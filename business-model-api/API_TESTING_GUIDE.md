# BizPilot API Testing Guide

## Overview

This guide explains how to test all the implemented API endpoints using Postman and provides examples of the complete workflow.

## Database Setup

Before testing, ensure your Supabase database has the following tables created according to the API specification:

```sql
-- Users table (enhanced)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    plan VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
    auth_provider VARCHAR(50) DEFAULT 'email',
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User usage tracking
CREATE TABLE user_usage (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    month DATE,
    ideas_active INTEGER NOT NULL DEFAULT 0,
    models_generated_month INTEGER NOT NULL DEFAULT 0,
    ai_messages_month INTEGER NOT NULL DEFAULT 0,
    ideas_limit INTEGER NOT NULL DEFAULT 3,
    models_limit_month INTEGER NOT NULL DEFAULT 6,
    ai_messages_limit_month INTEGER NOT NULL DEFAULT 50
);

-- Ideas table
CREATE TABLE ideas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    budget_range VARCHAR(20),
    timeline_range VARCHAR(20),
    target_market TEXT,
    competitors TEXT,
    unique_value TEXT,
    business_model_pref VARCHAR(255),
    voice_notes TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    progress INTEGER NOT NULL DEFAULT 0,
    success_score INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Market analysis
CREATE TABLE market_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea_id UUID UNIQUE NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
    market_size_usd NUMERIC(15,2),
    growth_rate_pct NUMERIC(5,2),
    target_customers TEXT,
    competitor_count INTEGER,
    market_opportunity VARCHAR(10),
    notes TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Business models
CREATE TABLE business_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    revenue_monthly_k NUMERIC(10,2) NOT NULL,
    margin_pct NUMERIC(5,2) NOT NULL,
    churn_pct NUMERIC(5,2),
    time_to_breakeven_months INTEGER NOT NULL,
    risk_level VARCHAR(10) NOT NULL,
    assumptions TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Risks
CREATE TABLE risks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(10) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Opportunities
CREATE TABLE opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    impact VARCHAR(10) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Attachments
CREATE TABLE idea_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
    name VARCHAR(500) NOT NULL,
    size BIGINT NOT NULL,
    type VARCHAR(255) NOT NULL,
    storage_key VARCHAR(500) NOT NULL,
    url TEXT,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## API Testing Workflow

### 1. Start the Server

```bash
cd "c:\Users\Shahraz\Documents\BizPilot\business-model-api"
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Import Postman Collection

1. Open Postmanj
2. Click "Import"
3. Select the `BizPilot_API_Tests.postman_collection.json` file
4. Create a new environment with these variables:
   - `base_url`: `http://localhost:8000`
   - `access_token`: (will be set automatically)
   - `user_id`: (will be set automatically)
   - `idea_id`: (will be set automatically)
   - `model_id`: (will be set automatically)
   - `risk_id`: (will be set automatically)
   - `opportunity_id`: (will be set automatically)

### 3. Complete Testing Flow

#### Step 1: Authentication
1. **Signup**: Creates a new user and sets authentication token
2. **Login**: Alternative login with existing credentials
3. **Get Current User**: Verify authentication and user data

#### Step 2: Create and Manage Ideas
1. **Create Idea**: Create a new business idea
2. **List Ideas**: Get paginated list with filters
3. **Get Idea Detail**: Get full idea with embedded data
4. **Update Idea**: Modify idea properties
5. **Delete Idea**: Remove an idea

#### Step 3: Market Analysis
1. **Update Market Analysis**: Add/update market data
2. **Get Market Analysis**: Retrieve market analysis

#### Step 4: Business Models
1. **Create Business Model**: Add financial projections
2. **List Business Models**: Get all models for an idea
3. **Get Business Model Detail**: Full model details
4. **Update Business Model**: Modify projections
5. **Delete Business Model**: Remove a model

#### Step 5: Risk Management
1. **Create Risk**: Add potential risks
2. **List Risks**: Get all risks
3. **Update Risk**: Modify risk assessment
4. **Delete Risk**: Remove a risk

#### Step 6: Opportunities
1. **Create Opportunity**: Add business opportunities
2. **List Opportunities**: Get all opportunities
3. **Update Opportunity**: Modify opportunity details
4. **Delete Opportunity**: Remove an opportunity

## Sample Test Data

### Create Idea Request
```json
{
    "title": "AI-Powered Personal Fitness Coach",
    "description": "A mobile app that uses AI to create personalized workout plans and nutrition advice based on user's goals, fitness level, and preferences.",
    "category": "Health & Fitness",
    "location": "San Francisco, CA",
    "budget_range": "10000-25000",
    "timeline_range": "6-12months",
    "target_market": "Fitness enthusiasts aged 25-45 who want personalized guidance",
    "competitors": "MyFitnessPal, Nike Training Club, Fitbit Premium",
    "unique_value": "AI-driven personalization with real-time adaptations based on progress and feedback",
    "business_model_pref": "Subscription-based with freemium tier",
    "voice_notes": "Focus on busy professionals who need efficient workouts"
}
```

### Create Business Model Request
```json
{
    "name": "Freemium Subscription Model",
    "description": "Free basic features with premium subscription for advanced AI coaching and analytics",
    "revenue_monthly_k": 45.5,
    "margin_pct": 75.2,
    "time_to_breakeven_months": 18,
    "risk_level": "Medium",
    "churn_pct": 8.5,
    "assumptions": "Customer acquisition cost of $25, monthly premium subscription of $9.99"
}
```

### Create Risk Request
```json
{
    "type": "Market",
    "description": "High competition from established fitness apps with large user bases and marketing budgets",
    "severity": "High"
}
```

### Create Opportunity Request
```json
{
    "type": "Technology",
    "description": "Integration with wearable devices and IoT fitness equipment for comprehensive health monitoring",
    "impact": "High"
}
```

## Expected Response Formats

All endpoints follow the API specification format with proper status codes:

- **201**: Created (with resource ID)
- **200**: Success (with data or confirmation message)
- **404**: Not Found
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (invalid/missing token)

## Error Handling

The API returns consistent error responses:

```json
{
    "error": {
        "code": "validation_error",
        "message": "Request validation failed",
        "details": {
            "field": ["error description"]
        }
    }
}
```

## Authentication

All endpoints except `/auth/signup` and `/auth/login` require Bearer token authentication:

```
Authorization: Bearer <your_jwt_token>
```

The token is automatically set by the Postman collection after successful signup/login.

## Running Manual Tests

You can also test endpoints manually using curl:

```bash
# Signup
curl -X POST "http://localhost:8000/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com", "password": "password123"}'

# Create Idea (use token from signup response)
curl -X POST "http://localhost:8000/ideas" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title": "Test Idea", "description": "A test business idea", "category": "Technology"}'
```

## Key Features Implemented

1. **Complete CRUD operations** for all resources
2. **UUID-based IDs** as specified
3. **Proper authentication** with JWT tokens
4. **Pagination support** for listing endpoints
5. **Filtering and search** capabilities
6. **Relationship management** between entities
7. **Error handling** with consistent format
8. **Response schemas** matching API specification
9. **Database constraints** and validations
10. **Proper HTTP status codes**

## Notes for Production

1. Replace `allow_origins=["*"]` with specific domains
2. Use environment variables for sensitive configuration
3. Implement proper logging and monitoring
4. Add rate limiting
5. Set up database connection pooling
6. Add input sanitization
7. Implement proper backup strategies
8. Use HTTPS in production