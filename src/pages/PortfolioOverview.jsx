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
    if (score >= 80) return { color: 'text-lamp-teal-400', bg: 'bg-lamp-teal-500/30', emoji: '✨', label: 'Blessed' };
    if (score >= 60) return { color: 'text-lamp-magenta-400', bg: 'bg-lamp-magenta-500/30', emoji: '🌟', label: 'Enchanted' };
    if (score >= 40) return { color: 'text-lamp-gold-400', bg: 'bg-lamp-gold-500/30', emoji: '💫', label: 'Mystical' };
    return { color: 'text-lamp-rose-400', bg: 'bg-lamp-rose-500/30', emoji: '⚠️', label: 'Needs Blessing' };
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
        return { color: 'text-lamp-teal-400', bg: 'bg-lamp-teal-500/20', icon: '↓', label: 'Received' };
      case 'sent':
        return { color: 'text-lamp-rose-400', bg: 'bg-lamp-rose-500/20', icon: '↑', label: 'Sent' };
      case 'contract':
        return { color: 'text-lamp-magenta-400', bg: 'bg-lamp-magenta-500/20', icon: '⚡', label: 'Contract' };
      default:
        return { color: 'text-lamp-purple-300', bg: 'bg-lamp-purple-500/20', icon: '•', label: 'Other' };
    }
  };

  if (loading && !stats) {
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
            Opening Treasure Vault
          </h2>
          <p className="text-lamp-purple-200 mb-2">
            The Genie is gathering your riches... ✨
          </p>
          {/* <div className="text-sm text-lamp-purple-400 space-y-1 mt-4">
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
    <div className="min-h-screen bg-mystical-night">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-lamp-gold-400 to-lamp-gold-500 bg-clip-text text-transparent mb-2">Treasure Vault Intelligence</h1>
            <p className="text-lg text-lamp-purple-200">Know your riches • Understand your mystical activity</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsTransactionModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-lamp-purple-600 to-lamp-magenta-600 text-white rounded-xl font-semibold hover:from-lamp-purple-500 hover:to-lamp-magenta-500 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <span className="text-xl">💎</span>
              <span>Make Transaction</span>
            </button>
            <div className="text-right">
              <div className="text-sm text-lamp-purple-400 mb-1">Lamp Address</div>
              <div className="text-lg font-mono font-semibold text-lamp-gold-400">{formatAddress(address)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Health Score Card */}
      <div className="card-premium p-8 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-lamp-purple-400 mb-2 flex items-center gap-2">
              <span>✨</span>
              Prosperity Score
            </div>
            <div className="flex items-center gap-4">
              <div className="text-6xl font-extrabold bg-gradient-to-r from-lamp-gold-400 to-lamp-gold-500 bg-clip-text text-transparent">{healthScore}</div>
              <div>
                <div className="text-3xl text-lamp-purple-400 font-bold">/100</div>
                <div className="inline-flex items-center gap-2 bg-lamp-teal-500/30 border border-lamp-teal-400/50 text-lamp-teal-300 px-3 py-1 rounded-full text-sm font-semibold mt-2">
                  <span>{healthStatus.emoji}</span>
                  <span>{healthStatus.label}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-lamp-purple-400 mb-3">Blessing Breakdown</div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 justify-end">
                <span className="text-lamp-purple-300 w-20 text-right">Balance</span>
                <div className="w-24 bg-lamp-night-800 rounded-full h-2">
                  <div className="bg-gradient-to-r from-lamp-purple-500 to-lamp-purple-600 h-2 rounded-full transition-all" style={{ width: `${healthComponents.balance}%` }}></div>
                </div>
                <span className="text-xs text-lamp-purple-400 w-8">{healthComponents.balance}%</span>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <span className="text-lamp-purple-300 w-20 text-right">Activity</span>
                <div className="w-24 bg-lamp-night-800 rounded-full h-2">
                  <div className="bg-gradient-to-r from-lamp-teal-500 to-lamp-teal-600 h-2 rounded-full transition-all" style={{ width: `${healthComponents.activity}%` }}></div>
                </div>
                <span className="text-xs text-lamp-purple-400 w-8">{healthComponents.activity}%</span>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <span className="text-lamp-purple-300 w-20 text-right">Diversity</span>
                <div className="w-24 bg-lamp-night-800 rounded-full h-2">
                  <div className="bg-gradient-to-r from-lamp-magenta-500 to-lamp-magenta-600 h-2 rounded-full transition-all" style={{ width: `${healthComponents.diversity}%` }}></div>
                </div>
                <span className="text-xs text-lamp-purple-400 w-8">{healthComponents.diversity}%</span>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <span className="text-lamp-purple-300 w-20 text-right">Experience</span>
                <div className="w-24 bg-lamp-night-800 rounded-full h-2">
                  <div className="bg-gradient-to-r from-lamp-gold-500 to-lamp-gold-600 h-2 rounded-full transition-all" style={{ width: `${healthComponents.experience}%` }}></div>
                </div>
                <span className="text-xs text-lamp-purple-400 w-8">{healthComponents.experience}%</span>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <span className="text-lamp-purple-300 w-20 text-right">Efficiency</span>
                <div className="w-24 bg-lamp-night-800 rounded-full h-2">
                  <div className="bg-gradient-to-r from-lamp-purple-600 to-lamp-purple-700 h-2 rounded-full transition-all" style={{ width: `${healthComponents.efficiency}%` }}></div>
                </div>
                <span className="text-xs text-lamp-purple-400 w-8">{healthComponents.efficiency}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Total Balance */}
        <div className="stat-card hover:scale-105">
          <div className="text-sm text-lamp-purple-400 mb-2">Total Riches</div>
          <div className="text-3xl font-bold text-lamp-gold-400 mb-1">
            {stats?.totalBalance.toFixed(4)} ETH
          </div>
          <div className="text-sm text-lamp-purple-300">
            ≈ ${(stats?.totalBalance * 2000).toFixed(2)} USD
          </div>
        </div>

        {/* Total Transactions */}
        <div className="stat-card hover:scale-105">
          <div className="text-sm text-lamp-purple-400 mb-2">Magical Ledger</div>
          <div className="text-3xl font-bold text-lamp-purple-200 mb-1">{stats?.totalTransactions}</div>
          <div className="text-sm text-lamp-teal-400">
            {stats?.recentActivity} in last 30 days
          </div>
        </div>

        {/* Wallet Age */}
        <div className="stat-card hover:scale-105">
          <div className="text-sm text-lamp-purple-400 mb-2">Lamp Age</div>
          <div className="text-3xl font-bold text-lamp-magenta-400 mb-1">{stats?.walletAge}</div>
          <div className="text-sm text-lamp-purple-300">days blessed</div>
        </div>

        {/* Activity Level */}
        <div className="stat-card hover:scale-105">
          <div className="text-sm text-lamp-purple-400 mb-2">Mystical Activity</div>
          <div className="text-3xl font-bold text-lamp-gold-400 mb-1 capitalize">
            {stats?.activityLevel}
          </div>
          <div className="text-sm text-lamp-purple-300">
            {stats?.contractInteractions} contract rituals
          </div>
        </div>
      </div>

      {/* Chain Breakdown */}
      <div className="card p-6 mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-lamp-gold-400 to-lamp-gold-500 bg-clip-text text-transparent mb-6">Multi-Realm Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats?.balanceByChain.map((chainData, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-lamp-purple-900/40 to-lamp-night-800/40 border border-lamp-purple-500/30 rounded-xl p-6 hover:border-lamp-gold-400/50 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-bold text-lamp-gold-300">{chainData.chain}</div>
                <div className="text-2xl">
                  {chainData.chain.includes('Sepolia ETH') && '⟠'}
                  {chainData.chain.includes('Base') && '🔵'}
                  {chainData.chain.includes('Arbitrum') && '🔷'}
                </div>
              </div>
              <div className="text-3xl font-bold text-lamp-purple-100 mb-1">
                {chainData.balance.toFixed(4)}
              </div>
              <div className="text-sm text-lamp-purple-300">{chainData.symbol}</div>
              <div className="mt-4 pt-4 border-t border-lamp-purple-500/30">
                <div className="text-xs text-lamp-purple-300">
                  {((chainData.balance / stats.totalBalance) * 100).toFixed(1)}% of treasure vault
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div className="card rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-lamp-gold-400 to-lamp-gold-500 bg-clip-text text-transparent flex items-center gap-3">
            Magical Ledger
            {loading && (
              <div className="w-5 h-5 border-2 border-lamp-purple-500 border-t-transparent rounded-full animate-spin"></div>
            )}
          </h2>

          {/* Chain Filter */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveChain('all')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeChain === 'all'
                ? 'bg-gradient-to-r from-lamp-purple-600 to-lamp-magenta-600 text-white'
                : 'bg-lamp-night-800/50 text-lamp-purple-200 hover:bg-lamp-night-700/50 border border-lamp-purple-500/30'
                }`}
            >
              All Realms
            </button>
            <button
              onClick={() => setActiveChain('sepolia ETH')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeChain === 'sepolia'
                ? 'bg-gradient-to-r from-lamp-purple-600 to-lamp-magenta-600 text-white'
                : 'bg-lamp-night-800/50 text-lamp-purple-200 hover:bg-lamp-night-700/50 border border-lamp-purple-500/30'
                }`}
            >
              Sepolia
            </button>
            <button
              onClick={() => setActiveChain('base sepolia')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeChain === 'base sepolia'
                ? 'bg-gradient-to-r from-lamp-purple-600 to-lamp-magenta-600 text-white'
                : 'bg-lamp-night-800/50 text-lamp-purple-200 hover:bg-lamp-night-700/50 border border-lamp-purple-500/30'
                }`}
            >
              Base Sepolia
            </button>
            <button
              onClick={() => setActiveChain('arbitrum sepolia')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeChain === 'arbitrum sepolia'
                ? 'bg-gradient-to-r from-lamp-purple-600 to-lamp-magenta-600 text-white'
                : 'bg-lamp-night-800/50 text-lamp-purple-200 hover:bg-lamp-night-700/50 border border-lamp-purple-500/30'
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
              <tr className="border-b border-lamp-purple-500/30">
                <th className="text-left py-3 px-4 text-sm font-semibold text-lamp-gold-400">Type</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-lamp-gold-400">Hash</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-lamp-gold-400">From/To</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-lamp-gold-400">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-lamp-gold-400">Realm</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-lamp-gold-400">Time</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-lamp-gold-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx, index) => {
                  const typeStyle = getTxTypeStyle(tx.type);
                  return (
                    <tr
                      key={index}
                      className="border-b border-lamp-purple-500/20 hover:bg-lamp-night-800/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div
                          className={`inline-flex items-center gap-2 ${typeStyle.bg} ${typeStyle.color} px-3 py-1 rounded-full text-xs font-semibold border border-current/30`}
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
                          className="font-mono text-sm text-lamp-magenta-400 hover:text-lamp-magenta-300 hover:underline"
                        >
                          {formatTxHash(tx.hash)}
                        </a>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-mono text-sm text-lamp-purple-300">
                          {tx.type === 'sent' ? formatAddress(tx.to) : formatAddress(tx.from)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-lamp-gold-300">
                          {tx.value > 0 ? `${tx.value.toFixed(4)} ETH` : '—'}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-lamp-purple-300">{tx.chain}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-lamp-purple-300">{formatTime(tx.timestamp)}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div
                          className={`text-sm font-semibold ${tx.isError ? 'text-lamp-rose-400' : 'text-lamp-teal-400'
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
                    <div className="text-lamp-purple-400 text-lg">No mystical records found</div>
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
      <div className="bg-gradient-to-br from-lamp-teal-900/40 to-lamp-teal-800/40 border border-lamp-teal-500/30 rounded-xl p-8 mb-8 mt-8">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="text-4xl">💧</span>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-lamp-gold-400 to-lamp-gold-500 bg-clip-text text-transparent">Need Mystical Test ETH?</h2>
        </div>
        <p className="text-center text-lamp-purple-200 mb-6 max-w-2xl mx-auto">
          Summon free test ETH from these enchanted faucets to practice your magic on Sepolia realms. No real treasures needed! ✨
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <a
            href="https://www.alchemy.com/faucets/ethereum-sepolia"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 bg-lamp-night-800/60 backdrop-blur-lg rounded-xl p-4 border border-lamp-purple-500/30 hover:border-lamp-gold-400/50 hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
          >
            <div className="text-3xl">⟠</div>
            <div className="font-bold text-lamp-gold-300">Sepolia Faucet</div>
            <div className="text-sm text-lamp-purple-300 text-center">Get ETH for Ethereum Sepolia</div>
            <div className="text-xs text-lamp-magenta-400 mt-2">→ Alchemy Faucet</div>
          </a>
          <a
            href="https://www.alchemy.com/faucets/base-sepolia"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 bg-lamp-night-800/60 backdrop-blur-lg rounded-xl p-4 border border-lamp-purple-500/30 hover:border-lamp-gold-400/50 hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
          >
            <div className="text-3xl">🔵</div>
            <div className="font-bold text-lamp-gold-300">Base Sepolia</div>
            <div className="text-sm text-lamp-purple-300 text-center">Get ETH for Base testnet</div>
            <div className="text-xs text-lamp-magenta-400 mt-2">→ Alchemy Faucet</div>
          </a>
          <a
            href="https://www.alchemy.com/faucets/arbitrum-sepolia"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 bg-lamp-night-800/60 backdrop-blur-lg rounded-xl p-4 border border-lamp-purple-500/30 hover:border-lamp-gold-400/50 hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
          >
            <div className="text-3xl">🔷</div>
            <div className="font-bold text-lamp-gold-300">Arbitrum Sepolia</div>
            <div className="text-sm text-lamp-purple-300 text-center">Get ETH for Arbitrum testnet</div>
            <div className="text-xs text-lamp-magenta-400 mt-2">→ Alchemy Faucet</div>
          </a>
        </div>
        <div className="mt-6 text-center text-sm text-lamp-purple-200">
          <span className="font-semibold">💡 Genie's Tip:</span> You'll need test ETH to see real mystical transactions in your treasure vault!
        </div>
      </div>

      {/* CTA to Dashboard */}
      <div className="bg-gradient-to-r from-lamp-purple-600 via-lamp-magenta-600 to-lamp-purple-600 rounded-2xl p-8 text-center text-white shadow-xl shadow-lamp-purple-900/50">
        <div className="text-5xl mb-4">🧞</div>
        <h2 className="text-3xl font-bold mb-3">Ready to Summon Prosperity?</h2>
        <p className="text-xl mb-6 text-lamp-purple-100">
          Now that you know your treasures, let's find wishes to grow your vault ✨
        </p>
        <a
          href="#dashboard"
          className="inline-flex items-center gap-3 bg-gradient-to-r from-lamp-gold-500 to-lamp-gold-600 text-lamp-night-950 px-8 py-4 rounded-xl font-bold text-lg hover:from-lamp-gold-400 hover:to-lamp-gold-500 transition-all hover:scale-105 shadow-lg"
        >
          <span>Summon the Genie</span>
          <span className="text-2xl">→</span>
        </a>
        <div className="mt-6 text-sm text-lamp-purple-100">
          Analyze 200+ mystical protocols • Discover prosperity wishes • Maximize blessings
        </div>
      </div>
      </div>
    </div>
  );
};

export default PortfolioOverview;

