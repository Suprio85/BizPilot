"""
Quick test script to verify the API endpoints
Run this after starting the server with:
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_api():
    print("🚀 Testing BizPilot API endpoints...")
    
    # Test 1: Signup
    print("\n1. Testing Signup...")
    signup_data = {
        "name": "Test User",
        "email": "test@example.com", 
        "password": "password123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/signup", json=signup_data)
        print(f"Status: {response.status_code}")
        if response.status_code == 201:
            data = response.json()
            token = data.get("token")
            user_id = data.get("user", {}).get("id")
            print("✅ Signup successful!")
            print(f"Token: {token[:50]}...")
            print(f"User ID: {user_id}")
            
            # Test 2: Create Idea
            print("\n2. Testing Create Idea...")
            headers = {"Authorization": f"Bearer {token}"}
            idea_data = {
                "title": "AI Fitness Coach",
                "description": "An AI-powered personal fitness coaching app",
                "category": "Health & Fitness",
                "location": "San Francisco, CA",
                "budget_range": "10000-25000",
                "timeline_range": "6-12months"
            }
            
            response = requests.post(f"{BASE_URL}/ideas", json=idea_data, headers=headers)
            print(f"Status: {response.status_code}")
            if response.status_code == 201:
                idea_response = response.json()
                idea_id = idea_response.get("id")
                print("✅ Idea created successfully!")
                print(f"Idea ID: {idea_id}")
                
                # Test 3: List Ideas
                print("\n3. Testing List Ideas...")
                response = requests.get(f"{BASE_URL}/ideas", headers=headers)
                print(f"Status: {response.status_code}")
                if response.status_code == 200:
                    ideas = response.json()
                    print("✅ Ideas listed successfully!")
                    print(f"Found {len(ideas.get('data', []))} ideas")
                    
                    # Test 4: Create Business Model
                    print("\n4. Testing Create Business Model...")
                    model_data = {
                        "name": "Freemium Model",
                        "description": "Free basic features with premium subscription",
                        "revenue_monthly_k": 45.5,
                        "margin_pct": 75.0,
                        "time_to_breakeven_months": 18,
                        "risk_level": "Medium"
                    }
                    
                    response = requests.post(f"{BASE_URL}/ideas/{idea_id}/models", json=model_data, headers=headers)
                    print(f"Status: {response.status_code}")
                    if response.status_code == 201:
                        model_response = response.json()
                        model_id = model_response.get("id")
                        print("✅ Business model created successfully!")
                        print(f"Model ID: {model_id}")
                        
                        # Test 5: Create Risk
                        print("\n5. Testing Create Risk...")
                        risk_data = {
                            "type": "Market",
                            "description": "High competition from established fitness apps",
                            "severity": "High"
                        }
                        
                        response = requests.post(f"{BASE_URL}/ideas/{idea_id}/risks", json=risk_data, headers=headers)
                        print(f"Status: {response.status_code}")
                        if response.status_code == 201:
                            print("✅ Risk created successfully!")
                            
                            # Test 6: Create Opportunity
                            print("\n6. Testing Create Opportunity...")
                            opportunity_data = {
                                "type": "Technology",
                                "description": "Integration with wearable devices",
                                "impact": "High"
                            }
                            
                            response = requests.post(f"{BASE_URL}/ideas/{idea_id}/opportunities", json=opportunity_data, headers=headers)
                            print(f"Status: {response.status_code}")
                            if response.status_code == 201:
                                print("✅ Opportunity created successfully!")
                                
                                print("\n🎉 All tests passed! API is working correctly.")
                                print("\nNext steps:")
                                print("1. Import the Postman collection for comprehensive testing")
                                print("2. Test with your Supabase database")
                                print("3. Verify authentication and data persistence")
                                return
    
    except requests.exceptions.ConnectionError:
        print("❌ Connection error - make sure the server is running on http://localhost:8000")
    except Exception as e:
        print(f"❌ Error: {e}")
        
    print(f"\n❌ Test failed at step with status {response.status_code}")
    if hasattr(response, 'text'):
        print(f"Response: {response.text}")

if __name__ == "__main__":
    test_api()