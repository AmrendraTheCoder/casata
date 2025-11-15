#!/bin/bash

# Test all API endpoints configured in .env
# This script checks if endpoints are accessible and working

echo "🔍 Testing YieldShift API Endpoints..."
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Load .env file if it exists
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo "✅ Loaded .env file"
else
    echo "⚠️  No .env file found, using defaults"
fi

echo ""
echo "1️⃣  Testing ML Service..."
echo "-------------------------"
ML_URL="${VITE_ML_SERVICE_URL:-http://localhost:5001}"
echo "URL: $ML_URL"

# Test health endpoint
if curl -s -f --max-time 3 "$ML_URL/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ ML Service is running${NC}"
    curl -s "$ML_URL/health" | head -c 100
    echo ""
else
    echo -e "${RED}❌ ML Service is not accessible${NC}"
    echo "   Make sure the service is running: cd ml-service && ./start-simple.sh"
fi

echo ""
echo "2️⃣  Testing Alchemy API..."
echo "-------------------------"
if [ -z "$VITE_ALCHEMY_API_KEY" ]; then
    echo -e "${YELLOW}⚠️  VITE_ALCHEMY_API_KEY not set${NC}"
    echo "   Alchemy features will not work"
else
    echo "API Key: ${VITE_ALCHEMY_API_KEY:0:10}...${VITE_ALCHEMY_API_KEY: -4}"
    
    # Test Sepolia endpoint
    SEPOLIA_URL="https://eth-sepolia.g.alchemy.com/v2/$VITE_ALCHEMY_API_KEY"
    echo "Testing Sepolia endpoint..."
    
    RESPONSE=$(curl -s -X POST "$SEPOLIA_URL" \
        -H "Content-Type: application/json" \
        -d '{"jsonrpc":"2.0","id":1,"method":"eth_blockNumber","params":[]}' \
        --max-time 5)
    
    if echo "$RESPONSE" | grep -q "result"; then
        echo -e "${GREEN}✅ Alchemy Sepolia endpoint is working${NC}"
    else
        echo -e "${RED}❌ Alchemy Sepolia endpoint failed${NC}"
        echo "   Response: $RESPONSE"
    fi
    
    # Test Base Sepolia
    BASE_URL="https://base-sepolia.g.alchemy.com/v2/$VITE_ALCHEMY_API_KEY"
    echo "Testing Base Sepolia endpoint..."
    
    RESPONSE=$(curl -s -X POST "$BASE_URL" \
        -H "Content-Type: application/json" \
        -d '{"jsonrpc":"2.0","id":1,"method":"eth_blockNumber","params":[]}' \
        --max-time 5)
    
    if echo "$RESPONSE" | grep -q "result"; then
        echo -e "${GREEN}✅ Alchemy Base Sepolia endpoint is working${NC}"
    else
        echo -e "${RED}❌ Alchemy Base Sepolia endpoint failed${NC}"
    fi
    
    # Test Arbitrum Sepolia
    ARB_URL="https://arb-sepolia.g.alchemy.com/v2/$VITE_ALCHEMY_API_KEY"
    echo "Testing Arbitrum Sepolia endpoint..."
    
    RESPONSE=$(curl -s -X POST "$ARB_URL" \
        -H "Content-Type: application/json" \
        -d '{"jsonrpc":"2.0","id":1,"method":"eth_blockNumber","params":[]}' \
        --max-time 5)
    
    if echo "$RESPONSE" | grep -q "result"; then
        echo -e "${GREEN}✅ Alchemy Arbitrum Sepolia endpoint is working${NC}"
    else
        echo -e "${RED}❌ Alchemy Arbitrum Sepolia endpoint failed${NC}"
    fi
fi

echo ""
echo "3️⃣  Testing DefiLlama API..."
echo "----------------------------"
DEFILLAMA_URL="https://yields.llama.fi/pools"
echo "URL: $DEFILLAMA_URL"

RESPONSE=$(curl -s -f --max-time 10 "$DEFILLAMA_URL" | head -c 200)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ DefiLlama API is accessible${NC}"
    echo "   Response preview: ${RESPONSE}..."
else
    echo -e "${RED}❌ DefiLlama API is not accessible${NC}"
fi

echo ""
echo "4️⃣  Testing Etherscan APIs..."
echo "-----------------------------"

# Sepolia Etherscan
if [ -z "$VITE_ETHERSCAN_API_KEY" ]; then
    echo -e "${YELLOW}⚠️  VITE_ETHERSCAN_API_KEY not set (optional)${NC}"
else
    ETHERSCAN_URL="https://api-sepolia.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=$VITE_ETHERSCAN_API_KEY"
    if curl -s -f --max-time 5 "$ETHERSCAN_URL" | grep -q "result"; then
        echo -e "${GREEN}✅ Etherscan Sepolia API is working${NC}"
    else
        echo -e "${RED}❌ Etherscan Sepolia API failed${NC}"
    fi
fi

# Base Sepolia Basescan
if [ -z "$VITE_BASESCAN_API_KEY" ]; then
    echo -e "${YELLOW}⚠️  VITE_BASESCAN_API_KEY not set (optional)${NC}"
else
    BASESCAN_URL="https://api-sepolia.basescan.org/api?module=proxy&action=eth_blockNumber&apikey=$VITE_BASESCAN_API_KEY"
    if curl -s -f --max-time 5 "$BASESCAN_URL" | grep -q "result"; then
        echo -e "${GREEN}✅ Basescan API is working${NC}"
    else
        echo -e "${RED}❌ Basescan API failed${NC}"
    fi
fi

# Arbitrum Sepolia Arbiscan
if [ -z "$VITE_ARBISCAN_API_KEY" ]; then
    echo -e "${YELLOW}⚠️  VITE_ARBISCAN_API_KEY not set (optional)${NC}"
else
    ARBISCAN_URL="https://api-sepolia.arbiscan.io/api?module=proxy&action=eth_blockNumber&apikey=$VITE_ARBISCAN_API_KEY"
    if curl -s -f --max-time 5 "$ARBISCAN_URL" | grep -q "result"; then
        echo -e "${GREEN}✅ Arbiscan API is working${NC}"
    else
        echo -e "${RED}❌ Arbiscan API failed${NC}"
    fi
fi

echo ""
echo "======================================"
echo "✅ Endpoint testing complete!"
echo ""
echo "Summary:"
echo "  - ML Service: Check above"
echo "  - Alchemy: Check above"
echo "  - DefiLlama: Public API (no key needed)"
echo "  - Etherscan APIs: Optional (for transaction history)"

