import os
import base64
import mimetypes
from typing import TypedDict, List, Annotated

from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages

# Set your Google API key as an environment variable before running
os.environ["GOOGLE_API_KEY"] = "AIzaSyC7f0qA_jsnvhW6ZWmkgYvhOLWssn5aGic"

# Initialize the Gemini model
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.7)

# Define the state schema
class ConversationState(TypedDict):
    messages: Annotated[List[BaseMessage], add_messages]
    image_urls: List[str]  # List of data URIs for images

# Define the LLM node function
def llm_node(state: ConversationState) -> ConversationState:
    messages = state["messages"]
    image_urls = state.get("image_urls", [])
    
    # If there are images, attach them to the last human message
    if image_urls and messages and isinstance(messages[-1], HumanMessage):
        text_content = messages[-1].content
        content = [{"type": "text", "text": text_content}] + [
            {"type": "image_url", "image_url": url} for url in image_urls
        ]
        human_with_images = HumanMessage(content=content)
        messages_to_llm = messages[:-1] + [human_with_images]
    else:
        messages_to_llm = messages
    
    # Invoke the LLM
    response = llm.invoke(messages_to_llm)
    
    # Add the assistant's response to messages
    state["messages"].append(AIMessage(content=response.content))
    
    return state

# Build the graph
graph = StateGraph(ConversationState)
graph.add_node("llm", llm_node)
graph.set_entry_point("llm")
graph.add_edge("llm", END)

# Compile the app
app = graph.compile()

# Function to get image as base64 data URI from file path
def get_image_data_uri(file_path: str) -> str:
    mime_type, _ = mimetypes.guess_type(file_path)
    if not mime_type or not mime_type.startswith("image/"):
        raise ValueError("Provided file is not a supported image type.")
    with open(file_path, "rb") as image_file:
        base64_encoded = base64.b64encode(image_file.read()).decode("utf-8")
    return f"data:{mime_type};base64,{base64_encoded}"

# Terminal-based conversation loop
def run_conversation():
    # Initial state
    state: ConversationState = {
        "messages": [SystemMessage(content="You are a helpful assistant that can understand images as context.")],
        "image_urls": []
    }
    
    print("Welcome to the Gemini conversation! Type your message, or '/upload' to add an image, or '/quit' to exit.")
    print("Images provided will be used as context for the conversation.")
    
    while True:
        user_input = input("\nYou: ").strip()
        
        if user_input.lower() == "/quit":
            print("Goodbye!")
            break
        elif user_input.lower() == "/upload":
            try:
                file_path = input("Enter the full path to the image file: ").strip()
                data_uri = get_image_data_uri(file_path)
                state["image_urls"].append(data_uri)
                print(f"Image uploaded successfully. You now have {len(state['image_urls'])} images in context.")
            except Exception as e:
                print(f"Error uploading image: {e}")
            continue
        
        # Add user message
        state["messages"].append(HumanMessage(content=user_input))
        
        # Invoke the graph
        updated_state = app.invoke(state)
        
        # Update state
        state = updated_state
        
        # Print assistant response
        assistant_response = state["messages"][-1].content
        print(f"\nAssistant: {assistant_response}")

if __name__ == "__main__":
    run_conversation()