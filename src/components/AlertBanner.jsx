import { formatCurrency } from '../utils/constants';

const AlertBanner = ({ underperformingCount, totalPotentialGain, healthScore }) => {
  // If health score is 100 (perfect), show optimized message
  if (healthScore === 100 || underperformingCount === 0) {
    return (
      <div className="card-premium bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 mb-8 slide-up">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-2xl shadow-md">
            ✓
          </div>
          <div className="flex-1">
            <p className="font-bold text-green-700 text-lg mb-1">Portfolio Optimized</p>
            <p className="text-sm text-green-600">
              Your portfolio health is {healthScore}/100. All positions are performing well. We'll notify you when better opportunities appear.
            </p>
          </div>
          <div className="text-4xl">🎉</div>
        </div>
      </div>
    );
  }
  
  // Only show opportunities if health score is less than 100
  if (healthScore >= 100) {
    return null;
  }

  return (
    <div className="card-premium bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 mb-8 slide-up">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-2xl shadow-md">
            💡
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <p className="font-extrabold text-gray-900 text-xl">
              {underperformingCount} Opportunity{underperformingCount > 1 ? 's' : ''} Found
            </p>
            <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full shadow-sm">
              ACT NOW
            </span>
          </div>
          <p className="text-base text-gray-700 mb-3">
            You could earn an extra <span className="font-extrabold text-green-600 text-lg">{formatCurrency(totalPotentialGain)}</span> per year by migrating to higher-yield protocols.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-green-600">✓</span>
              <span>Verified safe protocols</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-green-600">✓</span>
              <span>Clear cost breakdowns</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-green-600">✓</span>
              <span>Step-by-step guides</span>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 text-4xl">🚀</div>
      </div>
    </div>
  );
};

export default AlertBanner;
