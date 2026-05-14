"""AI Assistant endpoints for API v2."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.auth import get_current_user
from app.database import get_db
from app.services.assistant_service import assistant_service


router = APIRouter(
    prefix="/assistant",
    tags=["assistant"],
    dependencies=[Depends(get_current_user)],
)


@router.post("/chat")
async def chat(payload: dict, db: Session = Depends(get_db)):
    """Answer a user prompt using a local model when available.

    Request body:
    - prompt: required user question/command
    - context: optional frontend-provided context, e.g. API docs or ticket text

    The service tries an Ollama-compatible model first and falls back to a
    deterministic diagnostic response when no local model is reachable.
    """
    prompt = payload.get("prompt") if isinstance(payload, dict) else None
    context = payload.get("context") if isinstance(payload, dict) else None

    if not prompt:
        return {"error": "prompt is required"}

    reply = await assistant_service.answer(str(prompt), db, context=context)
    return {
        "reply": reply,
        "model": assistant_service.ollama_model,
        "provider": "ollama_or_local_fallback",
    }
