// Mock positions for demo
export const MOCK_POSITIONS = [
  {
    id: '1',
    protocol: 'Aave V3',
    protocolLogo: '🏦',
    chain: 'Ethereum',
    chainId: 1,
    asset: 'USDC',
    assetLogo: '💵',
    amount: 12300,
    currentApy: 8.1,
    status: 'underperforming',
    daysDeployed: 45,
    totalEarned: 123.45
  },
  {
    id: '2',
    protocol: 'Lido',
    protocolLogo: '🔷',
    chain: 'Ethereum',
    chainId: 1,
    asset: 'ETH',
    assetLogo: '⟠',
    amount: 8.5,
    currentApy: 3.2,
    status: 'optimal',
    daysDeployed: 120,
    totalEarned: 0.89
  },
  {
    id: '3',
    protocol: 'Compound V3',
    protocolLogo: '🏛️',
    chain: 'Arbitrum',
    chainId: 42161,
    asset: 'USDT',
    assetLogo: '💲',
    amount: 5400,
    currentApy: 6.5,
    status: 'underperforming',
    daysDeployed: 30,
    totalEarned: 29.59
  }
];

// Mock opportunities for migration
export const MOCK_OPPORTUNITIES = [
  {
    positionId: '1',
    targetProtocol: 'Aave V3',
    targetProtocolLogo: '🏦',
    targetChain: 'Base',
    targetChainId: 8453,
    asset: 'USDC',
    assetLogo: '💵',
    amount: 12300,
    currentApy: 8.1,
    targetApy: 14.2,
    apyDifferential: 6.1,
    score: 91,
    annualGain: 748,
    costs: {
      bridge: 3.20,
      gas: 0.80,
      total: 4.00
    },
    breakeven: 1.6, // days
    protocolSafetyScore: 9,
    socialProof: {
      similarWallets: 47,
      avgGain: 892,
      timeframe: '7 days'
    },
    timing: {
      recommendation: 'Move in next 48 hours',
      reason: 'Gas prices expected to drop 15%',
      urgency: 'high'
    },
    migrationSteps: [
      'Withdraw 12,300 USDC from Aave V3 on Ethereum',
      'Bridge USDC from Ethereum to Base via Across Protocol ($3.20 fee)',
      'Deposit 12,300 USDC to Aave V3 on Base',
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
    amount: 12300,
    currentApy: 8.1,
    targetApy: 12.8,
    apyDifferential: 4.7,
    score: 78,
    annualGain: 578,
    costs: {
      bridge: 3.20,
      gas: 0.80,
      total: 4.00
    },
    breakeven: 2.5, // days
    protocolSafetyScore: 8.5,
    socialProof: {
      similarWallets: 23,
      avgGain: 645,
      timeframe: '14 days'
    },
    timing: {
      recommendation: 'Good opportunity, consider this week',
      reason: 'APY stable for past 30 days',
      urgency: 'medium'
    },
    migrationSteps: [
      'Withdraw 12,300 USDC from Aave V3 on Ethereum',
      'Bridge USDC from Ethereum to Base via Across Protocol ($3.20 fee)',
      'Deposit 12,300 USDC to Compound V3 on Base',
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
    amount: 5400,
    currentApy: 6.5,
    targetApy: 11.2,
    apyDifferential: 4.7,
    score: 82,
    annualGain: 254,
    costs: {
      bridge: 2.80,
      gas: 0.60,
      total: 3.40
    },
    breakeven: 4.9, // days
    protocolSafetyScore: 9,
    socialProof: {
      similarWallets: 31,
      avgGain: 287,
      timeframe: '7 days'
    },
    timing: {
      recommendation: 'Move soon',
      reason: 'High APY on Base likely to persist',
      urgency: 'high'
    },
    migrationSteps: [
      'Withdraw 5,400 USDT from Compound V3 on Arbitrum',
      'Bridge USDT from Arbitrum to Base via Across Protocol ($2.80 fee)',
      'Deposit 5,400 USDT to Aave V3 on Base',
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

// Mock wallet balances
export const MOCK_WALLET_BALANCES = {
  '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb': {
    ethereum: {
      USDC: 12300,
      ETH: 8.5,
      USDT: 0
    },
    base: {
      USDC: 0,
      ETH: 0.5,
      USDT: 0
    },
    arbitrum: {
      USDC: 0,
      ETH: 0,
      USDT: 5400
    }
  }
};

// Mock portfolio summary
export const MOCK_PORTFOLIO_SUMMARY = {
  totalValue: 45234,
  currentYield: 2789, // Annual
  potentialYield: 3856, // If all migrations executed
  missedOpportunities: 1067,
  activePositions: 3,
  underperformingPositions: 2,
  healthScore: 68 // Out of 100
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

