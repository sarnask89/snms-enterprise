"""AI assistant service with local-model support and network context."""

from __future__ import annotations

import os
from typing import Any

import httpx
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app import models


class AssistantService:
    """Small service layer for network/helpdesk-aware AI responses.

    The service first tries to call a local Ollama-compatible model. If that
    model is offline or returns an unexpected payload, it degrades into a
    deterministic diagnostic fallback so the UI still remains useful.
    """

    def __init__(self) -> None:
        self.ollama_url = os.getenv("OLLAMA_URL", "http://localhost:11434").rstrip("/")
        self.ollama_model = os.getenv("OLLAMA_MODEL", "llama3.2:3b")
        self.timeout_seconds = float(os.getenv("ASSISTANT_TIMEOUT_SECONDS", "20"))

    async def answer(self, prompt: str, db: Session, context: str | None = None) -> str:
        system_prompt = self._build_system_prompt(db, context=context)

        try:
            async with httpx.AsyncClient(timeout=self.timeout_seconds) as client:
                response = await client.post(
                    f"{self.ollama_url}/api/chat",
                    json={
                        "model": self.ollama_model,
                        "stream": False,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": prompt},
                        ],
                    },
                )
                response.raise_for_status()
                payload = response.json()
        except Exception:
            return self._fallback_answer(prompt, system_prompt)

        reply = self._extract_reply(payload)
        if not reply:
            return self._fallback_answer(prompt, system_prompt)
        return reply

    def _build_system_prompt(self, db: Session, context: str | None = None) -> str:
        parts = [
            "You are SNMS Enterprise AI Assistant.",
            "You help with ISP network monitoring, NetFlow diagnostics, device operations, and helpdesk work.",
            "Be concise, operational, and suggest safe next steps.",
        ]

        runtime_context = self._collect_runtime_context(db)
        if runtime_context:
            parts.append("Current SNMS context:\n" + runtime_context)

        if context:
            parts.append("User-provided context:\n" + str(context)[:8000])

        return "\n\n".join(parts)

    def _collect_runtime_context(self, db: Session) -> str:
        lines: list[str] = []

        try:
            total_tickets = db.scalar(select(func.count()).select_from(models.SupportTicket)) or 0
            open_tickets = (
                db.scalar(
                    select(func.count())
                    .select_from(models.SupportTicket)
                    .where(models.SupportTicket.status == models.TicketStatus.open)
                )
                or 0
            )
            lines.append(f"Helpdesk tickets: total={int(total_tickets)}, open={int(open_tickets)}")
        except Exception:
            pass

        try:
            rows = db.execute(
                select(
                    models.NetFlowAggregate.src_ip,
                    func.sum(models.NetFlowAggregate.bytes).label("total_bytes"),
                )
                .group_by(models.NetFlowAggregate.src_ip)
                .order_by(func.sum(models.NetFlowAggregate.bytes).desc())
                .limit(5)
            ).all()
            if rows:
                top = ", ".join(f"{row.src_ip}={int(row.total_bytes or 0)}B" for row in rows)
                lines.append(f"Top NetFlow talkers: {top}")
        except Exception:
            pass

        try:
            device_count = db.scalar(select(func.count()).select_from(models.NetDevice)) or 0
            lines.append(f"Network devices in inventory: {int(device_count)}")
        except Exception:
            pass

        return "\n".join(lines)

    @staticmethod
    def _extract_reply(payload: dict[str, Any]) -> str | None:
        message = payload.get("message")
        if isinstance(message, dict) and message.get("content"):
            return str(message["content"])
        if payload.get("response"):
            return str(payload["response"])
        return None

    @staticmethod
    def _fallback_answer(prompt: str, system_prompt: str) -> str:
        lower_prompt = prompt.lower()
        prefix = "Local AI model is not available, so I am using deterministic SNMS diagnostics mode."

        if any(word in lower_prompt for word in ("netflow", "traffic", "talker", "bandwidth")):
            return (
                f"{prefix}\n\n"
                "For NetFlow analysis, check /api/v2/monitoring/top-talkers and /api/v2/monitoring/timeseries, "
                "then correlate the busiest source IPs with device inventory and customer devices.\n\n"
                f"Question: {prompt}"
            )

        if any(word in lower_prompt for word in ("ticket", "helpdesk", "customer", "support")):
            return (
                f"{prefix}\n\n"
                "For helpdesk triage, verify ticket priority, customer service status, device reachability, "
                "and recent traffic anomalies before replying.\n\n"
                f"Question: {prompt}"
            )

        return f"{prefix}\n\nI can help inspect monitoring data, devices, tickets, and imports.\n\nQuestion: {prompt}"


assistant_service = AssistantService()
