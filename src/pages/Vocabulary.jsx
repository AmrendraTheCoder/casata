import React from 'react';

const Vocabulary = () => {
  const terms = [
    {
      term: "APY (Annual Percentage Yield)",
      definition: "The total return on your investment over a year, including compound interest. For example, 10% APY means your $1000 will grow to $1100 in one year.",
      example: "If one platform offers 5% APY and another offers 7%, you'll earn more with the higher APY.",
      category: "Basic",
      icon: "📊"
    },
    {
      term: "DeFi (Decentralized Finance)",
      definition: "Financial services built on blockchain that don't require traditional banks. You interact directly with smart contracts.",
      example: "Instead of a bank savings account, you can use DeFi platforms to manage and transfer your crypto assets.",
      category: "Basic",
      icon: "🏦"
    },
    {
      term: "Protocol",
      definition: "A DeFi platform or application. Each protocol has its own smart contracts and rules.",
      example: "Different platforms serve different purposes - some for trading, some for lending, some for bridging between chains.",
      category: "Basic",
      icon: "🔧"
    },
    {
      term: "Bridge",
      definition: "A service that moves your crypto assets from one blockchain to another.",
      example: "To move ETH from Ethereum to Arbitrum, you'd use a bridge service.",
      category: "Basic",
      icon: "🌉"
    },
    {
      term: "Gas Fee",
      definition: "The cost to execute a transaction on the blockchain. Paid to validators/miners.",
      example: "Swapping tokens on Ethereum might cost $5-50 in gas fees depending on network congestion.",
      category: "Basic",
      icon: "⛽"
    },
    {
      term: "Liquidity Pool",
      definition: "A smart contract holding pairs of tokens that enables trading. You can deposit your tokens and earn fees.",
      example: "A liquidity pool with two tokens allows people to swap between them without needing a traditional exchange.",
      category: "Intermediate",
      icon: "💧"
    },
    {
      term: "Lending Protocol",
      definition: "A platform where you can lend your crypto to earn interest, or borrow crypto by providing collateral.",
      example: "Deposit crypto to earn interest, or use your assets as collateral to borrow other tokens.",
      category: "Intermediate",
      icon: "🏦"
    },
    {
      term: "Staking",
      definition: "Locking your crypto to help secure the network or earn rewards.",
      example: "Stake your ETH to earn staking rewards, or stake LP tokens in a farm to earn extra tokens.",
      category: "Intermediate",
      icon: "🔒"
    },
    {
      term: "Yield Farming",
      definition: "Moving your crypto between different platforms to maximize returns. Often involves multiple steps.",
      example: "Deposit tokens in a liquidity pool, stake the receipt tokens, and earn rewards from multiple sources.",
      category: "Advanced",
      icon: "🌾"
    },
    {
      term: "Impermanent Loss",
      definition: "The temporary loss you might face when providing liquidity to a pool if token prices diverge.",
      example: "If you provide liquidity with two tokens and one doubles in price, you'd have made more profit just holding that token.",
      category: "Advanced",
      icon: "📉"
    },
    {
      term: "Smart Contract",
      definition: "Self-executing code on the blockchain that runs automatically when conditions are met.",
      example: "When you send a transaction, a smart contract can automatically execute actions like transfers or swaps.",
      category: "Basic",
      icon: "📜"
    },
    {
      term: "TVL (Total Value Locked)",
      definition: "The total amount of money deposited in a DeFi platform. Higher TVL often means more trust.",
      example: "A platform with $10B TVL means users have deposited $10 billion worth of crypto, indicating high trust.",
      category: "Intermediate",
      icon: "💰"
    },
    {
      term: "Wish Score",
      definition: "LampFi's Genie-powered rating (0-100) of how beneficial a wish would be for your prosperity.",
      example: "A score of 85 means it's highly blessed, considering blessing gains, costs, safety, and timing.",
      category: "LampFi",
      icon: "🎯"
    },
    {
      term: "Breakeven Time",
      definition: "How long it takes for the extra blessings to cover your wish granting costs.",
      example: "If wish costs $50 and you'll earn $5 extra blessings per day, breakeven is 10 days.",
      category: "LampFi",
      icon: "⏱️"
    },
    {
      term: "Protocol Safety Enchantment",
      definition: "The Genie's rating (0-10) of how secure and reliable a platform is, based on audits, track record, and TVL.",
      example: "A platform with a 9/10 safety enchantment has multiple audits and years of operation without hacks.",
      category: "LampFi",
      icon: "🛡️"
    },
    {
      term: "Cross-Chain",
      definition: "Operations that involve multiple blockchains. Usually requires a bridge.",
      example: "Moving funds from Ethereum to Arbitrum is a cross-chain operation.",
      category: "Intermediate",
      icon: "🔗"
    },
    {
      term: "Slippage",
      definition: "The difference between expected and actual price when making a trade. Higher in low liquidity pools.",
      example: "You try to swap tokens but due to slippage, you get slightly less than expected based on the quoted price.",
      category: "Advanced",
      icon: "📊"
    },
    {
      term: "Collateral",
      definition: "Assets you deposit to secure a loan in DeFi. If the loan isn't repaid, collateral can be liquidated.",
      example: "Deposit $2000 worth of ETH to borrow $1000 worth of another token on a lending platform.",
      category: "Intermediate",
      icon: "💎"
    },
    {
      term: "Mystical Realm (Testnet)",
      definition: "A testing environment for blockchain networks where you can practice magic without using real treasures. Uses test tokens that have no real value.",
      example: "LampFi operates in Sepolia mystical realms, so you can test all features with free test ETH from enchanted faucets.",
      category: "Basic",
      icon: "🧪"
    },
    {
      term: "Sepolia",
      definition: "The name of Ethereum's current mystical testing realm. Also used by Base and Arbitrum for their realms (Base Sepolia, Arbitrum Sepolia).",
      example: "Switch your MetaMask to Sepolia mystical realm to use LampFi.",
      category: "Basic",
      icon: "⟠"
    },
    {
      term: "Faucet",
      definition: "A service that gives you free test tokens for testnets. Essential for testing blockchain applications without spending real money.",
      example: "Visit sepoliafaucet.com to get free test ETH for Ethereum Sepolia.",
      category: "Basic",
      icon: "💧"
    },
    {
      term: "Prosperity Score",
      definition: "LampFi's 0-100 blessing of your lamp based on balance, mystical activity, lamp age, and treasure diversity.",
      example: "A score of 85 means you have a prosperous, blessed lamp with good riches and regular mystical activity.",
      category: "LampFi",
      icon: "✨"
    },
    {
      term: "Prosperity Score Generator",
      definition: "LampFi feature that creates a shareable mystical score image of your prosperity statistics.",
      example: "Generate a prosperity score image showing your score, riches, and mystical activity to share on social media.",
      category: "LampFi",
      icon: "📸"
    },
    {
      term: "The Genie",
      definition: "LampFi's mystical AI guide that helps answer questions about the app and DeFi concepts. Click 3 times to summon.",
      example: "Click the Genie three times to ask 'How do I get test ETH?' or 'What does APY mean?'",
      category: "LampFi",
      icon: "🧞"
    },
    {
      term: "Multi-Realm",
      definition: "Operating across multiple mystical blockchain realms simultaneously. Allows you to manage treasures across different realms in one lamp.",
      example: "LampFi shows your riches on Ethereum Sepolia, Base Sepolia, and Arbitrum Sepolia all in one treasure vault.",
      category: "Intermediate",
      icon: "🔗"
    },
    {
      term: "Magical Ledger",
      definition: "A record of all mystical transactions associated with your lamp, including sent, received, and smart contract rituals.",
      example: "LampFi shows your last 20 mystical transactions across all supported realms with filtering options.",
      category: "Basic",
      icon: "📜"
    }
  ];

  const categories = ["All", "Basic", "Intermediate", "Advanced", "LampFi"];
  const [selectedCategory, setSelectedCategory] = React.useState("All");

  const filteredTerms = selectedCategory === "All" 
    ? terms 
    : terms.filter(t => t.category === selectedCategory);

  return (
    <div className="min-h-screen bg-mystical-night">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Title */}
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-lamp-gold-400 to-lamp-gold-500 bg-clip-text text-transparent mb-2">📜 Mystical Terms of LampFi</h1>
        <p className="text-lg text-lamp-purple-200">Learn the language of prosperity and enchantment ✨</p>
        </div>

        {/* Introduction */}
      <div className="bg-gradient-to-br from-lamp-purple-900/40 to-lamp-magenta-900/40 border border-lamp-purple-500/30 rounded-xl p-8 mb-8 text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-lamp-gold-400 to-lamp-gold-500 bg-clip-text text-transparent mb-4">
            Master the Language of Mystical Finance
          </h2>
          <p className="text-lg text-lamp-purple-200 leading-relaxed max-w-3xl mx-auto">
            DeFi can be confusing with all its mystical jargon. The Genie has compiled all the terms you need 
            to know to use LampFi effectively and make informed wishes about your treasures.
          </p>
        </div>

        {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-lamp-purple-600 to-lamp-magenta-600 text-white shadow-md scale-110'
                  : 'bg-lamp-night-800/50 text-lamp-purple-200 border border-lamp-purple-500/30 hover:border-lamp-gold-400/50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Terms Grid */}
        <div className="grid gap-6">
          {filteredTerms.map((item, index) => (
            <div 
              key={index}
            className="card rounded-xl p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex gap-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-lamp-purple-600 to-lamp-magenta-600 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-lamp-purple-500/50">
                    {item.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  {/* Term & Category */}
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-lamp-gold-400 to-lamp-gold-500 bg-clip-text text-transparent">{item.term}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.category === 'Basic' ? 'bg-lamp-teal-500/20 text-lamp-teal-400 border border-lamp-teal-400/50' :
                      item.category === 'Intermediate' ? 'bg-lamp-gold-500/20 text-lamp-gold-400 border border-lamp-gold-400/50' :
                      item.category === 'Advanced' ? 'bg-lamp-rose-500/20 text-lamp-rose-400 border border-lamp-rose-400/50' :
                      'bg-lamp-magenta-500/20 text-lamp-magenta-400 border border-lamp-magenta-400/50'
                    }`}>
                      {item.category}
                    </span>
                  </div>

                  {/* Definition */}
                  <p className="text-lamp-purple-200 mb-3 leading-relaxed">
                    {item.definition}
                  </p>

                  {/* Example */}
                  <div className="bg-lamp-night-800/60 border border-lamp-purple-500/30 rounded-lg p-4">
                    <p className="text-sm text-lamp-gold-400 mb-1 font-semibold">💡 Example:</p>
                    <p className="text-sm text-lamp-purple-300 leading-relaxed">
                      {item.example}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Help Section */}
      <div className="bg-gradient-to-br from-lamp-purple-900/40 to-lamp-magenta-900/40 border border-lamp-purple-500/30 rounded-xl p-8 mt-8 text-center">
        <div className="text-5xl mb-4">🧞</div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-lamp-gold-400 to-lamp-gold-500 bg-clip-text text-transparent mb-4">Still seeking wisdom?</h3>
        <p className="text-lamp-gold-300 mb-2 text-lg font-semibold">
          🧞 Summon the Genie First!
        </p>
        <p className="text-lamp-purple-200 mb-6">
          Click the Genie (bottom right corner) 3 times to activate mystical guidance. 
          The Genie can instantly explain any term or answer questions about LampFi!
        </p>
        <div className="border-t border-lamp-purple-500/30 pt-6 mt-6">
          <p className="text-lamp-purple-200 mb-6 text-lg">
            Want to join the mystical community?
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="px-6 py-3 bg-gradient-to-r from-lamp-purple-600 to-lamp-magenta-600 text-white font-semibold rounded-xl hover:from-lamp-purple-500 hover:to-lamp-magenta-500 transition-all hover:scale-105 shadow-lg">
              💬 Join Discord
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-lamp-gold-500 to-lamp-gold-600 text-lamp-night-950 font-semibold rounded-xl hover:from-lamp-gold-400 hover:to-lamp-gold-500 transition-all hover:scale-105 shadow-lg">
              📧 Mystical Support
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Vocabulary;

