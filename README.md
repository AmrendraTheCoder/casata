# YieldShift 🎯

AI-powered yield optimizer for DeFi farmers. Automatically detect underperforming positions and get migration recommendations to earn 30-40% more yield.

## Features

- 🔍 **Smart Detection**: Automatically scans your wallet for DeFi positions
- 🤖 **AI Analysis**: Compares 200+ protocols across chains
- ⚡ **Migration Scores**: Ranked recommendations with cost breakdowns
- 💰 **Maximize Yields**: Find better opportunities across Ethereum, Base, and Arbitrum
- 🔒 **Read-Only**: We never ask for signatures or access to your funds

## Tech Stack

- **Frontend**: React + Vite + TailwindCSS
- **Wallet**: wagmi + viem (MetaMask integration)
- **Data**: DefiLlama API, Alchemy API
- **AI/ML**: Python Flask service (optional)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file in the root directory (or copy from `.env.example`):

```env
# Optional: Alchemy API Key for live wallet data
VITE_ALCHEMY_API_KEY=

# Optional: WalletConnect Project ID
VITE_WALLETCONNECT_PROJECT_ID=

# Python ML Service URL (if running ML service)
VITE_ML_SERVICE_URL=http://localhost:5000

# Use mock data for demo (true/false)
VITE_ENABLE_MOCK_DATA=true
```

**Note**: The app works in demo mode with `VITE_ENABLE_MOCK_DATA=true` without any API keys!

### 3. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. (Optional) Run Python ML Service

If you want to run the AI scoring service:

```bash
cd ml-service
pip install -r requirements.txt
python app.py
```

The ML service will run on `http://localhost:5000`

**Note**: The app falls back to client-side calculations if the ML service isn't running.

## Demo Mode

The app includes mock data for demo purposes. Simply:

1. Start the dev server: `npm run dev`
2. Open `http://localhost:5173`
3. Click "Connect Wallet"
4. Connect MetaMask
5. You'll see demo positions with migration recommendations!

The demo data includes:
- 3 sample positions (USDC on Ethereum, ETH staking, USDT on Arbitrum)
- Multiple migration opportunities with scores
- Realistic APY data and cost calculations

## Live Mode (With Real Data)

To use real wallet data:

1. Get a free Alchemy API key: https://www.alchemy.com/
2. Add it to `.env`: `VITE_ALCHEMY_API_KEY=your_key_here`
3. Set `VITE_ENABLE_MOCK_DATA=false`
4. Restart the dev server

The app will fetch your actual DeFi positions and analyze real opportunities from DefiLlama.

## Supported Protocols

- **Aave V3** (Ethereum, Base, Arbitrum)
- **Compound V3** (Ethereum, Base, Arbitrum)
- **Curve Finance** (Ethereum)
- More coming soon!

## Supported Chains

- Ethereum (Mainnet)
- Base
- Arbitrum

## How It Works

1. **Connect Wallet**: Connect your MetaMask wallet
2. **Position Detection**: We detect your active DeFi positions
3. **Opportunity Analysis**: AI compares your positions against 200+ protocols
4. **Migration Scores**: Get ranked recommendations (0-100 score)
5. **Review Details**: See cost breakdowns, APY comparisons, and timing advice
6. **Execute**: Follow the step-by-step migration instructions

## Migration Score Formula

Scores are calculated based on:

- **APY Differential (40%)**: How much more yield you can earn
- **Protocol Safety (30%)**: Security score of the target protocol
- **Cost Efficiency (20%)**: Bridge fees, gas costs, breakeven time
- **Timing Factor (10%)**: Current gas prices and optimal migration window

## Project Structure

```
casata/
├── src/
│   ├── components/     # React components
│   ├── hooks/          # Custom hooks
│   ├── services/       # API integrations
│   ├── utils/          # Constants, calculations, mock data
│   ├── config/         # Wagmi configuration
│   ├── App.jsx         # Main app component
│   └── main.jsx        # Entry point
├── ml-service/         # Python ML service (optional)
│   ├── app.py          # Flask API
│   ├── scorer.py       # Score calculator
│   └── predictor.py    # Yield predictor
└── public/             # Static assets
```

## API Keys (Optional but Recommended)

### Alchemy API
- Free tier: 300M compute units/month
- Get it here: https://www.alchemy.com/
- Used for: Fetching wallet balances and positions

### WalletConnect Project ID
- Free tier available
- Get it here: https://cloud.walletconnect.com/
- Used for: Enhanced wallet connection options

### DefiLlama
- No API key required! 
- Used for: Protocol APY data

## Development

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Troubleshooting

### "No positions found"

- Make sure you have deposits in supported protocols (Aave, Compound)
- Check that you're on a supported chain (Ethereum, Base, Arbitrum)
- Or enable demo mode: `VITE_ENABLE_MOCK_DATA=true`

### Wallet won't connect

- Make sure MetaMask is installed
- Check that you're on a supported network
- Try refreshing the page

### Data not loading

- Check your internet connection
- Verify API keys if using live mode
- Fall back to demo mode for testing

## Hackathon Demo

For judging/demo purposes:

1. Keep `VITE_ENABLE_MOCK_DATA=true` for reliable demo
2. The app shows realistic positions with migration opportunities
3. Demonstrates full user flow without requiring real wallet positions
4. All calculations and scoring work with mock data

## Future Enhancements

- [ ] LP position support
- [ ] Cross-chain swaps integration
- [ ] One-click migration execution
- [ ] Email/Telegram alerts for opportunities
- [ ] Historical tracking and portfolio analytics
- [ ] More protocols (Yearn, Convex, etc.)
- [ ] Advanced ML models for yield prediction

## Contributing

This is a hackathon project! Contributions, ideas, and feedback are welcome.

## License

MIT

## Built For

DeFi farmers who want to maximize returns without constantly monitoring yields across chains.

---

**Note**: Always DYOR (Do Your Own Research) before making financial decisions. This tool provides recommendations but you should verify all data before executing migrations.
