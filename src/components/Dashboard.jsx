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
      <div className="min-h-screen bg-mystical-night flex items-center justify-center p-6">
        <div className="card-premium p-12 text-center max-w-md">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-lamp-purple-500/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-lamp-gold-400 rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-4xl animate-float">
              🪔
            </div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-lamp-gold-400 to-lamp-gold-500 bg-clip-text text-transparent mb-4">
            Summoning the Genie
          </h2>
          <p className="text-lamp-purple-200 mb-2">
            The Genie is peering into your treasure vault... ✨
          </p>
        </div>
      </div>
    );
  }

  if (positionsError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-lamp-rose-500/20 border border-lamp-rose-400/50 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-lamp-rose-300 font-semibold mb-2">🧞 The Genie encountered a mystical disturbance</p>
          <p className="text-lamp-rose-200 text-sm">{positionsError.message}</p>
          <p className="text-lamp-rose-300 text-xs mt-2">✨ Summoning enchanted demo treasures instead...</p>
        </div>
      </div>
    );
  }

  if (!positions || positions.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4 animate-float">🪔</div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-lamp-gold-400 to-lamp-gold-500 bg-clip-text text-transparent mb-2">Your Vault is Empty</h2>
          <p className="text-lamp-purple-200 mb-6">
            The Genie couldn't find any treasures in your lamp.
          </p>
          <div className="card max-w-md mx-auto">
            <p className="text-sm text-lamp-gold-400 mb-2">
              <strong>🧞 Genie's Wisdom:</strong> Make sure you have:
            </p>
            <ul className="text-sm text-lamp-purple-200 text-left list-disc list-inside space-y-1">
              <li>Deposited riches in enchanted protocols (Aave, Compound)</li>
              <li>Summoned the correct lamp (wallet)</li>
              <li>Treasures in mystical realms (Ethereum, Base, Arbitrum)</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-3">
      {/* Info Bar - Sticky at top */}
      <div className="mb-6 flex items-center justify-between bg-lamp-night-900/80 backdrop-blur-sm border border-lamp-purple-500/30 rounded-lg px-4 py-2.5 shadow-lg">
        <div className="flex items-center gap-4 text-xs text-lamp-purple-300">
          <div className="flex items-center gap-1.5">
            <span className="text-lamp-gold-400">✨</span>
            <span>Real-time mystical data from enchanted realms</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-lamp-teal-400">●</span>
            <span>Lamp connected: {address?.slice(0, 6)}...{address?.slice(-4)}</span>
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
      {/* <div className="my-6">
        <PortfolioChart />
      </div> */}

      {/* Alert Banner */}
      <AlertBanner
        underperformingCount={underperformingCount}
        totalPotentialGain={totalPotentialGain}
        healthScore={portfolioHealthScore}
      />

      {/* Loading state for opportunities */}
      {opportunitiesLoading && (
        <div className="card p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl animate-float">🧞</div>
            <svg className="animate-spin h-6 w-6 text-lamp-gold-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lamp-gold-400 font-semibold">The Genie is analyzing wish opportunities across mystical realms... ✨</p>
          </div>
        </div>
      )}

      {/* Positions Grid */}
      <div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-lamp-gold-400 to-lamp-gold-500 bg-clip-text text-transparent mb-3 flex items-center gap-2">
          <span>💎</span>
          Your Treasure Positions
        </h2>
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
            <h2 className="text-xl font-bold bg-gradient-to-r from-lamp-magenta-400 to-lamp-purple-400 bg-clip-text text-transparent flex items-center gap-2">
              <span>⭐</span>
              Saved Wishes
              <span className="px-2 py-0.5 bg-lamp-magenta-500/30 text-lamp-magenta-300 text-xs font-bold rounded border border-lamp-magenta-400/50">
                {savedOpportunities.length}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedOpportunities.map((opp, index) => (
              <div
                key={index}
                className="card-premium hover:scale-105 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-lamp-purple-400 mb-1">✨ WISH TO MIGRATE</p>
                    <p className="font-semibold text-sm text-lamp-gold-400">{opp.targetProtocol}</p>
                    <p className="text-xs text-lamp-purple-300">{opp.targetChain}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSavedOpportunities(prev => prev.filter((_, i) => i !== index));
                    }}
                    className="text-lamp-purple-400 hover:text-lamp-rose-400 transition-colors text-xl"
                    title="Remove wish"
                  >
                    ×
                  </button>
                </div>

                <div className="bg-lamp-night-800/50 border border-lamp-purple-500/30 rounded-lg p-3 mb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-lamp-purple-400">TARGET BLESSING</p>
                      <p className="font-bold text-xl text-lamp-magenta-400">
                        {opp.targetApy.toFixed(1)}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-lamp-purple-400">ANNUAL PROSPERITY</p>
                      <p className="font-bold text-sm text-lamp-teal-400">
                        +${opp.annualGain.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedOpportunity(opp)}
                  className="w-full bg-gradient-to-r from-lamp-magenta-600 to-lamp-purple-600 hover:from-lamp-magenta-500 hover:to-lamp-purple-500 text-white font-semibold py-2 px-4 rounded-lg transition-all text-xs shadow-lg"
                >
                  View Wish Details
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
          <div className="bg-gradient-to-r from-lamp-teal-600 to-lamp-teal-500 text-white px-6 py-4 rounded-lg shadow-2xl border-2 border-lamp-teal-400 flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-xl">✨</span>
            </div>
            <div>
              <p className="font-bold">Wish Saved!</p>
              <p className="text-sm text-teal-100">The Genie has preserved your wish in the "Saved Wishes" vault</p>
            </div>
          </div>
        </div>
      )}

      {/* Smart Tip Section - Compact */}
      <div className="mt-8 mb-6">
        <div className="card p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-lamp-gold-500 to-lamp-gold-600 rounded-full flex items-center justify-center shadow-lg animate-float">
              <span className="text-lg">🧞</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-lamp-gold-400 mb-1">Genie's Wisdom</h3>
              <p className="text-xs text-lamp-purple-200 leading-relaxed">
                Always verify migration costs during wish fulfillment as mystical gas fees fluctuate.
                Blessing data updates every 30 seconds for real-time accuracy. ✨
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

