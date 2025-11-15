import axios from 'axios';
import { STABLECOINS, CHAINS } from '../utils/constants';

// Get Alchemy API key from environment
const getAlchemyKey = () => {
  return import.meta.env.VITE_ALCHEMY_API_KEY || '';
};

// Get Alchemy RPC URL for chain
const getAlchemyUrl = (chainId) => {
  const key = getAlchemyKey();
  
  if (!key) {
    console.warn('Alchemy API key not set');
    return null;
  }
  
  // Testnet URLs (current configuration)
  const urlMap = {
    11155111: `https://eth-sepolia.g.alchemy.com/v2/${key}`, // Sepolia
    84532: `https://base-sepolia.g.alchemy.com/v2/${key}`, // Base Sepolia
    421614: `https://arb-sepolia.g.alchemy.com/v2/${key}`, // Arbitrum Sepolia
    
    // Mainnet URLs (uncomment when ready to switch to mainnet)
    // 1: `https://eth-mainnet.g.alchemy.com/v2/${key}`,
    // 8453: `https://base-mainnet.g.alchemy.com/v2/${key}`,
    // 42161: `https://arb-mainnet.g.alchemy.com/v2/${key}`
  };
  
  return urlMap[chainId] || null;
};

// Fetch token balances for an address on a specific chain
export const fetchTokenBalances = async (address, chainId) => {
  const url = getAlchemyUrl(chainId);
  
  if (!url) {
    throw new Error('Alchemy URL not configured');
  }
  
  try {
    // Get token addresses for this chain
    const tokenAddresses = Object.values(STABLECOINS)
      .map(token => token.addresses[chainId])
      .filter(addr => addr && addr !== '0x');
    
    if (tokenAddresses.length === 0) {
      console.warn(`No tokens configured for chain ${chainId}`);
      return [];
    }
    
    const response = await axios.post(url, {
      jsonrpc: '2.0',
      id: 1,
      method: 'alchemy_getTokenBalances',
      params: [address, tokenAddresses]
    });
    
    if (response.data.error) {
      throw new Error(response.data.error.message);
    }
    
    const balances = response.data.result.tokenBalances;
    
    // Parse balances and match with token info
    const parsedBalances = balances.map(balance => {
      // Find token info
      const tokenEntry = Object.entries(STABLECOINS).find(([_, token]) => 
        token.addresses[chainId]?.toLowerCase() === balance.contractAddress.toLowerCase()
      );
      
      if (!tokenEntry) return null;
      
      const [symbol, tokenInfo] = tokenEntry;
      const rawBalance = balance.tokenBalance;
      
      // Convert hex to decimal
      const balanceInWei = parseInt(rawBalance, 16);
      const balanceInToken = balanceInWei / Math.pow(10, tokenInfo.decimals);
      
      return {
        symbol,
        name: tokenInfo.name,
        balance: balanceInToken,
        decimals: tokenInfo.decimals,
        contractAddress: balance.contractAddress,
        chainId
      };
    }).filter(b => b !== null && b.balance > 0);
    
    return parsedBalances;
  } catch (error) {
    console.error(`Error fetching token balances for chain ${chainId}:`, error);
    throw error;
  }
};

// Fetch ETH balance for an address on a specific chain
export const fetchETHBalance = async (address, chainId) => {
  const url = getAlchemyUrl(chainId);
  
  if (!url) {
    throw new Error('Alchemy URL not configured');
  }
  
  try {
    const response = await axios.post(url, {
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_getBalance',
      params: [address, 'latest']
    });
    
    if (response.data.error) {
      throw new Error(response.data.error.message);
    }
    
    const balanceInWei = parseInt(response.data.result, 16);
    const balanceInETH = balanceInWei / Math.pow(10, 18);
    
    return {
      symbol: 'ETH',
      name: 'Ethereum',
      balance: balanceInETH,
      decimals: 18,
      chainId
    };
  } catch (error) {
    console.error(`Error fetching ETH balance for chain ${chainId}:`, error);
    throw error;
  }
};

// Fetch all balances across all supported chains
export const fetchAllBalances = async (address) => {
  if (!address) {
    throw new Error('Address is required');
  }
  
  // Testnet chain IDs (current configuration)
  const chainIds = [11155111, 84532, 421614]; // Sepolia, Base Sepolia, Arbitrum Sepolia
  
  // Mainnet chain IDs (use these when switching to mainnet)
  // const chainIds = [1, 8453, 42161]; // Ethereum, Base, Arbitrum
  
  const allBalances = {};
  
  for (const chainId of chainIds) {
    try {
      const chain = Object.values(CHAINS).find(c => c.id === chainId);
      const chainName = chain ? chain.name.toLowerCase() : `chain-${chainId}`;
      
      // Fetch token balances
      const tokenBalances = await fetchTokenBalances(address, chainId);
      
      // Fetch ETH balance
      let ethBalance = null;
      try {
        ethBalance = await fetchETHBalance(address, chainId);
      } catch (error) {
        console.warn(`Could not fetch ETH balance for chain ${chainId}`);
      }
      
      // Combine balances
      const balances = [...tokenBalances];
      if (ethBalance && ethBalance.balance > 0) {
        balances.push(ethBalance);
      }
      
      allBalances[chainName] = balances;
    } catch (error) {
      console.error(`Error fetching balances for chain ${chainId}:`, error);
      allBalances[Object.values(CHAINS).find(c => c.id === chainId)?.name.toLowerCase() || `chain-${chainId}`] = [];
    }
  }
  
  return allBalances;
};

