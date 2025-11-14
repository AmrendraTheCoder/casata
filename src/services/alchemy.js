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
  
  const urlMap = {
    1: `https://eth-mainnet.g.alchemy.com/v2/${key}`,
    8453: `https://base-mainnet.g.alchemy.com/v2/${key}`,
    42161: `https://arb-mainnet.g.alchemy.com/v2/${key}`
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
  
  const chainIds = [1, 8453, 42161]; // Ethereum, Base, Arbitrum
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

