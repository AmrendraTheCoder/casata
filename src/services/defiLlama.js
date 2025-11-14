import axios from 'axios';

const DEFILLAMA_BASE_URL = 'https://yields.llama.fi';

// Cache for APY data
let cachedPools = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fetch all pools from DefiLlama
export const fetchAllPools = async () => {
  try {
    // Check cache first
    if (cachedPools && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
      console.log('Returning cached DefiLlama data');
      return cachedPools;
    }

    console.log('Fetching fresh data from DefiLlama...');
    const response = await axios.get(`${DEFILLAMA_BASE_URL}/pools`);
    
    if (response.data && response.data.data) {
      cachedPools = response.data.data;
      cacheTimestamp = Date.now();
      return cachedPools;
    }
    
    throw new Error('Invalid response from DefiLlama');
  } catch (error) {
    console.error('Error fetching DefiLlama pools:', error);
    
    // Return cached data if available, even if expired
    if (cachedPools) {
      console.log('Returning expired cache due to error');
      return cachedPools;
    }
    
    throw error;
  }
};

// Get APY for specific protocol, chain, and asset
export const getProtocolAPY = async (protocol, chain, asset) => {
  try {
    const pools = await fetchAllPools();
    
    // Normalize inputs
    const protocolLower = protocol.toLowerCase();
    const chainLower = chain.toLowerCase();
    const assetUpper = asset.toUpperCase();
    
    // Filter pools matching criteria
    const matchingPools = pools.filter(pool => {
      const poolProject = pool.project?.toLowerCase() || '';
      const poolChain = pool.chain?.toLowerCase() || '';
      const poolSymbol = pool.symbol?.toUpperCase() || '';
      
      return (
        poolProject.includes(protocolLower) &&
        poolChain === chainLower &&
        poolSymbol.includes(assetUpper)
      );
    });
    
    if (matchingPools.length === 0) {
      console.warn(`No pools found for ${protocol} on ${chain} with ${asset}`);
      return null;
    }
    
    // Return the pool with highest APY
    const bestPool = matchingPools.reduce((best, current) => {
      const bestApy = best.apy || best.apyBase || 0;
      const currentApy = current.apy || current.apyBase || 0;
      return currentApy > bestApy ? current : best;
    });
    
    return {
      protocol: bestPool.project,
      chain: bestPool.chain,
      symbol: bestPool.symbol,
      apy: bestPool.apy || bestPool.apyBase || 0,
      apyBase: bestPool.apyBase || 0,
      apyReward: bestPool.apyReward || 0,
      tvl: bestPool.tvlUsd || 0,
      poolId: bestPool.pool
    };
  } catch (error) {
    console.error('Error getting protocol APY:', error);
    return null;
  }
};

// Get all opportunities for a given asset across chains
export const getAssetOpportunities = async (asset) => {
  try {
    const pools = await fetchAllPools();
    const assetUpper = asset.toUpperCase();
    
    // Filter for major protocols on supported chains
    const supportedProtocols = ['aave', 'compound', 'curve'];
    const supportedChains = ['ethereum', 'base', 'arbitrum'];
    
    const opportunities = pools.filter(pool => {
      const poolProject = pool.project?.toLowerCase() || '';
      const poolChain = pool.chain?.toLowerCase() || '';
      const poolSymbol = pool.symbol?.toUpperCase() || '';
      
      const isSupported = supportedProtocols.some(p => poolProject.includes(p)) &&
                          supportedChains.includes(poolChain);
      
      return isSupported && poolSymbol.includes(assetUpper);
    });
    
    // Sort by APY descending
    opportunities.sort((a, b) => {
      const apyA = a.apy || a.apyBase || 0;
      const apyB = b.apy || b.apyBase || 0;
      return apyB - apyA;
    });
    
    return opportunities.map(pool => ({
      protocol: pool.project,
      chain: pool.chain,
      symbol: pool.symbol,
      apy: pool.apy || pool.apyBase || 0,
      tvl: pool.tvlUsd || 0,
      poolId: pool.pool
    }));
  } catch (error) {
    console.error('Error getting asset opportunities:', error);
    return [];
  }
};

// Get top yielding pools across all chains
export const getTopYieldingPools = async (limit = 20) => {
  try {
    const pools = await fetchAllPools();
    
    // Filter for stablecoins on supported chains
    const supportedChains = ['ethereum', 'base', 'arbitrum'];
    const stablecoins = ['USDC', 'USDT', 'DAI'];
    
    const stablePools = pools.filter(pool => {
      const poolChain = pool.chain?.toLowerCase() || '';
      const poolSymbol = pool.symbol?.toUpperCase() || '';
      
      return supportedChains.includes(poolChain) &&
             stablecoins.some(stable => poolSymbol.includes(stable));
    });
    
    // Sort by APY and get top N
    stablePools.sort((a, b) => {
      const apyA = a.apy || a.apyBase || 0;
      const apyB = b.apy || b.apyBase || 0;
      return apyB - apyA;
    });
    
    return stablePools.slice(0, limit).map(pool => ({
      protocol: pool.project,
      chain: pool.chain,
      symbol: pool.symbol,
      apy: pool.apy || pool.apyBase || 0,
      tvl: pool.tvlUsd || 0,
      poolId: pool.pool
    }));
  } catch (error) {
    console.error('Error getting top yielding pools:', error);
    return [];
  }
};

// Map chain names to DefiLlama format
export const mapChainName = (chainId) => {
  const chainMap = {
    1: 'Ethereum',
    8453: 'Base',
    42161: 'Arbitrum'
  };
  return chainMap[chainId] || 'Ethereum';
};

// Map protocol names to DefiLlama format
export const mapProtocolName = (protocol) => {
  const protocolMap = {
    'Aave V3': 'aave-v3',
    'Compound V3': 'compound-v3',
    'Curve Finance': 'curve'
  };
  return protocolMap[protocol] || protocol.toLowerCase();
};

