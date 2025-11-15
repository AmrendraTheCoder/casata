import { formatCurrency } from '../utils/constants';

const AlertBanner = ({ underperformingCount, totalPotentialGain, healthScore }) => {
  // If health score is 100 (perfect), show blessed message
  if (healthScore === 100 || underperformingCount === 0) {
    return (
      <div className="card-premium bg-gradient-to-r from-lamp-teal-900/40 to-lamp-teal-800/40 border-2 border-lamp-teal-400/50 mb-8 slide-up">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-lamp-teal-500 to-lamp-teal-600 rounded-full flex items-center justify-center text-2xl shadow-lg animate-pulse">
            ✨
          </div>
          <div className="flex-1">
            <p className="font-bold text-lamp-teal-300 text-lg mb-1">Vault Fully Blessed</p>
            <p className="text-sm text-lamp-teal-200">
              Your prosperity score is {healthScore}/100. All treasures are blessed with optimal yields. The Genie will alert you when new wishes appear. 🧞
            </p>
          </div>
          <div className="text-4xl animate-sparkle">🎉</div>
        </div>
      </div>
    );
  }
  
  // Only show opportunities if health score is less than 100
  if (healthScore >= 100) {
    return null;
  }

  return (
    <div className="card-premium bg-gradient-to-r from-lamp-purple-900/40 to-lamp-magenta-900/40 border-2 border-lamp-magenta-400/50 mb-8 slide-up">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-lamp-magenta-500 to-lamp-purple-600 rounded-full flex items-center justify-center text-2xl shadow-lg animate-glow">
            🧞
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <p className="font-extrabold bg-gradient-to-r from-lamp-gold-400 to-lamp-gold-500 bg-clip-text text-transparent text-xl">
              {underperformingCount} Wish{underperformingCount > 1 ? 'es' : ''} Available
            </p>
            <span className="px-3 py-1 bg-gradient-to-r from-lamp-gold-500 to-lamp-gold-600 text-lamp-night-950 text-xs font-bold rounded-full shadow-lg animate-pulse">
              GRANT NOW
            </span>
          </div>
          <p className="text-base text-lamp-purple-200 mb-3">
            The Genie can grant you an extra <span className="font-extrabold text-lamp-teal-400 text-lg">{formatCurrency(totalPotentialGain)}</span> per year by migrating to enchanted pools with higher blessings. ✨
          </p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-lamp-purple-300">
              <span className="text-lamp-teal-400">✓</span>
              <span>Blessed safe protocols</span>
            </div>
            <div className="flex items-center gap-2 text-lamp-purple-300">
              <span className="text-lamp-teal-400">✓</span>
              <span>Clear cost prophecies</span>
            </div>
            <div className="flex items-center gap-2 text-lamp-purple-300">
              <span className="text-lamp-teal-400">✓</span>
              <span>Mystical incantations</span>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 text-4xl animate-float">🪔</div>
      </div>
    </div>
  );
};

export default AlertBanner;
