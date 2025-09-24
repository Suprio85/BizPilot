import os
import json
from fastapi import APIRouter, HTTPException, status
from langchain.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from app.schemas.daily_update import DailyUpdateAnalysisRequest, DailyUpdateAnalysisResponse

# Ensure API key is sourced from environment (avoid hardcoding)
os.environ.get("GOOGLE_API_KEY")

router = APIRouter(prefix="/daily", tags=["Daily Updates"])  # unauthenticated for now

# Reusable prompt template
PROMPT_TEMPLATE = PromptTemplate(
    input_variables=["historical", "today", "prediction"],
    template=(
        "You are an AI advisor for a small business.\n"
        "Historical daily operational data (JSON array oldest -> newest):\n{historical}\n\n"
        "Today's update (JSON):\n{today}\n\n"
        "Predicted demand for tomorrow (may be empty) as JSON: {prediction}\n\n"
        "TASK: Analyze trends and produce a strictly valid JSON object ONLY. No prose outside JSON.\n"
        "Output EXACTLY valid JSON with keys: summary (string), momentum_score (int 0-100), risks (array of strings), opportunities (array of strings), actions (array of strings), checklist (array of strings).\n"
        "Rules: momentum_score integer 0-100. Provide 3-6 checklist actionable steps for next day. Use double quotes. No markdown.\n"
    )
)

llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.4)

@router.post("/analyze", response_model=DailyUpdateAnalysisResponse)
def analyze_daily_update(payload: DailyUpdateAnalysisRequest):
    try:
        historical_json = json.dumps([u.dict() for u in payload.historical], indent=2)
        today_json = json.dumps(payload.update.dict(), indent=2)
        prediction_json = json.dumps(payload.predicted_demand or {})

        chain = PROMPT_TEMPLATE | llm
        raw = chain.invoke({
            "historical": historical_json,
            "today": today_json,
            "prediction": prediction_json
        })
        text = raw.content.strip()
        # Extract JSON substring
        if "{" in text:
            json_str = text[text.find("{") : text.rfind("}") + 1]
        else:
            raise ValueError("Model returned no JSON")
        data = json.loads(json_str)
        # Basic validation / defaults
        required_keys = ["summary", "momentum_score", "risks", "opportunities", "actions", "checklist"]
        for k in required_keys:
            if k not in data:
                data.setdefault(k, [] if k not in ("summary", "momentum_score") else ("" if k=="summary" else 0))
        return DailyUpdateAnalysisResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Analysis failed: {e}")
