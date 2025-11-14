# YieldShift - Quick Start Guide 🚀

Get YieldShift running in **under 2 minutes**!

## Option 1: Demo Mode (No API Keys Required)

Perfect for testing, presentations, or hackathon judging.

### Steps:

1. **Start the app**:
   ```bash
   npm run dev
   ```

2. **Open browser**: Navigate to `http://localhost:5173`

3. **Connect wallet**: Click "Connect Wallet" and connect MetaMask

4. **Explore**: You'll see demo positions with migration recommendations!

That's it! The app works with mock data out of the box.

---

## Option 2: Live Mode (With Your Actual Wallet Data)

### What You Need:

- Alchemy API Key (free): https://www.alchemy.com/
- Active DeFi positions (Aave, Compound on Ethereum/Base/Arbitrum)

### Steps:

1. **Get Alchemy API Key**:
   - Sign up at https://www.alchemy.com/
   - Create a new app (any network)
   - Copy your API key

2. **Configure**:
   Create a `.env` file:
   ```env
   VITE_ALCHEMY_API_KEY=your_key_here
   VITE_ENABLE_MOCK_DATA=false
   ```

3. **Start**:
   ```bash
   npm run dev
   ```

4. **Connect**: Open `http://localhost:5173` and connect your wallet

---

## Troubleshooting

### "No positions found"

✅ **Solution**: Enable demo mode
- Set `VITE_ENABLE_MOCK_DATA=true` in `.env`
- Or remove `.env` file (demo mode is default)

### Port already in use

✅ **Solution**: 
```bash
# Kill the process using port 5173
lsof -ti:5173 | xargs kill -9
npm run dev
```

### TailwindCSS errors

✅ **Solution**:
```bash
# Clean reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Features to Try

### 1. Portfolio Health Check
- See your total value and current yields
- Health score shows if you're optimized

### 2. Position Cards
- Click any underperforming position
- View APY comparison

### 3. Migration Opportunities
- Click "View Migration Details"
- See cost breakdown, timing, and steps
- Social proof shows similar wallets migrating

### 4. Migration Score
- 85-100: Move immediately
- 70-84: Good opportunity
- 50-69: Monitor
- 0-49: Stay put

---

## Demo Data Preview

The demo includes:

**Position 1**: $12,300 USDC in Aave Ethereum
- Current APY: 8.1%
- Best opportunity: Aave Base at 14.2%
- Score: 91/100 🔥
- Potential gain: $748/year

**Position 2**: 8.5 ETH in Lido
- Current APY: 3.2%
- Status: Optimal ✅
- Score: 42/100

**Position 3**: $5,400 USDT in Compound Arbitrum
- Current APY: 6.5%
- Best opportunity: Aave Base at 11.2%
- Score: 82/100
- Potential gain: $254/year

---

## Optional: Run Python ML Service

Adds advanced scoring (app works without it):

```bash
cd ml-service
pip install -r requirements.txt
python app.py
```

The service runs on `http://localhost:5000`

---

## Project Structure

```
casata/
├── src/
│   ├── components/      # UI components
│   │   ├── Dashboard.jsx
│   │   ├── PositionCard.jsx
│   │   ├── MigrationOpportunity.jsx
│   │   └── ...
│   ├── hooks/           # useWallet, usePositions, etc.
│   ├── services/        # API integrations
│   │   ├── defiLlama.js
│   │   ├── alchemy.js
│   │   └── mlService.js
│   └── utils/           # Constants, mock data
├── ml-service/          # Optional Python service
└── README.md            # Full documentation
```

---

## Next Steps

- [ ] Customize mock data in `src/utils/mockData.js`
- [ ] Add your own API keys for live data
- [ ] Explore the codebase
- [ ] Add more protocols or chains

---

## Support

Need help? Check:
- Full docs: `README.md`
- Code comments: Well documented!
- Demo mode: Always works, no setup needed

---

**Built for hackathons and DeFi enthusiasts** 🎯

Made with ❤️ for the DeFi community

