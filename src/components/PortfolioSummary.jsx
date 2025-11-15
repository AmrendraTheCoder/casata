import { formatCurrency, formatPercentage } from '../utils/constants';
import { calculateAnnualYield } from '../utils/calculations';

const PortfolioSummary = ({ positions, opportunities, healthScore: providedHealthScore }) => {
  // ETH price (could be fetched from API in production)
  const ETH_PRICE = 2000; // USD
  
  // Calculate total value
  const totalValue = positions.reduce((sum, pos) => {
    if (pos.asset === 'ETH' || pos.asset === 'WETH') {
      return sum + (pos.amount * ETH_PRICE);
    }
    // For stablecoins (USDC, USDT, DAI), assume 1:1 with USD
    return sum + pos.amount;
  }, 0);

  // Calculate current yield (in USD)
  const currentYield = positions.reduce((sum, pos) => {
    const positionValue = (pos.asset === 'ETH' || pos.asset === 'WETH') 
      ? pos.amount * ETH_PRICE 
      : pos.amount;
    return sum + calculateAnnualYield(positionValue, pos.currentApy);
  }, 0);

  // Calculate potential yield
  const potentialGain = opportunities.reduce((sum, opp) => {
    return sum + (opp.annualGain || 0);
  }, 0);

  // Use provided health score from unified portfolio data, or calculate fallback
  const healthScore = providedHealthScore !== undefined ? providedHealthScore : 100;

  const getHealthColor = (score) => {
    if (score >= 80) return 'text-lamp-teal-400';
    if (score >= 60) return 'text-lamp-gold-400';
    return 'text-lamp-rose-400';
  };

  const getHealthLabel = (score) => {
    if (score >= 80) return 'Blessed';
    if (score >= 60) return 'Needs Enchantment';
    return 'Cursed';
  };

  return (
    <div className="mb-8 slide-up">
      {/* Main Stats - Magical Impact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Total Value */}
        <div className="stat-card group hover:scale-105 transition-all">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-lamp-purple-300 mb-1">Treasure Vault Total</p>
              <p className="text-4xl font-extrabold bg-gradient-to-r from-lamp-gold-400 to-lamp-gold-500 bg-clip-text text-transparent">{formatCurrency(totalValue)}</p>
            </div>
            <div className="text-3xl group-hover:scale-110 transition-transform animate-float">💎</div>
          </div>
          <div className="flex items-center gap-2 text-sm text-lamp-purple-300">
            <span className="w-2 h-2 bg-lamp-purple-500 rounded-full animate-pulse"></span>
            {positions.length} enchanted position{positions.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Potential Gain - Highlighted */}
        <div className="stat-card bg-gradient-to-br from-lamp-teal-900/40 to-lamp-teal-800/40 border-2 border-lamp-teal-400/50 group hover:scale-105 transition-all">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-lamp-teal-300 mb-1">✨ Genie's Promise</p>
              <p className="text-4xl font-extrabold text-lamp-teal-400">
                +{formatCurrency(potentialGain)}
              </p>
            </div>
            <div className="text-3xl group-hover:scale-110 transition-transform animate-sparkle">🧞</div>
          </div>
          <p className="text-sm text-lamp-teal-300 font-medium">
            per year with granted wishes
          </p>
        </div>

        {/* Health Score */}
        <div className="stat-card group hover:scale-105 transition-all">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-lamp-purple-300 mb-1">Prosperity Score</p>
              <div className="flex items-baseline gap-2">
                <p className={`text-4xl font-extrabold ${getHealthColor(healthScore)}`}>
                  {healthScore}
                </p>
                <p className="text-2xl font-bold text-lamp-purple-500">/100</p>
              </div>
            </div>
            <div className="text-3xl group-hover:scale-110 transition-transform">
              {healthScore >= 80 ? '✨' : healthScore >= 60 ? '🌟' : '⚠️'}
            </div>
          </div>
          <div className="w-full bg-lamp-night-800 rounded-full h-2 mt-2">
            <div
              className={`h-2 rounded-full transition-all duration-1000 ${
                healthScore >= 80
                  ? 'bg-gradient-to-r from-lamp-teal-400 to-lamp-teal-600'
                  : healthScore >= 60
                  ? 'bg-gradient-to-r from-lamp-gold-400 to-lamp-gold-600'
                  : 'bg-gradient-to-r from-lamp-rose-400 to-lamp-rose-600'
              }`}
              style={{ width: `${healthScore}%` }}
            ></div>
          </div>
          <p className={`text-xs font-semibold mt-2 ${getHealthColor(healthScore)}`}>
            {getHealthLabel(healthScore)}
          </p>
        </div>
      </div>

      {/* Secondary Stats - Current Performance */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        <div className="bg-lamp-night-800/50 border border-lamp-purple-500/30 rounded-xl p-4 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-lamp-purple-400 font-medium mb-1">Current Blessings</p>
              <p className="text-2xl font-bold text-lamp-purple-200">{formatCurrency(currentYield)}</p>
              <p className="text-xs text-lamp-purple-400 mt-1">per year</p>
            </div>
          </div>
        </div>
        
        <div className="bg-lamp-night-800/50 border border-lamp-teal-400/50 rounded-xl p-4 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-lamp-teal-400 font-medium mb-1">Potential Prosperity</p>
              <p className="text-2xl font-bold text-lamp-teal-400">
                {formatCurrency(currentYield + potentialGain)}
              </p>
              <p className="text-xs text-lamp-teal-400 mt-1">per year with wishes ✨</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;
