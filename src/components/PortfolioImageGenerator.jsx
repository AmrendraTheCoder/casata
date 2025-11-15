import { useRef, useState, useMemo } from 'react';
import html2canvas from 'html2canvas';

const PortfolioImageGenerator = ({ stats, healthScore, address }) => {
  const imageRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate random NFT attributes based on health score
  const nftAttributes = useMemo(() => {
    const safeHealthScore = healthScore || 50; // Default to 50 if undefined
    const seed = safeHealthScore + (stats?.totalBalance || 0) * 100;
    const random = (max, min = 0) => {
      const value = Math.abs(Math.floor((Math.sin(seed + max) * 10000) % (max - min + 1)) + min);
      return Math.min(Math.max(value, min), max); // Clamp between min and max
    };

    // Color palettes based on health score
    const palettes = {
      excellent: [
        { bg: 'from-emerald-900 via-teal-900 to-green-900', accent: 'from-emerald-400 to-green-400', glow: 'emerald' },
        { bg: 'from-green-900 via-lime-900 to-emerald-900', accent: 'from-lime-400 to-green-400', glow: 'lime' },
        { bg: 'from-teal-900 via-cyan-900 to-emerald-900', accent: 'from-cyan-400 to-teal-400', glow: 'cyan' },
      ],
      good: [
        { bg: 'from-blue-900 via-indigo-900 to-purple-900', accent: 'from-blue-400 to-indigo-400', glow: 'blue' },
        { bg: 'from-indigo-900 via-blue-900 to-cyan-900', accent: 'from-indigo-400 to-cyan-400', glow: 'indigo' },
        { bg: 'from-purple-900 via-pink-900 to-blue-900', accent: 'from-purple-400 to-pink-400', glow: 'purple' },
      ],
      fair: [
        { bg: 'from-amber-900 via-yellow-900 to-orange-900', accent: 'from-amber-400 to-yellow-400', glow: 'amber' },
        { bg: 'from-yellow-900 via-orange-900 to-amber-900', accent: 'from-yellow-400 to-orange-400', glow: 'yellow' },
      ],
      poor: [
        { bg: 'from-red-900 via-orange-900 to-pink-900', accent: 'from-red-400 to-orange-400', glow: 'red' },
        { bg: 'from-rose-900 via-red-900 to-orange-900', accent: 'from-rose-400 to-red-400', glow: 'rose' },
      ],
    };

    // Select palette based on health
    let category = 'poor';
    if (safeHealthScore >= 80) category = 'excellent';
    else if (safeHealthScore >= 60) category = 'good';
    else if (safeHealthScore >= 40) category = 'fair';

    const categoryPalettes = palettes[category];
    const paletteIndex = random(categoryPalettes.length - 1, 0);
    const selectedPalette = categoryPalettes[paletteIndex] || categoryPalettes[0]; // Fallback to first palette

    // Random attributes
    const patterns = ['dots', 'grid', 'waves', 'hexagons', 'circles'];
    const frames = ['standard', 'double', 'glow', 'tech', 'minimal'];
    const badges = ['🏆', '⭐', '💎', '👑', '🎯', '🔥', '⚡', '🌟'];

    return {
      palette: selectedPalette,
      pattern: patterns[random(patterns.length - 1, 0)] || 'dots',
      frame: frames[random(frames.length - 1, 0)] || 'standard',
      badge: badges[random(badges.length - 1, 0)] || '🎯',
      uniqueId: `#${random(9999, 1000)}`,
      edition: `${random(500, 1)} / 500`,
      rarity: safeHealthScore >= 90 ? 'Legendary' : safeHealthScore >= 75 ? 'Epic' : safeHealthScore >= 60 ? 'Rare' : safeHealthScore >= 40 ? 'Uncommon' : 'Common',
    };
  }, [healthScore, stats]);

  const downloadImage = async () => {
    if (!imageRef.current) return;
    
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(imageRef.current, {
        backgroundColor: null,
        scale: 3,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `lampfi-prosperity-nft-${nftAttributes.uniqueId}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating NFT image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getHealthStatus = (score) => {
    const safeScore = score || 50; // Default to 50 if undefined
    if (safeScore >= 80) return { label: 'Excellent', emoji: '🏆', color: 'text-emerald-400' };
    if (safeScore >= 60) return { label: 'Good', emoji: '⭐', color: 'text-blue-400' };
    if (safeScore >= 40) return { label: 'Fair', emoji: '💎', color: 'text-yellow-400' };
    return { label: 'Needs Attention', emoji: '🔥', color: 'text-orange-400' };
  };

  const status = getHealthStatus(healthScore);
  const safeHealthScore = healthScore || 50; // Safe default for rendering

  // Pattern component
  const BackgroundPattern = ({ pattern }) => {
    const patterns = {
      dots: (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}></div>
        </div>
      ),
      grid: (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}></div>
        </div>
      ),
      waves: (
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="wave" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M0 50 Q 25 30, 50 50 T 100 50" stroke="white" strokeWidth="2" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#wave)" />
          </svg>
        </div>
      ),
      hexagons: (
        <div className="absolute inset-0 opacity-15">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute border border-white"
              style={{
                width: '60px',
                height: '60px',
                clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
                top: `${(i % 4) * 25}%`,
                left: `${Math.floor(i / 4) * 20}%`,
              }}
            ></div>
          ))}
        </div>
      ),
      circles: (
        <div className="absolute inset-0 opacity-15">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border-2 border-white"
              style={{
                width: `${50 + i * 10}px`,
                height: `${50 + i * 10}px`,
                top: `${(i * 7) % 80}%`,
                left: `${(i * 13) % 80}%`,
              }}
            ></div>
          ))}
        </div>
      ),
    };
    return patterns[pattern] || patterns.dots;
  };

  return (
    <div className="card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-lamp-gold-400 to-lamp-gold-500 bg-clip-text text-transparent">🪔 Prosperity NFT Generator</h3>
          <p className="text-sm text-lamp-purple-200">Generate unique mystical prosperity art</p>
        </div>
        <button
          onClick={downloadImage}
          disabled={isGenerating}
          className="px-6 py-3 bg-gradient-to-r from-lamp-purple-600 to-lamp-magenta-600 text-white font-bold rounded-xl hover:from-lamp-purple-500 hover:to-lamp-magenta-500 transition-all hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? '⏳ Summoning...' : '✨ Generate Prosperity NFT'}
        </button>
      </div>

      {/* NFT Attributes Preview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-gradient-to-br from-lamp-purple-900/40 to-lamp-magenta-900/40 border border-lamp-purple-500/30 rounded-lg p-3">
          <div className="text-xs text-lamp-purple-400 mb-1">Rarity</div>
          <div className="text-lg font-bold text-lamp-purple-200">{nftAttributes.rarity}</div>
        </div>
        <div className="bg-gradient-to-br from-lamp-magenta-900/40 to-lamp-purple-900/40 border border-lamp-magenta-500/30 rounded-lg p-3">
          <div className="text-xs text-lamp-purple-400 mb-1">Edition</div>
          <div className="text-lg font-bold text-lamp-magenta-300">{nftAttributes.edition}</div>
        </div>
        <div className="bg-gradient-to-br from-lamp-teal-900/40 to-lamp-teal-800/40 border border-lamp-teal-500/30 rounded-lg p-3">
          <div className="text-xs text-lamp-purple-400 mb-1">Pattern</div>
          <div className="text-lg font-bold text-lamp-teal-300 capitalize">{nftAttributes.pattern}</div>
        </div>
        <div className="bg-gradient-to-br from-lamp-gold-900/40 to-lamp-gold-800/40 border border-lamp-gold-500/30 rounded-lg p-3">
          <div className="text-xs text-lamp-purple-400 mb-1">ID</div>
          <div className="text-lg font-bold text-lamp-gold-300 font-mono">{nftAttributes.uniqueId}</div>
        </div>
      </div>

      {/* NFT Preview */}
      <div className="border-4 border-lamp-purple-500/30 rounded-2xl p-6 bg-gradient-to-br from-lamp-night-800 to-lamp-night-900">
        <p className="text-sm text-lamp-gold-400 mb-4 text-center font-semibold">✨ Your Unique Prosperity NFT Preview</p>
        
        {/* NFT Image to be generated */}
        <div
          ref={imageRef}
          className={`relative bg-gradient-to-br ${nftAttributes.palette.bg} rounded-3xl p-8 text-white overflow-hidden`}
          style={{ width: '600px', maxWidth: '100%', margin: '0 auto', aspectRatio: '1/1' }}
        >
          {/* Background Pattern */}
          <BackgroundPattern pattern={nftAttributes.pattern} />

          {/* Decorative Frame Corners */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-white/40 rounded-tl-xl"></div>
          <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-white/40 rounded-tr-xl"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-white/40 rounded-bl-xl"></div>
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-white/40 rounded-br-xl"></div>

          {/* Content */}
          <div className="relative z-10">
            {/* NFT Header */}
            <div className="text-center mb-6">
              <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 mb-3">
                <span className="text-xs font-bold tracking-wider">LAMPFI PROSPERITY</span>
              </div>
              <div className="text-6xl mb-3">{nftAttributes.badge}</div>
              <h1 className={`text-4xl font-black mb-2 bg-gradient-to-r ${nftAttributes.palette.accent} bg-clip-text text-transparent`}>
                {nftAttributes.rarity.toUpperCase()}
              </h1>
              <p className="text-white/70 text-xs font-mono">
                {address ? `${address.substring(0, 10)}...${address.substring(address.length - 8)}` : '0x1234...5678'}
              </p>
            </div>

            {/* Main Health Score - NFT Style */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent blur-xl"></div>
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-white/30">
                <div className="text-center">
                  <div className="text-white/70 text-xs uppercase tracking-wider mb-2">Health Score</div>
                  <div className="flex items-center justify-center gap-2">
                    <div className={`text-7xl font-black bg-gradient-to-br ${nftAttributes.palette.accent} bg-clip-text text-transparent`}>
                      {safeHealthScore}
                    </div>
                    <div className="text-3xl text-white/80 font-bold">/100</div>
                  </div>
                  <div className="mt-2 text-sm font-bold text-white/90">{status.emoji} {status.label}</div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-white/20 rounded-full h-3 mt-4 overflow-hidden">
                    <div
                      className={`h-3 rounded-full bg-gradient-to-r ${nftAttributes.palette.accent} transition-all duration-1000`}
                      style={{ width: `${safeHealthScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <div className="text-white/60 text-xs mb-1">Balance</div>
                <div className="text-xl font-bold">{stats?.totalBalance.toFixed(3)} ETH</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <div className="text-white/60 text-xs mb-1">Transactions</div>
                <div className="text-xl font-bold">{stats?.totalTransactions || 0}</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <div className="text-white/60 text-xs mb-1">Age (Days)</div>
                <div className="text-xl font-bold">{stats?.walletAge || 0}</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <div className="text-white/60 text-xs mb-1">Chains</div>
                <div className="text-xl font-bold">{stats?.balanceByChain?.length || 3}</div>
              </div>
            </div>

            {/* NFT Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/20">
              <div>
                <div className="text-xs text-white/60">Edition</div>
                <div className="text-sm font-bold">{nftAttributes.edition}</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-black">LAMPFI</div>
                <div className="text-xs text-white/70">Prosperity NFT</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-white/60">ID</div>
                <div className="text-sm font-bold font-mono">{nftAttributes.uniqueId}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-gradient-to-br from-lamp-purple-900/40 to-lamp-magenta-900/40 border border-lamp-purple-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <span className="text-3xl">🪔</span>
            <div>
              <p className="text-sm font-bold text-lamp-gold-400 mb-1">Unique Mystical Art</p>
              <p className="text-xs text-lamp-purple-200">
                Each prosperity score generates a unique NFT with mystical colors, patterns, and rarity based on your lamp's activity!
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gradient-to-br from-lamp-teal-900/40 to-lamp-teal-800/40 border border-lamp-teal-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <span className="text-3xl">✨</span>
            <div>
              <p className="text-sm font-bold text-lamp-gold-400 mb-1">Share Your Prosperity</p>
              <p className="text-xs text-lamp-purple-200">
                Download your NFT and share it on Twitter, Discord, Telegram, or use it as your PFP to show off your mystical prosperity!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioImageGenerator;

