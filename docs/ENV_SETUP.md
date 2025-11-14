# 🔐 Environment Setup Guide

## Creating Your .env File

The `.env` file stores your API keys and configuration. **Never commit this file to Git!**

### Step 1: Create the File

```bash
# From the project root directory
touch .env
```

Or create it manually in your code editor.

### Step 2: Add Configuration

Copy and paste this into your `.env` file:

```env
# ========================================
# MODE SELECTION
# ========================================
# Set to 'true' for demo mode (no API keys needed)
# Set to 'false' for real data mode
VITE_ENABLE_MOCK_DATA=true

# ========================================
# ALCHEMY API (REQUIRED FOR REAL DATA)
# ========================================
# Get your free API key from: https://www.alchemy.com/
# 1. Sign up (free, no credit card)
# 2. Create apps for each testnet:
#    - Ethereum Sepolia
#    - Base Sepolia
#    - Arbitrum Sepolia
# 3. Copy the same API key here (works for all testnets)

VITE_ALCHEMY_API_KEY=

# ========================================
# WALLETCONNECT (OPTIONAL)
# ========================================
# Only needed if you want WalletConnect support
# MetaMask works without this
# Get from: https://cloud.walletconnect.com/

VITE_WALLETCONNECT_PROJECT_ID=

# ========================================
# ML SERVICE (OPTIONAL)
# ========================================
# URL of the Python ML Service
# Default: http://localhost:5000
# App falls back to client-side scoring if not running

VITE_ML_SERVICE_URL=http://localhost:5000
```

### Step 3: Fill in Your Keys

#### For Demo Mode (Easiest)
Just leave it as is! The app works with `VITE_ENABLE_MOCK_DATA=true`

#### For Real Data Mode
1. Get Alchemy API key (see instructions below)
2. Replace the empty `VITE_ALCHEMY_API_KEY=` with your key
3. Change `VITE_ENABLE_MOCK_DATA=false`

---

## 🔑 Getting Your Alchemy API Key

### Why Alchemy?
- Fetches your wallet balances across multiple chains
- Free tier: 300M compute units/month (plenty for testing)
- No credit card required

### Steps:

1. **Go to Alchemy**
   - Visit: https://www.alchemy.com/
   - Click "Get started for free"

2. **Sign Up**
   - Use email or GitHub
   - No credit card required

3. **Create Apps** (Do this 3 times, once for each testnet)

   **App 1: Ethereum Sepolia**
   - Click "Create new app"
   - Name: "YieldShift Sepolia"
   - Chain: Ethereum
   - Network: Ethereum Sepolia
   - Click "Create app"

   **App 2: Base Sepolia**
   - Click "Create new app"
   - Name: "YieldShift Base"
   - Chain: Base
   - Network: Base Sepolia
   - Click "Create app"

   **App 3: Arbitrum Sepolia**
   - Click "Create new app"
   - Name: "YieldShift Arbitrum"
   - Chain: Arbitrum
   - Network: Arbitrum Sepolia
   - Click "Create app"

4. **Get API Key**
   - Go to any app dashboard
   - Click "API Key" tab
   - Copy the API key
   - **All apps share the same key!**

5. **Add to .env**
   ```env
   VITE_ALCHEMY_API_KEY=alch_xxxxxxxxxxxxxxxxxxxxxxxx
   ```

6. **Verify It Works**
   ```bash
   chmod +x scripts/test-alchemy.sh
   ./scripts/test-alchemy.sh YOUR_KEY YOUR_WALLET_ADDRESS
   ```

---

## 🧪 Test ETH for Testnets

You'll need test ETH to see transactions on testnets.

### Faucets (Free Test ETH):

1. **Ethereum Sepolia**
   - https://www.alchemy.com/faucets/ethereum-sepolia
   - Sign in with Alchemy account
   - Request 0.5 ETH per day

2. **Base Sepolia**
   - https://www.alchemy.com/faucets/base-sepolia
   - Sign in with Alchemy account
   - Request 0.5 ETH per day

