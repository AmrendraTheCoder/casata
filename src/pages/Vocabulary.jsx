import React from 'react';

const Vocabulary = () => {
  const terms = [
    {
      term: "APY (Annual Percentage Yield)",
      definition: "The total return on your investment over a year, including compound interest. For example, 10% APY means your $1000 will grow to $1100 in one year.",
      example: "If Aave offers 5% APY on USDC and Compound offers 7%, you'll earn more on Compound.",
      category: "Basic",
      icon: "📊"
    },
    {
      term: "DeFi (Decentralized Finance)",
      definition: "Financial services built on blockchain that don't require traditional banks. You interact directly with smart contracts.",
      example: "Instead of a bank savings account, you can lend USDC on Aave and earn yield.",
      category: "Basic",
      icon: "🏦"
    },
    {
      term: "Protocol",
      definition: "A DeFi platform or application. Each protocol has its own smart contracts and rules.",
      example: "Aave, Compound, and Curve are all popular DeFi protocols.",
      category: "Basic",
      icon: "🔧"
    },
    {
      term: "Bridge",
      definition: "A service that moves your crypto assets from one blockchain to another.",
      example: "To move USDC from Ethereum to Arbitrum, you'd use a bridge like Stargate.",
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
      example: "The ETH/USDC pool on Uniswap allows people to swap between ETH and USDC.",
      category: "Intermediate",
      icon: "💧"
    },
    {
      term: "Lending Protocol",
      definition: "A platform where you can lend your crypto to earn interest, or borrow crypto by providing collateral.",
      example: "Deposit USDC on Aave to earn 5% APY, or use your ETH as collateral to borrow USDC.",
      category: "Intermediate",
      icon: "🏦"
    },
    {
      term: "Staking",
      definition: "Locking your crypto in a protocol to help secure the network or earn rewards.",
      example: "Stake your ETH to earn staking rewards, or stake LP tokens in a farm to earn extra tokens.",
      category: "Intermediate",
      icon: "🔒"
    },
    {
      term: "Yield Farming",
      definition: "Moving your crypto between different protocols to maximize returns. Often involves multiple steps.",
      example: "Deposit USDC in Curve, stake the LP token in Convex, then stake the Convex receipt for maximum yield.",
      category: "Advanced",
      icon: "🌾"
    },
    {
      term: "Impermanent Loss",
      definition: "The temporary loss you might face when providing liquidity to a pool if token prices diverge.",
      example: "If you provide ETH/USDC liquidity and ETH doubles in price, you'd have made more profit just holding ETH.",
      category: "Advanced",
      icon: "📉"
    },
    {
      term: "Smart Contract",
      definition: "Self-executing code on the blockchain that runs automatically when conditions are met.",
      example: "When you lend on Aave, a smart contract automatically calculates and deposits your interest.",
      category: "Basic",
      icon: "📜"
    },
    {
      term: "TVL (Total Value Locked)",
      definition: "The total amount of money deposited in a DeFi protocol. Higher TVL often means more trust.",
      example: "Aave has $10B TVL, meaning users have deposited $10 billion worth of crypto.",
      category: "Intermediate",
      icon: "💰"
    },
    {
      term: "Migration Score",
      definition: "YieldShift's AI-powered rating (0-100) of how beneficial a migration would be for you.",
      example: "A score of 85 means it's highly recommended, considering APY gain, costs, safety, and timing.",
      category: "YieldShift",
      icon: "🎯"
    },
    {
      term: "Breakeven Time",
      definition: "How long it takes for the extra yield to cover your migration costs.",
      example: "If migration costs $50 and you'll earn $5 extra per day, breakeven is 10 days.",
      category: "YieldShift",
      icon: "⏱️"
    },
    {
      term: "Protocol Safety Score",
      definition: "Our rating (0-10) of how secure and reliable a protocol is, based on audits, track record, and TVL.",
      example: "Aave has a 9/10 safety score due to multiple audits and years of operation without hacks.",
      category: "YieldShift",
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
      example: "You try to swap $1000 USDC for ETH but due to slippage, you get slightly less ETH than expected.",
      category: "Advanced",
      icon: "📊"
    },
    {
      term: "Collateral",
      definition: "Assets you deposit to secure a loan in DeFi. If the loan isn't repaid, collateral can be liquidated.",
      example: "Deposit $2000 worth of ETH to borrow $1000 USDC on Aave.",
      category: "Intermediate",
      icon: "💎"
    }
  ];

  const categories = ["All", "Basic", "Intermediate", "Advanced", "YieldShift"];
  const [selectedCategory, setSelectedCategory] = React.useState("All");

  const filteredTerms = selectedCategory === "All" 
    ? terms 
    : terms.filter(t => t.category === selectedCategory);

  return (
    <div className="min-h-screen gradient-bg pt-12">
      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-3 flex items-center justify-center gap-3">
            <span className="text-5xl">📚</span>
            DeFi Vocabulary
          </h1>
          <p className="text-gray-600">Learn the language of decentralized finance</p>
        </div>
        {/* Introduction */}
        <div className="card-premium mb-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Master the Language of DeFi
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
            DeFi can be confusing with all its jargon. We've compiled all the terms you need 
            to know to use YieldShift effectively and make informed decisions about your investments.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md scale-110'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
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
              className="card hover:scale-[1.01] transition-all duration-300"
            >
              <div className="flex gap-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                    {item.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  {/* Term & Category */}
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{item.term}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.category === 'Basic' ? 'bg-green-100 text-green-700 border border-green-300' :
                      item.category === 'Intermediate' ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' :
                      item.category === 'Advanced' ? 'bg-red-100 text-red-700 border border-red-300' :
                      'bg-blue-100 text-blue-700 border border-blue-300'
                    }`}>
                      {item.category}
                    </span>
                  </div>

                  {/* Definition */}
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    {item.definition}
                  </p>

                  {/* Example */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-gray-700 mb-1 font-semibold">💡 Example:</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.example}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Help Section */}
        <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 mt-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Still confused? 🤔</h3>
          <p className="text-gray-700 mb-6">
            Join our community Discord where experienced DeFi users can help answer your questions!
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="btn-primary">
              💬 Join Discord
            </button>
            <button className="btn-secondary">
              📧 Email Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vocabulary;

