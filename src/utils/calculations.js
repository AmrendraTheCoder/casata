// Calculate annual yield from APY and principal
export const calculateAnnualYield = (principal, apy) => {
  return (principal * apy) / 100;
};

// Calculate migration score based on multiple factors
export const calculateMigrationScore = ({
  currentApy,
  targetApy,
  bridgeCost,
  gasCost,
  positionSize,
  protocolSafetyScore,
  gasPrice // Current gas price (for timing)
}) => {
  // APY Differential Score (40% weight)
  const apyDiff = targetApy - currentApy;
  const apyDiffPercent = (apyDiff / currentApy) * 100;
  const apyScore = Math.min(100, Math.max(0, apyDiffPercent * 5)); // Scale to 0-100

  // Protocol Safety Score (30% weight) - Already 0-10, scale to 0-100
  const safetyScore = protocolSafetyScore * 10;

  // Cost Efficiency Score (20% weight)
  const totalCost = bridgeCost + gasCost;
  const costPercent = (totalCost / positionSize) * 100;
  const costScore = Math.max(0, 100 - costPercent * 20); // Lower cost = higher score

  // Timing Factor (10% weight) - Based on gas prices
  const averageGasPrice = 30; // Gwei
  const timingScore = gasPrice <= averageGasPrice 
    ? 100 
    : Math.max(0, 100 - ((gasPrice - averageGasPrice) / averageGasPrice) * 100);

  // Calculate weighted score
  const finalScore = (
    apyScore * 0.40 +
    safetyScore * 0.30 +
    costScore * 0.20 +
    timingScore * 0.10
  );

  return Math.round(Math.min(100, Math.max(0, finalScore)));
};

// Calculate breakeven time in days
export const calculateBreakeven = (totalCost, dailyGain) => {
  if (dailyGain <= 0) return Infinity;
  return totalCost / dailyGain;
};

// Calculate daily yield
export const calculateDailyYield = (principal, apy) => {
  return (principal * apy) / (100 * 365);
};

// Calculate total gain over period
export const calculateGainOverPeriod = (principal, apy, days) => {
  return (principal * apy * days) / (100 * 365);
};

// Calculate net gain after costs
export const calculateNetGain = (principal, currentApy, targetApy, costs, days = 365) => {
  const currentYield = calculateGainOverPeriod(principal, currentApy, days);
  const targetYield = calculateGainOverPeriod(principal, targetApy, days);
  return targetYield - currentYield - costs;
};

// Calculate position health score
export const calculatePositionHealth = (position, bestOpportunity) => {
  if (!bestOpportunity) return 100; // No better opportunity = healthy

  const potentialGain = bestOpportunity.annualGain || 0;
  const currentYield = calculateAnnualYield(position.amount, position.currentApy);
  
  if (currentYield === 0) return 50;

  const lossPercent = (potentialGain / currentYield) * 100;
  
  if (lossPercent > 40) return 20; // Critical
  if (lossPercent > 20) return 50; // Underperforming
  if (lossPercent > 10) return 75; // Moderate
  return 100; // Optimal
};

// Calculate portfolio health score
export const calculatePortfolioHealth = (positions, opportunities) => {
  if (positions.length === 0) return 100;

  let totalHealthScore = 0;
  
  positions.forEach(position => {
    const positionOpportunities = opportunities.filter(
      opp => opp.positionId === position.id
    );
    const bestOpp = positionOpportunities.length > 0 
      ? positionOpportunities.reduce((best, curr) => 
          curr.score > best.score ? curr : best
        )
      : null;
    
    totalHealthScore += calculatePositionHealth(position, bestOpp);
  });

  return Math.round(totalHealthScore / positions.length);
};

// Format token amount based on decimals
export const formatTokenAmount = (amount, decimals = 18) => {
  return amount / Math.pow(10, decimals);
};

// Parse token amount to base units
export const parseTokenAmount = (amount, decimals = 18) => {
  return Math.floor(amount * Math.pow(10, decimals));
};

// Calculate APY from APR
export const aprToApy = (apr, compoundsPerYear = 365) => {
  return ((Math.pow(1 + apr / compoundsPerYear, compoundsPerYear) - 1) * 100);
};

// Calculate percentage change
export const calculatePercentageChange = (oldValue, newValue) => {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
};

// Determine position status based on opportunities
export const determinePositionStatus = (position, opportunities) => {
  const positionOpps = opportunities.filter(opp => opp.positionId === position.id);
  
  if (positionOpps.length === 0) return 'optimal';
  
  const bestScore = Math.max(...positionOpps.map(opp => opp.score));
  
  if (bestScore >= 85) return 'critical';
  if (bestScore >= 70) return 'underperforming';
  return 'optimal';
};

