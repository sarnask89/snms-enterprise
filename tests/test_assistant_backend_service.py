import pytest

from app.services.assistant_service import AssistantService


@pytest.mark.asyncio
async def test_assistant_service_falls_back_when_model_unavailable(session):
    service = AssistantService()
    service.ollama_url = "http://127.0.0.1:9"
    reply = await service.answer("show netflow top talkers", session)
    assert "deterministic SNMS diagnostics mode" in reply
    assert "NetFlow" in reply


def test_assistant_service_extracts_ollama_reply():
    service = AssistantService()
    assert service._extract_reply({"message": {"content": "hello"}}) == "hello"
    assert service._extract_reply({"response": "fallback format"}) == "fallback format"
    assert service._extract_reply({}) is None
