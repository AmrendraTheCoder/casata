import { useWallet } from '../hooks/useWallet';
import { shortenAddress } from '../utils/constants';

const WalletConnect = () => {
  const { address, isConnected, isConnecting, connect, disconnect } = useWallet();

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 bg-lamp-teal-500/20 px-3 py-2 rounded-lg border border-lamp-teal-400/50 backdrop-blur-sm">
          <div className="w-1.5 h-1.5 bg-lamp-teal-400 rounded-full animate-pulse"></div>
          <span className="text-xs font-mono font-medium text-lamp-gold-300">
            {shortenAddress(address)}
          </span>
        </div>
        <button
          onClick={disconnect}
          className="text-xs text-lamp-purple-300 hover:text-lamp-rose-400 transition-colors px-2 py-1 rounded hover:bg-lamp-night-800"
        >
          Release Lamp
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      disabled={isConnecting}
      className="bg-gradient-to-r from-lamp-gold-500 to-lamp-gold-600 hover:from-lamp-gold-400 hover:to-lamp-gold-500 text-lamp-night-950 text-sm font-bold px-6 py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-lamp-gold-600/50 hover:scale-105"
    >
      {isConnecting ? (
        <>
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Summoning...</span>
        </>
      ) : (
        <>
          <span>🪔</span>
          <span>Summon Your Lamp</span>
        </>
      )}
    </button>
  );
};

export default WalletConnect;

