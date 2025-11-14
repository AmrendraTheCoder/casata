import { useState, useEffect, useRef } from 'react';

const Gennie = () => {
  const [clickCount, setClickCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const clickTimeoutRef = useRef(null);

  // Knowledge base for Gennie
  const knowledgeBase = {
    greetings: [
      "Hello! I'm Gennie, your YieldShift assistant! 👋 How can I help you today?",
      "Hi there! Gennie here, ready to help you with YieldShift! What would you like to know?",
      "Hey! I'm Gennie, your friendly DeFi guide. Ask me anything about YieldShift!",
    ],
    
    topics: {
      'portfolio': {
        keywords: ['portfolio', 'wallet', 'balance', 'overview', 'assets'],
        responses: [
          "Your Portfolio Overview shows your complete wallet analysis including health score, balances across all chains, and recent transactions. It's the first step to understanding your DeFi activity!",
          "The Portfolio page displays your total balance, transaction history, and activity level across Sepolia testnet chains. You can filter transactions by chain and see detailed stats.",
        ]
      },
      'optimize': {
        keywords: ['optimize', 'yield', 'dashboard', 'opportunities', 'migration', 'apy'],
        responses: [
          "The Optimize (Dashboard) page analyzes your DeFi positions and recommends better yield opportunities. Our AI scores each opportunity from 0-100 based on APY gain, safety, costs, and timing!",
          "Yield optimization finds you better APY across 200+ protocols. Each recommendation shows potential gains, migration costs, breakeven time, and step-by-step instructions.",
        ]
      },
      'health': {
        keywords: ['health score', 'health', 'score', 'rating'],
        responses: [
          "Your Portfolio Health Score (0-100) is calculated based on: Balance (25%), Activity (20%), Chain Diversity (15%), and Experience (15%). A score above 80 is excellent!",
          "Health scores help you understand your portfolio quality. Higher scores mean better balance, more activity, chain diversification, and wallet maturity.",
        ]
      },
      'testnet': {
        keywords: ['testnet', 'sepolia', 'test eth', 'faucet', 'test network'],
        responses: [
          "YieldShift runs on Sepolia testnets (Ethereum, Base, Arbitrum). Get free test ETH from faucets - no real money needed! Check the Portfolio page for faucet links.",
          "We use Sepolia testnet so you can test with real transactions safely. Visit sepoliafaucet.com, coinbase faucets, or faucet.arbitrum.io to get free test ETH!",
        ]
      },
      'transaction': {
        keywords: ['transaction', 'tx', 'transfer', 'send', 'receive'],
        responses: [
          "Your recent transactions are displayed on the Portfolio Overview page. You can filter by chain (All, Sepolia, Base Sepolia, Arbitrum Sepolia) and see transaction type, amount, and status.",
          "Transactions show as Sent, Received, or Contract interactions. Each has a clickable hash that opens the blockchain explorer for details.",
        ]
      },
      'safety': {
        keywords: ['safe', 'security', 'private key', 'wallet safety', 'secure'],
        responses: [
          "YieldShift is 100% safe! We only request READ-ONLY access to view your positions. We NEVER ask for signatures, private keys, or access to your funds. Your assets are always secure.",
          "Security is our priority. All operations are read-only, no smart contract approvals needed, and we never store your private information. You're always in full control!",
        ]
      },
      'chains': {
        keywords: ['chain', 'network', 'ethereum', 'base', 'arbitrum', 'multi-chain'],
        responses: [
          "YieldShift supports 3 testnet chains: Sepolia (Ethereum), Base Sepolia, and Arbitrum Sepolia. You can track balances and transactions across all of them in one dashboard!",
          "Multi-chain support means you see all your activity across different networks in one place. No need to switch between explorers!",
        ]
      },
      'connect': {
        keywords: ['connect', 'wallet', 'metamask', 'connection'],
        responses: [
          "To connect your wallet: Click 'Connect Wallet' → Approve MetaMask connection → Switch to Sepolia testnet. That's it! We'll automatically detect your positions.",
          "Make sure MetaMask is installed and you're on a Sepolia testnet. The connection is read-only and completely safe.",
        ]
      },
      'demo': {
        keywords: ['demo', 'mock', 'test', 'example', 'try'],
        responses: [
          "YieldShift works in demo mode (VITE_ENABLE_MOCK_DATA=true) with realistic sample data. Perfect for testing without connecting a wallet!",
          "Demo mode shows 3 sample positions with migration opportunities. It's great for presentations and understanding how the app works!",
        ]
      },
      'image': {
        keywords: ['image', 'download', 'share', 'social', 'screenshot'],
        responses: [
          "You can download a beautiful portfolio card image from the Portfolio Overview page! Click 'Download Image' to save and share your health score on social media.",
          "Portfolio images show your health score, balance, transactions, and chain distribution. Perfect for Twitter, Discord, or Telegram!",
        ]
      },
    }
  };

  // Handle 3-click activation
  const handleButtonClick = () => {
    setClickCount(prev => prev + 1);

    // Clear existing timeout
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    // Reset counter after 2 seconds of no clicks
    clickTimeoutRef.current = setTimeout(() => {
      setClickCount(0);
    }, 2000);

    // Activate after 3 clicks
    if (clickCount + 1 === 3) {
      setIsOpen(true);
      setClickCount(0);
      
      // Welcome message
      if (messages.length === 0) {
        const greeting = knowledgeBase.greetings[Math.floor(Math.random() * knowledgeBase.greetings.length)];
        setMessages([{ type: 'bot', text: greeting, timestamp: Date.now() }]);
      }
    }
  };

  // Find response based on user input
  const findResponse = (input) => {
    const lowerInput = input.toLowerCase();

    // Check for greetings
    if (['hi', 'hello', 'hey', 'help'].some(word => lowerInput.includes(word))) {
      return knowledgeBase.greetings[Math.floor(Math.random() * knowledgeBase.greetings.length)];
    }

    // Search through topics
    for (const [_topic, data] of Object.entries(knowledgeBase.topics)) {
      if (data.keywords.some(keyword => lowerInput.includes(keyword))) {
        return data.responses[Math.floor(Math.random() * data.responses.length)];
      }
    }

    // Default response
    return "I'm not sure about that! You can ask me about: Portfolio, Optimize/Yield, Health Score, Testnets, Transactions, Safety, Chains, or Connecting your wallet. How can I help? 😊";
  };

  // Handle sending message
  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = { type: 'user', text: inputValue, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = findResponse(inputValue);
      const botMessage = { type: 'bot', text: response, timestamp: Date.now() };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Quick questions
  const quickQuestions = [
    "How does Portfolio work?",
    "How to get test ETH?",
    "Is my wallet safe?",
    "What's the health score?",
  ];

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {/* Click counter hint - LEFT SIDE */}
        {clickCount > 0 && clickCount < 3 && !isOpen && (
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-xl animate-pulse">
            {3 - clickCount} more {3 - clickCount === 1 ? 'click' : 'clicks'}! 🎯
          </div>
        )}

        {/* Static Genie Button with Border */}
        {!isOpen && (
          <button
            onClick={handleButtonClick}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-4xl transition-all duration-300 hover:scale-110 border-4 ${
              clickCount > 0
                ? 'border-purple-600 bg-white shadow-2xl shadow-purple-600/50 animate-pulse'
                : 'border-blue-600 bg-white shadow-2xl shadow-blue-600/30 hover:shadow-blue-600/50'
            }`}
            title={`Click ${3 - clickCount} more time${3 - clickCount !== 1 ? 's' : ''} to activate Gennie`}
          >
            🧞
          </button>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                🧞
              </div>
              <div>
                <h3 className="font-bold text-lg">Gennie</h3>
                <p className="text-xs text-blue-100">Your YieldShift Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🧞</div>
                <p className="text-gray-600 mb-4">Hi! I'm Gennie, your YieldShift assistant!</p>
                <p className="text-sm text-gray-500">Ask me anything about the app</p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                    msg.type === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white border border-gray-200 text-gray-900 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl rounded-bl-none">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div className="px-4 py-2 border-t border-gray-200 bg-white">
              <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputValue(q);
                      setTimeout(() => handleSend(), 100);
                    }}
                    className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Gennie;

