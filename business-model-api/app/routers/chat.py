from fastapi import APIRouter, HTTPException, status
from typing import List
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, BaseMessage
from app.schemas.chat import ChatRequest, ChatResponse, ChatMessage, ChatImage
from Agents import chatbot

router = APIRouter(prefix="/chat", tags=["Chat"])

# The LangGraph compiled app in Agents.chatbot is also named 'app'. Avoid shadowing.
chat_graph = chatbot.app  # StateGraph compiled application

ROLE_MAP = {
    "user": HumanMessage,
    "ai": AIMessage,
    "system": SystemMessage,
}

def _convert_messages(msgs: List[ChatMessage]) -> List[BaseMessage]:
    converted: List[BaseMessage] = []
    for m in msgs:
        role = m.role
        cls = ROLE_MAP.get(role)
        if not cls:
            continue
        # For historical messages we treat content as plain text only; images only attached to last turn via request.images
        converted.append(cls(content=m.content))
    return converted

@router.post("", response_model=ChatResponse)
async def chat(payload: ChatRequest):
    try:
        if not payload.messages:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="messages cannot be empty")
        messages = _convert_messages(payload.messages)
        # Prepare state with images (only applied to the last human message inside chatbot logic)
        image_urls = []
        if payload.images:
            image_urls = [img.data_url for img in payload.images]
        state = {"messages": messages, "image_urls": image_urls}
        updated = chat_graph.invoke(state)
        # Build response messages list (append new AI turn if any)
        out_messages: List[ChatMessage] = []
        for m in updated["messages"]:
            role = "user"
            if isinstance(m, AIMessage):
                role = "ai"
            elif isinstance(m, SystemMessage):
                role = "system"
            out_messages.append(ChatMessage(role=role, content=m.content))
        reply_content = out_messages[-1].content if out_messages else ""
        return ChatResponse(reply=reply_content, messages=out_messages)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat processing failed: {e}")