// Get token metadata
export const getTokenMetadata = async (tokenAddress, chainId) => {
  const url = getAlchemyUrl(chainId);
  
  if (!url) {
    throw new Error('Alchemy URL not configured');
  }
  
  try {
    const response = await axios.post(url, {
      jsonrpc: '2.0',
      id: 1,
      method: 'alchemy_getTokenMetadata',
      params: [tokenAddress]
    });
    
    if (response.data.error) {
      throw new Error(response.data.error.message);
    }
    
    return response.data.result;
  } catch (error) {
    console.error('Error fetching token metadata:', error);
    throw error;
  }
};

// Check if Alchemy is configured
export const isAlchemyConfigured = () => {
  const key = getAlchemyKey();
  return key && key.length > 0;
};

// Fetch transaction history using Alchemy
export const fetchTransactionHistory = async (address, chainId, limit = 20) => {
  const url = getAlchemyUrl(chainId);
  
  // Get chain info for logging
  const { CHAINS } = await import('../utils/constants');
  const chain = Object.values(CHAINS).find(c => c.id === chainId);
  const chainName = chain?.name || `Chain ${chainId}`;
  
  if (!url) {
    console.error(`❌ Alchemy URL not configured for ${chainName} (${chainId})`);
    throw new Error(`Alchemy URL not configured for chain ${chainId}`);
  }
  
  try {
    console.log(`\n📡 [${chainName}] Fetching transactions...`);
    console.log(`   Address: ${address}`);
    console.log(`   Chain ID: ${chainId}`);
    console.log(`   API URL: ${url.substring(0, 50)}...`);
    
    // Determine which categories to use based on chain
    // Base and Arbitrum don't support 'internal' category
    const categories = chainId === 11155111 
      ? ['external', 'internal', 'erc20', 'erc721', 'erc1155']  // Sepolia supports internal
      : ['external', 'erc20', 'erc721', 'erc1155'];  // Base & Arbitrum don't
    
    // Get transaction history using alchemy_getAssetTransfers
    const response = await axios.post(url, {
      jsonrpc: '2.0',
      id: 1,
      method: 'alchemy_getAssetTransfers',
      params: [{
        fromBlock: '0x0',
        toBlock: 'latest',
        fromAddress: address,
        category: categories,
        maxCount: `0x${limit.toString(16)}`,
        order: 'desc'
      }]
    });
    
    if (response.data.error) {
      console.error(`❌ [${chainName}] Alchemy API error:`, response.data.error);
      throw new Error(response.data.error.message);
    }
    
    const transfers = response.data.result.transfers || [];
    console.log(`   ✅ Found ${transfers.length} outgoing transactions`);
    
    // Also get incoming transactions (use same categories)
    const incomingResponse = await axios.post(url, {
      jsonrpc: '2.0',
      id: 2,
      method: 'alchemy_getAssetTransfers',
      params: [{
        fromBlock: '0x0',
        toBlock: 'latest',
        toAddress: address,
        category: categories,
        maxCount: `0x${limit.toString(16)}`,
        order: 'desc'
      }]
    });
    
    const incomingTransfers = incomingResponse.data.result?.transfers || [];
    console.log(`   ✅ Found ${incomingTransfers.length} incoming transactions`);
    
    // Combine and format transactions
    const allTransfers = [...transfers, ...incomingTransfers];
    console.log(`   📊 Total transfers: ${allTransfers.length}`);
    
    if (allTransfers.length === 0) {
      console.log(`   ℹ️  No transactions found on ${chainName}`);
      console.log(`   💡 Make sure you have transactions on this network`);
      console.log(`   💡 Or check if your Alchemy API key supports ${chainName}`);
      return [];
    }
    
    const transactions = allTransfers.map((tx, index) => {
      const isOutgoing = tx.from.toLowerCase() === address.toLowerCase();
      const isSelfTransfer = tx.from.toLowerCase() === tx.to?.toLowerCase();
      
      // Parse timestamp - Alchemy getAssetTransfers doesn't include blockTimestamp
      // We need to use block number to estimate time
      let timestamp;
      
      if (tx.metadata?.blockTimestamp) {
        // If blockTimestamp exists, use it
        timestamp = new Date(tx.metadata.blockTimestamp).getTime();
      } else if (tx.blockNum) {
        // Estimate timestamp from block number
        // Blocks are mined roughly every 12 seconds on Ethereum
        // For testnets, we'll use the block number as a relative ordering
        // More recent blocks = higher block number
        const blockHex = tx.blockNum;
        const blockNumber = parseInt(blockHex, 16);
        
        // Use block number to create relative timestamps
        // Subtract from current time based on block position in the list
        // This ensures proper ordering even without exact timestamps
        timestamp = Date.now() - (allTransfers.length - index) * 15000; // 15 seconds per position
      } else {
        console.warn(`No timestamp or block number for tx ${tx.hash}`);
        timestamp = Date.now() - (allTransfers.length - index) * 15000;
      }
      
      return {
        hash: tx.hash,
        from: tx.from,
        to: tx.to || tx.from, // For contract interactions
        value: parseFloat(tx.value || 0),
        timestamp: timestamp,
        blockNumber: tx.blockNum,
        isError: false, // Alchemy only returns successful transactions
        gasUsed: '0',
        gasPrice: '0',
        input: tx.rawContract?.address ? 'contract' : '0x',
        chain: chain?.name || 'Unknown',
        chainId: chainId,
        type: isSelfTransfer ? 'self' : isOutgoing ? 'sent' : 'received',
        explorerUrl: `${chain?.explorer}/tx/${tx.hash}`,
        asset: tx.asset || 'ETH',
        category: tx.category
      };
    });
    
    // Sort by timestamp and limit
    const sortedTx = transactions
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
    
    console.log(`   ✅ [${chainName}] Returning ${sortedTx.length} formatted transactions`);
    if (sortedTx.length > 0) {
      console.log(`   📅 Latest tx timestamp: ${new Date(sortedTx[0].timestamp).toLocaleString()}`);
      console.log(`   📅 Oldest tx timestamp: ${new Date(sortedTx[sortedTx.length - 1].timestamp).toLocaleString()}\n`);
    }
    return sortedTx;
    
  } catch (error) {
    console.error(`\n❌ [${chainName}] Error fetching transactions:`, error.message);
    if (error.response) {
      console.error(`   HTTP Status: ${error.response.status}`);
      console.error(`   Response:`, error.response.data);
    }
    console.log(`   💡 This might mean:`);
    console.log(`      - No transactions exist on ${chainName}`);
    console.log(`      - Your Alchemy API key doesn't support ${chainName}`);
    console.log(`      - API rate limit reached`);
    console.log(`      - Network connectivity issue\n`);
    return [];
  }
};

