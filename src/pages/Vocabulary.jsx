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
    },
    {
      term: "Testnet",
      definition: "A testing environment for blockchain networks where you can experiment without using real money. Uses test tokens that have no real value.",
      example: "YieldShift runs on Sepolia testnet, so you can test all features with free test ETH from faucets.",
      category: "Basic",
      icon: "🧪"
    },
    {
      term: "Sepolia",
      definition: "The name of Ethereum's current testnet. Also used by Base and Arbitrum for their testnets (Base Sepolia, Arbitrum Sepolia).",
      example: "Switch your MetaMask to Sepolia testnet to use YieldShift.",
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
      term: "Portfolio Health Score",
      definition: "YieldShift's 0-100 rating of your wallet based on balance, transaction activity, wallet age, and asset diversity.",
      example: "A score of 85 means you have a healthy, active wallet with good balance and regular transactions.",
      category: "YieldShift",
      icon: "❤️"
    },
    {
      term: "Portfolio Image Generator",
      definition: "YieldShift feature that creates a shareable image of your portfolio health statistics.",
      example: "Generate a portfolio health card showing your score, balance, and transaction stats to share on social media.",
      category: "YieldShift",
      icon: "📸"
    },
    {
      term: "Gennie",
      definition: "YieldShift's AI chatbot assistant that helps answer questions about the app and DeFi concepts. Click 3 times to activate.",
      example: "Click Gennie three times to ask 'How do I get test ETH?' or 'What does APY mean?'",
      category: "YieldShift",
      icon: "🤖"
    },
    {
      term: "Multi-Chain",
      definition: "Operating across multiple blockchain networks simultaneously. Allows you to manage assets on different chains in one place.",
      example: "YieldShift shows your balances on Ethereum Sepolia, Base Sepolia, and Arbitrum Sepolia all in one dashboard.",
      category: "Intermediate",
      icon: "🔗"
    },
    {
      term: "Transaction History",
      definition: "A record of all blockchain transactions associated with your wallet, including sent, received, and smart contract interactions.",
      example: "YieldShift shows your last 20 transactions across all supported chains with filtering options.",
      category: "Basic",
      icon: "📜"
    }
  ];

  const categories = ["All", "Basic", "Intermediate", "Advanced", "YieldShift"];
  const [selectedCategory, setSelectedCategory] = React.useState("All");

  const filteredTerms = selectedCategory === "All" 
    ? terms 
    : terms.filter(t => t.category === selectedCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Title */}
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">DeFi Vocabulary</h1>
        <p className="text-lg text-gray-600">Learn the language of decentralized finance</p>
        </div>

        {/* Introduction */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8 mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Master the Language of DeFi
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
            DeFi can be confusing with all its jargon. We've compiled all the terms you need 
            to know to use YieldShift effectively and make informed decisions about your investments.
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
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
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
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-8 mt-8 text-center">
        <div className="text-5xl mb-4">🤔</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Still confused?</h3>
        <p className="text-gray-700 mb-2 text-lg font-semibold">
          🤖 Try Gennie First!
        </p>
        <p className="text-gray-600 mb-6">
          Click Gennie (bottom right corner) 3 times to activate our AI chatbot. 
          She can instantly explain any term or answer questions about YieldShift!
        </p>
        <div className="border-t border-purple-300 pt-6 mt-6">
          <p className="text-gray-700 mb-6 text-lg">
            Want to connect with the community?
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all hover:scale-105 shadow-lg">
              💬 Join Discord
            </button>
            <button className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-300 hover:bg-gray-50 transition-all hover:scale-105">
              📧 Email Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vocabulary;

