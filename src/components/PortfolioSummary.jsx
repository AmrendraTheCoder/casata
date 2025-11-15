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
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthLabel = (score) => {
    if (score >= 80) return 'Healthy';
    if (score >= 60) return 'Needs Attention';
    return 'Critical';
  };

  return (
    <div className="mb-8 slide-up">
      {/* Main Stats - Big Impact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Total Value */}
        <div className="stat-card group hover:scale-105 transition-all">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Portfolio</p>
              <p className="text-4xl font-extrabold text-gray-900">{formatCurrency(totalValue)}</p>
            </div>
            <div className="text-3xl group-hover:scale-110 transition-transform">💰</div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            {positions.length} active position{positions.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Potential Gain - Highlighted */}
        <div className="stat-card bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 group hover:scale-105 transition-all">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-green-700 mb-1">💡 You Could Earn</p>
              <p className="text-4xl font-extrabold text-green-600">
                +{formatCurrency(potentialGain)}
              </p>
            </div>
            <div className="text-3xl group-hover:scale-110 transition-transform">🚀</div>
          </div>
          <p className="text-sm text-green-700 font-medium">
            per year with recommended migrations
          </p>
        </div>

        {/* Health Score */}
        <div className="stat-card group hover:scale-105 transition-all">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Portfolio Health</p>
              <div className="flex items-baseline gap-2">
                <p className={`text-4xl font-extrabold ${getHealthColor(healthScore)}`}>
                  {healthScore}
                </p>
                <p className="text-2xl font-bold text-gray-400">/100</p>
              </div>
            </div>
            <div className="text-3xl group-hover:scale-110 transition-transform">
              {healthScore >= 80 ? '💚' : healthScore >= 60 ? '💛' : '❤️'}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className={`h-2 rounded-full transition-all duration-1000 ${
                healthScore >= 80
                  ? 'bg-gradient-to-r from-green-400 to-green-600'
                  : healthScore >= 60
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                  : 'bg-gradient-to-r from-red-400 to-red-600'
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
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 font-medium mb-1">Current Annual Yield</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentYield)}</p>
            </div>
            {/* <span className="text-2xl">📊</span> */}
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 font-medium mb-1">Potential Annual Yield</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(currentYield + potentialGain)}
              </p>
            </div>
            {/* <span className="text-2xl">✨</span> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;
