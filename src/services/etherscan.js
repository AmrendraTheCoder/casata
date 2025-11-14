import axios from "axios";

// Etherscan API endpoints for different chains - TESTNET MODE
const CHAIN_APIS = {
  sepolia: {
    url: "https://api-sepolia.etherscan.io/api",
    name: "Sepolia",
    symbol: "ETH",
    chainId: 11155111,
    explorer: "https://sepolia.etherscan.io",
    faucet: "https://sepoliafaucet.com",
  },
  baseSepolia: {
    url: "https://api-sepolia.basescan.org/api",
    name: "Base Sepolia",
    symbol: "ETH",
    chainId: 84532,
    explorer: "https://sepolia.basescan.org",
    faucet: "https://www.coinbase.com/faucets/base-ethereum-goerli-faucet",
  },
  arbitrumSepolia: {
    url: "https://api-sepolia.arbiscan.io/api",
    name: "Arbitrum Sepolia",
    symbol: "ETH",
    chainId: 421614,
    explorer: "https://sepolia.arbiscan.io",
    faucet: "https://faucet.arbitrum.io",
  },
};

// API Keys (optional - Etherscan works without key but with rate limits)
const API_KEYS = {
  sepolia: import.meta.env.VITE_ETHERSCAN_API_KEY || "",
  baseSepolia: import.meta.env.VITE_BASESCAN_API_KEY || "",
  arbitrumSepolia: import.meta.env.VITE_ARBISCAN_API_KEY || "",
};

/**
 * Fetch wallet balance for a specific chain
 */
export const getWalletBalance = async (address, chain = "sepolia") => {
  try {
    const chainConfig = CHAIN_APIS[chain];
    const apiKey = API_KEYS[chain];

    const response = await axios.get(chainConfig.url, {
      params: {
        module: "account",
        action: "balance",
        address: address,
        tag: "latest",
        apikey: apiKey,
      },
    });

    if (response.data.status === "1") {
      // Convert from Wei to ETH
      const balanceInEth = parseFloat(response.data.result) / 1e18;
      return {
        balance: balanceInEth,
        chain: chainConfig.name,
        symbol: chainConfig.symbol,
      };
    }

    return { balance: 0, chain: chainConfig.name, symbol: chainConfig.symbol };
  } catch (error) {
    console.error(`Error fetching balance for ${chain}:`, error);
    return {
      balance: 0,
      chain: CHAIN_APIS[chain].name,
      symbol: CHAIN_APIS[chain].symbol,
    };
  }
};

/**
 * Fetch transaction history for a specific chain
 */
export const getTransactionHistory = async (
  address,
  chain = "sepolia",
  limit = 20
) => {
  try {
    const chainConfig = CHAIN_APIS[chain];
    const apiKey = API_KEYS[chain];

    const response = await axios.get(chainConfig.url, {
      params: {
        module: "account",
        action: "txlist",
        address: address,
        startblock: 0,
        endblock: 99999999,
        page: 1,
        offset: limit,
        sort: "desc",
        apikey: apiKey,
      },
    });

    if (response.data.status === "1" && response.data.result) {
      return response.data.result.map((tx) => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: parseFloat(tx.value) / 1e18, // Convert Wei to ETH
        timestamp: parseInt(tx.timeStamp) * 1000, // Convert to milliseconds
        blockNumber: tx.blockNumber,
        isError: tx.isError === "1",
        gasUsed: tx.gasUsed,
        gasPrice: tx.gasPrice,
        chain: chainConfig.name,
        chainId: chainConfig.chainId,
        type: determineTransactionType(tx, address),
        explorerUrl: `${chainConfig.explorer}/tx/${tx.hash}`,
      }));
    }

    return [];
  } catch (error) {
    console.error(`Error fetching transactions for ${chain}:`, error);
    return [];
  }
};

/**
 * Fetch balances from all supported chains
 */
