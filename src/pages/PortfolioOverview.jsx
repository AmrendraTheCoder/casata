import { useState, useEffect } from 'react';
import { useWallet } from '../hooks/useWallet';
import {
  getWalletStats,
  getMultiChainTransactions,
  getMockWalletData,
  calculatePortfolioHealth,
  formatAddress,
  formatTxHash,
} from '../services/etherscan';
import PortfolioImageGenerator from '../components/PortfolioImageGenerator';
import TransactionModal from '../components/TransactionModal';

const PortfolioOverview = () => {
  const { address } = useWallet();
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChain, setActiveChain] = useState('all');
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  // Check if mock data is enabled
  const useMockData = import.meta.env.VITE_ENABLE_MOCK_DATA === 'true';

  useEffect(() => {
    const fetchWalletData = async () => {
      if (!address) return;

      setLoading(true);
      try {
        console.log('🔍 Portfolio: Fetching wallet data...');
        console.log('   Mock data enabled:', useMockData);
        console.log('   Wallet address:', address);

        if (useMockData) {
          // Use mock data for demo
          console.log('📊 Using mock data');
          const mockData = getMockWalletData(address);
          setStats(mockData.stats);
          setTransactions(mockData.transactions);
        } else {
          // Fetch real data using unified portfolio service
          console.log('🌐 Fetching real data from unified portfolio service...');

          const { fetchPortfolioData, isDataServiceConfigured } = await import('../services/portfolioData');

          if (isDataServiceConfigured()) {
            const portfolioData = await fetchPortfolioData(address);

            console.log('✅ Unified portfolio data fetched:', portfolioData);

            setStats(portfolioData.stats);
            setTransactions(portfolioData.transactions);
          } else {
            console.log('⚠️  Data service not configured, trying fallback...');
            const { fetchAllTransactions } = await import('../services/alchemy');
            const txHistory = await fetchAllTransactions(address, 50);
            const walletStats = await getWalletStats(address);

            walletStats.totalTransactions = txHistory.length;
            walletStats.recentActivity = txHistory.filter(tx => {
              const daysSince = (Date.now() - tx.timestamp) / (1000 * 60 * 60 * 24);
              return daysSince <= 30;
            }).length;

            if (txHistory.length > 0) {
              const oldestTx = txHistory[txHistory.length - 1];
              walletStats.walletAge = Math.floor((Date.now() - oldestTx.timestamp) / (1000 * 60 * 60 * 24));
            }

            setStats(walletStats);
            setTransactions(txHistory);
          }
        }
      } catch (error) {
        console.error('❌ Error fetching wallet data:', error);
        // Fallback to mock data on error
        console.log('⚠️  Falling back to mock data due to error');
        const mockData = getMockWalletData(address);
        setStats(mockData.stats);
        setTransactions(mockData.transactions);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [address, useMockData]);

  // Refresh data after transaction
  const handleTransactionSuccess = async () => {
    console.log('🔄 Transaction successful, refreshing portfolio data...');

    // Wait a bit longer for blockchain to update (testnets can be slower)
    setTimeout(async () => {
      setLoading(true);
      try {
        console.log('📊 Fetching updated wallet data...');

        // Import Alchemy service
        const { fetchAllTransactions, isAlchemyConfigured } = await import('../services/alchemy');

        let txHistory = [];

        if (isAlchemyConfigured()) {
          console.log('✅ Using Alchemy for transactions refresh');
          // Fetch 50 transactions per chain, return 20 most recent overall
          txHistory = await fetchAllTransactions(address, 50);
        } else {
          console.log('⚠️  Using Etherscan fallback');
          txHistory = await getMultiChainTransactions(address, 20);
        }

        const walletStats = await getWalletStats(address);

        // Update stats with actual transaction count from Alchemy
        walletStats.totalTransactions = txHistory.length;
        walletStats.recentActivity = txHistory.filter(tx => {
          const daysSince = (Date.now() - tx.timestamp) / (1000 * 60 * 60 * 24);
          return daysSince <= 30;
        }).length;

        // Calculate wallet age from actual transactions
        if (txHistory.length > 0) {
          const oldestTx = txHistory[txHistory.length - 1];
          walletStats.walletAge = Math.floor((Date.now() - oldestTx.timestamp) / (1000 * 60 * 60 * 24));
          console.log(`📅 Wallet age: ${walletStats.walletAge} days (from ${new Date(oldestTx.timestamp).toLocaleDateString()})`);
        }

        console.log('✅ Updated data fetched:', {
          walletStats,
          transactionCount: txHistory.length
        });

        setStats(walletStats);
        setTransactions(txHistory);
      } catch (error) {
        console.error('❌ Error refreshing data:', error);
        // Fallback to page reload if fetch fails
        window.location.reload();
      } finally {
        setLoading(false);
      }
    }, 5000); // Wait 5 seconds for blockchain to update
  };

  // Calculate health score and component breakdown
  const healthScore = stats ? calculatePortfolioHealth(stats) : 0;

  // Calculate individual component scores for display
  const getHealthComponents = (stats) => {
    if (!stats) return { balance: 0, activity: 0, diversity: 0, experience: 0, efficiency: 0 };

    const weights = { balance: 30, activity: 25, diversity: 20, experience: 15, efficiency: 10 };

    // Balance score
    const balanceNormalized = stats.totalBalance > 0
      ? Math.min(1, Math.log10(stats.totalBalance * 10 + 1) / 2)
      : 0;
    const balanceScore = balanceNormalized * weights.balance;

    // Activity score
    const recentActivityRatio = stats.totalTransactions > 0
      ? stats.recentActivity / Math.max(1, stats.totalTransactions)
      : 0;
    const totalTxScore = Math.min(1, stats.totalTransactions / 50);
    const activityScore = (recentActivityRatio * 0.6 + totalTxScore * 0.4) * weights.activity;

    // Diversity score
    const activeChains = stats.balanceByChain.filter(b => b.balance > 0).length;
    const chainCoverageScore = activeChains / stats.balanceByChain.length;
    const diversityScore = chainCoverageScore * weights.diversity * 0.7; // Simplified

    // Experience score
    const ageScore = stats.walletAge > 0
      ? Math.min(1, Math.log10(stats.walletAge + 1) / Math.log10(365))
      : 0;
    const contractScore = Math.min(1, stats.contractInteractions / 20);
    const experienceScore = (ageScore * 0.5 + contractScore * 0.5) * weights.experience;

    // Efficiency score (simplified)
    const efficiencyScore = stats.totalTransactions > 0 && stats.totalBalance > 0
      ? Math.min(weights.efficiency, weights.efficiency * (1 - Math.min(1, stats.totalGasSpent / stats.totalBalance / 0.05)))
      : 0;

    return {
      balance: Math.round((balanceScore / weights.balance) * 100),
      activity: Math.round((activityScore / weights.activity) * 100),
      diversity: Math.round((diversityScore / weights.diversity) * 100),
      experience: Math.round((experienceScore / weights.experience) * 100),
      efficiency: Math.round((efficiencyScore / weights.efficiency) * 100)
    };
  };

  const healthComponents = getHealthComponents(stats);

  // Get health color and emoji
  const getHealthStatus = (score) => {
    if (score >= 80) return { color: 'text-green-600', bg: 'bg-green-100', emoji: '💚', label: 'Excellent' };
    if (score >= 60) return { color: 'text-blue-600', bg: 'bg-blue-100', emoji: '💙', label: 'Good' };
    if (score >= 40) return { color: 'text-yellow-600', bg: 'bg-yellow-100', emoji: '💛', label: 'Fair' };
    return { color: 'text-orange-600', bg: 'bg-orange-100', emoji: '🧡', label: 'Needs Attention' };
  };

  const healthStatus = getHealthStatus(healthScore);

  // Filter transactions by chain
  const filteredTransactions =
    activeChain === 'all'
      ? transactions
      : transactions.filter((tx) => {
        const txChain = tx.chain.toLowerCase();
        const filterChain = activeChain.toLowerCase();

        // Handle different chain name formats
        if (filterChain === 'sepolia') {
          return txChain.includes('sepolia') && !txChain.includes('base') && !txChain.includes('arbitrum');
        }
        if (filterChain === 'base sepolia') {
          return txChain.includes('base');
        }
        if (filterChain === 'arbitrum sepolia') {
          return txChain.includes('arbitrum');
        }

        return txChain === filterChain;
      });

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = Date.now();
    const diff = now - timestamp;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return date.toLocaleDateString();
  };

  // Get transaction type styling
  const getTxTypeStyle = (type) => {
    switch (type) {
      case 'received':
        return { color: 'text-green-600', bg: 'bg-green-50', icon: '↓', label: 'Received' };
      case 'sent':
        return { color: 'text-red-600', bg: 'bg-red-50', icon: '↑', label: 'Sent' };
      case 'contract':
        return { color: 'text-blue-600', bg: 'bg-blue-50', icon: '⚡', label: 'Contract' };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-50', icon: '•', label: 'Other' };
    }
  };

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Loading Portfolio
          </h2>
          <p className="text-gray-600 mb-2">
            Fetching your wallet data...
          </p>
          {/* <div className="text-sm text-gray-500 space-y-1 mt-4">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <span>Scanning Sepolia</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <span>Scanning Base Sepolia</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              <span>Scanning Arbitrum Sepolia</span>
            </div>
          </div> */}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Portfolio Intelligence</h1>
            <p className="text-lg text-gray-600">Know your wallet • Understand your activity</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsTransactionModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <span className="text-xl">💸</span>
              <span>Make Transaction</span>
            </button>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">Wallet Address</div>
              <div className="text-lg font-mono font-semibold text-gray-900">{formatAddress(address)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Health Score Card */}
      <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-8 mb-8 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-gray-500 mb-2">Portfolio Health Score</div>
            <div className="flex items-center gap-4">
              <div className="text-6xl font-extrabold text-gray-900">{healthScore}</div>
              <div>
                <div className={`text-3xl ${healthStatus.color} font-bold`}>/100</div>
                <div className={`inline-flex items-center gap-2 ${healthStatus.bg} ${healthStatus.color} px-3 py-1 rounded-full text-sm font-semibold mt-2`}>
                  <span>{healthStatus.emoji}</span>
                  <span>{healthStatus.label}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-3">Score Breakdown</div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 justify-end">
                <span className="text-gray-600 w-20 text-right">Balance</span>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${healthComponents.balance}%` }}></div>
                </div>
                <span className="text-xs text-gray-500 w-8">{healthComponents.balance}%</span>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <span className="text-gray-600 w-20 text-right">Activity</span>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full transition-all" style={{ width: `${healthComponents.activity}%` }}></div>
                </div>
                <span className="text-xs text-gray-500 w-8">{healthComponents.activity}%</span>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <span className="text-gray-600 w-20 text-right">Diversity</span>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full transition-all" style={{ width: `${healthComponents.diversity}%` }}></div>
                </div>
                <span className="text-xs text-gray-500 w-8">{healthComponents.diversity}%</span>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <span className="text-gray-600 w-20 text-right">Experience</span>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full transition-all" style={{ width: `${healthComponents.experience}%` }}></div>
                </div>
                <span className="text-xs text-gray-500 w-8">{healthComponents.experience}%</span>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <span className="text-gray-600 w-20 text-right">Efficiency</span>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${healthComponents.efficiency}%` }}></div>
                </div>
                <span className="text-xs text-gray-500 w-8">{healthComponents.efficiency}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Total Balance */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
          <div className="text-sm text-gray-500 mb-2">Total Balance</div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {stats?.totalBalance.toFixed(4)} ETH
          </div>
          <div className="text-sm text-gray-600">
            ≈ ${(stats?.totalBalance * 2000).toFixed(2)} USD
          </div>
        </div>

        {/* Total Transactions */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
          <div className="text-sm text-gray-500 mb-2">Total Transactions</div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats?.totalTransactions}</div>
          <div className="text-sm text-green-600">
            {stats?.recentActivity} in last 30 days
          </div>
        </div>

        {/* Wallet Age */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
          <div className="text-sm text-gray-500 mb-2">Wallet Age</div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats?.walletAge}</div>
          <div className="text-sm text-gray-600">days old</div>
        </div>

        {/* Activity Level */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
          <div className="text-sm text-gray-500 mb-2">Activity Level</div>
          <div className="text-3xl font-bold text-gray-900 mb-1 capitalize">
            {stats?.activityLevel}
          </div>
          <div className="text-sm text-gray-600">
            {stats?.contractInteractions} contract interactions
          </div>
        </div>
      </div>

      {/* Chain Breakdown */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Multi-Chain Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats?.balanceByChain.map((chainData, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-bold text-gray-900">{chainData.chain}</div>
                <div className="text-2xl">
                  {chainData.chain.includes('Sepolia ETH') && '⟠'}
                  {chainData.chain.includes('Base') && '🔵'}
                  {chainData.chain.includes('Arbitrum') && '🔷'}
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {chainData.balance.toFixed(4)}
              </div>
              <div className="text-sm text-gray-600">{chainData.symbol}</div>
              <div className="mt-4 pt-4 border-t border-blue-200">
                <div className="text-xs text-gray-600">
                  {((chainData.balance / stats.totalBalance) * 100).toFixed(1)}% of portfolio
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            Recent Transactions
            {loading && (
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            )}
          </h2>

          {/* Chain Filter */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveChain('all')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeChain === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              All Chains
            </button>
            <button
              onClick={() => setActiveChain('sepolia ETH')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeChain === 'sepolia'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              Sepolia
            </button>
            <button
              onClick={() => setActiveChain('base sepolia')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeChain === 'base sepolia'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              Base Sepolia
            </button>
            <button
              onClick={() => setActiveChain('arbitrum sepolia')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeChain === 'arbitrum sepolia'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              Arbitrum Sepolia
            </button>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Type</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Hash</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">From/To</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Chain</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Time</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx, index) => {
                  const typeStyle = getTxTypeStyle(tx.type);
                  return (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div
                          className={`inline-flex items-center gap-2 ${typeStyle.bg} ${typeStyle.color} px-3 py-1 rounded-full text-xs font-semibold`}
                        >
                          <span>{typeStyle.icon}</span>
                          <span>{typeStyle.label}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <a
                          href={tx.explorerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-sm text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          {formatTxHash(tx.hash)}
                        </a>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-mono text-sm text-gray-600">
                          {tx.type === 'sent' ? formatAddress(tx.to) : formatAddress(tx.from)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-gray-900">
                          {tx.value > 0 ? `${tx.value.toFixed(4)} ETH` : '—'}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-600">{tx.chain}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-600">{formatTime(tx.timestamp)}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div
                          className={`text-sm font-semibold ${tx.isError ? 'text-red-600' : 'text-green-600'
                            }`}
                        >
                          {tx.isError ? '✗ Failed' : '✓ Success'}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center">
                    <div className="text-gray-400 text-lg">No transactions found</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Portfolio Image Generator */}
      <PortfolioImageGenerator stats={stats} healthScore={healthScore} address={address} />

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        onSuccess={handleTransactionSuccess}
      />

      {/* Faucet Section */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-8 mb-8 mt-8">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="text-4xl">💧</span>
          <h2 className="text-2xl font-bold text-gray-900">Need Test ETH?</h2>
        </div>
        <p className="text-center text-gray-700 mb-6 max-w-2xl mx-auto">
          Get free test ETH from these faucets to test transactions on Sepolia testnets. No real funds needed!
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <a
            href="https://www.alchemy.com/faucets/ethereum-sepolia"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
          >
            <div className="text-3xl">⟠</div>
            <div className="font-bold text-gray-900">Sepolia Faucet</div>
            <div className="text-sm text-gray-600 text-center">Get ETH for Ethereum Sepolia</div>
            <div className="text-xs text-blue-600 mt-2">→ Alchemy Faucet</div>
          </a>
          <a
            href="https://www.alchemy.com/faucets/base-sepolia"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
          >
            <div className="text-3xl">🔵</div>
            <div className="font-bold text-gray-900">Base Sepolia</div>
            <div className="text-sm text-gray-600 text-center">Get ETH for Base testnet</div>
            <div className="text-xs text-blue-600 mt-2">→ Alchemy Faucet</div>
          </a>
          <a
            href="https://www.alchemy.com/faucets/arbitrum-sepolia"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
          >
            <div className="text-3xl">🔷</div>
            <div className="font-bold text-gray-900">Arbitrum Sepolia</div>
            <div className="text-sm text-gray-600 text-center">Get ETH for Arbitrum testnet</div>
            <div className="text-xs text-blue-600 mt-2">→ Alchemy Faucet</div>
          </a>
        </div>
        <div className="mt-6 text-center text-sm text-gray-600">
          <span className="font-semibold">💡 Tip:</span> You'll need test ETH to see real transactions in your portfolio!
        </div>
      </div>

      {/* CTA to Dashboard */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white shadow-xl">
        <div className="text-5xl mb-4">🚀</div>
        <h2 className="text-3xl font-bold mb-3">Ready to Optimize Your Yields?</h2>
        <p className="text-xl mb-6 text-blue-100">
          Now that you know your wallet, let's find opportunities to grow it
        </p>
        <a
          href="#dashboard"
          className="inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all hover:scale-105 shadow-lg"
        >
          <span>Go to Yield Optimizer</span>
          <span className="text-2xl">→</span>
        </a>
        <div className="mt-6 text-sm text-blue-100">
          Analyze 200+ protocols • Find better yields • Maximize returns
        </div>
      </div>
    </div>
  );
};

export default PortfolioOverview;

