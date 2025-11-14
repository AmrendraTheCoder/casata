// Chain configurations - TESTNET MODE
export const CHAINS = {
  SEPOLIA: {
    id: 11155111,
    name: "Sepolia",
    shortName: "ETH",
    explorer: "https://sepolia.etherscan.io",
    color: "#627EEA",
    faucet: "https://sepoliafaucet.com",
  },
  BASE_SEPOLIA: {
    id: 84532,
    name: "Base Sepolia",
    shortName: "BASE",
    explorer: "https://sepolia.basescan.org",
    color: "#0052FF",
    faucet: "https://www.coinbase.com/faucets/base-ethereum-goerli-faucet",
  },
  ARBITRUM_SEPOLIA: {
    id: 421614,
    name: "Arbitrum Sepolia",
    shortName: "ARB",
    explorer: "https://sepolia.arbiscan.io",
    color: "#28A0F0",
    faucet: "https://faucet.arbitrum.io",
  },
};

// Get chain by ID
export const getChainById = (chainId) => {
  return (
    Object.values(CHAINS).find((chain) => chain.id === chainId) ||
    CHAINS.ETHEREUM
  );
};

// Protocol configurations
export const PROTOCOLS = {
  AAVE_V3: {
    name: "Aave V3",
    shortName: "Aave",
    safetyScore: 9,
    type: "lending",
    website: "https://aave.com",
    logo: "🏦",
    contracts: {
      1: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2", // Ethereum
      8453: "0xA238Dd80C259a72e81d7e4664a9801593F98d1c5", // Base
      42161: "0x794a61358D6845594F94dc1DB02A252b5b4814aD", // Arbitrum
    },
  },
  COMPOUND_V3: {
    name: "Compound V3",
    shortName: "Compound",
    safetyScore: 8.5,
    type: "lending",
    website: "https://compound.finance",
    logo: "🏛️",
    contracts: {
      1: "0xc3d688B66703497DAA19211EEdff47f25384cdc3",
      8453: "0x9c4ec768c28520B50860ea7a15bd7213a9fF58bf",
      42161: "0xA5EDBDD9646f8dFF606d7448e414884C7d905dCA",
    },
  },
  CURVE: {
    name: "Curve Finance",
    shortName: "Curve",
    safetyScore: 8.8,
    type: "liquidity",
    website: "https://curve.fi",
    logo: "📈",
    contracts: {
      1: "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7",
      8453: "0x", // Add if needed
      42161: "0x", // Add if needed
    },
  },
};

// Stablecoin configurations
export const STABLECOINS = {
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    logo: "💵",
    addresses: {
      1: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      8453: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      42161: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    },
  },
  USDT: {
    symbol: "USDT",
    name: "Tether USD",
    decimals: 6,
    logo: "💲",
    addresses: {
      1: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      8453: "0x", // Not widely used on Base
      42161: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    },
  },
  DAI: {
    symbol: "DAI",
    name: "Dai Stablecoin",
    decimals: 18,
    logo: "◈",
    addresses: {
      1: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      8453: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
      42161: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    },
  },
};

// Position status types
export const POSITION_STATUS = {
  OPTIMAL: "optimal",
  UNDERPERFORMING: "underperforming",
  CRITICAL: "critical",
};

// Migration score thresholds
export const SCORE_THRESHOLDS = {
  EXCELLENT: 85, // Move immediately
  GOOD: 70, // Strong candidate
  MODERATE: 50, // Monitor
  LOW: 0, // Stay put
};

// Get score color based on threshold
export const getScoreColor = (score) => {
  if (score >= SCORE_THRESHOLDS.EXCELLENT) return "text-green-600 bg-green-100";
  if (score >= SCORE_THRESHOLDS.GOOD) return "text-blue-600 bg-blue-100";
  if (score >= SCORE_THRESHOLDS.MODERATE)
    return "text-yellow-600 bg-yellow-100";
  return "text-gray-600 bg-gray-100";
};

// Get score label
export const getScoreLabel = (score) => {
  if (score >= SCORE_THRESHOLDS.EXCELLENT) return "Excellent Opportunity";
  if (score >= SCORE_THRESHOLDS.GOOD) return "Good Opportunity";
  if (score >= SCORE_THRESHOLDS.MODERATE) return "Moderate Opportunity";
  return "Stay Put";
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format percentage
export const formatPercentage = (value) => {
  return `${value.toFixed(2)}%`;
};

// Format large numbers
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(2)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(2)}K`;
  }
  return num.toFixed(2);
};

// Shorten address
export const shortenAddress = (address) => {
  if (!address) return "";
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;
};
