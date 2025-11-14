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
      totalBalance: 12.45,
      balanceByChain: [
        { balance: 8.3, chain: "Sepolia", symbol: "ETH" },
        { balance: 2.5, chain: "Base Sepolia", symbol: "ETH" },
        { balance: 1.65, chain: "Arbitrum Sepolia", symbol: "ETH" },
      ],
      totalTransactions: 247,
      sentTransactions: 132,
      receivedTransactions: 98,
      contractInteractions: 17,
      totalGasSpent: 0.45,
      walletAge: 456,
      activityLevel: "high",
      recentActivity: 18,
    },
    transactions: [
      {
        hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        from: address,
        to: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        value: 0.5,
        timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
        blockNumber: "18500123",
        isError: false,
        gasUsed: "21000",
        gasPrice: "30000000000",
        chain: "Sepolia",
        chainId: 11155111,
        type: "sent",
        explorerUrl: "https://sepolia.etherscan.io/tx/0x1234567890abcdef",
      },
      {
        hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        from: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        to: address,
        value: 1.2,
        timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
        blockNumber: "18499456",
        isError: false,
        gasUsed: "21000",
        gasPrice: "25000000000",
        chain: "Sepolia",
        chainId: 11155111,
        type: "received",
        explorerUrl: "https://sepolia.etherscan.io/tx/0xabcdef1234567890",
      },
      {
        hash: "0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba",
        from: address,
        to: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        value: 0,
        timestamp: Date.now() - 1000 * 60 * 60 * 48, // 2 days ago
        blockNumber: "18498234",
        isError: false,
        gasUsed: "65000",
        gasPrice: "35000000000",
        chain: "Base Sepolia",
        chainId: 84532,
        type: "contract",
        explorerUrl: "https://sepolia.basescan.org/tx/0x9876543210fedcba",
      },
    ],
  };
};
