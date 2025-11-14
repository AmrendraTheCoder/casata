import { formatCurrency, formatPercentage, getScoreColor, getScoreLabel } from '../utils/constants';

const MigrationOpportunity = ({ opportunity, onClose }) => {
  if (!opportunity) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn" onClick={onClose}>
      <div
        className="bg-white border border-gray-200 rounded-xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-gray-900">Migration Opportunity</h2>
            <span className="px-2 py-0.5 bg-blue-100 border border-blue-300 rounded text-xs text-blue-700">AI Recommended</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-52px)] bg-gray-50 p-5">

          {/* Score & Gain */}
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 rounded-lg ${getScoreColor(opportunity.score)}`}>
                <span className="text-2xl font-bold">{opportunity.score}</span>
                <span className="text-xs text-gray-600">/100</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{getScoreLabel(opportunity.score)}</p>
                <p className="text-xs text-gray-500">Confidence Score</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-green-600">+{formatCurrency(opportunity.annualGain)}</p>
              <p className="text-xs text-gray-500">Annual Gain</p>
            </div>
          </div>

          {/* Comparison */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="text-[10px] text-gray-500 mb-1">CURRENT</div>
              <div className="text-sm font-medium text-gray-700 mb-1">{opportunity.asset}</div>
              <div className="text-xs text-gray-500 mb-2">Ethereum</div>
              <div className="text-2xl font-bold text-gray-700">{formatPercentage(opportunity.currentApy)}</div>
              <div className="text-[10px] text-gray-500">APY</div>
            </div>

            <div className="bg-blue-50 border border-blue-300 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <div className="text-[10px] text-gray-600">RECOMMENDED</div>
                <div className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[9px] font-bold rounded">+{formatPercentage(opportunity.apyDifferential)}</div>
              </div>
              <div className="text-sm font-medium text-gray-900 mb-1">{opportunity.targetProtocol}</div>
              <div className="text-xs text-gray-600 mb-2">{opportunity.targetChain}</div>
              <div className="text-2xl font-bold text-blue-600">{formatPercentage(opportunity.targetApy)}</div>
              <div className="text-[10px] text-gray-600">APY</div>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-white border border-gray-200 rounded-lg p-2.5 text-center">
              <div className="text-xs text-gray-500 mb-0.5">Cost</div>
              <div className="text-base font-bold text-gray-700">{formatCurrency(opportunity.costs.total)}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-2.5 text-center">
              <div className="text-xs text-gray-500 mb-0.5">Breakeven</div>
              <div className="text-base font-bold text-gray-700">{opportunity.breakeven.toFixed(0)}d</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-2.5 text-center">
              <div className="text-xs text-gray-500 mb-0.5">Safety</div>
              <div className="text-base font-bold text-green-600">{opportunity.protocolSafetyScore}/10</div>
            </div>
          </div>

          {/* Cost Details */}
          <div className="bg-white border border-gray-200 rounded-lg p-3 mb-4">
            <div className="text-[10px] font-semibold text-gray-600 mb-2">COST BREAKDOWN</div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Bridge Fee</span>
                <span className="text-gray-800">{formatCurrency(opportunity.costs.bridge)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gas (est.)</span>
                <span className="text-gray-800">{formatCurrency(opportunity.costs.gas)}</span>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="bg-white border border-gray-200 rounded-lg p-3 mb-4">
            <div className="text-[10px] font-semibold text-gray-600 mb-2">MIGRATION STEPS</div>
            <ol className="space-y-1.5">
              {opportunity.migrationSteps?.map((step, index) => (
                <li key={index} className="flex gap-2 text-xs">
                  <span className="flex-shrink-0 w-4 h-4 bg-blue-100 text-blue-700 rounded flex items-center justify-center text-[10px] font-bold mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 leading-tight">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 mb-3">
            <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
              Save
            </button>
            <button
              onClick={onClose}
              className="px-5 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2 rounded-lg border border-gray-300 transition-colors text-sm"
            >
              Close
            </button>
          </div>

          {/* Disclaimer */}
          <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
            <p className="text-[10px] text-gray-600 leading-relaxed">
              <span className="text-yellow-600">⚠</span> Estimates based on current conditions. Always verify before executing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MigrationOpportunity;