3. **Arbitrum Sepolia**
   - https://www.alchemy.com/faucets/arbitrum-sepolia
   - Sign in with Alchemy account
   - Request 0.5 ETH per day

### How to Use:
1. Connect your MetaMask wallet
2. Make sure you're on the correct testnet
3. Paste your wallet address
4. Request tokens
5. Wait 1-2 minutes

---

## ✅ Verification Checklist

After setting up your `.env`:

- [ ] File is in project root: `/Users/amrendravikramsingh/Desktop/casata/.env`
- [ ] File is in `.gitignore` (should already be there)
- [ ] Alchemy API key is added (if using real data)
- [ ] `VITE_ENABLE_MOCK_DATA` is set correctly
- [ ] Dev server has been restarted: `npm run dev`

---

## 🔍 Testing Your Setup

### 1. Check Configuration
```bash
# View your configuration (keys will be hidden in app)
cat .env | grep VITE_
```

### 2. Test Alchemy Connection
```bash
./scripts/test-alchemy.sh YOUR_ALCHEMY_KEY YOUR_WALLET
```

### 3. Start the App
```bash
npm run dev
```

### 4. Check Browser Console
Open DevTools (F12) and look for:
- ✅ "Using real data" or "Using mock data"
- ✅ "Alchemy configured: true" or "false"
- ✅ No error messages

---

## 🐛 Troubleshooting

### Issue: "Alchemy API key not set"
**Solution:**
- Check file name is exactly `.env` (starts with a dot)
- Check variable name is `VITE_ALCHEMY_API_KEY` (exact spelling)
- Restart dev server after changing .env
- No spaces around the `=` sign

### Issue: ".env file not found"
**Solution:**
```bash
# Check if file exists
ls -la .env

# If not, create it
touch .env

# Edit it
nano .env
# Or use your code editor
```

### Issue: "Changes to .env not working"
**Solution:**
- Restart the dev server (Ctrl+C, then `npm run dev`)
- .env changes require a restart
- Check for typos in variable names

### Issue: "Invalid API key"
**Solution:**
- Copy the full key from Alchemy dashboard
- Remove any spaces before/after the key
- Make sure you copied the API key, not the App ID

### Issue: "Can't see .env file in editor"
**Solution:**
- Files starting with `.` are hidden by default
- In VS Code: File > Preferences > Settings > "files.exclude"
- Or use terminal: `ls -la` to see hidden files

---

## 🔒 Security Best Practices

1. **Never Commit .env to Git**
   - Already in `.gitignore`
   - Double-check before pushing

2. **Don't Share Your API Keys**
   - Each person should have their own
   - Don't put keys in screenshots or docs

3. **Use Different Keys for Dev/Prod**
   - Create separate Alchemy apps
   - Rotate keys if compromised

4. **Read-Only Access**
   - This app only reads data
   - Never signs transactions
   - Your funds are safe

---

## 📝 Example Configurations

### Demo Mode (No Setup)
```env
VITE_ENABLE_MOCK_DATA=true
VITE_ALCHEMY_API_KEY=
VITE_ML_SERVICE_URL=http://localhost:5000
```

### Real Data Mode (Testnet)
```env
VITE_ENABLE_MOCK_DATA=false
VITE_ALCHEMY_API_KEY=alch_abc123xyz789
VITE_ML_SERVICE_URL=http://localhost:5000
```

### Production Mode (Mainnet)
```env
VITE_ENABLE_MOCK_DATA=false
VITE_ALCHEMY_API_KEY=alch_prod_key_here
VITE_ML_SERVICE_URL=https://your-ml-service.com
```

---

## 🚀 Next Steps

1. ✅ Create `.env` file
2. ✅ Add API keys
3. ✅ Test configuration
4. ✅ Start dev server
5. ✅ Connect wallet
6. 🎉 See it work!

**Need more help?**
- See `INTEGRATION_GUIDE.md` for full setup
- See `QUICK_START.md` for fastest path
- Check `README.md` for overview

