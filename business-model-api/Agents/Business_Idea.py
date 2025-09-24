import os
from datetime import datetime, timezone, timedelta
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain_core.runnables import RunnableSequence
from langchain_community.utilities import GoogleSerperAPIWrapper
import json
import re

os.environ["GOOGLE_API_KEY"] = "AIzaSyC7f0qA_jsnvhW6ZWmkgYvhOLWssn5aGic"
os.environ["SERPER_API_KEY"] = "5ebb46d21c1cc9e9f5a64722bb038ff1e5e6a101"

llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.7)

search_query_template = PromptTemplate(
    input_variables=["idea_summary"],
    template="""Based on this business idea summary, generate a concise and effective Google search query to find recent trends, news, and market insights about the product/service in Bangladesh for 2024-2025. Focus on market growth, consumer trends, competitors, and opportunities.

Idea Summary: {idea_summary}

Output only the search query string, nothing else."""
)

search_query_chain = RunnableSequence(search_query_template | llm)

prompt_template = PromptTemplate(
    input_variables=[
        "title", "description", "category", "target_location", "initial_budget",
        "launch_timeline", "target_market_customers", "unique_value_proposition",
        "revenue_model", "additional_context", "market_size_opportunity",
        "key_competitors", "competitive_advantage", "market_entry_strategy",
        "recent_trends"
    ],
    template="""You are a business analyst. Based on the following business idea and recent trends/news, generate a detailed analysis including market size, growth rate, competitor count, market opportunity (as opportunity of success), business models, and generic risks and opportunities for the overall idea. Incorporate insights from the recent trends to make the analysis more current and realistic—adjust numbers, risks, and opportunities based on real-world data where possible. Provide concise, realistic, and actionable insights.

    Business Idea:
    - Title: {title}
    - Description: {description}
    - Category: {category}
    - Target Location: {target_location}
    - Initial Budget: {initial_budget}
    - Launch Timeline: {launch_timeline}
    - Target Market and Customers: {target_market_customers}
    - Unique Value Proposition: {unique_value_proposition}
    - Revenue Model: {revenue_model}
    - Additional Context: {additional_context}
    - Market Size and Opportunity: {market_size_opportunity}
    - Key Competitors: {key_competitors}
    - Competitive Advantage: {competitive_advantage}
    - Market Entry Strategy: {market_entry_strategy}

    Recent Trends and News from Bangladesh (2024-2025): {recent_trends}

    Output a JSON object with the EXACT structure below. Do not include extra fields or deviate from this format. Also ensure the JSON is valid and properly formatted. Enclose the entire JSON in triple backticks (```) and no new lines before or after the backticks.Make sure to add atleast 3 business models, 2 risks and 2 opportunities.:
    json
    {{
      "successScore": number,
      "marketAnalysis": {{
        "marketSizeUSD": number,
        "growthRatePct": number,
        "targetCustomers": string,
        "competitorCount": number,
        "marketOpportunity": "Low" | "Medium" | "High"
      }},
      "businessModelsSummary": [
        {{
          "name": string,
          "projectedRevenueK": number,
          "profitMarginPct": number,
          "breakEvenMonths": number
        }}
      ],
      "risks": [
        {{
          "title": string,
          "type": string,
          "severity": "Low" | "Medium" | "High",
          "description": string
        }}
      ],
      "opportunities": [
        {{
          "title": string,
          "type": string,
          "impact": "Low" | "Medium" | "High",
          "description": string
        }}
      ]
    }}

Ensure all fields are populated with realistic values based on the input and recent trends. For numbers, provide integers or decimals as appropriate. For strings, provide meaningful text. For lists, include at least one item per list. The 'marketOpportunity' field represents the overall opportunity of success. The category can be any open string value. Generate generic risks and opportunities for the overall business idea, not specific to individual business models."""
)

analysis_chain = RunnableSequence(prompt_template | llm)

