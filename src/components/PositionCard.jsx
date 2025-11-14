import { formatCurrency, formatPercentage, getChainById } from '../utils/constants';
import { calculateAnnualYield } from '../utils/calculations';

const PositionCard = ({ position, opportunities = [], onViewOpportunities }) => {
  const annualYield = calculateAnnualYield(position.amount, position.currentApy);
  const bestOpportunity = opportunities.length > 0 
    ? opportunities.reduce((best, curr) => curr.score > best.score ? curr : best)
    : null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical':
        return 'border-orange-300 bg-gradient-to-br from-orange-50 to-white';
      case 'underperforming':
        return 'border-blue-300 bg-gradient-to-br from-blue-50 to-white';
      default:
        return 'border-green-300 bg-gradient-to-br from-green-50 to-white';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'critical':
        return <span className="px-2 py-0.5 bg-orange-100 border border-orange-300 text-orange-700 text-[10px] font-bold rounded">HIGH OPP</span>;
      case 'underperforming':
        return <span className="px-2 py-0.5 bg-blue-100 border border-blue-300 text-blue-700 text-[10px] font-bold rounded">OPPORTUNITY</span>;
      default:
        return <span className="px-2 py-0.5 bg-green-100 border border-green-300 text-green-700 text-[10px] font-bold rounded">OPTIMIZED</span>;
    }
  };

  const chain = getChainById(position.chainId);

  return (
    <div className={`border ${getStatusColor(position.status)} rounded-lg p-4 hover:shadow-md transition-all`}>
      {/* Header - Compact */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{position.protocolLogo}</span>
          <div>
            <h3 className="font-semibold text-sm text-gray-900">{position.protocol}</h3>
            <p className="text-xs text-gray-500">{chain?.name || position.chain}</p>
          </div>
        </div>
        {getStatusBadge(position.status)}
      </div>

      {/* Asset & Amount - Inline */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-500 mb-1">YOUR POSITION</p>
            <p className="font-bold text-lg text-gray-900 flex items-center gap-1.5">
              <span className="text-xl">{position.assetLogo}</span>
              <span className="text-sm">
                {position.asset === 'ETH' 
                  ? `${position.amount.toFixed(2)} ${position.asset}` 
                  : `${formatCurrency(position.amount).replace('$', '')} ${position.asset}`}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* APY & Yield - Compact Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5">
          <p className="text-[10px] text-gray-600 mb-1">CURRENT APY</p>
          <p className="font-bold text-xl text-blue-600">
            {formatPercentage(position.currentApy)}
          </p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-2.5">
          <p className="text-[10px] text-gray-600 mb-1">ANNUAL YIELD</p>
          <p className="font-bold text-sm text-gray-700">
            {position.asset === 'ETH'
              ? `${annualYield.toFixed(2)} ETH`
              : formatCurrency(annualYield)}
          </p>
        </div>
      </div>

      {bestOpportunity && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">✨</span>
              <p className="text-xs font-semibold text-gray-700">Better Option</p>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              bestOpportunity.score >= 85 ? 'bg-green-100 text-green-700' :
              bestOpportunity.score >= 70 ? 'bg-blue-100 text-blue-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {bestOpportunity.score}/100
            </span>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-[10px] text-gray-600">MIGRATE TO</p>
                <p className="font-semibold text-sm text-gray-900">
                  {bestOpportunity.targetProtocol}
                </p>
                <p className="text-[10px] text-gray-600">{bestOpportunity.targetChain}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-600">NEW APY</p>
                <p className="font-bold text-2xl text-blue-600">
                  {formatPercentage(bestOpportunity.targetApy)}
                </p>
                <p className="text-[10px] text-green-600 font-bold">
                  +{formatPercentage(bestOpportunity.apyDifferential)}
                </p>
              </div>
            </div>
            
            <div className="bg-green-100 border border-green-300 rounded p-2 flex items-center justify-between mt-2">
              <div>
                <p className="text-[10px] text-gray-600">EXTRA ANNUAL</p>
                <p className="font-bold text-base text-green-700">
                  +{formatCurrency(bestOpportunity.annualGain)}
                </p>
              </div>
              <span className="text-xl">💰</span>
            </div>
          </div>

          <button
            onClick={() => onViewOpportunities(position.id)}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm"
          >
            View Details →
          </button>
        </div>
      )}

      {!bestOpportunity && opportunities.length === 0 && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="text-center py-2">
            <span className="text-2xl mb-1 block">✓</span>
            <p className="text-xs font-semibold text-gray-700">
              Already Optimized
            </p>
            <p className="text-[10px] text-gray-500 mt-1">
              We'll alert you when better opportunities appear
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PositionCard;
