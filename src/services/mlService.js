import axios from 'axios';
import { calculateMigrationScore, calculateNetGain, calculateBreakeven, calculateDailyYield } from '../utils/calculations';

// Get ML service URL from environment
const getMLServiceUrl = () => {
  return import.meta.env.VITE_ML_SERVICE_URL || 'http://localhost:5000';
};

// Check if ML service is available
export const isMLServiceAvailable = async () => {
  try {
    const url = getMLServiceUrl();
    const response = await axios.get(`${url}/health`, { timeout: 2000 });
    return response.status === 200;
  } catch (error) {
    console.warn('ML service is not available');
    return false;
  }
};

// Get migration score from ML service
export const getMigrationScore = async (positionData) => {
  try {
    const url = getMLServiceUrl();
    const response = await axios.post(`${url}/api/score`, positionData, {
      timeout: 5000
    });
    
    return response.data;
  } catch (error) {
    console.error('Error calling ML service:', error);
    // Fall back to client-side calculation
    return calculateScoreClientSide(positionData);
  }
};

// Client-side score calculation (fallback)
const calculateScoreClientSide = (positionData) => {
  const { currentPosition, targetOpportunity, bridgeCost = 3, gasCost = 1 } = positionData;
  
  const score = calculateMigrationScore({
    currentApy: currentPosition.currentApy,
    targetApy: targetOpportunity.targetApy,
    bridgeCost,
    gasCost,
    positionSize: currentPosition.amount,
    protocolSafetyScore: targetOpportunity.protocolSafetyScore || 8,
    gasPrice: 25 // Assume moderate gas
  });
  
  const currentDailyYield = calculateDailyYield(currentPosition.amount, currentPosition.currentApy);
  const targetDailyYield = calculateDailyYield(currentPosition.amount, targetOpportunity.targetApy);
  const dailyGain = targetDailyYield - currentDailyYield;
  
  const annualGain = calculateNetGain(
    currentPosition.amount,
    currentPosition.currentApy,
    targetOpportunity.targetApy,
    bridgeCost + gasCost,
    365
  );
  
  const breakeven = calculateBreakeven(bridgeCost + gasCost, dailyGain);
  
  return {
    score,
    annualGain: Math.max(0, annualGain),
    breakeven,
    costs: {
      bridge: bridgeCost,
      gas: gasCost,
      total: bridgeCost + gasCost
    }
  };
};

// Get yield prediction from ML service
export const predictYield = async (protocol, chain, asset) => {
  try {
    const url = getMLServiceUrl();
    const response = await axios.post(`${url}/api/predict`, {
      protocol,
      chain,
      asset
    }, {
      timeout: 5000
    });
    
    return response.data;
  } catch (error) {
    console.error('Error predicting yield:', error);
    // Return a simple prediction
    return {
      prediction: 'stable',
      confidence: 0.5,
      trend: 'neutral'
    };
  }
};

// Batch score multiple opportunities
export const batchScoreOpportunities = async (opportunities) => {
  // Check if ML service is available
  const serviceAvailable = await isMLServiceAvailable();
  
  if (!serviceAvailable) {
    console.log('Using client-side scoring');
    return opportunities.map(opp => {
      const scored = calculateScoreClientSide(opp);
      return {
        ...opp,
        ...scored
      };
    });
  }
  
  try {
    const url = getMLServiceUrl();
    const response = await axios.post(`${url}/api/batch-score`, {
      opportunities
    }, {
      timeout: 10000
    });
    
    return response.data.scoredOpportunities;
  } catch (error) {
    console.error('Error batch scoring:', error);
    // Fall back to client-side
    return opportunities.map(opp => {
      const scored = calculateScoreClientSide(opp);
      return {
        ...opp,
        ...scored
      };
    });
  }
};

// Generate migration recommendations
export const generateRecommendations = async (positions, opportunities) => {
  const recommendations = [];
  
  for (const position of positions) {
    const positionOpps = opportunities.filter(
      opp => opp.asset === position.asset && opp.targetChain !== position.chain
    );
    
    if (positionOpps.length === 0) continue;
    
    // Score each opportunity
    const scoredOpps = await Promise.all(
      positionOpps.map(async (opp) => {
        const scored = await getMigrationScore({
          currentPosition: position,
          targetOpportunity: opp,
          bridgeCost: 3.20,
          gasCost: 0.80
        });
        
        return {
          positionId: position.id,
          ...opp,
          ...scored
        };
      })
    );
    
    // Add top recommendations
    scoredOpps
      .sort((a, b) => b.score - a.score)
      .slice(0, 3) // Top 3 per position
      .forEach(rec => recommendations.push(rec));
  }
  
  return recommendations.sort((a, b) => b.score - a.score);
};

