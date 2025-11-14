# 🧪 Sepolia Testnet Configuration

## ✅ Complete! Your App Now Uses Testnet

YieldShift has been successfully configured to use **Sepolia testnets** instead of mainnet. This means you can test with real transactions using free faucet tokens!

---

## 🎯 What Changed

### **Chains Updated**

- ❌ ~~Ethereum Mainnet~~ → ✅ **Sepolia Testnet**
- ❌ ~~Base Mainnet~~ → ✅ **Base Sepolia**
- ❌ ~~Arbitrum Mainnet~~ → ✅ **Arbitrum Sepolia**

### **Files Modified**

1. ✅ `src/config/wagmi.js` - Wallet connector now uses testnet chains
2. ✅ `src/utils/constants.js` - Chain IDs and explorers updated
3. ✅ `src/services/etherscan.js` - API endpoints changed to testnet
4. ✅ `src/pages/PortfolioOverview.jsx` - Added faucet section, updated filters
5. ✅ `src/components/Router.jsx` - Footer updated with testnet info

---

## 🌐 Testnet Details

### **Sepolia (Ethereum Testnet)**

```
Chain ID: 11155111
RPC: https://sepolia.infura.io/v3/YOUR_KEY
Explorer: https://sepolia.etherscan.io
Faucet: https://sepoliafaucet.com
```

### **Base Sepolia**

```
Chain ID: 84532
RPC: https://sepolia.base.org
Explorer: https://sepolia.basescan.org
Faucet: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
```

### **Arbitrum Sepolia**

```
Chain ID: 421614
RPC: https://sepolia-rollup.arbitrum.io/rpc
Explorer: https://sepolia.arbiscan.io
Faucet: https://faucet.arbitrum.io
```

---

## 💧 How to Get Test ETH

### **Step 1: Get Sepolia ETH**

1. Visit: https://sepoliafaucet.com
2. Connect your wallet or enter your address
3. Request test ETH (usually 0.5 - 1 ETH)
4. Wait ~30 seconds for confirmation

**Alternative Faucets:**

- https://faucet.quicknode.com/ethereum/sepolia
- https://www.alchemy.com/faucets/ethereum-sepolia
- https://faucets.chain.link/sepolia

### **Step 2: Get Base Sepolia ETH**

1. Visit: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
2. Connect your Coinbase account (required)
3. Request test ETH for Base Sepolia
4. Tokens arrive in ~1 minute

### **Step 3: Get Arbitrum Sepolia ETH**

1. Visit: https://faucet.arbitrum.io
2. Connect your wallet
3. Select "Arbitrum Sepolia"
4. Request test ETH
5. Confirm transaction

---

## 🔧 Setup MetaMask for Testnets

### **Add Sepolia to MetaMask**

Sepolia should be available by default. If not:

1. Open MetaMask
2. Click network dropdown → "Add Network"
3. Search for "Sepolia" or add manually:
   - **Network Name:** Sepolia
   - **RPC URL:** https://sepolia.infura.io/v3/YOUR_KEY
   - **Chain ID:** 11155111
   - **Currency:** ETH
   - **Block Explorer:** https://sepolia.etherscan.io

### **Add Base Sepolia**

1. Visit: https://chainlist.org
2. Search "Base Sepolia"
3. Click "Add to MetaMask"
4. Approve the connection

**OR manually:**

- **Network Name:** Base Sepolia
- **RPC URL:** https://sepolia.base.org
- **Chain ID:** 84532
- **Currency:** ETH
- **Block Explorer:** https://sepolia.basescan.org

### **Add Arbitrum Sepolia**

1. Visit: https://chainlist.org
2. Search "Arbitrum Sepolia"
3. Click "Add to MetaMask"
4. Approve the connection

**OR manually:**

- **Network Name:** Arbitrum Sepolia
- **RPC URL:** https://sepolia-rollup.arbitrum.io/rpc
- **Chain ID:** 421614
- **Currency:** ETH
- **Block Explorer:** https://sepolia.arbiscan.io

---

## 🧪 Testing Your Setup

### **1. Run the App**

```bash
npm run dev
```

### **2. Connect Wallet**

- Click "Connect Wallet"
- Select MetaMask
- Switch to Sepolia network
- Approve connection

### **3. Get Test ETH**

- Visit the faucet section on Portfolio page
- Click on faucet links
- Get free test ETH

### **4. Make Test Transactions**

To see real transactions in your portfolio:

**Simple Transfer:**

```
Send 0.01 ETH from your wallet to another address
From: Your Address
To: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb (test address)
Amount: 0.01 ETH
Network: Sepolia
```

**Contract Interaction (Uniswap):**

