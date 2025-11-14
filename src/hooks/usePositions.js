import { useQuery } from '@tanstack/react-query';
import { fetchAllBalances, isAlchemyConfigured } from '../services/alchemy';
import { getProtocolAPY, mapChainName } from '../services/defiLlama';
import { MOCK_POSITIONS, shouldUseMockData } from '../utils/mockData';
import { determinePositionStatus } from '../utils/calculations';

// Fetch positions for a wallet address
const fetchPositions = async (address) => {
  if (!address) {
    throw new Error('Address is required');
  }

  // Check if we should use mock data
  if (shouldUseMockData() || !isAlchemyConfigured()) {
    console.log('Using mock positions data');
    return MOCK_POSITIONS;
  }

  try {
    // Fetch balances from Alchemy
    const balances = await fetchAllBalances(address);
    
    // Convert balances to positions format
    const positions = [];
    let positionId = 1;

    for (const [chainName, chainBalances] of Object.entries(balances)) {
      for (const balance of chainBalances) {
        if (balance.balance > 0) {
          // Fetch current APY for this position
          // Assume lending protocol (Aave) for simplicity
          const apyData = await getProtocolAPY('aave-v3', chainName, balance.symbol);
          
          positions.push({
            id: String(positionId++),
            protocol: 'Aave V3', // Default assumption
            protocolLogo: '🏦',
            chain: chainName.charAt(0).toUpperCase() + chainName.slice(1),
            chainId: balance.chainId,
            asset: balance.symbol,
            assetLogo: getAssetLogo(balance.symbol),
            amount: balance.balance,
            currentApy: apyData?.apy || 0,
            status: 'optimal', // Will be updated after opportunities are found
            daysDeployed: 0, // Would need historical data
            totalEarned: 0 // Would need historical data
          });
        }
      }
    }

    return positions;
  } catch (error) {
    console.error('Error fetching positions:', error);
    // Fall back to mock data on error
    return MOCK_POSITIONS;
  }
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

