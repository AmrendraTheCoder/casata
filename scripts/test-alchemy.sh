#!/bin/bash

# Test Alchemy API Connection
# Usage: chmod +x scripts/test-alchemy.sh && ./scripts/test-alchemy.sh YOUR_ALCHEMY_KEY YOUR_WALLET_ADDRESS

echo "🔗 Testing Alchemy API Connection"
echo "=================================="
echo ""

# Check arguments
if [ -z "$1" ]; then
    echo "❌ Error: Alchemy API key required"
    echo "Usage: ./scripts/test-alchemy.sh YOUR_ALCHEMY_KEY [WALLET_ADDRESS]"
    exit 1
fi

ALCHEMY_KEY="$1"
WALLET_ADDRESS="${2:-0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb}"  # Default test address

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "Testing with:"
echo "  API Key: ${ALCHEMY_KEY:0:10}...${ALCHEMY_KEY: -4}"
echo "  Address: $WALLET_ADDRESS"
echo ""

# Test 1: Sepolia
echo "1️⃣  Testing Ethereum Sepolia..."
SEPOLIA_URL="https://eth-sepolia.g.alchemy.com/v2/$ALCHEMY_KEY"
SEPOLIA_RESPONSE=$(curl -s -X POST "$SEPOLIA_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "eth_getBalance",
    "params": ["'"$WALLET_ADDRESS"'", "latest"]
  }')

if echo "$SEPOLIA_RESPONSE" | grep -q '"result"'; then
    BALANCE=$(echo "$SEPOLIA_RESPONSE" | grep -o '"result":"[^"]*"' | cut -d'"' -f4)
    BALANCE_ETH=$(echo "scale=6; ibase=16; ${BALANCE#0x} / 10^18" | bc 2>/dev/null || echo "N/A")
    echo -e "${GREEN}✅ Sepolia Connected${NC}"
    echo "   Balance: $BALANCE_ETH ETH"
else
    echo -e "${RED}❌ Sepolia Failed${NC}"
    echo "   Response: $SEPOLIA_RESPONSE"
fi
echo ""

# Test 2: Base Sepolia
echo "2️⃣  Testing Base Sepolia..."
BASE_URL="https://base-sepolia.g.alchemy.com/v2/$ALCHEMY_KEY"
BASE_RESPONSE=$(curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "eth_getBalance",
    "params": ["'"$WALLET_ADDRESS"'", "latest"]
  }')

if echo "$BASE_RESPONSE" | grep -q '"result"'; then
    BALANCE=$(echo "$BASE_RESPONSE" | grep -o '"result":"[^"]*"' | cut -d'"' -f4)
    BALANCE_ETH=$(echo "scale=6; ibase=16; ${BALANCE#0x} / 10^18" | bc 2>/dev/null || echo "N/A")
    echo -e "${GREEN}✅ Base Sepolia Connected${NC}"
    echo "   Balance: $BALANCE_ETH ETH"
else
    echo -e "${RED}❌ Base Sepolia Failed${NC}"
    echo "   Response: $BASE_RESPONSE"
fi
echo ""

# Test 3: Arbitrum Sepolia
echo "3️⃣  Testing Arbitrum Sepolia..."
ARB_URL="https://arb-sepolia.g.alchemy.com/v2/$ALCHEMY_KEY"
ARB_RESPONSE=$(curl -s -X POST "$ARB_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "eth_getBalance",
    "params": ["'"$WALLET_ADDRESS"'", "latest"]
  }')

if echo "$ARB_RESPONSE" | grep -q '"result"'; then
    BALANCE=$(echo "$ARB_RESPONSE" | grep -o '"result":"[^"]*"' | cut -d'"' -f4)
    BALANCE_ETH=$(echo "scale=6; ibase=16; ${BALANCE#0x} / 10^18" | bc 2>/dev/null || echo "N/A")
    echo -e "${GREEN}✅ Arbitrum Sepolia Connected${NC}"
    echo "   Balance: $BALANCE_ETH ETH"
else
    echo -e "${RED}❌ Arbitrum Sepolia Failed${NC}"
    echo "   Response: $ARB_RESPONSE"
fi
echo ""

echo "=================================="
echo "🎉 Alchemy API Tests Complete!"
echo ""
echo "Next steps:"
echo "1. Add API key to .env: VITE_ALCHEMY_API_KEY=$ALCHEMY_KEY"
echo "2. Set VITE_ENABLE_MOCK_DATA=false"
echo "3. Restart dev server: npm run dev"

