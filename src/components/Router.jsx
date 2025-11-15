import React from 'react';
import { useWallet } from '../hooks/useWallet';
import WalletConnect from './WalletConnect';
import Dashboard from './Dashboard';
import PortfolioOverview from '../pages/PortfolioOverview';
import HowToUse from '../pages/HowToUse';
import Vocabulary from '../pages/Vocabulary';
import Gennie from './Gennie';

const Router = () => {
  const { isConnected } = useWallet();
  const [currentPage, setCurrentPage] = React.useState('home');
  const [scrolled, setScrolled] = React.useState(false);

  // Simple hash-based routing
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'home';
      setCurrentPage(hash);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Navigate to portfolio
  const goToPortfolio = () => {
    window.location.hash = 'portfolio';
  };

  // Scroll detection for header
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation component - Magical LampFi style
  const Navigation = () => (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-lamp-night-900/95 backdrop-blur-xl border-b border-lamp-purple-500/30 shadow-lg shadow-lamp-purple-900/50'
        : 'bg-lamp-night-900/80 backdrop-blur-md border-b border-lamp-purple-500/20'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Left - Logo */}
          <a
            href="#home"
            className="flex items-center gap-2 transition-all duration-300 hover:scale-105"
          >
            <span className="text-3xl animate-float">🪔</span>
            <span className="text-xl font-bold bg-gradient-to-r from-lamp-gold-400 to-lamp-gold-500 bg-clip-text text-transparent">
              LampFi
            </span>
          </a>

          {/* Center Navigation */}
          <nav className="flex items-center gap-6">
            <a
              href="#home"
              className={`text-sm font-medium transition-all ${currentPage === 'home'
                ? 'text-lamp-gold-400'
                : 'text-lamp-purple-200 hover:text-lamp-gold-300'
                }`}
            >
              Home
            </a>
            {isConnected && (
              <>
                <a
                  href="#portfolio"
                  className={`text-sm font-medium transition-all ${currentPage === 'portfolio'
                    ? 'text-lamp-gold-400'
                    : 'text-lamp-purple-200 hover:text-lamp-gold-300'
                    }`}
                >
                  Treasure Vault
                </a>
                <a
                  href="#dashboard"
                  className={`text-sm font-medium transition-all ${currentPage === 'dashboard'
                    ? 'text-lamp-gold-400'
                    : 'text-lamp-purple-200 hover:text-lamp-gold-300'
                    }`}
                >
                  Summon Genie
                </a>
              </>
            )}
            <a
              href="#how-to-use"
              className={`text-sm font-medium transition-all ${currentPage === 'how-to-use'
                ? 'text-lamp-gold-400'
                : 'text-lamp-purple-200 hover:text-lamp-gold-300'
                }`}
            >
              Genie's Guide
            </a>
            <a
              href="#vocabulary"
              className={`text-sm font-medium transition-all ${currentPage === 'vocabulary'
                ? 'text-lamp-gold-400'
                : 'text-lamp-purple-200 hover:text-lamp-gold-300'
                }`}
            >
              Mystical Terms
            </a>
          </nav>

          {/* Right Navigation & Wallet */}
          <div className="flex items-center gap-6">
            <WalletConnect />
          </div>
        </div>
      </div>
    </header>
  );

  // Render current page
  const renderPage = () => {
    switch (currentPage) {
      case 'portfolio':
        return (
          <div className="min-h-screen bg-mystical-night">
            <Navigation />
            <main className="pt-16">
              <PortfolioOverview />
            </main>
          </div>
        );
      case 'dashboard':
        return (
          <div className="min-h-screen bg-mystical-night">
            <Navigation />
            <main className="pt-16">
              <Dashboard />
            </main>
          </div>
        );
      case 'how-to-use':
        return (
          <div className="min-h-screen bg-mystical-night">
            <Navigation />
            <main className="pt-16">
              <HowToUse />
            </main>
          </div>
        );
      case 'vocabulary':
        return (
          <div className="min-h-screen bg-mystical-night">
            <Navigation />
            <main className="pt-16">
              <Vocabulary />
            </main>
          </div>
        );
      case 'home':
      default:
        return (
          <div className="min-h-screen bg-mystical-night relative overflow-hidden">
            {/* Magical Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-20 left-10 w-64 h-64 bg-lamp-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-20 right-10 w-96 h-96 bg-lamp-magenta-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-lamp-gold-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <Navigation />
            <main className="pt-14 relative z-10">
              {/* Hero Section - Magical Lamp Theme */}
              <section className="max-w-6xl mx-auto px-6 py-20 text-center relative">
                {/* Trust Badge */}
                <div className="inline-flex items-center gap-2 bg-lamp-teal-500/20 backdrop-blur-sm px-4 py-2 rounded-full mb-8 border border-lamp-teal-400/30 animate-float">
                  <span className="w-2 h-2 bg-lamp-teal-400 rounded-full animate-pulse"></span>
                  <span className="text-sm font-medium text-lamp-teal-300">Read-only • 100% Safe • Magical</span>
                </div>

                {/* Lamp Image Container */}
                <div className="relative mb-8 flex justify-center">
                  <div className="relative">
                    {/* Glow effect behind lamp */}
                    <div className="absolute inset-0 bg-lamp-glow blur-3xl animate-glow"></div>
                    {/* Lamp placeholder - User will add their image here */}
                    <div className="relative w-64 h-64 mx-auto">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-9xl animate-float">🪔</span>
                      </div>
                      {/* Sparkles around lamp */}
                      <span className="absolute top-0 right-0 text-3xl animate-sparkle">✨</span>
                      <span className="absolute top-10 left-0 text-2xl animate-sparkle" style={{ animationDelay: '0.5s' }}>✨</span>
                      <span className="absolute bottom-10 right-10 text-2xl animate-sparkle" style={{ animationDelay: '1s' }}>✨</span>
                    </div>
                  </div>
                </div>

                {/* Hero Headline - Magical Style */}
                <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6 leading-none">
                  <span className="text-white">Your Wishes,</span>
                  <br />
                  <span className="bg-gradient-to-r from-lamp-gold-400 via-lamp-gold-300 to-lamp-gold-500 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
                    Our Command
                  </span>
                </h1>

                <p className="text-xl md:text-2xl text-lamp-purple-200 font-light mb-12 max-w-3xl mx-auto leading-relaxed">
                  Summon the Genie to unlock prosperity. AI-powered magic finds you 30-40% better yields across 200+ protocols in 3 seconds. ✨
                </p>

                {/* CTA */}
                <div className="flex flex-col items-center gap-4 mb-12">
                  {!isConnected ? (
                    <>
                      <WalletConnect />
                      <p className="text-sm text-lamp-purple-300">No lamp yet? Explore the magic in demo mode</p>
                    </>
                  ) : (
                    <button
                      onClick={goToPortfolio}
                      className="px-10 py-4 bg-gradient-to-r from-lamp-gold-500 to-lamp-gold-600 hover:from-lamp-gold-400 hover:to-lamp-gold-500 text-lamp-night-950 font-bold rounded-full transition-all text-lg flex items-center gap-2 shadow-2xl shadow-lamp-gold-600/50 hover:scale-105 hover:shadow-lamp-gold-500/70"
                    >
                      <span>🪔</span>
                      Open My Treasure Vault
                      <span>✨</span>
                    </button>
                  )}
                </div>

                {/* Quick Stats - Magical */}
                <div className="flex justify-center gap-8 md:gap-16 mt-16">
                  <div className="card-premium p-6 min-w-[140px]">
                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-lamp-gold-400 to-lamp-gold-500 bg-clip-text text-transparent mb-2">30-40%</div>
                    <div className="text-sm text-lamp-purple-300">More Prosperity</div>
                  </div>
                  <div className="card-premium p-6 min-w-[140px]">
                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-lamp-magenta-400 to-lamp-purple-400 bg-clip-text text-transparent mb-2">200+</div>
                    <div className="text-sm text-lamp-purple-300">Magical Pools</div>
                  </div>
                  <div className="card-premium p-6 min-w-[140px]">
                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-lamp-teal-400 to-lamp-teal-500 bg-clip-text text-transparent mb-2">3 sec</div>
                    <div className="text-sm text-lamp-purple-300">Genie Speed</div>
                  </div>
                </div>
              </section>

              {/* Visual Separator */}
              <div className="h-px bg-gradient-to-r from-transparent via-lamp-purple-500/50 to-transparent max-w-6xl mx-auto mb-20"></div>

              {/* Features Section - Magical Powers */}
              <section className="max-w-6xl mx-auto px-6 mb-32">
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-lamp-gold-400 to-lamp-gold-500 bg-clip-text text-transparent">
                  Three Wishes, Infinite Prosperity
                </h2>
                <p className="text-center text-lamp-purple-200 mb-16 text-lg">
                  The Genie grants you three magical powers to grow your wealth
                </p>
                
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="card text-center group hover:scale-105 transition-all duration-300">
                    <div className="w-20 h-20 bg-gradient-to-br from-lamp-purple-600 to-lamp-magenta-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-lamp-purple-600/50 group-hover:shadow-xl group-hover:shadow-lamp-purple-500/70 transition-all">
                      <span className="text-4xl">🔮</span>
                    </div>
                    <h3 className="text-2xl font-bold text-lamp-gold-400 mb-3">Mystical Vision</h3>
                    <p className="text-lamp-purple-200 leading-relaxed">
                      The Genie peers into your treasure vault in 3 seconds, revealing hidden opportunities for prosperity
                    </p>
                  </div>
                  
                  <div className="card text-center group hover:scale-105 transition-all duration-300">
                    <div className="w-20 h-20 bg-gradient-to-br from-lamp-gold-500 to-lamp-gold-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-lamp-gold-600/50 group-hover:shadow-xl group-hover:shadow-lamp-gold-500/70 transition-all">
                      <span className="text-4xl">🧞</span>
                    </div>
                    <h3 className="text-2xl font-bold text-lamp-gold-400 mb-3">Genie's Wisdom</h3>
                    <p className="text-lamp-purple-200 leading-relaxed">
                      Ancient AI magic compares 200+ enchanted pools across mystical chains to grant your wishes
                    </p>
                  </div>
                  
                  <div className="card text-center group hover:scale-105 transition-all duration-300">
                    <div className="w-20 h-20 bg-gradient-to-br from-lamp-teal-500 to-lamp-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-lamp-teal-600/50 group-hover:shadow-xl group-hover:shadow-lamp-teal-500/70 transition-all">
                      <span className="text-4xl">✨</span>
                    </div>
                    <h3 className="text-2xl font-bold text-lamp-gold-400 mb-3">Wish Fulfillment</h3>
                    <p className="text-lamp-purple-200 leading-relaxed">
                      Every wish receives a magical score (0-100) with transparent costs and guaranteed prosperity
                    </p>
                  </div>
                </div>
              </section>

              {/* How It Works - Apple Style */}
              {/* <section className="bg-gray-50 py-20">
                <div className="max-w-4xl mx-auto px-6">
                  <h2 className="text-5xl font-semibold text-center text-gray-900 mb-16">
                    How it works
                  </h2>
                  
                  <div className="space-y-16">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-semibold">
                          1
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-3">Connect & Scan</h3>
                        <p className="text-xl text-gray-600 leading-relaxed">
                          One click to connect your wallet. We scan your positions across chains in 3 seconds.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 items-center">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-semibold">
                          2
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-3">Review Opportunities</h3>
                        <p className="text-xl text-gray-600 leading-relaxed">
                          See migration scores, cost breakdowns, and potential earnings. Everything transparent.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 items-center">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center text-white text-3xl font-semibold">
                          3
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-3">Optimize</h3>
                        <p className="text-xl text-gray-600 leading-relaxed">
                          Follow clear instructions to migrate. You're always in control.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section> */}
            </main>

            {/* Final CTA - Magical Call to Action */}
            <section className="relative py-20 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-lamp-night-900/50 to-lamp-purple-900/30"></div>
              <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                <div className="mb-6">
                  <span className="text-6xl animate-float">🪔</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-lamp-gold-400 to-lamp-gold-500 bg-clip-text text-transparent">
                    Ready to Make a Wish?
                  </span>
                </h2>
                <p className="text-xl text-lamp-purple-200 mb-12">
                  Rub the lamp and summon prosperity. Your journey to wealth begins now. ✨
                </p>
                {!isConnected ? (
                  <div className="flex flex-col items-center gap-4">
                    <WalletConnect />
                    <p className="text-sm text-lamp-purple-300">Free • Magical • Your wishes await</p>
                  </div>
                ) : (
                  <button
                    onClick={goToPortfolio}
                    className="px-10 py-4 bg-gradient-to-r from-lamp-gold-500 to-lamp-gold-600 hover:from-lamp-gold-400 hover:to-lamp-gold-500 text-lamp-night-950 font-bold rounded-full transition-all text-lg flex items-center gap-2 mx-auto shadow-2xl shadow-lamp-gold-600/50 hover:scale-105"
                  >
                    <span>🪔</span>
                    Enter the Treasure Vault
                    <span>✨</span>
                  </button>
                )}
              </div>
            </section>

            {/* Footer - Magical Theme */}
            <footer className="bg-lamp-night-950/80 border-t border-lamp-purple-500/30 backdrop-blur-xl">
              <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">🪔</span>
                      <h3 className="font-bold text-xl bg-gradient-to-r from-lamp-gold-400 to-lamp-gold-500 bg-clip-text text-transparent">
                        LampFi
                      </h3>
                    </div>
                    <p className="text-sm text-lamp-purple-300">
                      Your wishes, our command. Magical AI-powered prosperity for the modern Aladdin.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lamp-gold-400 mb-4">Mystical Knowledge</h3>
                    <div className="space-y-2">
                      <a href="#how-to-use" className="block text-sm text-lamp-purple-300 hover:text-lamp-gold-300 transition-colors">
                        Genie's Guide
                      </a>
                      <a href="#vocabulary" className="block text-sm text-lamp-purple-300 hover:text-lamp-gold-300 transition-colors">
                        Mystical Terms
                      </a>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lamp-gold-400 mb-4">Enchanted Realms</h3>
                    <div className="space-y-2 text-sm text-lamp-purple-300">
                      <div>⟠ Sepolia Realm</div>
                      <div>🔵 Base Sepolia Kingdom</div>
                      <div>🔷 Arbitrum Sepolia Empire</div>
                    </div>
                  </div>
                </div>
                <div className="pt-8 border-t border-lamp-purple-500/20">
                  <p className="text-center text-sm text-lamp-purple-400">
                    Powered by ancient DeFi magic • Always trust the Genie's wisdom
                  </p>
                  <p className="text-center text-xs text-lamp-purple-500 mt-2 flex items-center justify-center gap-2">
                    <span>✨</span>
                    Built for prosperity seekers • © 2025 LampFi
                    <span>✨</span>
                  </p>
                </div>
              </div>
            </footer>
          </div>
        );
    }
  };

  return (
    <>
      {renderPage()}
      <Gennie />
    </>
  );
};

export default Router;