export const getMultiChainBalances = async (address) => {
  try {
    const chains = ["sepolia", "baseSepolia", "arbitrumSepolia"];
    const balancePromises = chains.map((chain) =>
      getWalletBalance(address, chain)
    );
    const balances = await Promise.all(balancePromises);

    const totalBalance = balances.reduce((sum, b) => sum + b.balance, 0);

    return {
      balances,
      totalBalance,
      chains: balances.length,
    };
  } catch (error) {
    console.error("Error fetching multi-chain balances:", error);
    return {
      balances: [],
      totalBalance: 0,
      chains: 0,
    };
  }
};

/**
 * Fetch transactions from all supported chains
 */
export const getMultiChainTransactions = async (
  address,
  limitPerChain = 20
) => {
  try {
    const chains = ["sepolia", "baseSepolia", "arbitrumSepolia"];
    const txPromises = chains.map((chain) =>
      getTransactionHistory(address, chain, limitPerChain)
    );
    const allTransactions = await Promise.all(txPromises);

    // Flatten and sort by timestamp
    const transactions = allTransactions
      .flat()
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limitPerChain); // Get latest 20 across all chains

    return transactions;
  } catch (error) {
    console.error("Error fetching multi-chain transactions:", error);
    return [];
  }
};

/**
 * Get wallet statistics
 */
export const getWalletStats = async (address) => {
  try {
    const [balanceData, transactions] = await Promise.all([
      getMultiChainBalances(address),
      getMultiChainTransactions(address, 100), // Fetch more for stats
    ]);

    // Calculate stats
    const totalTransactions = transactions.length;
    const sentTransactions = transactions.filter(
      (tx) => tx.type === "sent"
    ).length;
    const receivedTransactions = transactions.filter(
      (tx) => tx.type === "received"
    ).length;
    const contractInteractions = transactions.filter(
      (tx) => tx.type === "contract"
    ).length;

    // Calculate total gas spent (approximate)
    const totalGasSpent = transactions.reduce((sum, tx) => {
      const gasCost = (parseFloat(tx.gasUsed) * parseFloat(tx.gasPrice)) / 1e18;
      return sum + gasCost;
    }, 0);

    // Get first transaction date (oldest)
    const oldestTx =
      transactions.length > 0
        ? transactions[transactions.length - 1].timestamp
        : Date.now();
    const walletAge = Math.floor(
      (Date.now() - oldestTx) / (1000 * 60 * 60 * 24)
    ); // Days

    // Activity level
    const recentTransactions = transactions.filter(
      (tx) => Date.now() - tx.timestamp < 30 * 24 * 60 * 60 * 1000 // Last 30 days
    ).length;
    const activityLevel =
      recentTransactions > 10
        ? "high"
        : recentTransactions > 3
        ? "medium"
        : "low";

    return {
      totalBalance: balanceData.totalBalance,
      balanceByChain: balanceData.balances,
      totalTransactions,
      sentTransactions,
      receivedTransactions,
      contractInteractions,
      totalGasSpent,
      walletAge, // in days
      activityLevel,
      recentActivity: recentTransactions,
    };
  } catch (error) {
    console.error("Error fetching wallet stats:", error);
    return null;
  }
};

/**
 * Determine transaction type based on sender/receiver
 */
const determineTransactionType = (tx, walletAddress) => {
  const from = tx.from.toLowerCase();
  const to = tx.to.toLowerCase();
  const wallet = walletAddress.toLowerCase();

  if (from === wallet && to === wallet) {
    return "self";
  } else if (from === wallet) {
    return tx.input !== "0x" ? "contract" : "sent";
  } else if (to === wallet) {
    return "received";
  } else {
    return "unknown";
  }
};

/**
 * Format address for display
 */
export const formatAddress = (address) => {
  if (!address) return "";
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;
};

/**
 * Format transaction hash for display
 */
