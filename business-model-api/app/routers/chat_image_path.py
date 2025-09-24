import os
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional
from langchain_core.messages import HumanMessage, BaseMessage, SystemMessage
from Agents import chatbot

router = APIRouter(prefix="/chat-image", tags=["Chat Image Path"])

class ImagePathChatRequest(BaseModel):
    prompt: str = Field("", description="Optional text prompt (can be empty if only image context)")
    image_path: str = Field(..., description="Absolute path to the image file on the server host")
    system: Optional[str] = Field(None, description="Optional system instruction")

class ImagePathChatResponse(BaseModel):
    reply: str

@router.post("/invoke", response_model=ImagePathChatResponse)
async def chat_with_image_path(payload: ImagePathChatRequest):
    # Validate path
    if not os.path.isabs(payload.image_path):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="image_path must be absolute")
    if not os.path.exists(payload.image_path):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image file not found")
    try:
        # Reuse helper to produce data URI
        data_uri = chatbot.get_image_data_uri(payload.image_path)
        messages: list[BaseMessage] = []
        if payload.system:
            messages.append(SystemMessage(content=payload.system))
        # Attach image with optional text
        content = []
        if payload.prompt:
            content.append({"type": "text", "text": payload.prompt})
        content.append({"type": "image_url", "image_url": data_uri})
        messages.append(HumanMessage(content=content))
        state = {"messages": messages, "image_urls": []}  # image already embedded in message
        updated = chatbot.app.invoke(state)
        reply = updated["messages"][-1].content if updated.get("messages") else ""
        return ImagePathChatResponse(reply=reply)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {e}")
