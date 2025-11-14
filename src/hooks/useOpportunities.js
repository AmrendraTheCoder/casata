import { useQuery } from '@tanstack/react-query';
import { getScoredOpportunities } from '../services/opportunityMatcher';
import { MOCK_OPPORTUNITIES, shouldUseMockData, getAllMockOpportunities } from '../utils/mockData';

// Fetch opportunities for positions
const fetchOpportunities = async (positions) => {
  if (!positions || positions.length === 0) {
    return [];
  }

  // Check if we should use mock data
  if (shouldUseMockData()) {
    console.log('Using mock opportunities data');
    return getAllMockOpportunities();
  }

  try {
    // Get scored opportunities from the opportunity matcher
    const opportunities = await getScoredOpportunities(positions);
    return opportunities;
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    // Fall back to mock data on error
    return getAllMockOpportunities();
  }
};

// Hook to use opportunities
export const useOpportunities = (positions) => {
  return useQuery({
    queryKey: ['opportunities', positions?.map(p => p.id).join(',')],
    queryFn: () => fetchOpportunities(positions),
    enabled: !!positions && positions.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    onError: (error) => {
      console.error('useOpportunities error:', error);
    }
  });
};

// Hook to get opportunities for a specific position
export const usePositionOpportunities = (positions, positionId) => {
  const { data: allOpportunities, ...rest } = useOpportunities(positions);
  
  const positionOpportunities = allOpportunities?.filter(
    opp => opp.positionId === positionId
  ) || [];
  
  return {
    data: positionOpportunities,
    ...rest
  };
};

