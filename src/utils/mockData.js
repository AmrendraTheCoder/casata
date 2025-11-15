// Mock positions for demo - Testnet Profile
export const MOCK_POSITIONS = [
  {
    id: '1',
    protocol: 'Testnet Position',
    protocolLogo: '🧪',
    chain: 'Sepolia',
    chainId: 11155111,
    asset: 'ETH',
    assetLogo: '⟠',
    amount: 0.5,
    currentApy: 3.5,
    status: 'optimal',
    daysDeployed: 45,
    totalEarned: 0.0216
  },
  {
    id: '2',
    protocol: 'Testnet Position',
    protocolLogo: '🧪',
    chain: 'Base Sepolia',
    chainId: 84532,
    asset: 'ETH',
    assetLogo: '⟠',
    amount: 0.3,
    currentApy: 3.5,
    status: 'underperforming',
    daysDeployed: 30,
    totalEarned: 0.0086
  },
  {
    id: '3',
    protocol: 'Testnet Position',
    protocolLogo: '🧪',
    chain: 'Arbitrum Sepolia',
    chainId: 421614,
    asset: 'ETH',
    assetLogo: '⟠',
    amount: 0.2,
    currentApy: 3.5,
    status: 'optimal',
    daysDeployed: 20,
    totalEarned: 0.0038
  }
];

// Mock opportunities for migration - Testnet Amounts
export const MOCK_OPPORTUNITIES = [
  {
    positionId: '2',
    targetProtocol: 'Testnet Position',
    targetProtocolLogo: '🧪',
    targetChain: 'Arbitrum Sepolia',
    targetChainId: 421614,
    asset: 'ETH',
    assetLogo: '⟠',
    amount: 0.3,
    currentApy: 3.5,
    targetApy: 5.2,
    apyDifferential: 1.7,
    score: 75,
    annualGain: 0.0051,
    costs: {
      bridge: 0.0001,
      gas: 0.0001,
      total: 0.0002
    },
    breakeven: 14.3, // days
    protocolSafetyScore: 8,
    socialProof: {
      similarWallets: 45,
      avgGain: 0.006,
      timeframe: '7 days'
    },
    timing: {
      recommendation: 'Good testnet opportunity',
      reason: 'Low cost, practice migration',
      urgency: 'low'
    },
    migrationSteps: [
      'Withdraw 0.3 ETH from Base Sepolia',
      'Bridge ETH from Base Sepolia to Arbitrum Sepolia (minimal fee)',
      'Deposit 0.3 ETH on Arbitrum Sepolia',
      'Start earning higher APY'
    ]
  }
];

// Mock historical data for charts
export const MOCK_APY_HISTORY = {
  '1': [ // Position 1 (Aave Ethereum USDC)
    { date: '2024-10-15', apy: 9.2 },
    { date: '2024-10-22', apy: 8.9 },
    { date: '2024-10-29', apy: 8.5 },
    { date: '2024-11-05', apy: 8.3 },
    { date: '2024-11-12', apy: 8.1 },
  ],
  'aave-base-usdc': [ // Target (Aave Base USDC)
    { date: '2024-10-15', apy: 13.8 },
    { date: '2024-10-22', apy: 14.1 },
    { date: '2024-10-29', apy: 14.3 },
    { date: '2024-11-05', apy: 14.0 },
    { date: '2024-11-12', apy: 14.2 },
  ]
};

// Mock wallet balances - College Student
export const MOCK_WALLET_BALANCES = {
  '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb': {
    ethereum: {
      USDC: 450,
      ETH: 0.3,
      USDT: 0
    },
    base: {
      USDC: 0,
      ETH: 0.05,
      USDT: 0
    },
    arbitrum: {
      USDC: 0,
      ETH: 0,
      USDT: 150
    }
  }
};

// Mock portfolio summary - College Student
export const MOCK_PORTFOLIO_SUMMARY = {
  totalValue: 1200,
  currentYield: 72, // Annual
  potentialYield: 107, // If all migrations executed
  missedOpportunities: 35,
  activePositions: 3,
  underperformingPositions: 2,
  healthScore: 64 // Out of 100
};

// Check if mock data should be used
export const shouldUseMockData = () => {
  return import.meta.env.VITE_ENABLE_MOCK_DATA === 'true';
};

// Get mock opportunities for a position
export const getMockOpportunitiesForPosition = (positionId) => {
  return MOCK_OPPORTUNITIES.filter(opp => opp.positionId === positionId);
};

// Get all mock opportunities sorted by score
export const getAllMockOpportunities = () => {
  return [...MOCK_OPPORTUNITIES].sort((a, b) => b.score - a.score);
};

