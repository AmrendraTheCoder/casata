import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi';
import { injected } from 'wagmi/connectors';

export const useWallet = () => {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();

  const connectWallet = async () => {
    try {
      connect({ connector: injected({ target: 'metaMask' }) });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  };

  const disconnectWallet = () => {
    try {
      disconnect();
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      throw error;
    }
  };

  return {
    address,
    chainId,
    isConnected,
    isConnecting,
    connect: connectWallet,
    disconnect: disconnectWallet,
  };
};

