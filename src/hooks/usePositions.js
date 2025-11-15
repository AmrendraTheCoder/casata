import { useQuery } from '@tanstack/react-query';
import { fetchAllBalances, isAlchemyConfigured, fetchAllTransactions } from '../services/alchemy';
import { getProtocolAPY, mapChainName } from '../services/defiLlama';
import { MOCK_POSITIONS, shouldUseMockData } from '../utils/mockData';
import { determinePositionStatus } from '../utils/calculations';

// Fetch positions for a wallet address
const fetchPositions = async (address) => {
  if (!address) {
    throw new Error('Address is required');
  }

  // Check if we should use mock data
  if (shouldUseMockData()) {
    console.log('📊 Dashboard: Using mock positions data');
    return MOCK_POSITIONS;
  }

  try {
    console.log('🔍 Dashboard: Fetching positions from unified portfolio service...');
    console.log('   Wallet address:', address);
    
    // Use unified portfolio service
    const { fetchPortfolioData, isDataServiceConfigured } = await import('../services/portfolioData');
    
    if (!isDataServiceConfigured()) {
      console.log('⚠️  Dashboard: Data service not configured, using mock data');
      return MOCK_POSITIONS;
    }
    
    const portfolioData = await fetchPortfolioData(address);
    
    console.log('✅ Dashboard: Portfolio data fetched:', {
      positions: portfolioData.positions.length,
      totalBalance: portfolioData.totalBalanceETH,
      healthScore: portfolioData.healthScore
    });
    
    // If no positions found, return mock data for demo
    if (portfolioData.positions.length === 0) {
      console.log('⚠️  Dashboard: No positions found, using mock data');
      return MOCK_POSITIONS;
    }

    return portfolioData.positions;
  } catch (error) {
    console.error('❌ Dashboard: Error fetching positions:', error);
    // Fall back to mock data on error
    console.log('⚠️  Dashboard: Falling back to mock data');
    return MOCK_POSITIONS;
  }
};

// Format chain name for display
const formatChainName = (chainName) => {
  const nameMap = {
    'sepolia': 'Sepolia',
    'base sepolia': 'Base Sepolia',
    'arbitrum sepolia': 'Arbitrum Sepolia'
  };
  return nameMap[chainName.toLowerCase()] || chainName;
};

// Get default APY for assets when DefiLlama data is unavailable
const getDefaultAPY = (symbol) => {
  const defaultAPYs = {
    'ETH': 3.5,
    'USDC': 8.0,
    'USDT': 7.5,
    'DAI': 7.0
  };
  return defaultAPYs[symbol] || 5.0;
};

// Hook to use positions
export const usePositions = (address) => {
  return useQuery({
    queryKey: ['positions', address],
    queryFn: () => fetchPositions(address),
    enabled: !!address,
    staleTime: 30 * 1000, // 30 seconds
    cacheTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    onError: (error) => {
      console.error('usePositions error:', error);
    }
  });
};

// Helper to get asset logo
const getAssetLogo = (symbol) => {
  const logoMap = {
    'USDC': '💵',
    'USDT': '💲',
    'DAI': '◈',
    'ETH': '⟠',
    'WETH': '⟠'
  };
  return logoMap[symbol] || '💰';
};

