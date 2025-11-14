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

  // Navigation component - Apple style
  const Navigation = () => (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm'
        : 'bg-white/80 backdrop-blur-md border-b border-gray-200/50'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-12">
          {/* Left Navigation */}
          <nav className="flex items-center gap-6">
            <a
              href="#home"
              className={`text-sm font-medium transition-colors ${currentPage === 'home'
                ? 'text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Home
            </a>
            {isConnected && (
              <>
                <a
                  href="#portfolio"
                  className={`text-sm font-medium transition-colors ${currentPage === 'portfolio'
                    ? 'text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Portfolio
                </a>
                <a
                  href="#dashboard"
                  className={`text-sm font-medium transition-colors ${currentPage === 'dashboard'
                    ? 'text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Optimize
                </a>
              </>
            )}
            <a
              href="#how-to-use"
              className={`text-sm font-medium transition-colors ${currentPage === 'how-to-use'
                ? 'text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              How to Use
            </a>
            <a
              href="#vocabulary"
              className={`text-sm font-medium transition-colors ${currentPage === 'vocabulary'
                ? 'text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Vocabulary
            </a>
          </nav>

          {/* Center Logo */}
          {/* <a
            href="#home"
            className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2 transition-all duration-300"
          >
            <span className="text-2xl">🎯</span>
            <span className="text-lg font-semibold text-gray-900">YieldShift</span>
          </a> */}

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
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main className="pt-16">
              <PortfolioOverview />
            </main>
          </div>
        );
      case 'dashboard':
        return (
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main className="pt-16">
              <Dashboard />
            </main>
          </div>
        );
      case 'how-to-use':
        return (
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main className="pt-16">
              <HowToUse />
            </main>
          </div>
        );
      case 'vocabulary':
        return (
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main className="pt-16">
              <Vocabulary />
            </main>
          </div>
        );
      case 'home':
      default:
        return (
          <div className="min-h-screen bg-white">
            <Navigation />
            <main className="pt-12">
              {/* Hero Section - Apple Style */}
              <section className="max-w-5xl mx-auto px-6 py-20 text-center">
                {/* Trust Badge */}
                <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full mb-8">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-sm font-medium text-green-700">Read-only • 100% Safe</span>
                </div>

                {/* Hero Headline - Apple Style */}
                <h1 className="text-7xl md:text-8xl font-semibold tracking-tight text-gray-900 mb-6 leading-none">
                  Stop losing
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    on yields.
                  </span>
                </h1>

                <p className="text-2xl md:text-3xl text-gray-600 font-light mb-12 max-w-3xl mx-auto leading-snug">
                  AI-powered DeFi optimizer. Find better yields across 200+ protocols in 3 seconds.
                </p>

                {/* CTA */}
                <div className="flex flex-col items-center gap-4 mb-8">
                  {!isConnected ? (
                    <>
                      <WalletConnect />
                      <p className="text-sm text-gray-500">No wallet? Explore demo mode</p>
                    </>
                  ) : (
                    <button
                      onClick={goToPortfolio}
                      className="px-8 py-4 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-all text-lg flex items-center gap-2"
                    >
                      View My Portfolio
                      <span>→</span>
                    </button>
                  )}
                </div>

                {/* Quick Stats - Minimal */}
                <div className="flex justify-center gap-12 mt-16 text-sm text-gray-500">
                  <div>
                    <div className="text-2xl font-semibold text-gray-900">30-40%</div>
                    <div>More Yield</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-gray-900">200+</div>
                    <div>Protocols</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-gray-900">3 sec</div>
                    <div>Analysis</div>
                  </div>
                </div>
              </section>

              {/* Visual Separator */}
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent max-w-6xl mx-auto mb-20"></div>

              {/* Features Section - Apple Style */}
              <section className="max-w-6xl mx-auto px-6 mb-32">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <span className="text-3xl">🔍</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Instant Detection</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Scans your wallet in under 3 seconds and spots underperforming positions automatically
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <span className="text-3xl">🤖</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Powered</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Compares against 200+ protocols across Ethereum, Base, and Arbitrum testnets
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <span className="text-3xl">⚡</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Scored</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Every opportunity gets a 0-100 score with transparent cost breakdown
                    </p>
                  </div>
                </div>
              </section>

              {/* How It Works - Apple Style */}
              <section className="bg-gray-50 py-20">
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
              </section>

                {/* Final CTA with Social Proof */}
                {/* <div className="card-premium max-w-2xl mx-auto text-center">
                    <div className="text-5xl mb-4">🚀</div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                      Start Earning More Today
                    </h3>
                    <p className="text-lg text-gray-700 mb-6">
                      Join farmers already earning 30-40% more yield
                    </p>
                    <div className="mb-6">
                      <WalletConnect />
                    </div>
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-700 bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Free to use</span>
                      </div>
                      <div className="w-px h-4 bg-gray-300"></div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Read-only</span>
                      </div>
                      <div className="w-px h-4 bg-gray-300"></div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span>No risk</span>
                      </div>
                    </div>
                  </div> */}
              </div>
            </main>

            {/* Final CTA - Apple Style */}
            <section className="bg-white py-20">
              <div className="max-w-4xl mx-auto px-6 text-center">
                <h2 className="text-5xl font-semibold text-gray-900 mb-6">
                  Ready to optimize?
                </h2>
                <p className="text-xl text-gray-600 mb-12">
                  Connect your wallet and find better yields in seconds.
                </p>
                {!isConnected ? (
                  <div className="flex flex-col items-center gap-4">
                    <WalletConnect />
                    <p className="text-sm text-gray-500">Free • Read-only • No risk</p>
                  </div>
                ) : (
                  <button
                    onClick={goToPortfolio}
                    className="px-8 py-4 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-all text-lg flex items-center gap-2 mx-auto"
                  >
                    View My Portfolio
                    <span>→</span>
                  </button>
                )}
              </div>
            </section>

            {/* Footer - Apple Style */}
            <footer className="bg-gray-50 border-t border-gray-200">
              <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">YieldShift</h3>
                    <p className="text-sm text-gray-600">
                      AI-powered DeFi optimizer for smarter yields
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Learn</h3>
                    <div className="space-y-2">
                      <a href="#how-to-use" className="block text-sm text-gray-600 hover:text-gray-900">
                        How to Use
                      </a>
                      <a href="#vocabulary" className="block text-sm text-gray-600 hover:text-gray-900">
                        Vocabulary
                      </a>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Testnets</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>⟠ Sepolia</div>
                      <div>🔵 Base Sepolia</div>
                      <div>🔷 Arbitrum Sepolia</div>
                    </div>
                  </div>
                </div>
                <div className="pt-8 border-t border-gray-200">
                  <p className="text-center text-sm text-gray-500">
                    Data from DefiLlama • Always do your own research
                  </p>
                  <p className="text-center text-xs text-gray-400 mt-2">
                    Built for DeFi optimizers • © 2025 YieldShift
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

