import os
from fastapi import APIRouter, HTTPException, status
from typing import Optional, List
from pydantic import BaseModel, Field
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage, BaseMessage
from langchain_google_genai import ChatGoogleGenerativeAI

# Expect GOOGLE_API_KEY in env
os.environ.get("GOOGLE_API_KEY")

llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.7)

router = APIRouter(prefix="/chat-simple", tags=["Chat"])

class SimpleChatRequest(BaseModel):
    prompt: str = Field("", description="User text prompt")
    image_url: Optional[str] = Field(None, description="Optional image data URL or remote HTTP URL")
    system: Optional[str] = Field(None, description="Optional system instruction override")

class SimpleChatResponse(BaseModel):
    reply: str

@router.post("/invoke", response_model=SimpleChatResponse)
async def simple_invoke(payload: SimpleChatRequest):
    try:
        if not payload.prompt and not payload.image_url:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Provide prompt or image_url")
        messages: List[BaseMessage] = []
        if payload.system:
            messages.append(SystemMessage(content=payload.system))
        # Build content with optional image
        if payload.image_url:
            content = [
                {"type": "text", "text": payload.prompt or ""},
                {"type": "image_url", "image_url": payload.image_url}
            ]
            messages.append(HumanMessage(content=content))
        else:
            messages.append(HumanMessage(content=payload.prompt))
        resp = llm.invoke(messages)
        return SimpleChatResponse(reply=resp.content.strip())
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {e}")
