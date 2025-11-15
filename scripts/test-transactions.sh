#!/bin/bash

# Test transaction fetching from Etherscan APIs
# Usage: ./scripts/test-transactions.sh <wallet_address>

WALLET_ADDRESS="${1:-0x7AAEE83b0d757dcF204E4279914e5d3c4a524146}"

echo "🔍 Testing Transaction Fetching"
echo "================================"
echo "Wallet: $WALLET_ADDRESS"
echo ""

# Load API keys from .env
if [ -f .env ]; then
    export $(cat .env | grep -E "VITE_ETHERSCAN_API_KEY|VITE_BASESCAN_API_KEY|VITE_ARBISCAN_API_KEY" | xargs)
fi

# Test Sepolia
echo "1️⃣  Testing Sepolia Etherscan..."
echo "URL: https://api-sepolia.etherscan.io/api"
SEPOLIA_RESPONSE=$(curl -s "https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=$WALLET_ADDRESS&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=$VITE_ETHERSCAN_API_KEY")
SEPOLIA_COUNT=$(echo $SEPOLIA_RESPONSE | jq -r '.result | length' 2>/dev/null || echo "0")
echo "   Transactions found: $SEPOLIA_COUNT"
if [ "$SEPOLIA_COUNT" != "0" ] && [ "$SEPOLIA_COUNT" != "null" ]; then
    echo "   ✅ Sepolia API working"
    echo $SEPOLIA_RESPONSE | jq -r '.result[0] | "   Latest: \(.hash[0:20])... at block \(.blockNumber)"' 2>/dev/null
else
    echo "   ⚠️  No transactions or API error"
    echo "   Response: $(echo $SEPOLIA_RESPONSE | jq -r '.message' 2>/dev/null || echo $SEPOLIA_RESPONSE | head -c 100)"
fi
echo ""

# Test Base Sepolia
echo "2️⃣  Testing Base Sepolia..."
echo "URL: https://api-sepolia.basescan.org/api"
BASE_RESPONSE=$(curl -s "https://api-sepolia.basescan.org/api?module=account&action=txlist&address=$WALLET_ADDRESS&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=$VITE_BASESCAN_API_KEY")
BASE_COUNT=$(echo $BASE_RESPONSE | jq -r '.result | length' 2>/dev/null || echo "0")
echo "   Transactions found: $BASE_COUNT"
if [ "$BASE_COUNT" != "0" ] && [ "$BASE_COUNT" != "null" ]; then
    echo "   ✅ Base Sepolia API working"
    echo $BASE_RESPONSE | jq -r '.result[0] | "   Latest: \(.hash[0:20])... at block \(.blockNumber)"' 2>/dev/null
else
    echo "   ⚠️  No transactions or API error"
    echo "   Response: $(echo $BASE_RESPONSE | jq -r '.message' 2>/dev/null || echo $BASE_RESPONSE | head -c 100)"
fi
echo ""

# Test Arbitrum Sepolia
echo "3️⃣  Testing Arbitrum Sepolia..."
echo "URL: https://api-sepolia.arbiscan.io/api"
ARB_RESPONSE=$(curl -s "https://api-sepolia.arbiscan.io/api?module=account&action=txlist&address=$WALLET_ADDRESS&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=$VITE_ARBISCAN_API_KEY")
ARB_COUNT=$(echo $ARB_RESPONSE | jq -r '.result | length' 2>/dev/null || echo "0")
echo "   Transactions found: $ARB_COUNT"
if [ "$ARB_COUNT" != "0" ] && [ "$ARB_COUNT" != "null" ]; then
    echo "   ✅ Arbitrum Sepolia API working"
    echo $ARB_RESPONSE | jq -r '.result[0] | "   Latest: \(.hash[0:20])... at block \(.blockNumber)"' 2>/dev/null
else
    echo "   ⚠️  No transactions or API error"
    echo "   Response: $(echo $ARB_RESPONSE | jq -r '.message' 2>/dev/null || echo $ARB_RESPONSE | head -c 100)"
fi
echo ""

# Summary
TOTAL=$((SEPOLIA_COUNT + BASE_COUNT + ARB_COUNT))
echo "================================"
echo "📊 Summary:"
echo "   Sepolia: $SEPOLIA_COUNT transactions"
echo "   Base Sepolia: $BASE_COUNT transactions"
echo "   Arbitrum Sepolia: $ARB_COUNT transactions"
echo "   Total: $TOTAL transactions"
echo ""

if [ "$TOTAL" -eq "0" ]; then
    echo "⚠️  No transactions found on any chain!"
    echo ""
    echo "Possible reasons:"
    echo "1. This wallet has no transactions on testnets"
    echo "2. Transactions are very recent (< 1 minute) and not indexed yet"
    echo "3. API keys might be invalid or rate limited"
    echo ""
    echo "💡 Try:"
    echo "   - Wait 1-2 minutes after sending a transaction"
    echo "   - Check the transaction on block explorer"
    echo "   - Make sure you're using testnet addresses"
else
    echo "✅ Transaction fetching is working!"
fi