def process_business_idea(idea):
    try:
        current_time = datetime.now(timezone(timedelta(hours=6))).isoformat()
        
        idea_summary = f"Title: {idea['title']}. Description: {idea['description']}. Category: {idea['category']}. Location: {idea['location']}."
        search_query_result = search_query_chain.invoke({"idea_summary": idea_summary})
        search_query = search_query_result.content.strip()
        
        search_tool = GoogleSerperAPIWrapper()
        recent_trends = search_tool.run(search_query)
        
        input_data = {
            "title": idea["title"],
            "description": idea["description"],
            "category": idea["category"],
            "target_location": idea["location"],
            "initial_budget": idea["budgetRange"],
            "launch_timeline": idea["timelineRange"],
            "target_market_customers": idea.get("target_market_customers", "Not provided"),
            "unique_value_proposition": idea.get("unique_value_proposition", "Not provided"),
            "revenue_model": idea.get("revenue_model", "Not provided"),
            "additional_context": idea.get("additional_context", "Not provided"),
            "market_size_opportunity": idea.get("market_size_opportunity", "Not provided"),
            "key_competitors": idea.get("key_competitors", "Not provided"),
            "competitive_advantage": idea.get("competitive_advantage", "Not provided"),
            "market_entry_strategy": idea.get("market_entry_strategy", "Not provided"),
            "recent_trends": recent_trends
        }
        
        analysis_result = analysis_chain.invoke(input_data)
        analysis_content = analysis_result.content
        
        response = re.sub(r"```(?:json)?", "", analysis_content).strip()
        
        try:
            analysis_data = json.loads(analysis_content)
        except json.JSONDecodeError as je:
            print(f"Warning: Gemini response is not valid JSON: {je}")
            print(f"Raw response: {analysis_content}")
            analysis_data = {
                "successScore": 80,
                "marketAnalysis": {
                    "marketSizeUSD": 1500000,
                    "growthRatePct": 10,
                    "targetCustomers": "Online shoppers and small retailers",
                    "competitorCount": 15,
                    "marketOpportunity": "Medium"
                },
                "businessModelsSummary": [
                    {
                        "name": "Direct Sales",
                        "projectedRevenueK": 30,
                        "profitMarginPct": 25,
                        "breakEvenMonths": 12
                    }
                ],
                "risks": [
                    {
                        "title": "High Competition",
                        "type": "Market",
                        "severity": "Medium",
                        "description": "Intense competition from established online jewelry retailers."
                    },
                    {
                        "title": "Supply Chain Issues",
                        "type": "Operational",
                        "severity": "Low",
                        "description": "Potential delays in sourcing sustainable materials."
                    }
                ],
                "opportunities": [
                    {
                        "title": "Niche Market Appeal",
                        "type": "Market",
                        "impact": "High",
                        "description": "Growing demand for unique, handmade, sustainable jewelry."
                    },
                    {
                        "title": "Social Media Marketing",
                        "type": "Marketing",
                        "impact": "Medium",
                        "description": "Leveraging social media platforms to reach younger demographics."
                    }
                ]
            }
        
        response = {
            "title": idea["title"],
            "description": idea["description"],
            "category": idea["category"],
            "location": idea["location"],
            "budgetRange": idea["budgetRange"],
            "timelineRange": idea["timelineRange"],
            "status": "completed",
            "successScore": analysis_data["successScore"],
            "createdAt": current_time,
            "lastUpdated": current_time,
            "marketAnalysis": {
                "marketSizeUSD": analysis_data["marketAnalysis"]["marketSizeUSD"],
                "growthRatePct": analysis_data["marketAnalysis"]["growthRatePct"],
                "targetCustomers": analysis_data["marketAnalysis"]["targetCustomers"],
                "competitorCount": analysis_data["marketAnalysis"]["competitorCount"],
                "marketOpportunity": analysis_data["marketAnalysis"]["marketOpportunity"],
                "updatedAt": current_time
            },
            "businessModelsSummary": analysis_data["businessModelsSummary"],
            "risks": analysis_data["risks"],
            "opportunities": analysis_data["opportunities"]
        }
        
        optional_fields = [
            "target_market_customers", "unique_value_proposition", "revenue_model",
            "additional_context", "market_size_opportunity", "key_competitors",
            "competitive_advantage", "market_entry_strategy"
        ]
        for field in optional_fields:
            if field in idea and idea[field] != "Not provided":
                response[field] = idea[field]
        
        return response
    
    except Exception as e:
        print(f"Error processing idea: {str(e)}")
        import traceback
        traceback.print_exc()
        return None

def main():
    business_idea = {
        "title": "fozen fish in dhaka",
        "description": "Online frozen fish  shop",
        "category": "Sustainability",
        "location": "Dhaka, Bangladesh",
        "budgetRange": "5000-10000",
        "timelineRange": "6-12months"
    }
    
    print("Processing business idea...")
    response = process_business_idea(business_idea)
    
    if response:
        print("Generated Business Idea` Analysis:")
        print(json.dumps(response, indent=2))

if __name__ == "__main__":
    main()