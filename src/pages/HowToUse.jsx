import React from 'react';

const HowToUse = () => {
  const steps = [
    {
      number: 1,
      title: "Summon Your Lamp",
      description: "Click 'Summon Your Lamp' and approve MetaMask connection to enter the mystical realm.",
      details: [
        "Make sure MetaMask is installed in your browser",
        "Switch to Sepolia mystical realm (ETH, Base, or Arbitrum)",
        "Approve the connection request (read-only access to your vault)",
        "Get free test ETH from enchanted faucets if needed"
      ],
      icon: "🪔"
    },
    {
      number: 2,
      title: "Discover Your Prosperity",
      description: "View your Treasure Vault page to see complete mystical stats and prosperity score.",
      details: [
        "See your total riches across Sepolia mystical realms",
        "View last 20 mystical transactions with realm filtering",
        "Check your Prosperity Score (0-100 blessing)",
        "Generate and share prosperity NFT images"
      ],
      icon: "💎"
    },
    {
      number: 3,
      title: "Grant Your Wishes",
      description: "Summon the Genie to discover prosperity wishes across mystical protocols.",
      details: [
        "The Genie scans 200+ mystical protocols across multiple realms",
        "AI wisdom scores each wish opportunity from 0-100",
        "See potential annual blessings and breakeven time",
        "Wish costs (bridge + mystical fees) are estimated"
      ],
      icon: "🧞"
    },
    {
      number: 4,
      title: "Examine the Wish",
      description: "Click 'View Wish Details' to peer into comprehensive wish information.",
      details: [
        "Compare current vs target blessings side-by-side",
        "See detailed mystical cost breakdown",
        "Check protocol safety enchantments",
        "Read step-by-step wish granting instructions"
      ],
      icon: "🔮"
    },
    {
      number: 5,
      title: "Grant the Wish",
      description: "Follow the Genie's guidance to grant wishes and move your treasures to greater prosperity.",
      details: [
        "Each step is explained with mystical clarity",
        "Bridge routes are pre-selected by the Genie",
        "Mystical fee optimization tips included",
        "Safety enchantments at every step"
      ],
      icon: "✨"
    },
    {
      number: 6,
      title: "Seek the Genie's Wisdom",
      description: "Need assistance? Click the Genie 3 times to summon instant mystical guidance.",
      details: [
        "The Genie knows everything about LampFi",
        "Ask about features, mystical terms, or troubleshooting",
        "Get step-by-step guidance on any mystical task",
        "Available 24/7 in the bottom right corner"
      ],
      icon: "🧞"
    }
  ];

  return (
    <div className="min-h-screen bg-mystical-night">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Title */}
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-lamp-gold-400 to-lamp-gold-500 bg-clip-text text-transparent mb-2">🧞 Genie's Guide to LampFi</h1>
        <p className="text-lg text-lamp-purple-200">Master the art of prosperity in 6 mystical steps ✨</p>
        </div>

        {/* Introduction */}
      <div className="bg-gradient-to-br from-lamp-purple-900/40 to-lamp-magenta-900/40 border border-lamp-purple-500/30 rounded-xl p-8 mb-8 text-center">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-lamp-gold-400 to-lamp-gold-500 bg-clip-text text-transparent mb-4">
            Welcome to LampFi! 🪔
          </h2>
          <p className="text-lg text-lamp-purple-200 leading-relaxed max-w-3xl mx-auto">
            LampFi is your mystical companion for maximizing DeFi prosperity.
            The Genie analyzes your treasures across 200+ protocols and reveals the best
            wishes to increase your blessings while protecting your vault.
          </p>
        </div>

        {/* Getting Started Video/Demo */}
        {/* <div className="card mb-12 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🎬</span>
            <h3 className="text-2xl font-bold text-lamp-gold-400">Quick Start Guide</h3>
          </div>
          <div className="card rounded-xl p-8 text-center ">
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
            className="card rounded-xl p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex gap-6">
                {/* Step Number */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-lamp-purple-600 to-lamp-magenta-600 rounded-2xl flex items-center justify-center shadow-lg shadow-lamp-purple-500/50">
                    <span className="text-3xl font-extrabold text-white">{step.number}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{step.icon}</span>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-lamp-gold-400 to-lamp-gold-500 bg-clip-text text-transparent">{step.title}</h3>
                  </div>
                  <p className="text-lamp-purple-200 text-lg mb-4">{step.description}</p>

                  {/* Details */}
                  <ul className="space-y-2">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-lamp-teal-400 mt-1">✓</span>
                        <span className="text-lamp-purple-300">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tips & Best Practices */}
      <div className="bg-gradient-to-br from-lamp-teal-900/40 to-lamp-teal-800/40 border border-lamp-teal-500/30 rounded-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">💡</span>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-lamp-gold-400 to-lamp-gold-500 bg-clip-text text-transparent">Genie's Wisdom</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-lamp-night-800/60 backdrop-blur-lg rounded-xl p-5 border border-lamp-purple-500/30 hover:border-lamp-gold-400/50 transition-all">
              <h4 className="font-bold text-lg text-lamp-teal-400 mb-2">💧 Practice in Mystical Realms</h4>
              <p className="text-lamp-purple-200 text-sm">
                LampFi runs on Sepolia testnets! Get free test ETH from enchanted faucets to practice without risking real treasures.
              </p>
            </div>
            <div className="bg-lamp-night-800/60 backdrop-blur-lg rounded-xl p-5 border border-lamp-purple-500/30 hover:border-lamp-gold-400/50 transition-all">
              <h4 className="font-bold text-lg text-lamp-teal-400 mb-2">📸 Share Your Prosperity</h4>
              <p className="text-lamp-purple-200 text-sm">
                Generate and download prosperity score images to track your blessings or share with the mystical community!
              </p>
            </div>
            <div className="bg-lamp-night-800/60 backdrop-blur-lg rounded-xl p-5 border border-lamp-purple-500/30 hover:border-lamp-gold-400/50 transition-all">
              <h4 className="font-bold text-lg text-lamp-teal-400 mb-2">📊 Consider the Journey</h4>
              <p className="text-lamp-purple-200 text-sm">
                Always check the breakeven time. If you're planning to hold for less time, the wish might not be worth granting.
              </p>
            </div>
            <div className="bg-lamp-night-800/60 backdrop-blur-lg rounded-xl p-5 border border-lamp-purple-500/30 hover:border-lamp-gold-400/50 transition-all">
              <h4 className="font-bold text-lg text-lamp-teal-400 mb-2">🔒 Safety Enchantments</h4>
              <p className="text-lamp-purple-200 text-sm">
                Pay attention to protocol safety scores. A slightly lower blessing on a safer protocol might be wiser.
              </p>
            </div>
            <div className="bg-lamp-night-800/60 backdrop-blur-lg rounded-xl p-5 border border-lamp-purple-500/30 hover:border-lamp-gold-400/50 transition-all">
              <h4 className="font-bold text-lg text-lamp-teal-400 mb-2">💸 Magical Timing</h4>
              <p className="text-lamp-purple-200 text-sm">
                Grant wishes during off-peak hours to save on mystical fees. The Genie shows you the best timing!
              </p>
            </div>
            <div className="bg-lamp-night-800/60 backdrop-blur-lg rounded-xl p-5 border border-lamp-purple-500/30 hover:border-lamp-gold-400/50 transition-all">
              <h4 className="font-bold text-lg text-lamp-teal-400 mb-2">🧞 Summon the Genie</h4>
              <p className="text-lamp-purple-200 text-sm">
                Click the Genie 3 times to activate mystical guidance. The Genie can answer any questions about LampFi instantly!
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
      <div className="card rounded-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">❓</span>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-lamp-gold-400 to-lamp-gold-500 bg-clip-text text-transparent">Mystical Questions</h3>
          </div>
          <div className="space-y-6">
            <div className="border-b border-lamp-purple-500/30 pb-4">
              <h4 className="font-bold text-lg text-lamp-gold-400 mb-2">Is my lamp safe?</h4>
              <p className="text-lamp-purple-200">
                Yes! We only request read-only access to peer into your vault. We never have access to your treasures or mystical keys.
              </p>
            </div>
            <div className="border-b border-lamp-purple-500/30 pb-4">
              <h4 className="font-bold text-lg text-lamp-gold-400 mb-2">Why is LampFi on testnets?</h4>
              <p className="text-lamp-purple-200">
                We operate in Sepolia mystical realms (Ethereum, Base, Arbitrum) so you can practice your magic without using real treasures. Get free test ETH from enchanted faucets linked in the Treasure Vault page!
              </p>
            </div>
            <div className="border-b border-lamp-purple-500/30 pb-4">
              <h4 className="font-bold text-lg text-lamp-gold-400 mb-2">How do I get mystical test ETH?</h4>
              <p className="text-lamp-purple-200">
                Visit the faucet links in the Treasure Vault page. You can summon free test ETH for Sepolia, Base Sepolia, and Arbitrum Sepolia. No real gold needed!
              </p>
            </div>
            <div className="border-b border-lamp-purple-500/30 pb-4">
              <h4 className="font-bold text-lg text-lamp-gold-400 mb-2">What is Prosperity Score?</h4>
              <p className="text-lamp-purple-200">
                It's a 0-100 blessing based on your balance, mystical activity, lamp age, and diversity. Higher scores indicate a more prosperous and blessed vault.
              </p>
            </div>
            <div className="border-b border-lamp-purple-500/30 pb-4">
              <h4 className="font-bold text-lg text-lamp-gold-400 mb-2">How accurate are the blessing predictions?</h4>
              <p className="text-lamp-purple-200">
                Our Genie's wisdom is trained on 6+ months of mystical data with 87% accuracy. However, DeFi blessings can change rapidly, so always verify before granting wishes.
              </p>
            </div>
            <div className="pb-4">
              <h4 className="font-bold text-lg text-lamp-gold-400 mb-2">Do you charge any mystical fees?</h4>
              <p className="text-lamp-purple-200">
                LampFi is completely free to use! You only pay the standard realm fees (gas + bridge fees) when granting wishes.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
      <div className="bg-gradient-to-r from-lamp-purple-600 via-lamp-magenta-600 to-lamp-purple-600 rounded-2xl p-8 text-center text-white shadow-xl shadow-lamp-purple-900/50">
        <div className="text-5xl mb-4">🪔</div>
        <h3 className="text-3xl font-bold mb-3">Ready to Unlock Prosperity?</h3>
        <p className="text-xl mb-6 text-lamp-purple-100">
            Summon your lamp now and discover mystical wishes! ✨
          </p>
        <a
          href="#home"
          className="inline-flex items-center gap-3 bg-gradient-to-r from-lamp-gold-500 to-lamp-gold-600 text-lamp-night-950 px-8 py-4 rounded-xl font-bold text-lg hover:from-lamp-gold-400 hover:to-lamp-gold-500 transition-all hover:scale-105 shadow-lg"
        >
          <span>Begin Your Journey</span>
          <span className="text-2xl">→</span>
        </a>
      </div>
      </div>
    </div>
  );
};

export default HowToUse;

