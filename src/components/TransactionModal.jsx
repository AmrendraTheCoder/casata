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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Send Transaction</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Success State */}
        {isSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">✅</span>
              <div>
                <div className="font-semibold text-green-900">Transaction Successful!</div>
                <div className="text-sm text-green-700">Your portfolio will update shortly</div>
              </div>
            </div>
            {hash && (
              <a
                href={`${chains[selectedChain].explorer}/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-green-600 hover:text-green-700 underline block mt-2"
              >
                View on Explorer →
              </a>
            )}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-2xl">❌</span>
              <div>
                <div className="font-semibold text-red-900">Transaction Failed</div>
                <div className="text-sm text-red-700">{error.message}</div>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Chain Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Chain
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(chains).map(([key, chain]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedChain(key)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    selectedChain === key
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{chain.emoji}</div>
                  <div className="text-xs font-semibold text-gray-700">{chain.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Recipient Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Recipient Address
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              disabled={isPending || isConfirming}
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Amount (ETH)
            </label>
            <input
              type="number"
              step="0.000001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.01"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isPending || isConfirming}
            />
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setAmount('0.001')}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-semibold text-gray-700"
                disabled={isPending || isConfirming}
              >
                0.001
              </button>
              <button
                type="button"
                onClick={() => setAmount('0.01')}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-semibold text-gray-700"
                disabled={isPending || isConfirming}
              >
                0.01
              </button>
              <button
                type="button"
                onClick={() => setAmount('0.1')}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-semibold text-gray-700"
                disabled={isPending || isConfirming}
              >
                0.1
              </button>
            </div>
          </div>

          {/* Transaction Info */}
          {hash && isConfirming && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <div>
                  <div className="font-semibold text-blue-900">Confirming Transaction...</div>
                  <div className="text-sm text-blue-700">Please wait for confirmation</div>
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
              disabled={isPending || isConfirming}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || isConfirming || isSuccess}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isPending ? 'Confirming...' : isConfirming ? 'Processing...' : isSuccess ? 'Success!' : 'Send Transaction'}
            </button>
          </div>
        </form>

        {/* Info */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex items-center gap-2">
              <span>💡</span>
              <span>This will send test ETH on {chains[selectedChain].name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🔄</span>
              <span>MetaMask will switch to the selected network automatically</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🔒</span>
              <span>You'll need to approve the network switch and transaction</span>
            </div>
            <div className="flex items-center gap-2">
              <span>⚡</span>
              <span>Portfolio updates in ~5 seconds after confirmation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;

