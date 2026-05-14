"""
AI Assistant endpoints for API v2.

This module exposes a simple endpoint that acts as a chat interface
between the user and a backend AI model. For now, the implementation
is deliberately minimal: it simply echoes the user's prompt to
demonstrate the wiring between FastAPI, request parsing and a
placeholder AI service. In the future this could be expanded to call
an on-premise or external language model, incorporate contextual
history, and perform network diagnostics or ticket summarisation.
"""

from fastapi import APIRouter, Depends
from app.api.auth import get_current_user


router = APIRouter(
    prefix="/assistant", tags=["assistant"], dependencies=[Depends(get_current_user)]
)


@router.post("/chat")
async def chat(payload: dict):
    """Return a dummy chat response.

    Expects a JSON body containing a ``prompt`` string. If the prompt
    is missing the endpoint returns a simple error. Otherwise it
    returns a dictionary with a ``reply`` field that echoes the input.
    This function is asynchronous to anticipate future integration with
    asynchronous model inference services.
    """
    prompt = payload.get("prompt") if isinstance(payload, dict) else None
    if not prompt:
        return {"error": "prompt is required"}
    # For now just echo the prompt. In future this could call a local
    # language model (e.g. llama.cpp) or a remote API and return the
    # generated response.
    response = f"You said: {prompt}"
    return {"reply": response}
