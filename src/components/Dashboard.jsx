import { useState, useEffect } from 'react';
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
  const [savedOpportunities, setSavedOpportunities] = useState([]);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [portfolioHealthScore, setPortfolioHealthScore] = useState(100);

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

  const handleSaveOpportunity = (opportunity) => {
    console.log('💾 Saving opportunity:', opportunity);

    // Add to saved opportunities
    setSavedOpportunities(prev => {
      // Check if already saved
      const exists = prev.find(opp =>
        opp.positionId === opportunity.positionId &&
        opp.targetChain === opportunity.targetChain
      );

      if (exists) {
        console.log('⚠️  Opportunity already saved');
        return prev;
      }

      const updated = [...prev, { ...opportunity, savedAt: Date.now() }];
      console.log('✅ Opportunity saved! Total saved:', updated.length);
      return updated;
    });

    // Show notification
    setShowSaveNotification(true);

    // Close modal
    setSelectedOpportunity(null);

    // Hide notification after 3 seconds
    setTimeout(() => {
      setShowSaveNotification(false);
    }, 3000);
  };

  // Fetch health score from unified portfolio data
  useEffect(() => {
    const fetchHealthScore = async () => {
      if (!address) return;

      try {
        const { fetchPortfolioData, isDataServiceConfigured } = await import('../services/portfolioData');

        if (isDataServiceConfigured()) {
          const portfolioData = await fetchPortfolioData(address);
          console.log('📊 Dashboard: Health score from unified data:', portfolioData.healthScore);
          setPortfolioHealthScore(portfolioData.healthScore);
        }
      } catch (error) {
        console.error('❌ Dashboard: Error fetching health score:', error);
      }
    };

    fetchHealthScore();
  }, [address]);

  if (positionsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Loading Dashboard
          </h2>
          <p className="text-gray-600 mb-2">
            Fetching your positions from testnets...
          </p>
          {/* <div className="mt-6 space-y-2 text-sm text-gray-500">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Scanning Sepolia</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <span>Scanning Base Sepolia</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              <span>Scanning Arbitrum Sepolia</span>
            </div>
          </div> */}
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
    <div className="max-w-7xl mx-auto px-4 py-3">
      {/* Info Bar - Sticky at top */}
      <div className="mb-6 flex items-center justify-between bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-2.5 shadow-sm">
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <span className="text-blue-600">⚡</span>
            <span>Real-time data from testnets</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-green-600">●</span>
            <span>Connected to {address?.slice(0, 6)}...{address?.slice(-4)}</span>
          </div>
        </div>
      </div>

      {/* Portfolio Summary */}
      <PortfolioSummary
        positions={enrichedPositions}
        opportunities={opportunities || []}
        healthScore={portfolioHealthScore}
      />

      {/* Chart */}
      <div className="my-6">
        <PortfolioChart />
      </div>

      {/* Alert Banner */}
      <AlertBanner
        underperformingCount={underperformingCount}
        totalPotentialGain={totalPotentialGain}
        healthScore={portfolioHealthScore}
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

      {/* Saved Opportunities Section */}
      {savedOpportunities.length > 0 && (
        <div className="mt-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <span>💾</span>
              Saved Opportunities
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                {savedOpportunities.length}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedOpportunities.map((opp, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-300 rounded-lg p-4 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">MIGRATE TO</p>
                    <p className="font-semibold text-sm text-gray-900">{opp.targetProtocol}</p>
                    <p className="text-xs text-gray-600">{opp.targetChain}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSavedOpportunities(prev => prev.filter((_, i) => i !== index));
                    }}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    title="Remove"
                  >
                    ×
                  </button>
                </div>

                <div className="bg-white border border-blue-200 rounded-lg p-3 mb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-gray-600">TARGET APY</p>
                      <p className="font-bold text-xl text-blue-600">
                        {opp.targetApy.toFixed(1)}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-600">ANNUAL GAIN</p>
                      <p className="font-bold text-sm text-green-600">
                        +${opp.annualGain.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedOpportunity(opp)}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-xs"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Migration Opportunity Modal */}
      {selectedOpportunity && (
        <MigrationOpportunity
          opportunity={selectedOpportunity}
          onClose={handleCloseOpportunity}
          onSave={handleSaveOpportunity}
        />
      )}

      {/* Save Notification */}
      {showSaveNotification && (
        <div className="fixed top-20 right-6 z-50 animate-slideInRight">
          <div className="bg-green-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-xl">✓</span>
            </div>
            <div>
              <p className="font-semibold">Opportunity Saved!</p>
              <p className="text-sm text-green-100">You can view it in the "Saved Opportunities" section</p>
            </div>
          </div>
        </div>
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

