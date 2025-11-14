# ⚡ Quick Start Guide

Get YieldShift running in 5 minutes!

## 🎯 Choose Your Mode

### Option 1: Demo Mode (No Setup Required) ⭐ Recommended for First Time

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open browser
open http://localhost:5173

# 4. Click "Connect Wallet" and connect MetaMask
# 5. See demo data with mock positions and opportunities!
```

**That's it!** The app works out of the box with demo data.

---

### Option 2: Real Data Mode (Testnet)

```bash
# 1. Get Alchemy API Key
# Visit: https://www.alchemy.com/
# Sign up (free) and create apps for:
#   - Ethereum Sepolia
#   - Base Sepolia
#   - Arbitrum Sepolia

# 2. Create .env file
cp .env.example .env

# 3. Add your API key to .env
VITE_ALCHEMY_API_KEY=your_key_here
VITE_ENABLE_MOCK_DATA=false

# 4. Get test ETH from faucets
# - Sepolia: https://www.alchemy.com/faucets/ethereum-sepolia
# - Base Sepolia: https://www.alchemy.com/faucets/base-sepolia
# - Arbitrum Sepolia: https://www.alchemy.com/faucets/arbitrum-sepolia

# 5. Start dev server
npm run dev

# 6. Connect MetaMask (switch to Sepolia network)
# 7. See your real testnet positions!
```

---

### Option 3: With ML Service (Advanced)

```bash
# Terminal 1: Start ML Service
cd ml-service
chmod +x start.sh
./start.sh

# Terminal 2: Start Frontend
npm run dev

# Open browser and connect wallet
# ML service will provide AI-powered scoring!
```

---

## 🧪 Testing

### Test ML Service
```bash
chmod +x scripts/test-ml-service.sh
./scripts/test-ml-service.sh
```

### Test Alchemy API
```bash
chmod +x scripts/test-alchemy.sh
./scripts/test-alchemy.sh YOUR_API_KEY YOUR_WALLET_ADDRESS
```

---

## 📚 Next Steps

- **Full Setup**: See `INTEGRATION_GUIDE.md` for complete instructions
- **Deployment**: See `DEPLOYMENT.md` for production deployment
- **Features**: See `FEATURES.md` for all capabilities
- **Troubleshooting**: See `INTEGRATION_GUIDE.md` → Troubleshooting section

---

## 🆘 Common Issues

### "Alchemy API key not set"
→ Create `.env` file and add `VITE_ALCHEMY_API_KEY=your_key`

### "ML service not available"
→ Start ML service: `cd ml-service && ./start.sh`

### "No positions found"
→ Get test ETH from faucets or use demo mode

### Port already in use
→ Kill process: `lsof -ti:5173 | xargs kill -9`

---

## 🎨 Features Available

✅ Wallet connection (MetaMask)
✅ Portfolio overview
✅ Transaction history
✅ Yield optimizer dashboard
✅ Migration opportunities with AI scores
✅ Portfolio health NFT generator
✅ Gennie AI chatbot
✅ Multi-chain support (Sepolia testnets)
✅ Dark mode optimized UI
✅ Responsive design

---

**Need help?** Check the full `INTEGRATION_GUIDE.md` or review code comments.

**Ready to deploy?** See `DEPLOYMENT.md` for production setup.

