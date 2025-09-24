import os
import json
from langchain.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI

# Set your Google API key (replace with your actual key)
os.environ["GOOGLE_API_KEY"] = "AIzaSyC7f0qA_jsnvhW6ZWmkgYvhOLWssn5aGic"

# Initialize Gemini model
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.7)

# Historical + today's data
historical_data = [
    {
        "date": "2025-09-21",
        "sales_demand": {"units_sold": 15, "new_orders": 8, "product_attention": "Jewelry got more attention than soap."},
        "customer_engagement": {"inquiries_feedback": "Received 3 inquiries about custom jewelry.", "visits": 120, "new_followers": 25},
        "marketing_outreach": {"posted": "Yes", "channel": "Instagram", "budget": 50},
        "operations_supply": {"issues": "No issues.", "produced_restock": 20},
        "challenges_insights": {"biggest_challenge": "High demand for jewelry leading to stock shortage.", "new_opportunity": "Partner with local influencer for soap promotion."}
    },
    {
        "date": "2025-09-22",
        "sales_demand": {"units_sold": 20, "new_orders": 10, "product_attention": "Soap sales picked up."},
        "customer_engagement": {"inquiries_feedback": "Positive feedback on soap scents.", "visits": 150, "new_followers": 30},
        "marketing_outreach": {"posted": "Yes", "channel": "Facebook", "budget": 30},
        "operations_supply": {"issues": "Minor delay in soap ingredients.", "produced_restock": 25},
        "challenges_insights": {"biggest_challenge": "Supply delay affected production.", "new_opportunity": "Expand jewelry line based on inquiries."}
    },
    {
        "date": "2025-09-23",
        "sales_demand": {"units_sold": 18, "new_orders": 7, "product_attention": "Balanced attention between products."},
        "customer_engagement": {"inquiries_feedback": "2 complaints about packaging.", "visits": 140, "new_followers": 20},
        "marketing_outreach": {"posted": "No", "channel": "", "budget": 0},
        "operations_supply": {"issues": "No issues.", "produced_restock": 22},
        "challenges_insights": {"biggest_challenge": "Packaging quality needs improvement.", "new_opportunity": "Run a discount on soap to boost sales."}
    }
]

predicted_demand = {"jewelry": 30, "soap": 50}

today_data = {
    "date": "2025-09-24",
    "sales_demand": {"units_sold": 22, "new_orders": 12, "product_attention": "Jewelry continues to lead."},
    "customer_engagement": {"inquiries_feedback": "Several inquiries for bulk soap orders.", "visits": 160, "new_followers": 35},
    "marketing_outreach": {"posted": "Yes", "channel": "Instagram and Local fair", "budget": 40},
    "operations_supply": {"issues": "Supply chain smooth.", "produced_restock": 28},
    "challenges_insights": {"biggest_challenge": "Managing increased orders.", "new_opportunity": "Collaborate with online marketplace for jewelry."}
}

all_data = historical_data + [today_data]

# Prompt
prompt = PromptTemplate(
    input_variables=["data", "prediction"],
    template="""
    You are an AI advisor for a small business selling products like jewelry and soap.
    Based on the following daily data: {data}
    
    And the predicted demand for tomorrow: {prediction}
    
    Provide guidance for the next day as an array of strings, each string being a step or action item.
    Output only in JSON format: {{"steps": ["step1", "step2", ...]}}
    """
)

# New style chain
chain = prompt | llm

# Run the chain
input_data = {
    "data": json.dumps(all_data, indent=2),
    "prediction": json.dumps(predicted_demand)
}
response = chain.invoke(input_data)

# Extract response content safely
raw_text = response.content.strip()

# Try parsing JSON, handle extra text
try:
    if "{" in raw_text:
        json_str = raw_text[raw_text.find("{"): raw_text.rfind("}")+1]
        guidance = json.loads(json_str)
        steps = guidance.get("steps", [])
    else:
        steps = ["Model did not return JSON."]
except Exception as e:
    steps = [f"Error parsing response: {str(e)}"]

# Print results
print("Predicted Demand:")
print(predicted_demand)
print("\nNext Day Steps:")
for step in steps:
    print(f"- {step}")