1. Go to https://app.uniswap.org
2. Switch to Sepolia network
3. Try to swap tokens (even if you don't complete it)
4. This creates a contract interaction transaction

### **5. View Transactions**

- Go back to YieldShift
- Navigate to Portfolio Overview
- You should see your transactions!
- Filter by chain to see specific networks

---

## 🎯 Benefits of Testnet

### **Why Use Testnets?**

✅ **Free Testing** - No real money needed  
✅ **Real Transactions** - Actual blockchain interactions  
✅ **Safe Development** - Can't lose real funds  
✅ **Full Features** - Same experience as mainnet  
✅ **Easy Reset** - Get more test ETH anytime

### **Perfect For:**

- 👨‍💻 Developers testing features
- 🎓 Learning blockchain development
- 🧪 Testing new protocols
- 📊 Demo presentations
- 🎮 Experimenting without risk

---

## 📊 Mock Data vs Real Testnet Data

### **Mock Data Mode** (`VITE_ENABLE_MOCK_DATA=true`)

- Shows fake transactions
- No wallet connection needed
- Instant demo
- Same transactions every time

### **Testnet Mode** (`VITE_ENABLE_MOCK_DATA=false`)

- Shows YOUR real testnet transactions
- Requires wallet connection
- Need test ETH from faucets
- Real blockchain data
- **← YOU ARE HERE NOW**

---

## 🔄 Switching Back to Mainnet (Future)

If you ever want to switch back to mainnet:

### **1. Update `src/config/wagmi.js`**

```javascript
import { mainnet, base, arbitrum } from "wagmi/chains";
export const chains = [mainnet, base, arbitrum];
```

### **2. Update `src/utils/constants.js`**

```javascript
export const CHAINS = {
  ETHEREUM: { id: 1, name: "Ethereum", ... },
  BASE: { id: 8453, name: "Base", ... },
  ARBITRUM: { id: 42161, name: "Arbitrum", ... },
};
```

### **3. Update `src/services/etherscan.js`**

```javascript
const CHAIN_APIS = {
  ethereum: { url: "https://api.etherscan.io/api", ... },
  base: { url: "https://api.basescan.org/api", ... },
  arbitrum: { url: "https://api.arbiscan.io/api", ... },
};
```

---

## 🐛 Troubleshooting

### **Issue: MetaMask not showing testnet**

**Solution:** Enable "Show test networks" in MetaMask settings

1. MetaMask → Settings → Advanced
2. Enable "Show test networks"
3. Restart MetaMask

### **Issue: Can't get test ETH from faucet**

**Solution:** Try alternative faucets or wait 24 hours

- Most faucets have daily limits per address
- Try different faucets listed above
- Join Discord/Telegram for faucet help

### **Issue: Transactions not showing**

**Solution:**

1. Make sure you're on the correct network in MetaMask
2. Verify transaction was successful on explorer
3. Wait ~1 minute and refresh the page
4. Check if `VITE_ENABLE_MOCK_DATA=false`

### **Issue: "Insufficient funds" error**

**Solution:** Get more test ETH from faucets

- Need at least 0.01 ETH for transactions
- Gas fees consume test ETH
- Request more from faucets

---

## 📱 Mobile Testing

### **MetaMask Mobile**

1. Install MetaMask Mobile app
2. Add testnet networks (same as desktop)
3. Get test ETH from faucets
4. Open YieldShift in MetaMask browser
5. Connect wallet and test!

---

## 🎓 Learning Resources

### **Understanding Testnets**

- [Ethereum Testnets Guide](https://ethereum.org/en/developers/docs/networks/#testnets)
- [What are Testnets?](https://www.alchemy.com/overviews/what-are-testnets)

### **Getting Test ETH**

- [Best Faucet List](https://faucetlink.to/)
- [Alchemy Faucets](https://www.alchemy.com/faucets)

### **Blockchain Explorers**

- [Sepolia Etherscan](https://sepolia.etherscan.io)
- [Base Sepolia Explorer](https://sepolia.basescan.org)
- [Arbitrum Sepolia Explorer](https://sepolia.arbiscan.io)

---

## ✨ New Features Added

### **Faucet Section**

Added a beautiful faucet section to Portfolio Overview page with:

- 💧 Direct links to all testnet faucets
- 🎨 Cards for each chain with icons
- 💡 Helpful tips
- 🖱️ One-click access to get test ETH

### **Updated UI**

- Chain names show "Sepolia", "Base Sepolia", "Arbitrum Sepolia"
- Chain icons updated to match testnet
- Filter buttons updated for testnet chains
- Footer shows testnet information
- Explorer links point to testnet explorers

---

## 🎉 You're All Set!

**Your YieldShift app is now configured for Sepolia testnets!**

### **Next Steps:**

1. ✅ Run `npm run dev`
2. ✅ Connect your MetaMask wallet
3. ✅ Switch to Sepolia network
4. ✅ Get test ETH from faucets
5. ✅ Make some test transactions
6. ✅ View them in Portfolio Overview!

### **Test Wallet:**

If you need a dedicated test wallet:

1. Create a new MetaMask account
2. Name it "Test Wallet - Sepolia"
3. Get test ETH
4. Use it exclusively for testing

---

## 🔒 Security Note

**Testnets are safe but remember:**

- ⚠️ Never use testnet wallet for real funds
- ⚠️ Test private keys should be different from mainnet
- ⚠️ Don't share testnet private keys publicly
- ⚠️ Testnet tokens have NO real value

---

## 📞 Need Help?

**Faucet Issues:**

- [Alchemy Discord](https://discord.com/invite/alchemyplatform)
- [Ethereum Discord](https://discord.com/invite/ethereum-org)

**Technical Issues:**

- Check the code comments
- Review the implementation files
- Test with mock data first

---

**Happy Testing! 🧪**

_Now you can test YieldShift with real blockchain transactions without spending any real money!_
