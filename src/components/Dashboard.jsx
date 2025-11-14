import { useState } from 'react';
import { usePositions } from '../hooks/usePositions';
import { useOpportunities } from '../hooks/useOpportunities';
import { useWallet } from '../hooks/useWallet';
import PortfolioSummary from './PortfolioSummary';
import AlertBanner from './AlertBanner';
import PositionCard from './PositionCard';
import MigrationOpportunity from './MigrationOpportunity';
import PortfolioChart from './PortfolioChart';
import { groupOpportunitiesByPosition } from '../services/opportunityMatcher';
import { determinePositionStatus } from '../utils/calculations';

const Dashboard = () => {
  const { address } = useWallet();
  const { data: positions, isLoading: positionsLoading, error: positionsError } = usePositions(address);
  const { data: opportunities, isLoading: opportunitiesLoading } = useOpportunities(positions);

  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  // Group opportunities by position
  const groupedOpportunities = opportunities
    ? groupOpportunitiesByPosition(opportunities)
    : {};

  // Update position statuses based on opportunities
  const enrichedPositions = positions?.map(position => {
    return {
      ...position,
      status: determinePositionStatus(position, opportunities || [])
    };
  }) || [];

  // Calculate underperforming count and total potential gain
  const underperformingCount = enrichedPositions.filter(
    p => p.status === 'underperforming' || p.status === 'critical'
  ).length;

  const totalPotentialGain = opportunities?.reduce((sum, opp) => {
    const bestForPosition = groupedOpportunities[opp.positionId]?.[0];
    if (bestForPosition?.positionId === opp.positionId && bestForPosition.score === opp.score) {
      return sum + (opp.annualGain || 0);
    }
    return sum;
  }, 0) || 0;

  const handleViewOpportunities = (positionId) => {
    const positionOpps = groupedOpportunities[positionId] || [];
    if (positionOpps.length > 0) {
      setSelectedOpportunity(positionOpps[0]); // Show best opportunity
    }
  };

  const handleCloseOpportunity = () => {
    setSelectedOpportunity(null);
  };

  if (positionsLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg text-gray-900">Loading your positions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (positionsError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-300 rounded-lg p-4">
          <p className="text-red-900 font-semibold mb-2">Error loading positions</p>
          <p className="text-red-700 text-sm">{positionsError.message}</p>
          <p className="text-red-600 text-xs mt-2">Falling back to demo data...</p>
        </div>
      </div>
    );
  }

  if (!positions || positions.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💼</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No positions found</h2>
          <p className="text-gray-600 mb-6">
            We couldn't detect any DeFi positions in your wallet.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-gray-900 mb-2">
              <strong>Tip:</strong> Make sure you have:
            </p>
            <ul className="text-sm text-gray-700 text-left list-disc list-inside space-y-1">
              <li>Deposited assets in supported protocols (Aave, Compound)</li>
              <li>Connected the correct wallet</li>
              <li>Assets on supported chains (Ethereum, Base, Arbitrum)</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Info Bar - Sticky at top */}
      <div className="mb-6 flex items-center justify-between bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-2.5 shadow-sm">
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <span className="text-blue-600">⚡</span>
            <span>Updates every 30s</span>
          </div>
        </div>
      </div>

      {/* Portfolio Summary */}
      <PortfolioSummary
        positions={enrichedPositions}
        opportunities={opportunities || []}
      />

      {/* Chart */}
      <div className="my-6">
        <PortfolioChart />
      </div>

      {/* Alert Banner */}
      <AlertBanner
        underperformingCount={underperformingCount}
        totalPotentialGain={totalPotentialGain}
      />

      {/* Loading state for opportunities */}
      {opportunitiesLoading && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex items-center gap-3">
            <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-blue-600 font-semibold">Analyzing migration opportunities across chains...</p>
          </div>
        </div>
      )}

      {/* Positions Grid */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-3">Your Positions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {enrichedPositions.map((position) => (
            <PositionCard
              key={position.id}
              position={position}
              opportunities={groupedOpportunities[position.id] || []}
              onViewOpportunities={handleViewOpportunities}
            />
          ))}
        </div>
      </div>

      {/* Migration Opportunity Modal */}
      {selectedOpportunity && (
        <MigrationOpportunity
          opportunity={selectedOpportunity}
          onClose={handleCloseOpportunity}
        />
      )}

      {/* Smart Tip Section - Compact */}
      <div className="mt-8 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
              <span className="text-lg">💡</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xs font-semibold text-gray-900 mb-1">Pro Tip</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Always verify migration costs during execution as gas fees fluctuate.
                APY data updates every 30 seconds for real-time accuracy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

