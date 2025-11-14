# 🚀 Full Integration Guide - ML Service & Real Wallet Data

This guide will help you set up YieldShift with real MetaMask integration and the ML service.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step 1: Environment Setup](#step-1-environment-setup)
4. [Step 2: Get API Keys](#step-2-get-api-keys)
5. [Step 3: Configure the Frontend](#step-3-configure-the-frontend)
6. [Step 4: Set Up ML Service](#step-4-set-up-ml-service)
7. [Step 5: Configure for Testnet](#step-5-configure-for-testnet)
8. [Step 6: Testing](#step-6-testing)
9. [Troubleshooting](#troubleshooting)
10. [Switch to Mainnet](#switch-to-mainnet)

---

## Overview

**Current Status:**

- ✅ Frontend: React + Vite + TailwindCSS
- ✅ Wallet: wagmi + viem (MetaMask ready)
- ✅ Data: DefiLlama (200+ protocols)
- ✅ Blockchain: Alchemy API (wallet data)
- ✅ ML Service: Python Flask (AI scoring)
- ✅ Testnets: Sepolia, Base Sepolia, Arbitrum Sepolia

**What Works:**

- ✅ Mock data mode (demo)
- ✅ MetaMask connection
- ✅ UI/UX complete
- ✅ Portfolio health calculation
- ✅ NFT image generation
- ✅ Gennie chatbot

**What Needs Setup:**

- ⚙️ Alchemy API key (for real wallet data)
- ⚙️ ML Service (for AI scoring)
- ⚙️ Environment configuration

---

## Prerequisites

### Required

- Node.js 18+ and npm
- MetaMask browser extension
- Git

### For ML Service (Optional)

- Python 3.8+
- pip

---

## Step 1: Environment Setup

### 1.1 Clone and Install

```bash
cd /Users/amrendravikramsingh/Desktop/casata
npm install
```

### 1.2 Create Environment File

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Start with demo mode
VITE_ENABLE_MOCK_DATA=true

# Add your API keys (get these in Step 2)
VITE_ALCHEMY_API_KEY=

# Optional
VITE_WALLETCONNECT_PROJECT_ID=
VITE_ML_SERVICE_URL=http://localhost:5000
```

---

## Step 2: Get API Keys

### 2.1 Alchemy API Key (REQUIRED for real data)

**Why?** Fetches wallet balances across Ethereum, Base, and Arbitrum

**Steps:**

1. Go to https://www.alchemy.com/
2. Sign up for free (no credit card needed)
3. Create a new app:
   - **Chain**: Select "Ethereum"
   - **Network**: Select "Ethereum Sepolia"
   - Click "Create App"
4. Repeat for Base Sepolia and Arbitrum Sepolia
5. Go to Dashboard → Apps → View Key
6. Copy your API key

**Free Tier:**

- 300M compute units/month
- Plenty for testing and development

### 2.2 WalletConnect Project ID (OPTIONAL)

**Why?** Only if you want WalletConnect support (MetaMask works without this)

**Steps:**

1. Go to https://cloud.walletconnect.com/
2. Sign up and create a project
3. Copy your Project ID

---

## Step 3: Configure the Frontend

### 3.1 Update .env File

```env
# Alchemy API Key (from Step 2.1)
VITE_ALCHEMY_API_KEY=your_actual_key_here

# Switch to real data mode
VITE_ENABLE_MOCK_DATA=false

# Optional: WalletConnect
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here

# ML Service URL
VITE_ML_SERVICE_URL=http://localhost:5000
```

### 3.2 Verify Configuration

Create `scripts/check-config.js`:

```javascript
// Check if environment is properly configured
const checkConfig = () => {
  const alchemyKey = import.meta.env.VITE_ALCHEMY_API_KEY;
  const mockMode = import.meta.env.VITE_ENABLE_MOCK_DATA === "true";

  console.log("📋 Configuration Status:");
  console.log("------------------------");
  console.log(
    `Mock Mode: ${mockMode ? "✅ Enabled (Demo)" : "❌ Disabled (Live)"}`
  );
  console.log(`Alchemy API: ${alchemyKey ? "✅ Configured" : "❌ Missing"}`);
  console.log(
    `ML Service: ${
      import.meta.env.VITE_ML_SERVICE_URL || "http://localhost:5000"
    }`
  );

  if (!mockMode && !alchemyKey) {
    console.warn("⚠️  Warning: Real data mode requires Alchemy API key");
  }
};

checkConfig();
```

### 3.3 Start Frontend

```bash
npm run dev
```

Open http://localhost:5173

---

## Step 4: Set Up ML Service

### 4.1 Navigate to ML Service Directory

```bash
cd ml-service
```

### 4.2 Quick Start (Recommended)

**Option A: Using Simple Script (Easiest)**

```bash
cd ml-service
./start-simple.sh
```

This uses the existing `.venv` in the project root.

**Option B: Using Smart Script**

```bash
cd ml-service
./start.sh
```

This automatically detects and uses your virtual environment.

**Option C: Manual Setup**

If you have a virtual environment at the project root:

```bash
# From project root
source .venv/bin/activate
cd ml-service
pip install -r requirements.txt
python app.py
```

Or if `python`/`pip` aren't in your PATH:

```bash
# From project root
cd ml-service
../.venv/bin/python app.py
```

### 4.3 Install Dependencies (If Needed)

If dependencies aren't installed:

```bash
# Using venv Python directly
../.venv/bin/pip install -r requirements.txt

# Or activate venv first
source ../.venv/bin/activate
pip install -r requirements.txt
```

**Dependencies:**

- Flask (web framework)
- Flask-CORS (CORS support)
- numpy (calculations)
- pandas (data processing)
- scikit-learn (ML algorithms)

### 4.4 Test ML Service

```bash
# Using the script
./start-simple.sh

# Or manually
../.venv/bin/python app.py
```

You should see:

```
🚀 YieldShift ML Service starting...
📊 Endpoints available:
   GET  /health          - Health check
   POST /api/score       - Score single opportunity
   POST /api/batch-score - Score multiple opportunities
   POST /api/predict     - Predict yield trend

✅ Service running on http://localhost:5000
```

### 4.5 Test Health Endpoint

Open a new terminal:

```bash
curl http://localhost:5000/health
```

Should return:

```json
{ "status": "healthy", "service": "YieldShift ML Service" }
```

### 4.6 Test Scoring Endpoint

```bash
curl -X POST http://localhost:5000/api/score \
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
  }'
```

Should return a score and calculations.

---

## Step 5: Configure for Testnet

### 5.1 Current Testnet Configuration

The app is already configured for testnets in `src/utils/constants.js`:

```javascript
export const CHAINS = {
  SEPOLIA: {
    id: 11155111,
    name: "Sepolia",
    explorer: "https://sepolia.etherscan.io",
  },
  BASE_SEPOLIA: {
    id: 84532,
    name: "Base Sepolia",
    explorer: "https://sepolia.basescan.org",
  },
  ARBITRUM_SEPOLIA: {
    id: 421614,
    name: "Arbitrum Sepolia",
    explorer: "https://sepolia.arbiscan.io",
  },
};
```

### 5.2 Update Alchemy Service for Testnets

The `src/services/alchemy.js` needs to be updated for testnets:

```javascript
// Get Alchemy RPC URL for chain
const getAlchemyUrl = (chainId) => {
  const key = getAlchemyKey();

  if (!key) {
    console.warn("Alchemy API key not set");
    return null;
  }

  const urlMap = {
    // Testnets
    11155111: `https://eth-sepolia.g.alchemy.com/v2/${key}`, // Sepolia
    84532: `https://base-sepolia.g.alchemy.com/v2/${key}`, // Base Sepolia
    421614: `https://arb-sepolia.g.alchemy.com/v2/${key}`, // Arbitrum Sepolia
  };

  return urlMap[chainId] || null;
};
```

### 5.3 Update fetchAllBalances for Testnets

```javascript
export const fetchAllBalances = async (address) => {
  if (!address) {
    throw new Error("Address is required");
  }

  const chainIds = [11155111, 84532, 421614]; // Sepolia testnets
  const allBalances = {};

  // ... rest of the function
};
```

### 5.4 Get Test ETH

Use the faucets in the app:

- **Sepolia**: https://www.alchemy.com/faucets/ethereum-sepolia
- **Base Sepolia**: https://www.alchemy.com/faucets/base-sepolia
- **Arbitrum Sepolia**: https://www.alchemy.com/faucets/arbitrum-sepolia

---

## Step 6: Testing

### 6.1 Test with Demo Mode First

1. Set `VITE_ENABLE_MOCK_DATA=true` in `.env`
2. Run `npm run dev`
3. Connect MetaMask
4. You should see mock positions

### 6.2 Test with Real Data (Testnet)

1. Get test ETH from faucets (Step 5.4)
2. Set `VITE_ENABLE_MOCK_DATA=false` in `.env`
3. Restart: `npm run dev`
4. Connect MetaMask (make sure you're on Sepolia)
5. App should fetch real wallet data

### 6.3 Test ML Service Integration

1. Start ML service: `cd ml-service && python app.py`
2. Start frontend: `npm run dev`
3. Open browser console
4. Look for: "Using ML service" or "ML service available"

### 6.4 Test Full Flow

1. **Connect Wallet**: Click "Connect Wallet" → MetaMask
2. **View Portfolio**: Navigate to Portfolio Overview
3. **See Positions**: Should show your testnet positions
4. **Get Recommendations**: Go to Dashboard/Optimize
5. **Check Scores**: Opportunities should have AI scores

---

## Troubleshooting

### Issue: "Alchemy API key not set"

**Solution:**

```bash
# Check .env file exists
ls -la .env

# Check if variable is set
cat .env | grep VITE_ALCHEMY_API_KEY

# Make sure to restart dev server after changing .env
```

### Issue: "ML service is not available"

**Solution:**

```bash
# Check if ML service is running
curl http://localhost:5000/health

# If not, start it:
cd ml-service
python app.py

# Check for port conflicts
lsof -i :5000
```

### Issue: "No positions found"

**Possible Causes:**

1. Wallet has no assets → Get test ETH from faucets
2. Wrong network → Switch MetaMask to Sepolia
3. Alchemy API issue → Check API key
4. Mock mode enabled → Set `VITE_ENABLE_MOCK_DATA=false`

**Debug:**

```javascript
// Add to src/hooks/usePositions.js
console.log("Mock mode:", shouldUseMockData());
console.log("Alchemy configured:", isAlchemyConfigured());
console.log("Fetching for address:", address);
```

### Issue: "Error fetching DefiLlama pools"

**Solution:**

```bash
# Test DefiLlama API directly
curl https://yields.llama.fi/pools | jq '.data[0]'

# If it works, check CORS in browser console
# If it fails, DefiLlama might be down (use cache)
```

### Issue: Port Already in Use

**Frontend (5173):**

```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

**ML Service (5000):**

```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in ml-service/app.py
app.run(host='0.0.0.0', port=5001, debug=True)
# Then update VITE_ML_SERVICE_URL=http://localhost:5001
```

### Issue: MetaMask Not Detecting

**Solution:**

1. Install MetaMask extension
2. Refresh page
3. Check browser console for errors
4. Try different browser (Chrome/Brave recommended)

### Issue: "Cannot read properties of undefined"

**Check:**

1. Are positions loaded? `console.log(positions)`
2. Is wallet connected? `console.log(isConnected, address)`
3. API responses: Check Network tab in DevTools

---

## Switch to Mainnet

### ⚠️ WARNING: Only switch to mainnet when you're ready to use real funds

### Step 1: Update constants.js

```javascript
// src/utils/constants.js
export const CHAINS = {
  ETHEREUM: {
    id: 1,
    name: "Ethereum",
    explorer: "https://etherscan.io",
  },
  BASE: {
    id: 8453,
    name: "Base",
    explorer: "https://basescan.org",
  },
  ARBITRUM: {
    id: 42161,
    name: "Arbitrum",
    explorer: "https://arbiscan.io",
  },
};
```

### Step 2: Update alchemy.js

```javascript
const urlMap = {
  1: `https://eth-mainnet.g.alchemy.com/v2/${key}`,
  8453: `https://base-mainnet.g.alchemy.com/v2/${key}`,
  42161: `https://arb-mainnet.g.alchemy.com/v2/${key}`,
};

// Update fetchAllBalances
const chainIds = [1, 8453, 42161]; // Mainnets
```

### Step 3: Update Alchemy Apps

Create mainnet apps in Alchemy dashboard for each chain.

### Step 4: Update wagmi config

```javascript
// src/config/wagmi.js
import { mainnet, base, arbitrum } from "wagmi/chains";

export const config = createConfig({
  chains: [mainnet, base, arbitrum],
  // ... rest of config
});
```

---

## Architecture Overview

```
┌─────────────────┐
│   Frontend      │
│  (React/Vite)   │
│                 │
│  ┌───────────┐  │
│  │ Portfolio │  │
│  │ Dashboard │  │
│  │  Router   │  │
│  └───────────┘  │
│        │        │
│        ├────────┼──────> MetaMask (Wallet Connection)
│        │        │
│        ├────────┼──────> Alchemy API (Wallet Balances)
│        │        │
│        ├────────┼──────> DefiLlama API (APY Data)
│        │        │
│        └────────┼──────> ML Service (AI Scoring)
└─────────────────┘              │
                                 │
                         ┌───────▼──────┐
                         │  ML Service  │
                         │   (Python)   │
                         │              │
                         │ • scorer.py  │
                         │ • predictor  │
                         └──────────────┘
```

---

## Next Steps

✅ **You're All Set!**

1. Start with demo mode to understand the app
2. Get Alchemy API key when ready for real data
3. Use testnets for safe testing
4. Run ML service for AI-powered scoring
5. Switch to mainnet only when confident

**Need Help?**

- Check browser console for errors
- Check terminal for API errors
- Review this guide's troubleshooting section
- Check `README.md` for additional info

---

## Performance Tips

1. **Cache DefiLlama Data**: Already implemented (5min cache)
2. **Batch API Calls**: Use batch scoring endpoint
3. **Lazy Load**: Components load on demand
4. **Mock Mode for Dev**: Use mock data during UI development

---

## Security Checklist

- ✅ Read-only access (no signatures required)
- ✅ API keys in .env (not committed)
- ✅ CORS properly configured
- ✅ No private keys in code
- ✅ Alchemy API has rate limits
- ✅ MetaMask handles all transactions

---

**Built with ❤️ for DeFi Optimizers**

Questions? Check the troubleshooting section or review the code comments.
