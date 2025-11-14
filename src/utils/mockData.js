// Mock positions for demo - College Student Profile
export const MOCK_POSITIONS = [
  {
    id: '1',
    protocol: 'Aave V3',
    protocolLogo: '🏦',
    chain: 'Ethereum',
    chainId: 1,
    asset: 'USDC',
    assetLogo: '💵',
    amount: 450,
    currentApy: 8.1,
    status: 'underperforming',
    daysDeployed: 35,
    totalEarned: 3.52
  },
  {
    id: '2',
    protocol: 'Lido',
    protocolLogo: '🔷',
    chain: 'Ethereum',
    chainId: 1,
    asset: 'ETH',
    assetLogo: '⟠',
    amount: 0.3,
    currentApy: 3.2,
    status: 'optimal',
    daysDeployed: 65,
    totalEarned: 0.0172
  },
  {
    id: '3',
    protocol: 'Compound V3',
    protocolLogo: '🏛️',
    chain: 'Arbitrum',
    chainId: 42161,
    asset: 'USDT',
    assetLogo: '💲',
    amount: 150,
    currentApy: 6.5,
    status: 'underperforming',
    daysDeployed: 22,
    totalEarned: 0.59
  }
];

// Mock opportunities for migration - College Student Amounts
export const MOCK_OPPORTUNITIES = [
  {
    positionId: '1',
    targetProtocol: 'Aave V3',
    targetProtocolLogo: '🏦',
    targetChain: 'Base',
    targetChainId: 8453,
    asset: 'USDC',
    assetLogo: '💵',
    amount: 450,
    currentApy: 8.1,
    targetApy: 14.2,
    apyDifferential: 6.1,
    score: 91,
    annualGain: 27.45,
    costs: {
      bridge: 1.20,
      gas: 0.50,
      total: 1.70
    },
    breakeven: 22.6, // days
    protocolSafetyScore: 9,
    socialProof: {
      similarWallets: 127,
      avgGain: 32,
      timeframe: '7 days'
    },
    timing: {
      recommendation: 'Great learning opportunity',
      reason: 'Low cost, high APY gain',
      urgency: 'medium'
    },
    migrationSteps: [
      'Withdraw 450 USDC from Aave V3 on Ethereum',
      'Bridge USDC from Ethereum to Base via Across Protocol ($1.20 fee)',
      'Deposit 450 USDC to Aave V3 on Base',
      'Start earning 14.2% APY'
    ]
  },
  {
    positionId: '1',
    targetProtocol: 'Compound V3',
    targetProtocolLogo: '🏛️',
    targetChain: 'Base',
    targetChainId: 8453,
    asset: 'USDC',
    assetLogo: '💵',
    amount: 450,
    currentApy: 8.1,
    targetApy: 12.8,
    apyDifferential: 4.7,
    score: 78,
    annualGain: 21.15,
    costs: {
      bridge: 1.20,
      gas: 0.50,
      total: 1.70
    },
    breakeven: 29.3, // days
    protocolSafetyScore: 8.5,
    socialProof: {
      similarWallets: 89,
      avgGain: 24,
      timeframe: '14 days'
    },
    timing: {
      recommendation: 'Good starter opportunity',
      reason: 'Compound is beginner-friendly',
      urgency: 'low'
    },
    migrationSteps: [
      'Withdraw 450 USDC from Aave V3 on Ethereum',
      'Bridge USDC from Ethereum to Base via Across Protocol ($1.20 fee)',
      'Deposit 450 USDC to Compound V3 on Base',
      'Start earning 12.8% APY'
    ]
  },
  {
    positionId: '3',
    targetProtocol: 'Aave V3',
    targetProtocolLogo: '🏦',
    targetChain: 'Base',
    targetChainId: 8453,
    asset: 'USDT',
    assetLogo: '💲',
    amount: 150,
    currentApy: 6.5,
    targetApy: 11.2,
    apyDifferential: 4.7,
    score: 82,
    annualGain: 7.05,
    costs: {
      bridge: 0.80,
      gas: 0.40,
      total: 1.20
    },
    breakeven: 62.1, // days
    protocolSafetyScore: 9,
    socialProof: {
      similarWallets: 156,
      avgGain: 8,
      timeframe: '7 days'
    },
    timing: {
      recommendation: 'Consider after gaining experience',
      reason: 'Smaller amount, learn basics first',
      urgency: 'low'
    },
    migrationSteps: [
      'Withdraw 150 USDT from Compound V3 on Arbitrum',
      'Bridge USDT from Arbitrum to Base via Across Protocol ($0.80 fee)',
      'Deposit 150 USDT to Aave V3 on Base',
      'Start earning 11.2% APY'
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