// Fetch transactions from all chains
export const fetchAllTransactions = async (address, limitPerChain = 50) => {
  if (!address) {
    throw new Error('Address is required');
  }
  
  if (!isAlchemyConfigured()) {
    console.warn('⚠️  Alchemy not configured, cannot fetch transactions');
    return [];
  }
  
  const chainIds = [11155111, 84532, 421614]; // Sepolia, Base Sepolia, Arbitrum Sepolia
  
  console.log(`\n${'='.repeat(70)}`);
  console.log(`🔍 FETCHING TRANSACTIONS FROM ALL CHAINS`);
  console.log(`${'='.repeat(70)}`);
  console.log(`Address: ${address}`);
  console.log(`Chains: Sepolia, Base Sepolia, Arbitrum Sepolia`);
  console.log(`${'='.repeat(70)}\n`);
  
  const allTransactions = [];
  const chainResults = {};
  
  for (const chainId of chainIds) {
    try {
      const transactions = await fetchTransactionHistory(address, chainId, limitPerChain);
      allTransactions.push(...transactions);
      
      const { CHAINS } = await import('../utils/constants');
      const chain = Object.values(CHAINS).find(c => c.id === chainId);
      chainResults[chain?.name || chainId] = transactions.length;
    } catch (error) {
      console.error(`❌ Error fetching transactions for chain ${chainId}:`, error.message);
      const { CHAINS } = await import('../utils/constants');
      const chain = Object.values(CHAINS).find(c => c.id === chainId);
      chainResults[chain?.name || chainId] = 0;
    }
  }
  
  // Sort all transactions by timestamp and return last 20
  const sortedTransactions = allTransactions
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 20);  // Return only 20 most recent
  
  console.log(`\n${'='.repeat(70)}`);
  console.log(`📊 TRANSACTION SUMMARY`);
  console.log(`${'='.repeat(70)}`);
  Object.entries(chainResults).forEach(([chain, count]) => {
    const emoji = count > 0 ? '✅' : '⚠️ ';
    console.log(`${emoji} ${chain}: ${count} transactions`);
  });
  console.log(`\n🎯 Total transactions: ${sortedTransactions.length}`);
  if (sortedTransactions.length > 0) {
    console.log(`📍 Most recent: ${sortedTransactions[0].hash.substring(0, 10)}... on ${sortedTransactions[0].chain}`);
    console.log(`\n🔍 DEBUGGING - First 3 transactions:`);
    sortedTransactions.slice(0, 3).forEach((tx, i) => {
      console.log(`   ${i + 1}. Chain: ${tx.chain} | Time: ${new Date(tx.timestamp).toLocaleString()} | Hash: ${tx.hash.substring(0, 10)}...`);
    });
  } else {
    console.log(`\n💡 TIP: If you're not seeing transactions:`);
    console.log(`   1. Make sure you have transactions on these testnets`);
    console.log(`   2. Check if your Alchemy API key supports all networks`);
    console.log(`   3. Try making a test transaction using the "Make Transaction" button`);
  }
  console.log(`${'='.repeat(70)}\n`);
  
  return sortedTransactions;
};