export const formatTxHash = (hash) => {
  if (!hash) return "";
  return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`;
};

/**
 * Calculate portfolio health score
 */
export const calculatePortfolioHealth = (stats) => {
  if (!stats) return 0;

  let score = 50; // Base score

  // Balance factor (0-25 points)
  if (stats.totalBalance > 10) score += 25;
  else if (stats.totalBalance > 1) score += 15;
  else if (stats.totalBalance > 0.1) score += 10;
  else score += 5;

  // Activity factor (0-20 points)
  if (stats.activityLevel === "high") score += 20;
  else if (stats.activityLevel === "medium") score += 12;
  else score += 5;

  // Diversification factor (0-15 points)
  const activeChains = stats.balanceByChain.filter((b) => b.balance > 0).length;
  score += activeChains * 5;

  // Experience factor (0-15 points)
  if (stats.walletAge > 365) score += 15; // 1+ year
  else if (stats.walletAge > 180) score += 10; // 6+ months
  else if (stats.walletAge > 90) score += 7; // 3+ months
  else score += 3;

  return Math.min(100, Math.max(0, score));
};

/**
 * Mock data for demo/testing
 */
export const getMockWalletData = (address) => {
  return {
    stats: {
      totalBalance: 0.65,
      balanceByChain: [
        { balance: 0.35, chain: "Sepolia", symbol: "ETH", explorer: "https://sepolia.etherscan.io" },
        { balance: 0.18, chain: "Base Sepolia", symbol: "ETH", explorer: "https://sepolia.basescan.org" },
        { balance: 0.12, chain: "Arbitrum Sepolia", symbol: "ETH", explorer: "https://sepolia.arbiscan.io" },
      ],
      totalTransactions: 52,
      sentTransactions: 18,
      receivedTransactions: 26,
      contractInteractions: 8,
      totalGasSpent: 0.028,
      walletAge: 87,
      activityLevel: "medium",
      recentActivity: 12,
      chains: 3,
    },
    transactions: [
      {
        hash: "0xa1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890",
        from: address,
        to: "0x87D29c6206e89b6d7e1f4F3c92BfD7D21e3c3456",
        value: 0.05,
        timestamp: Date.now() - 1000 * 60 * 45, // 45 mins ago
        blockNumber: "18500789",
        isError: false,
        gasUsed: "21000",
        gasPrice: "20000000000",
        chain: "Sepolia",
        chainId: 11155111,
        type: "sent",
        explorerUrl: "https://sepolia.etherscan.io/tx/0xa1b2c3d4e5f67890",
      },
      {
        hash: "0xb2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1",
        from: "0x1a2b3c4d5e6f7890123456789abcdef01234567",
        to: address,
        value: 0.15,
        timestamp: Date.now() - 1000 * 60 * 60 * 5, // 5 hours ago
        blockNumber: "18500650",
        isError: false,
        gasUsed: "21000",
        gasPrice: "22000000000",
        chain: "Sepolia",
        chainId: 11155111,
        type: "received",
        explorerUrl: "https://sepolia.etherscan.io/tx/0xb2c3d4e5f67890a1",
      },
      {
        hash: "0xc3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2",
        from: address,
        to: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        value: 0,
        timestamp: Date.now() - 1000 * 60 * 60 * 18, // 18 hours ago
        blockNumber: "18500234",
        isError: false,
        gasUsed: "85000",
        gasPrice: "25000000000",
        chain: "Base Sepolia",
        chainId: 84532,
        type: "contract",
        explorerUrl: "https://sepolia.basescan.org/tx/0xc3d4e5f67890a1b2",
      },
      {
        hash: "0xd4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3",
        from: "0x9f8e7d6c5b4a39281726354abcdef0123456789",
        to: address,
        value: 0.25,
        timestamp: Date.now() - 1000 * 60 * 60 * 48, // 2 days ago
        blockNumber: "18499123",
        isError: false,
        gasUsed: "21000",
        gasPrice: "18000000000",
        chain: "Sepolia",
        chainId: 11155111,
        type: "received",
        explorerUrl: "https://sepolia.etherscan.io/tx/0xd4e5f67890a1b2c3",
      },
      {
        hash: "0xe5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4",
        from: address,
        to: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        value: 0.08,
        timestamp: Date.now() - 1000 * 60 * 60 * 72, // 3 days ago
        blockNumber: "18498567",
        isError: false,
        gasUsed: "21000",
        gasPrice: "30000000000",
        chain: "Sepolia",
        chainId: 11155111,
        type: "sent",
        explorerUrl: "https://sepolia.etherscan.io/tx/0xe5f67890a1b2c3d4",
      },
      {
        hash: "0xf67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5",
        from: address,
        to: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
        value: 0,
        timestamp: Date.now() - 1000 * 60 * 60 * 96, // 4 days ago
        blockNumber: "18498012",
        isError: false,
        gasUsed: "95000",
        gasPrice: "28000000000",
        chain: "Arbitrum Sepolia",
        chainId: 421614,
        type: "contract",
        explorerUrl: "https://sepolia.arbiscan.io/tx/0xf67890a1b2c3d4e5",
      },
      {
        hash: "0x67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f",
        from: "0xabcdef0123456789abcdef0123456789abcdef01",
        to: address,
        value: 0.12,
        timestamp: Date.now() - 1000 * 60 * 60 * 120, // 5 days ago
        blockNumber: "18497456",
        isError: false,
        gasUsed: "21000",
        gasPrice: "19000000000",
        chain: "Base Sepolia",
        chainId: 84532,
        type: "received",
        explorerUrl: "https://sepolia.basescan.org/tx/0x67890a1b2c3d4e5f",
      },
      {
        hash: "0x7890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f6",
        from: address,
        to: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
        value: 0.03,
        timestamp: Date.now() - 1000 * 60 * 60 * 144, // 6 days ago
        blockNumber: "18496890",
        isError: false,
        gasUsed: "21000",
        gasPrice: "27000000000",
        chain: "Sepolia",
        chainId: 11155111,
        type: "sent",
        explorerUrl: "https://sepolia.etherscan.io/tx/0x7890a1b2c3d4e5f6",
      },
      {
        hash: "0x890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67",
        from: "0x234567890abcdef1234567890abcdef123456789",
        to: address,
        value: 0.2,
        timestamp: Date.now() - 1000 * 60 * 60 * 168, // 7 days ago
        blockNumber: "18496123",
        isError: false,
        gasUsed: "21000",
        gasPrice: "21000000000",
        chain: "Sepolia",
        chainId: 11155111,
        type: "received",
        explorerUrl: "https://sepolia.etherscan.io/tx/0x890a1b2c3d4e5f67",
      },
      {
        hash: "0x90a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f678",
        from: address,
        to: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        value: 0,
        timestamp: Date.now() - 1000 * 60 * 60 * 192, // 8 days ago
        blockNumber: "18495567",
        isError: false,
        gasUsed: "72000",
        gasPrice: "24000000000",
        chain: "Base Sepolia",
        chainId: 84532,
        type: "contract",
        explorerUrl: "https://sepolia.basescan.org/tx/0x90a1b2c3d4e5f678",
      },
      {
        hash: "0x0a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f6789",
        from: "0xcdef0123456789abcdef0123456789abcdef0123",
        to: address,
        value: 0.18,
        timestamp: Date.now() - 1000 * 60 * 60 * 216, // 9 days ago
        blockNumber: "18495012",
        isError: false,
        gasUsed: "21000",
        gasPrice: "23000000000",
        chain: "Arbitrum Sepolia",
        chainId: 421614,
        type: "received",
        explorerUrl: "https://sepolia.arbiscan.io/tx/0x0a1b2c3d4e5f6789",
      },
      {
        hash: "0x1a2b3c4d5e6f7890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890",
        from: address,
        to: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
        value: 0.06,
        timestamp: Date.now() - 1000 * 60 * 60 * 240, // 10 days ago
        blockNumber: "18494456",
        isError: false,
        gasUsed: "21000",
        gasPrice: "26000000000",
        chain: "Sepolia",
        chainId: 11155111,
        type: "sent",
        explorerUrl: "https://sepolia.etherscan.io/tx/0x1a2b3c4d5e6f7890",
      },
      {
        hash: "0x2b3c4d5e6f7890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1",
        from: "0x456789abcdef0123456789abcdef0123456789ab",
        to: address,
        value: 0.1,
        timestamp: Date.now() - 1000 * 60 * 60 * 264, // 11 days ago
        blockNumber: "18493890",
        isError: false,
        gasUsed: "21000",
        gasPrice: "20000000000",
        chain: "Base Sepolia",
        chainId: 84532,
        type: "received",
        explorerUrl: "https://sepolia.basescan.org/tx/0x2b3c4d5e6f7890a1",
      },
      {
        hash: "0x3c4d5e6f7890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2",
        from: address,
        to: "0x9A676e781A523b5d0C0e43731313A708CB607508",
        value: 0,
        timestamp: Date.now() - 1000 * 60 * 60 * 288, // 12 days ago
        blockNumber: "18493234",
        isError: false,
        gasUsed: "110000",
        gasPrice: "29000000000",
        chain: "Arbitrum Sepolia",
        chainId: 421614,
        type: "contract",
        explorerUrl: "https://sepolia.arbiscan.io/tx/0x3c4d5e6f7890a1b2",
      },
      {
        hash: "0x4d5e6f7890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3",
        from: "0x6789abcdef0123456789abcdef0123456789abcd",
        to: address,
        value: 0.22,
        timestamp: Date.now() - 1000 * 60 * 60 * 312, // 13 days ago
        blockNumber: "18492678",
        isError: false,
        gasUsed: "21000",
        gasPrice: "19000000000",
        chain: "Sepolia",
        chainId: 11155111,
        type: "received",
        explorerUrl: "https://sepolia.etherscan.io/tx/0x4d5e6f7890a1b2c3",
      },
      {
        hash: "0x5e6f7890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4",
        from: address,
        to: "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82",
        value: 0.04,
        timestamp: Date.now() - 1000 * 60 * 60 * 336, // 14 days ago
        blockNumber: "18492012",
        isError: false,
        gasUsed: "21000",
        gasPrice: "25000000000",
        chain: "Base Sepolia",
        chainId: 84532,
        type: "sent",
        explorerUrl: "https://sepolia.basescan.org/tx/0x5e6f7890a1b2c3d4",
      },
      {
        hash: "0x6f7890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5",
        from: "0x89abcdef0123456789abcdef0123456789abcdef",
        to: address,
        value: 0.13,
        timestamp: Date.now() - 1000 * 60 * 60 * 360, // 15 days ago
        blockNumber: "18491456",
        isError: false,
        gasUsed: "21000",
        gasPrice: "22000000000",
        chain: "Arbitrum Sepolia",
        chainId: 421614,
        type: "received",
        explorerUrl: "https://sepolia.arbiscan.io/tx/0x6f7890a1b2c3d4e5",
      },
      {
        hash: "0x7f890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f",
        from: address,
        to: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
        value: 0,
        timestamp: Date.now() - 1000 * 60 * 60 * 384, // 16 days ago
        blockNumber: "18490890",
        isError: false,
        gasUsed: "78000",
        gasPrice: "27000000000",
        chain: "Sepolia",
        chainId: 11155111,
        type: "contract",
        explorerUrl: "https://sepolia.etherscan.io/tx/0x7f890a1b2c3d4e5f",
      },
      {
        hash: "0x8f90a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f6",
        from: "0xabcdef0123456789abcdef0123456789abcdef01",
        to: address,
        value: 0.14,
        timestamp: Date.now() - 1000 * 60 * 60 * 408, // 17 days ago
        blockNumber: "18490234",
        isError: false,
        gasUsed: "21000",
        gasPrice: "21000000000",
        chain: "Base Sepolia",
        chainId: 84532,
        type: "received",
        explorerUrl: "https://sepolia.basescan.org/tx/0x8f90a1b2c3d4e5f6",
      },
      {
        hash: "0x9f0a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67",
        from: address,
        to: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
        value: 0.07,
        timestamp: Date.now() - 1000 * 60 * 60 * 432, // 18 days ago
        blockNumber: "18489678",
        isError: false,
        gasUsed: "21000",
        gasPrice: "24000000000",
        chain: "Sepolia",
        chainId: 11155111,
        type: "sent",
        explorerUrl: "https://sepolia.etherscan.io/tx/0x9f0a1b2c3d4e5f67",
      },
    ],
  };
};
