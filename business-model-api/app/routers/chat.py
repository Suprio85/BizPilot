from fastapi import APIRouter, HTTPException
from app.schemas.chat import ChatRequest, ChatResponse, ChatMessage
from Agents.chatbot import load_conversation, save_conversation, app as chat_app
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from typing import List

router = APIRouter(prefix="/chat", tags=["Chat"])

def _convert_to_langchain(messages: List[ChatMessage]):
    lc_messages = []
    for m in messages:
        role = m.role
        if role == 'user':
            lc_messages.append(HumanMessage(content=m.content))
        elif role == 'ai':
            lc_messages.append(AIMessage(content=m.content))
        elif role == 'system':
            lc_messages.append(SystemMessage(content=m.content))
    return lc_messages

def _convert_from_langchain(messages) -> List[ChatMessage]:
    out: List[ChatMessage] = []
    for m in messages:
        if isinstance(m, HumanMessage):
            out.append(ChatMessage(role='user', content=m.content))
        elif isinstance(m, AIMessage):
            out.append(ChatMessage(role='ai', content=m.content))
        elif isinstance(m, SystemMessage):
            out.append(ChatMessage(role='system', content=m.content))
    return out

@router.post("", response_model=ChatResponse)
def chat(request: ChatRequest):
    try:
        state = load_conversation()
        # Merge provided history (client is source of truth for now)
        if request.messages:
            state['messages'] = _convert_to_langchain(request.messages)
        # Attach images to state if provided
        image_urls = []
        if request.images:
            image_urls = [img.data_url for img in request.images]
        state['image_urls'] = image_urls

        # Run graph
        updated_state = chat_app.invoke(state)
        save_conversation(updated_state)

        all_messages = _convert_from_langchain(updated_state['messages'])
        reply_msg = all_messages[-1] if all_messages else None
        reply_text = reply_msg.content if reply_msg else ''
        return ChatResponse(reply=reply_text, messages=all_messages)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))