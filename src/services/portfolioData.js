/**
 * Unified Portfolio Data Service
 * 
 * This service provides a single source of truth for portfolio data
 * used by both the Portfolio Overview page and the Dashboard page.
 */

import { fetchAllBalances, fetchAllTransactions, isAlchemyConfigured } from './alchemy';
import { getWalletStats, calculatePortfolioHealth as calculateWalletHealth } from './etherscan';

const ETH_PRICE = 2000; // USD (could be fetched from price API)

/**
 * Fetch complete portfolio data for a wallet
 * Returns unified data structure used by both Portfolio and Dashboard pages
 */
export const fetchPortfolioData = async (address) => {
  if (!address) {
    throw new Error('Address is required');
  }

  console.log('📊 Fetching unified portfolio data for:', address);

  try {
    // Fetch balances and transactions
    const [balances, transactions] = await Promise.all([
      fetchAllBalances(address),
      fetchAllTransactions(address, 50)
    ]);

    console.log('✅ Balances fetched:', balances);
    console.log('✅ Transactions fetched:', transactions.length);

    // Calculate total balance in ETH
    let totalBalanceETH = 0;
    const balanceByChain = [];

    for (const [chainName, chainBalances] of Object.entries(balances)) {
      const ethBalance = chainBalances.find(b => b.symbol === 'ETH');
      const balance = ethBalance ? ethBalance.balance : 0;
      
      totalBalanceETH += balance;
      
      balanceByChain.push({
        chain: formatChainName(chainName),
        balance: balance,
        symbol: 'ETH',
        chainId: getChainId(chainName)
      });
    }

    // Calculate total balance in USD
    const totalBalanceUSD = totalBalanceETH * ETH_PRICE;

    // Calculate wallet age from transactions
    let walletAge = 0;
    if (transactions.length > 0) {
      const oldestTx = transactions[transactions.length - 1];
      walletAge = Math.floor((Date.now() - oldestTx.timestamp) / (1000 * 60 * 60 * 24));
    }

    // Calculate recent activity (last 30 days)
    const recentActivity = transactions.filter(tx => {
      const daysSince = (Date.now() - tx.timestamp) / (1000 * 60 * 60 * 24);
      return daysSince <= 30;
    }).length;

    // Count contract interactions
    const contractInteractions = transactions.filter(tx => 
      tx.input && tx.input !== '0x' && tx.input.length > 2
    ).length;

    // Calculate total gas spent (simplified)
    const totalGasSpent = transactions.reduce((sum, tx) => {
      const gasUsed = parseFloat(tx.gasUsed || 0);
      const gasPrice = parseFloat(tx.gasPrice || 0);
      return sum + (gasUsed * gasPrice / 1e18); // Convert to ETH
    }, 0);

    // Build wallet stats object
    const walletStats = {
      totalBalance: totalBalanceETH,
      totalBalanceUSD: totalBalanceUSD,
      balanceByChain: balanceByChain,
      totalTransactions: transactions.length,
      recentActivity: recentActivity,
      walletAge: walletAge,
      contractInteractions: contractInteractions,
      totalGasSpent: totalGasSpent,
      chains: balanceByChain.length
    };

    // Calculate health score using the Portfolio page algorithm
    const healthScore = calculateWalletHealth(walletStats);

    // Build positions array for Dashboard
    const positions = [];
    let positionId = 1;

    for (const [chainName, chainBalances] of Object.entries(balances)) {
      for (const balance of chainBalances) {
        if (balance.balance > 0) {
          // Calculate days deployed from first transaction on this chain
          const chainTransactions = transactions.filter(tx => 
            tx.chain.toLowerCase().includes(chainName.toLowerCase().replace(' sepolia', ''))
          );
          
          let daysDeployed = 0;
          if (chainTransactions.length > 0) {
            const oldestTx = chainTransactions[chainTransactions.length - 1];
            daysDeployed = Math.floor((Date.now() - oldestTx.timestamp) / (1000 * 60 * 60 * 24));
          }
          
          // Get default APY for asset
          const currentApy = getDefaultAPY(balance.symbol);
          
          // Calculate total earned (simplified: balance * APY * days / 365)
          const totalEarned = daysDeployed > 0 
            ? (balance.balance * currentApy / 100 * daysDeployed / 365)
            : 0;
          
          positions.push({
            id: String(positionId++),
            protocol: 'Testnet Position',
            protocolLogo: '🧪',
            chain: formatChainName(chainName),
            chainId: balance.chainId,
            asset: balance.symbol,
            assetLogo: getAssetLogo(balance.symbol),
            amount: balance.balance,
            currentApy: currentApy,
            status: 'optimal',
            daysDeployed: daysDeployed,
            totalEarned: totalEarned
          });
        }
      }
    }

    console.log('✅ Portfolio data compiled:', {
      totalBalanceETH,
      totalBalanceUSD,
      healthScore,
      positions: positions.length,
      transactions: transactions.length
    });

    return {
      // For Portfolio Overview page
      stats: walletStats,
      transactions: transactions,
      healthScore: healthScore,
      
      // For Dashboard page
      positions: positions,
      
      // Shared data
      totalBalanceETH: totalBalanceETH,
      totalBalanceUSD: totalBalanceUSD,
      address: address
    };

  } catch (error) {
    console.error('❌ Error fetching portfolio data:', error);
    throw error;
  }
};

/**
 * Format chain name for display
 */
const formatChainName = (chainName) => {
  const nameMap = {
    'sepolia': 'Sepolia',
    'base sepolia': 'Base Sepolia',
    'arbitrum sepolia': 'Arbitrum Sepolia'
  };
  return nameMap[chainName.toLowerCase()] || chainName;
};

/**
 * Get chain ID from chain name
 */
const getChainId = (chainName) => {
  const chainMap = {
    'sepolia': 11155111,
    'base sepolia': 84532,
    'arbitrum sepolia': 421614
  };
  return chainMap[chainName.toLowerCase()] || 11155111;
};

/**
 * Get default APY for assets
 */
const getDefaultAPY = (symbol) => {
  const defaultAPYs = {
    'ETH': 3.5,
    'USDC': 8.0,
    'USDT': 7.5,
    'DAI': 7.0
  };
  return defaultAPYs[symbol] || 5.0;
};

/**
 * Get asset logo emoji
 */
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

/**
 * Check if Alchemy is configured
 */
export const isDataServiceConfigured = () => {
  return isAlchemyConfigured();
};

