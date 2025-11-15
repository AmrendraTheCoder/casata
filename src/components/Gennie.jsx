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
      "Greetings, Aladdin! 🧞‍♂️ I am the Genie of LampFi, here to grant your wishes for prosperity! How may I serve you?",
      "Welcome back, seeker of fortune! ✨ Your Genie awaits your command. What magical knowledge do you seek?",
      "Ah, you've summoned me! 🪔 I am the Genie, guardian of wealth and prosperity. Ask, and your wish shall be answered!",
    ],
    
    topics: {
      'portfolio': {
        keywords: ['portfolio', 'wallet', 'balance', 'overview', 'assets', 'treasure', 'vault'],
        responses: [
          "Your Treasure Vault reveals all your riches! ✨ Behold your prosperity score, mystical balances across all realms, and the ledger of your magical transactions. This is where your journey begins!",
          "The Treasure Vault displays your complete fortune, wish history, and activity across the enchanted Sepolia realms. Filter by kingdom and witness your wealth grow!",
        ]
      },
      'optimize': {
        keywords: ['optimize', 'yield', 'dashboard', 'opportunities', 'migration', 'apy', 'genie', 'summon', 'wish'],
        responses: [
          "Summon the Genie to analyze your treasures and discover better opportunities for prosperity! 🧞‍♂️ Each wish receives a magical score (0-100) based on potential gains, safety, costs, and divine timing!",
          "The Genie's wisdom compares 200+ enchanted pools across mystical chains. Each recommendation reveals potential riches, migration costs, breakeven prophecies, and step-by-step incantations!",
        ]
      },
      'health': {
        keywords: ['health score', 'health', 'score', 'rating', 'prosperity'],
        responses: [
          "Your Prosperity Score (0-100) is divined from ancient formulas: Balance (25%), Activity (20%), Realm Diversity (15%), and Experience (15%). A score above 80 means the gods smile upon you! ✨",
          "Prosperity scores reveal the strength of your fortune. Higher scores mean greater balance, more activity, diversification across realms, and the wisdom of experience!",
        ]
      },
      'testnet': {
        keywords: ['testnet', 'sepolia', 'test eth', 'faucet', 'test network'],
        responses: [
          "LampFi operates in the enchanted Sepolia realms (Ethereum, Base, Arbitrum). Summon free test ETH from mystical faucets - no real gold needed! 🪙 Visit the Treasure Vault for faucet portals.",
          "We use Sepolia testnet so you can practice magic safely with real incantations. Visit sepoliafaucet.com, coinbase faucets, or faucet.arbitrum.io for free test treasures!",
        ]
      },
      'transaction': {
        keywords: ['transaction', 'tx', 'transfer', 'send', 'receive', 'ledger', 'history'],
        responses: [
          "Your Magical Ledger chronicles all recent transactions! 📜 Filter by realm (All, Sepolia, Base Sepolia, Arbitrum Sepolia) and witness each transfer, amount, and mystical status.",
          "Transactions appear as Sent, Received, or Contract Rituals. Each has a clickable rune that opens the realm's explorer for deeper divination!",
        ]
      },
      'safety': {
        keywords: ['safe', 'security', 'private key', 'wallet safety', 'secure'],
        responses: [
          "LampFi is blessed with 100% safety! 🛡️ We only request READ-ONLY vision to peer into your treasures. We NEVER ask for signatures, private keys, or access to your riches. Your gold is eternally protected!",
          "Security is our sacred oath. All operations are read-only, no contract approvals needed, and we never store your secrets. You remain the master of your lamp!",
        ]
      },
      'chains': {
        keywords: ['chain', 'network', 'ethereum', 'base', 'arbitrum', 'multi-chain', 'realm'],
        responses: [
          "LampFi spans 3 enchanted realms: Sepolia Kingdom, Base Sepolia Empire, and Arbitrum Sepolia Domain. Track your treasures and transactions across all mystical lands in one magical dashboard! 🌍",
          "Multi-realm support means you witness all your fortune across different kingdoms in one place. No need to travel between realm explorers!",
        ]
      },
      'connect': {
        keywords: ['connect', 'wallet', 'metamask', 'connection', 'lamp', 'summon'],
        responses: [
          "To summon your lamp: Click 'Summon Your Lamp' → Approve MetaMask ritual → Switch to Sepolia realm. That's it! 🪔 The Genie will automatically detect your treasures.",
          "Ensure MetaMask is installed and you're in a Sepolia realm. The connection is read-only and blessed with protection magic!",
        ]
      },
      'demo': {
        keywords: ['demo', 'mock', 'test', 'example', 'try'],
        responses: [
          "LampFi works in mystical demo mode with enchanted sample data. Perfect for witnessing the magic without summoning your real lamp! ✨",
          "Demo mode reveals 3 sample treasure positions with wish opportunities. It's perfect for understanding how the Genie grants prosperity!",
        ]
      },
      'image': {
        keywords: ['image', 'download', 'share', 'social', 'screenshot'],
        responses: [
          "You can conjure a beautiful prosperity card from the Treasure Vault! 🎴 Click 'Download Image' to capture and share your prosperity score across the social realms.",
          "Prosperity images display your score, riches, wish history, and realm distribution. Perfect for Twitter, Discord, or Telegram! Share your fortune! ✨",
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
    return "Hmm, that wish is beyond my current powers! 🧞‍♂️ You can ask me about: Treasure Vault, Summoning the Genie, Prosperity Score, Mystical Realms, Magical Ledger, Safety Enchantments, or Connecting your Lamp. What knowledge do you seek? ✨";
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
    "How does Treasure Vault work?",
    "How to get test treasures?",
    "Is my lamp safe?",
    "What's the prosperity score?",
  ];

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {/* Click counter hint - LEFT SIDE */}
        {clickCount > 0 && clickCount < 3 && !isOpen && (
          <div className="bg-gradient-to-r from-lamp-purple-600 to-lamp-magenta-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-xl animate-pulse border border-lamp-gold-400/50">
            {3 - clickCount} more {3 - clickCount === 1 ? 'rub' : 'rubs'}! 🪔✨
          </div>
        )}

        {/* Static Genie Button with Border */}
        {!isOpen && (
          <button
            onClick={handleButtonClick}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-4xl transition-all duration-300 hover:scale-110 border-4 ${
              clickCount > 0
                ? 'border-lamp-gold-400 bg-gradient-to-br from-lamp-purple-600 to-lamp-magenta-600 shadow-2xl shadow-lamp-purple-600/70 animate-pulse'
                : 'border-lamp-purple-500 bg-gradient-to-br from-lamp-night-800 to-lamp-purple-900 shadow-2xl shadow-lamp-purple-600/50 hover:shadow-lamp-gold-500/50'
            }`}
            title={`Rub the lamp ${3 - clickCount} more time${3 - clickCount !== 1 ? 's' : ''} to summon the Genie`}
          >
            🧞
          </button>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] h-[500px] bg-lamp-night-900 rounded-2xl shadow-2xl border-2 border-lamp-gold-400/50 z-50 flex flex-col animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-lamp-purple-600 via-lamp-magenta-600 to-lamp-purple-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-lamp-glow opacity-30"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-lamp-gold-500/30 rounded-full flex items-center justify-center text-2xl border-2 border-lamp-gold-400 animate-float">
                🧞
              </div>
              <div>
                <h3 className="font-bold text-lg">The Genie</h3>
                <p className="text-xs text-lamp-gold-200">Your LampFi Guide ✨</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-lamp-gold-500/20 hover:bg-lamp-gold-500/40 transition-colors flex items-center justify-center border border-lamp-gold-400/50 relative z-10"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-lamp-night-800 to-lamp-night-900">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="text-6xl mb-4 animate-float">🧞</div>
                <p className="text-lamp-purple-200 mb-4 font-semibold">Greetings, Aladdin!</p>
                <p className="text-sm text-lamp-purple-300">I am the Genie. Ask me anything about LampFi! ✨</p>
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
                      ? 'bg-gradient-to-r from-lamp-gold-500 to-lamp-gold-600 text-lamp-night-950 rounded-br-none shadow-lg'
                      : 'bg-lamp-night-800/80 border border-lamp-purple-500/30 text-lamp-purple-100 rounded-bl-none shadow-lg backdrop-blur-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-lamp-night-800/80 border border-lamp-purple-500/30 px-4 py-2 rounded-2xl rounded-bl-none backdrop-blur-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-lamp-gold-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-lamp-magenta-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-2 h-2 bg-lamp-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div className="px-4 py-2 border-t border-lamp-purple-500/30 bg-lamp-night-900">
              <p className="text-xs text-lamp-gold-400 mb-2">✨ Quick wishes:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputValue(q);
                      setTimeout(() => handleSend(), 100);
                    }}
                    className="text-xs px-3 py-1 bg-lamp-night-800 hover:bg-lamp-purple-800 text-lamp-purple-200 hover:text-lamp-gold-300 rounded-full transition-colors border border-lamp-purple-500/30"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-lamp-purple-500/30 bg-lamp-night-900 rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Make a wish... ✨"
                className="flex-1 px-4 py-2 border border-lamp-purple-500/30 bg-lamp-night-800 text-lamp-purple-100 placeholder-lamp-purple-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-lamp-gold-500 focus:border-lamp-gold-400"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="px-4 py-2 bg-gradient-to-r from-lamp-gold-500 to-lamp-gold-600 hover:from-lamp-gold-400 hover:to-lamp-gold-500 text-lamp-night-950 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-lg"
              >
                Grant
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Gennie;

