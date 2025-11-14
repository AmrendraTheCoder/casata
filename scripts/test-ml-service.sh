#!/bin/bash

# Test ML Service Connection and Endpoints
# Usage: chmod +x scripts/test-ml-service.sh && ./scripts/test-ml-service.sh

echo "🧪 Testing YieldShift ML Service"
echo "================================"
echo ""

ML_URL="${VITE_ML_SERVICE_URL:-http://localhost:5001}"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo "1️⃣  Testing Health Endpoint..."
HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" "$ML_URL/health" 2>/dev/null)
HTTP_CODE=$(echo "$HEALTH_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$HEALTH_RESPONSE" | head -n1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Health Check Passed${NC}"
    echo "   Response: $RESPONSE_BODY"
else
    echo -e "${RED}❌ Health Check Failed (HTTP $HTTP_CODE)${NC}"
    echo "   Is the ML service running? (cd ml-service && python app.py)"
    exit 1
fi
echo ""

# Test 2: Score Endpoint
echo "2️⃣  Testing Score Endpoint..."
SCORE_RESPONSE=$(curl -s -X POST "$ML_URL/api/score" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPosition": {
      "protocol": "aave-v3",
      "chain": "ethereum",
      "asset": "USDC",
      "amount": 1000,
      "currentApy": 5.0
    },
    "targetOpportunity": {
      "protocol": "aave-v3",
      "chain": "base",
      "targetApy": 15.0,
      "protocolSafetyScore": 9
    },
    "bridgeCost": 3.20,
    "gasCost": 0.80
  }' 2>/dev/null)

if echo "$SCORE_RESPONSE" | grep -q '"score"'; then
    echo -e "${GREEN}✅ Score Endpoint Passed${NC}"
    SCORE=$(echo "$SCORE_RESPONSE" | grep -o '"score":[0-9]*' | grep -o '[0-9]*')
    echo "   Score: $SCORE/100"
else
    echo -e "${RED}❌ Score Endpoint Failed${NC}"
    echo "   Response: $SCORE_RESPONSE"
fi
echo ""

# Test 3: Predict Endpoint
echo "3️⃣  Testing Predict Endpoint..."
PREDICT_RESPONSE=$(curl -s -X POST "$ML_URL/api/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "protocol": "aave-v3",
    "chain": "base",
    "asset": "USDC"
  }' 2>/dev/null)

if echo "$PREDICT_RESPONSE" | grep -q '"prediction"'; then
    echo -e "${GREEN}✅ Predict Endpoint Passed${NC}"
    PREDICTION=$(echo "$PREDICT_RESPONSE" | grep -o '"prediction":"[^"]*"' | cut -d'"' -f4)
    echo "   Prediction: $PREDICTION"
else
    echo -e "${RED}❌ Predict Endpoint Failed${NC}"
    echo "   Response: $PREDICT_RESPONSE"
fi
echo ""

# Test 4: Batch Score Endpoint
echo "4️⃣  Testing Batch Score Endpoint..."
BATCH_RESPONSE=$(curl -s -X POST "$ML_URL/api/batch-score" \
  -H "Content-Type: application/json" \
  -d '{
    "opportunities": [
      {
        "currentPosition": {"protocol": "aave-v3", "chain": "ethereum", "asset": "USDC", "amount": 1000, "currentApy": 5.0},
        "targetOpportunity": {"protocol": "aave-v3", "chain": "base", "targetApy": 15.0, "protocolSafetyScore": 9},
        "bridgeCost": 3.20,
        "gasCost": 0.80
      },
      {
        "currentPosition": {"protocol": "compound-v3", "chain": "ethereum", "asset": "USDT", "amount": 2000, "currentApy": 6.0},
        "targetOpportunity": {"protocol": "aave-v3", "chain": "arbitrum", "targetApy": 12.0, "protocolSafetyScore": 8.5},
        "bridgeCost": 2.50,
        "gasCost": 0.60
      }
    ]
  }' 2>/dev/null)

if echo "$BATCH_RESPONSE" | grep -q '"scoredOpportunities"'; then
    echo -e "${GREEN}✅ Batch Score Endpoint Passed${NC}"
    COUNT=$(echo "$BATCH_RESPONSE" | grep -o '"score"' | wc -l | tr -d ' ')
    echo "   Scored $COUNT opportunities"
else
    echo -e "${RED}❌ Batch Score Endpoint Failed${NC}"
    echo "   Response: $BATCH_RESPONSE"
fi
echo ""

echo "================================"
echo "🎉 ML Service Tests Complete!"
echo ""
echo "Next steps:"
echo "1. Start the frontend: npm run dev"
echo "2. Check browser console for ML service status"
echo "3. Connect wallet and test with real data"

