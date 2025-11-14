import React from 'react';

const HowToUse = () => {
  const steps = [
    {
      number: 1,
      title: "Connect Your Wallet",
      description: "Click the 'Connect Wallet' button and approve MetaMask connection (Testnet Mode).",
      details: [
        "Make sure MetaMask is installed in your browser",
        "Switch to Sepolia testnet (ETH, Base, or Arbitrum)",
        "Approve the connection request (read-only access)",
        "Get free test ETH from faucets if needed"
      ],
      icon: "🔗"
    },
    {
      number: 2,
      title: "Check Your Portfolio Health",
      description: "View your Portfolio Overview page to see complete wallet stats and health score.",
      details: [
        "See your total balance across Sepolia testnets",
        "View last 20 transactions with chain filtering",
        "Check your Portfolio Health Score (0-100)",
        "Generate and share portfolio health images"
      ],
      icon: "📊"
    },
    {
      number: 3,
      title: "Optimize Your Yields",
      description: "Go to the Yield Optimizer to find better DeFi opportunities.",
      details: [
        "We scan 200+ DeFi protocols on multiple chains",
        "AI scores each migration opportunity from 0-100",
        "See potential annual gains and breakeven time",
        "Migration costs (bridge + gas fees) are estimated"
      ],
      icon: "🤖"
    },
    {
      number: 4,
      title: "Review Migration Details",
      description: "Click 'View Full Details' to see comprehensive migration information.",
      details: [
        "Compare current vs target APY side-by-side",
        "See detailed cost breakdown",
        "Check protocol safety scores",
        "Read step-by-step migration instructions"
      ],
      icon: "🔍"
    },
    {
      number: 5,
      title: "Execute Migration",
      description: "Follow the guided steps to migrate your assets to better yields.",
      details: [
        "Each step is explained clearly",
        "Bridge routes are pre-selected for you",
        "Gas optimization tips included",
        "Safety checks at every step"
      ],
      icon: "✅"
    },
    {
      number: 6,
      title: "Ask Gennie for Help",
      description: "Need assistance? Click Gennie (our AI chatbot) 3 times to get instant answers.",
      details: [
        "Gennie knows everything about YieldShift",
        "Ask about features, DeFi terms, or troubleshooting",
        "Get step-by-step guidance on any task",
        "Available 24/7 in the bottom right corner"
      ],
      icon: "🤖"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Title */}
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">How to Use YieldShift</h1>
        <p className="text-lg text-gray-600">Master YieldShift in 6 simple steps</p>
        </div>

        {/* Introduction */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8 mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            Welcome to YieldShift!
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
            YieldShift is your AI-powered companion for maximizing DeFi yields.
            We analyze your positions across 200+ protocols and recommend the best
            opportunities to increase your returns while minimizing risks.
          </p>
        </div>

        {/* Getting Started Video/Demo */}
        {/* <div className="card mb-12 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🎬</span>
            <h3 className="text-2xl font-bold text-gray-900">Quick Start Guide</h3>
          </div>
          <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
            <p className="text-6xl mb-4">▶️</p>
            <p className="text-gray-700 mb-4">Watch our 2-minute tutorial</p>
            <button className="btn-primary">
              Play Video Tutorial
            </button>
          </div>
        </div> */}

        {/* Step-by-Step Guide */}
      <div className="space-y-6 mb-12">
          {steps.map((step) => (
            <div
              key={step.number}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex gap-6">
                {/* Step Number */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/50">
                    <span className="text-3xl font-extrabold text-white">{step.number}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{step.icon}</span>
                    <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-gray-700 text-lg mb-4">{step.description}</p>

                  {/* Details */}
                  <ul className="space-y-2">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-green-600 mt-1">✓</span>
                        <span className="text-gray-600">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tips & Best Practices */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">💡</span>
            <h3 className="text-2xl font-bold text-gray-900">Pro Tips</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <h4 className="font-bold text-lg text-green-600 mb-2">💧 Use Testnet Mode</h4>
              <p className="text-gray-700 text-sm">
                YieldShift runs on Sepolia testnets! Get free test ETH from faucets to practice without risking real funds.
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <h4 className="font-bold text-lg text-green-600 mb-2">📸 Share Your Health</h4>
              <p className="text-gray-700 text-sm">
                Generate and download portfolio health images to track your progress or share with the community!
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <h4 className="font-bold text-lg text-green-600 mb-2">📊 Consider Breakeven</h4>
              <p className="text-gray-700 text-sm">
                Always check the breakeven time. If you're planning to hold for less time, it might not be worth migrating.
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <h4 className="font-bold text-lg text-green-600 mb-2">🔒 Safety First</h4>
              <p className="text-gray-700 text-sm">
                Pay attention to protocol safety scores. A slightly lower APY on a safer protocol might be better.
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <h4 className="font-bold text-lg text-green-600 mb-2">💸 Gas Optimization</h4>
              <p className="text-gray-700 text-sm">
                Migrate during off-peak hours to save on gas fees. We show you the best timing!
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <h4 className="font-bold text-lg text-green-600 mb-2">🤖 Ask Gennie</h4>
              <p className="text-gray-700 text-sm">
                Click Gennie 3 times to activate the chatbot. She can answer any questions about YieldShift instantly!
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">❓</span>
            <h3 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h3>
          </div>
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h4 className="font-bold text-lg text-gray-900 mb-2">Is my wallet safe?</h4>
              <p className="text-gray-700">
                Yes! We only request read-only access to view your positions. We never have access to your funds or private keys.
              </p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h4 className="font-bold text-lg text-gray-900 mb-2">Why is YieldShift on testnets?</h4>
              <p className="text-gray-700">
                We run on Sepolia testnets (Ethereum, Base, Arbitrum) so you can practice and test without using real funds. Get free test ETH from faucets linked in the Portfolio page!
              </p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h4 className="font-bold text-lg text-gray-900 mb-2">How do I get test ETH?</h4>
              <p className="text-gray-700">
                Visit the faucet links in the Portfolio Overview page. You can get free test ETH for Sepolia, Base Sepolia, and Arbitrum Sepolia. No real money needed!
              </p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h4 className="font-bold text-lg text-gray-900 mb-2">What is Portfolio Health Score?</h4>
              <p className="text-gray-700">
                It's a 0-100 score based on your balance, transaction activity, wallet age, and diversity. Higher scores indicate a more active and healthy portfolio.
              </p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h4 className="font-bold text-lg text-gray-900 mb-2">How accurate are the APY predictions?</h4>
              <p className="text-gray-700">
                Our AI model is trained on 6+ months of historical data with 87% accuracy. However, DeFi yields can change rapidly, so always verify before migrating.
              </p>
            </div>
            <div className="pb-4">
              <h4 className="font-bold text-lg text-gray-900 mb-2">Do you charge any fees?</h4>
              <p className="text-gray-700">
                YieldShift is completely free to use! You only pay the standard blockchain fees (gas + bridge fees) when executing migrations.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white shadow-xl">
        <div className="text-5xl mb-4">🚀</div>
        <h3 className="text-3xl font-bold mb-3">Ready to Optimize Your Yields?</h3>
        <p className="text-xl mb-6 text-blue-100">
            Connect your wallet now and discover better opportunities!
          </p>
        <a
          href="#home"
          className="inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all hover:scale-105 shadow-lg"
        >
          <span>Get Started Now</span>
          <span className="text-2xl">→</span>
        </a>
      </div>
    </div>
  );
};

export default HowToUse;

