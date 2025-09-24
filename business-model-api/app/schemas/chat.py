from pydantic import BaseModel, Field
from typing import List, Optional

class ChatImage(BaseModel):
    id: str = Field(..., description="Client generated id for the image")
    data_url: str = Field(..., description="Base64 data URI or remote URL")
    file_name: Optional[str] = Field(None, description="Original file name")

class ChatMessage(BaseModel):
    role: str = Field(..., pattern="^(user|ai|system)$")
    content: str
    images: Optional[List[ChatImage]] = None

class ChatRequest(BaseModel):
    messages: List[ChatMessage] = Field(..., description="Full running history including the new user turn at end")
    images: Optional[List[ChatImage]] = Field(None, description="Images to attach to the last user message (convenience)")

class ChatResponse(BaseModel):
    reply: str
    messages: List[ChatMessage]