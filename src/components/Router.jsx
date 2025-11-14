import React from 'react';
import { useWallet } from '../hooks/useWallet';
import WalletConnect from './WalletConnect';
import Dashboard from './Dashboard';
import HowToUse from '../pages/HowToUse';
import Vocabulary from '../pages/Vocabulary';

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
              Dashboard
            </a>
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
            {/* <a
              href="#vocabulary"
              className={`text-sm font-medium transition-colors ${currentPage === 'vocabulary'
                ? 'text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Vocabulary
            </a> */}
            {currentPage === 'home' && <WalletConnect />}
          </div>
        </div>
      </div>
    </header>
  );

  // Render current page
  const renderPage = () => {
    switch (currentPage) {
      case 'how-to-use':
        return (
          <>
            <Navigation />
            <HowToUse />
          </>
        );
      case 'vocabulary':
        return (
          <>
            <Navigation />
            <Vocabulary />
          </>
        );
      case 'home':
      default:
        return (
          <div className="min-h-screen gradient-bg">
            <Navigation />
            <main className="pt-12">
              {!isConnected ? (
                <div className="max-w-6xl mx-auto px-4 py-12">
                  {/* Hero Section with Instant Value */}
                  <div className="text-center mb-16 slide-up">
                    {/* Trust Badge */}
                    <div className="inline-flex items-center gap-2 bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Read-only • 100% Safe • No Signatures Required
                    </div>

                    <h2 className="text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                      You're Likely Losing
                      <span className="block bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mt-2">
                        $2,000+ Per Year
                      </span>
                    </h2>

                    <p className="text-2xl text-gray-700 mb-3 font-medium">
                      in missed DeFi yields across chains
                    </p>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                      YieldShift finds better opportunities in 3 seconds. No monitoring, no stress, just optimized returns.
                    </p>

                    {/* Value Prop Stats */}
                    <div className="flex justify-center gap-8 mt-8 mb-10">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">30-40%</div>
                        <div className="text-sm text-gray-600">More Yield</div>
                      </div>
                      <div className="w-px bg-gray-300"></div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">200+</div>
                        <div className="text-sm text-gray-600">Protocols</div>
                      </div>
                      <div className="w-px bg-gray-300"></div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">3 sec</div>
                        <div className="text-sm text-gray-600">Analysis</div>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                      <WalletConnect />
                      <p className="text-sm text-gray-500">
                        Works in demo mode • No wallet required to explore
                      </p>
                    </div>
                  </div>

                  {/* Features with Progressive Disclosure */}
                  <div className="grid md:grid-cols-3 gap-6 mb-16 fade-in">
                    <div className="card-premium group hover:scale-105 transition-transform">
                      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🔍</div>
                      <h3 className="font-bold text-xl mb-3 text-gray-900">Instant Detection</h3>
                      <p className="text-gray-700 leading-relaxed">
                        Scans your wallet in <span className="font-semibold text-blue-600">under 3 seconds</span> and spots underperforming positions automatically
                      </p>
                      <div className="mt-4 text-sm text-blue-600 font-semibold">→ No manual work required</div>
                    </div>
                    <div className="card-premium group hover:scale-105 transition-transform">
                      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🤖</div>
                      <h3 className="font-bold text-xl mb-3 text-gray-900">AI-Powered Matching</h3>
                      <p className="text-gray-700 leading-relaxed">
                        Compares your positions against <span className="font-semibold text-blue-600">200+ protocols</span> across Ethereum, Base, and Arbitrum
                      </p>
                      <div className="mt-4 text-sm text-blue-600 font-semibold">→ Always finds the best yield</div>
                    </div>
                    <div className="card-premium group hover:scale-105 transition-transform">
                      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">⚡</div>
                      <h3 className="font-bold text-xl mb-3 text-gray-900">Scored Recommendations</h3>
                      <p className="text-gray-700 leading-relaxed">
                        Every opportunity gets a <span className="font-semibold text-blue-600">0-100 score</span> with transparent cost breakdown and timing
                      </p>
                      <div className="mt-4 text-sm text-blue-600 font-semibold">→ Make confident decisions</div>
                    </div>
                  </div>

                  {/* How It Works - Clear & Simple */}
                  <div className="max-w-3xl mx-auto mb-8">
                    <h3 className="font-bold text-3xl mb-10 text-center text-gray-900">
                      Get Optimized in <span className="text-blue-600">3 Simple Steps</span>
                    </h3>
                    <div className="space-y-6">
                      <div className="flex gap-6 items-start bg-white border border-gray-200 p-6 rounded-xl hover:shadow-lg transition-shadow">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-xl shadow-md">
                          1
                        </div>
                        <div>
                          <h4 className="font-bold text-xl text-gray-900 mb-2">Connect Wallet</h4>
                          <p className="text-gray-700 leading-relaxed">
                            One click. We scan your positions across Ethereum, Base, and Arbitrum.
                            <span className="text-green-600 font-semibold"> Takes 3 seconds.</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-6 items-start bg-white border border-gray-200 p-6 rounded-xl hover:shadow-lg transition-shadow">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-xl shadow-md">
                          2
                        </div>
                        <div>
                          <h4 className="font-bold text-xl text-gray-900 mb-2">Review Opportunities</h4>
                          <p className="text-gray-700 leading-relaxed">
                            See exactly how much you can earn with migration scores, cost breakdowns, and timing advice.
                            <span className="text-blue-600 font-semibold"> All transparent.</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-6 items-start bg-white border border-gray-200 p-6 rounded-xl hover:shadow-lg transition-shadow">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg flex items-center justify-center font-bold text-xl shadow-md">
                          3
                        </div>
                        <div>
                          <h4 className="font-bold text-xl text-gray-900 mb-2">Follow Simple Steps</h4>
                          <p className="text-gray-700 leading-relaxed">
                            Get clear migration instructions. Execute when you're ready.
                            <span className="text-green-600 font-semibold"> You're always in control.</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

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
              ) : (
                <Dashboard />
              )}
            </main>

            {/* Footer */}
            {!isConnected && (
              <footer className="bg-white border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-8">
                  <div className="text-center mb-6">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Built for DeFi farmers who refuse to leave money on the table
                    </p>
                    <div className="flex justify-center gap-6 text-xs text-gray-600 mb-4">
                      <span>🔗 Ethereum</span>
                      <span>🔗 Base</span>
                      <span>🔗 Arbitrum</span>
                    </div>
                    <div className="flex justify-center gap-6 text-sm">
                      <a href="#how-to-use" className="text-blue-600 hover:text-blue-700 transition-colors">
                        📖 How to Use
                      </a>
                      <a href="#vocabulary" className="text-blue-600 hover:text-blue-700 transition-colors">
                        📚 Vocabulary
                      </a>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      Data from DefiLlama • Always do your own research
                    </p>
                  </div>
                </div>
              </footer>
            )}
          </div>
        );
    }
  };

  return renderPage();
};

export default Router;

