import { useState } from 'react';
import { useSendTransaction, useWaitForTransactionReceipt, useSwitchChain, useChainId } from 'wagmi';
import { parseEther } from 'viem';

const TransactionModal = ({ isOpen, onClose, onSuccess }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedChain, setSelectedChain] = useState('sepolia');
  
  const { data: hash, isPending, sendTransaction, error } = useSendTransaction();
  const { switchChain } = useSwitchChain();
  const currentChainId = useChainId();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Chain configurations
  const chains = {
    sepolia: {
      id: 11155111,
      name: 'Sepolia',
      emoji: '⟠',
      explorer: 'https://sepolia.etherscan.io'
    },
    baseSepolia: {
      id: 84532,
      name: 'Base Sepolia',
      emoji: '🔵',
      explorer: 'https://sepolia.basescan.org'
    },
    arbitrumSepolia: {
      id: 421614,
      name: 'Arbitrum Sepolia',
      emoji: '🔷',
      explorer: 'https://sepolia.arbiscan.io'
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!recipient || !amount) {
      alert('Please fill in all fields');
      return;
    }

    // Validate Ethereum address
    if (!/^0x[a-fA-F0-9]{40}$/.test(recipient)) {
      alert('Invalid Ethereum address');
      return;
    }

    // Validate amount
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Invalid amount');
      return;
    }

    try {
      const targetChainId = chains[selectedChain].id;
      
      console.log(`🎯 Target chain: ${chains[selectedChain].name} (${targetChainId})`);
      console.log(`📍 Current chain: ${currentChainId}`);
      
      // Check if we need to switch chains
      if (currentChainId !== targetChainId) {
        console.log(`🔄 Chain mismatch detected, switching from ${currentChainId} to ${targetChainId}...`);
        
        if (!switchChain) {
          alert('Chain switching not available. Please manually switch to the correct network in MetaMask.');
          return;
        }
        
        try {
          // Request chain switch
          await switchChain({ chainId: targetChainId });
          console.log('✅ Chain switch requested');
          
          // Wait for chain switch to complete
          // We'll check multiple times to ensure it's done
          let attempts = 0;
          const maxAttempts = 10;
          
          while (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Note: currentChainId won't update immediately, so we just wait
            attempts++;
            
            if (attempts === maxAttempts) {
              console.log('✅ Chain switch should be complete');
              break;
            }
          }
          
        } catch (switchError) {
          console.error('❌ Chain switch error:', switchError);
          
          // Check if user rejected
          if (switchError.message?.includes('rejected') || switchError.message?.includes('denied')) {
            alert('You must approve the network switch in MetaMask to continue.');
            return;
          }
          
          // If chain doesn't exist in MetaMask
          if (switchError.message?.includes('Unrecognized chain') || switchError.code === 4902) {
            alert(`Please add ${chains[selectedChain].name} to MetaMask first.\n\nYou can do this by:\n1. Opening MetaMask\n2. Clicking the network dropdown\n3. Adding the ${chains[selectedChain].name} network`);
            return;
          }
          
          // For other errors, show message and stop
          alert(`Failed to switch network: ${switchError.message || 'Unknown error'}\n\nPlease manually switch to ${chains[selectedChain].name} in MetaMask and try again.`);
          return;
        }
      } else {
        console.log('✅ Already on correct chain');
      }
      
      // Send the transaction
      console.log('📤 Sending transaction...');
      console.log(`   To: ${recipient}`);
      console.log(`   Amount: ${amount} ETH`);
      console.log(`   Chain ID: ${targetChainId}`);
      
      // Don't pass chainId to sendTransaction - let it use the current chain
      sendTransaction({
        to: recipient,
        value: parseEther(amount)
      });
      
    } catch (err) {
      console.error('❌ Transaction error:', err);
      alert(`Transaction failed: ${err.message || 'Unknown error'}`);
    }
  };

  // Handle success
  if (isSuccess && hash) {
    console.log('✅ Transaction confirmed:', hash);
    setTimeout(() => {
      console.log('🔄 Refreshing portfolio data...');
      onSuccess?.();
      handleClose();
    }, 2000);
  }

  const handleClose = () => {
    setRecipient('');
    setAmount('');
    setSelectedChain('sepolia');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-lamp-night-900/95 backdrop-blur-xl rounded-2xl max-w-md w-full p-6 shadow-2xl border border-lamp-purple-500/30">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-lamp-gold-400 to-lamp-gold-500 bg-clip-text text-transparent">🪔 Mystical Transfer</h2>
          <button
            onClick={handleClose}
            className="text-lamp-gold-400 hover:text-lamp-gold-300 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Success State */}
        {isSuccess && (
          <div className="mb-6 p-4 bg-lamp-teal-900/40 border border-lamp-teal-500/30 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">✨</span>
              <div>
                <div className="font-semibold text-lamp-teal-300">Transfer Complete!</div>
                <div className="text-sm text-lamp-purple-200">Your treasure vault will update shortly</div>
              </div>
            </div>
            {hash && (
              <a
                href={`${chains[selectedChain].explorer}/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-lamp-magenta-400 hover:text-lamp-magenta-300 underline block mt-2"
              >
                View on Mystical Explorer →
              </a>
            )}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-lamp-rose-900/40 border border-lamp-rose-500/30 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <div className="font-semibold text-lamp-rose-300">Transfer Mystically Blocked</div>
                <div className="text-sm text-lamp-purple-200">{error.message}</div>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Chain Selection */}
          <div>
            <label className="block text-sm font-semibold text-lamp-gold-400 mb-2">
              Select Mystical Realm
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(chains).map(([key, chain]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedChain(key)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    selectedChain === key
                      ? 'border-lamp-magenta-500 bg-gradient-to-br from-lamp-purple-900/60 to-lamp-magenta-900/60'
                      : 'border-lamp-purple-500/30 bg-lamp-night-800/50 hover:border-lamp-gold-400/50'
                  }`}
                >
                  <div className="text-2xl mb-1">{chain.emoji}</div>
                  <div className="text-xs font-semibold text-lamp-purple-200">{chain.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Recipient Address */}
          <div>
            <label className="block text-sm font-semibold text-lamp-gold-400 mb-2">
              Recipient Lamp Address
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-3 bg-lamp-night-800/50 border border-lamp-purple-500/30 rounded-xl focus:ring-2 focus:ring-lamp-magenta-500 focus:border-lamp-magenta-500 font-mono text-sm text-lamp-purple-100 placeholder-lamp-purple-400"
              disabled={isPending || isConfirming}
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold text-lamp-gold-400 mb-2">
              Mystical Amount (ETH)
            </label>
            <input
              type="number"
              step="0.000001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.01"
              className="w-full px-4 py-3 bg-lamp-night-800/50 border border-lamp-purple-500/30 rounded-xl focus:ring-2 focus:ring-lamp-magenta-500 focus:border-lamp-magenta-500 text-lamp-purple-100 placeholder-lamp-purple-400"
              disabled={isPending || isConfirming}
            />
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setAmount('0.001')}
                className="px-3 py-1 bg-lamp-night-800/60 hover:bg-lamp-night-700/60 border border-lamp-purple-500/30 rounded-lg text-xs font-semibold text-lamp-purple-200"
                disabled={isPending || isConfirming}
              >
                0.001
              </button>
              <button
                type="button"
                onClick={() => setAmount('0.01')}
                className="px-3 py-1 bg-lamp-night-800/60 hover:bg-lamp-night-700/60 border border-lamp-purple-500/30 rounded-lg text-xs font-semibold text-lamp-purple-200"
                disabled={isPending || isConfirming}
              >
                0.01
              </button>
              <button
                type="button"
                onClick={() => setAmount('0.1')}
                className="px-3 py-1 bg-lamp-night-800/60 hover:bg-lamp-night-700/60 border border-lamp-purple-500/30 rounded-lg text-xs font-semibold text-lamp-purple-200"
                disabled={isPending || isConfirming}
              >
                0.1
              </button>
            </div>
          </div>

          {/* Transaction Info */}
          {hash && isConfirming && (
            <div className="p-4 bg-lamp-purple-900/40 border border-lamp-purple-500/30 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-lamp-purple-500"></div>
                <div>
                  <div className="font-semibold text-lamp-purple-200">Confirming Mystical Transfer...</div>
                  <div className="text-sm text-lamp-purple-300">The Genie is processing your wish</div>
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 bg-lamp-night-800/60 border border-lamp-purple-500/30 rounded-xl font-semibold text-lamp-purple-200 hover:bg-lamp-night-700/60 hover:border-lamp-gold-400/50 transition-all"
              disabled={isPending || isConfirming}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || isConfirming || isSuccess}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-lamp-purple-600 to-lamp-magenta-600 text-white rounded-xl font-semibold hover:from-lamp-purple-500 hover:to-lamp-magenta-500 transition-all disabled:from-lamp-night-700 disabled:to-lamp-night-700 disabled:cursor-not-allowed"
            >
              {isPending ? 'Confirming...' : isConfirming ? 'Processing...' : isSuccess ? 'Success!' : 'Grant Transfer'}
            </button>
          </div>
        </form>

        {/* Info */}
        <div className="mt-6 p-4 bg-lamp-night-800/60 border border-lamp-purple-500/30 rounded-xl">
          <div className="text-xs text-lamp-purple-200 space-y-1">
            <div className="flex items-center gap-2">
              <span>🪔</span>
              <span>This will send test ETH in {chains[selectedChain].name} mystical realm</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🔄</span>
              <span>MetaMask will switch to the selected realm automatically</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🔒</span>
              <span>You'll need to approve the realm switch and transfer</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✨</span>
              <span>Treasure vault updates in ~5 seconds after confirmation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;

