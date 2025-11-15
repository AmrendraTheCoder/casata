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
        return 'border-lamp-rose-400/50 bg-gradient-to-br from-lamp-rose-900/40 to-lamp-night-800/40';
      case 'underperforming':
        return 'border-lamp-magenta-400/50 bg-gradient-to-br from-lamp-magenta-900/40 to-lamp-night-800/40';
      default:
        return 'border-lamp-teal-400/50 bg-gradient-to-br from-lamp-teal-900/40 to-lamp-night-800/40';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'critical':
        return <span className="px-2 py-0.5 bg-lamp-rose-500/30 border border-lamp-rose-400/50 text-lamp-rose-300 text-[10px] font-bold rounded animate-pulse">URGENT WISH</span>;
      case 'underperforming':
        return <span className="px-2 py-0.5 bg-lamp-magenta-500/30 border border-lamp-magenta-400/50 text-lamp-magenta-300 text-[10px] font-bold rounded">WISH AVAILABLE</span>;
      default:
        return <span className="px-2 py-0.5 bg-lamp-teal-500/30 border border-lamp-teal-400/50 text-lamp-teal-300 text-[10px] font-bold rounded">BLESSED</span>;
    }
  };

  const chain = getChainById(position.chainId);

  return (
    <div className={`border-2 ${getStatusColor(position.status)} rounded-lg p-4 hover:shadow-xl hover:scale-105 transition-all backdrop-blur-sm`}>
      {/* Header - Compact */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{position.protocolLogo}</span>
          <div>
            <h3 className="font-semibold text-sm text-lamp-gold-400">{position.protocol}</h3>
            <p className="text-xs text-lamp-purple-400">{chain?.name || position.chain}</p>
          </div>
        </div>
        {getStatusBadge(position.status)}
      </div>

      {/* Asset & Amount - Inline */}
      <div className="bg-lamp-night-800/50 border border-lamp-purple-500/30 rounded-lg p-3 mb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-lamp-purple-400 mb-1">YOUR TREASURE</p>
            <p className="font-bold text-lg text-lamp-purple-100 flex items-center gap-1.5">
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
        <div className="bg-lamp-purple-900/40 border border-lamp-purple-500/30 rounded-lg p-2.5">
          <p className="text-[10px] text-lamp-purple-400 mb-1">CURRENT BLESSING</p>
          <p className="font-bold text-xl text-lamp-purple-300">
            {formatPercentage(position.currentApy)}
          </p>
        </div>
        <div className="bg-lamp-night-800/50 border border-lamp-purple-500/30 rounded-lg p-2.5">
          <p className="text-[10px] text-lamp-purple-400 mb-1">ANNUAL YIELD</p>
          <p className="font-bold text-sm text-lamp-gold-400">
            {position.asset === 'ETH'
              ? `${annualYield.toFixed(2)} ETH`
              : formatCurrency(annualYield)}
          </p>
        </div>
      </div>

      {bestOpportunity && (
        <div className="border-t border-lamp-purple-500/30 pt-4 mt-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-lg animate-sparkle">🧞</span>
              <p className="text-xs font-semibold text-lamp-gold-400">Genie's Wish</p>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              bestOpportunity.score >= 85 ? 'bg-lamp-teal-500/30 text-lamp-teal-300 border border-lamp-teal-400/50' :
              bestOpportunity.score >= 70 ? 'bg-lamp-magenta-500/30 text-lamp-magenta-300 border border-lamp-magenta-400/50' :
              'bg-lamp-gold-500/30 text-lamp-gold-300 border border-lamp-gold-400/50'
            }`}>
              {bestOpportunity.score}/100
            </span>
          </div>
          
          <div className="bg-lamp-magenta-900/40 border border-lamp-magenta-500/30 rounded-lg p-3 mb-3">
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-[10px] text-lamp-purple-400">✨ WISH TO MIGRATE</p>
                <p className="font-semibold text-sm text-lamp-gold-400">
                  {bestOpportunity.targetProtocol}
                </p>
                <p className="text-[10px] text-lamp-purple-300">{bestOpportunity.targetChain}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-lamp-purple-400">NEW BLESSING</p>
                <p className="font-bold text-2xl text-lamp-magenta-400">
                  {formatPercentage(bestOpportunity.targetApy)}
                </p>
                <p className="text-[10px] text-lamp-teal-400 font-bold">
                  +{formatPercentage(bestOpportunity.apyDifferential)}
                </p>
              </div>
            </div>
            
            <div className="bg-lamp-teal-900/40 border border-lamp-teal-400/50 rounded p-2 flex items-center justify-between mt-2">
              <div>
                <p className="text-[10px] text-lamp-teal-400">EXTRA PROSPERITY</p>
                <p className="font-bold text-base text-lamp-teal-300">
                  +{formatCurrency(bestOpportunity.annualGain)}
                </p>
              </div>
              <span className="text-xl animate-sparkle">✨</span>
            </div>
          </div>

          <button
            onClick={() => onViewOpportunities(position.id)}
            className="w-full bg-gradient-to-r from-lamp-magenta-600 to-lamp-purple-600 hover:from-lamp-magenta-500 hover:to-lamp-purple-500 text-white font-semibold py-2.5 px-4 rounded-lg transition-all text-sm shadow-lg"
          >
            Grant This Wish →
          </button>
        </div>
      )}

      {!bestOpportunity && opportunities.length === 0 && (
        <div className="border-t border-lamp-purple-500/30 pt-4 mt-4">
          <div className="text-center py-2">
            <span className="text-2xl mb-1 block animate-sparkle">✨</span>
            <p className="text-xs font-semibold text-lamp-teal-400">
              Fully Blessed
            </p>
            <p className="text-[10px] text-lamp-purple-400 mt-1">
              The Genie will alert you when new wishes appear
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PositionCard;
