import React from 'react';

const HowToUse = () => {
  const steps = [
    {
      number: 1,
      title: "Connect Your Wallet",
      description: "Click the 'Connect Wallet' button and approve MetaMask connection.",
      details: [
        "Make sure MetaMask is installed in your browser",
        "Select the wallet you want to analyze",
        "Approve the connection request (read-only access)",
        "Your wallet address will appear in the header"
      ],
      icon: "🔗"
    },
    {
      number: 2,
      title: "View Your Portfolio",
      description: "YieldShift automatically detects all your DeFi positions across protocols.",
      details: [
        "We scan 200+ DeFi protocols on multiple chains",
        "All lending, staking, and liquidity positions are detected",
        "Current APYs and values are fetched in real-time",
        "Your total portfolio value is calculated instantly"
      ],
      icon: "📊"
    },
    {
      number: 3,
      title: "Analyze AI Recommendations",
      description: "Our AI engine analyzes your positions and finds better opportunities.",
      details: [
        "AI scores each migration opportunity from 0-100",
        "We calculate potential annual gains",
        "Migration costs (bridge + gas fees) are estimated",
        "Breakeven time shows when you start profiting"
      ],
      icon: "🤖"
    },
    {
      number: 4,
      title: "Review Details",
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
    }
  ];

  return (
    <div className="min-h-screen gradient-bg pt-12">
      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-3 flex items-center justify-center gap-3">
            <span className="text-5xl">📖</span>
            How to Use YieldShift
          </h1>
          <p className="text-gray-600">Master YieldShift in 5 simple steps</p>
        </div>
        {/* Introduction */}
        <div className="card-premium mb-12 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            Welcome to YieldShift! 👋
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
        <div className="space-y-8 mb-12">
          {steps.map((step) => (
            <div
              key={step.number}
              className="card hover:scale-[1.02] transition-all duration-300"
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
        <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">💡</span>
            <h3 className="text-2xl font-bold text-gray-900">Pro Tips</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <h4 className="font-bold text-lg text-green-600 mb-2">⏰ Check Regularly</h4>
              <p className="text-gray-700 text-sm">
                DeFi yields change constantly. Check YieldShift daily for new opportunities.
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
          </div>
        </div>

        {/* FAQ */}
        <div className="card mb-12">
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
              <h4 className="font-bold text-lg text-gray-900 mb-2">How accurate are the APY predictions?</h4>
              <p className="text-gray-700">
                Our AI model is trained on 6+ months of historical data with 87% accuracy. However, DeFi yields can change rapidly, so always verify before migrating.
              </p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h4 className="font-bold text-lg text-gray-900 mb-2">Do you charge any fees?</h4>
              <p className="text-gray-700">
                YieldShift is completely free to use! You only pay the standard blockchain fees (gas + bridge fees).
              </p>
            </div>
            <div className="pb-4">
              <h4 className="font-bold text-lg text-gray-900 mb-2">What chains do you support?</h4>
              <p className="text-gray-700">
                We currently support Ethereum, Arbitrum, Optimism, Polygon, and Base. More chains coming soon!
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="card-premium text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Optimize Your Yields?</h3>
          <p className="text-gray-700 mb-6 text-lg">
            Connect your wallet now and discover better opportunities!
          </p>
          <a href="/" className="btn-primary px-8 py-4 text-lg inline-block">
            🚀 Get Started Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default HowToUse;

