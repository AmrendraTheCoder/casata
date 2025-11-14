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

const PortfolioOverview = () => {
  const { address } = useWallet();
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChain, setActiveChain] = useState('all');

  // Check if mock data is enabled
  const useMockData = import.meta.env.VITE_ENABLE_MOCK_DATA === 'true';

  useEffect(() => {
    const fetchWalletData = async () => {
      if (!address) return;

      setLoading(true);
      try {
        if (useMockData) {
          // Use mock data for demo
          const mockData = getMockWalletData(address);
          setStats(mockData.stats);
          setTransactions(mockData.transactions);
        } else {
          // Fetch real data
          const [walletStats, txHistory] = await Promise.all([
            getWalletStats(address),
            getMultiChainTransactions(address, 20),
          ]);
          setStats(walletStats);
          setTransactions(txHistory);
        }
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [address, useMockData]);

  // Calculate health score
  const healthScore = stats ? calculatePortfolioHealth(stats) : 0;

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
      : transactions.filter((tx) => tx.chain.toLowerCase() === activeChain);

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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="text-center">
            <svg
              className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-lg text-gray-700">Analyzing your wallet...</p>
            <p className="text-sm text-gray-500 mt-2">Fetching data from multiple chains</p>
          </div>
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
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Wallet Address</div>
            <div className="text-lg font-mono font-semibold text-gray-900">{formatAddress(address)}</div>
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
            <div className="text-sm text-gray-500 mb-3">Based on your</div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 justify-end">
                <span className="text-gray-600">Balance</span>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <span className="text-gray-600">Activity</span>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <span className="text-gray-600">Diversity</span>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
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
                  {chainData.chain.includes('Sepolia') && '⟠'}
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
          <h2 className="text-2xl font-bold text-gray-900">Recent Transactions</h2>
          
          {/* Chain Filter */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveChain('all')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeChain === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Chains
            </button>
            <button
              onClick={() => setActiveChain('sepolia')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeChain === 'sepolia'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Sepolia
            </button>
            <button
              onClick={() => setActiveChain('base sepolia')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeChain === 'base sepolia'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Base Sepolia
            </button>
            <button
              onClick={() => setActiveChain('arbitrum sepolia')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeChain === 'arbitrum sepolia'
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
                          className={`text-sm font-semibold ${
                            tx.isError ? 'text-red-600' : 'text-green-600'
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
            href="https://sepoliafaucet.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all hover:scale-105"
          >
            <div className="text-3xl">⟠</div>
            <div className="font-bold text-gray-900">Sepolia Faucet</div>
            <div className="text-sm text-gray-600 text-center">Get ETH for Ethereum Sepolia</div>
          </a>
          <a
            href="https://www.coinbase.com/faucets/base-ethereum-goerli-faucet"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all hover:scale-105"
          >
            <div className="text-3xl">🔵</div>
            <div className="font-bold text-gray-900">Base Sepolia</div>
            <div className="text-sm text-gray-600 text-center">Get ETH for Base testnet</div>
          </a>
          <a
            href="https://faucet.arbitrum.io"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all hover:scale-105"
          >
            <div className="text-3xl">🔷</div>
            <div className="font-bold text-gray-900">Arbitrum Sepolia</div>
            <div className="text-sm text-gray-600 text-center">Get ETH for Arbitrum testnet</div>
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

