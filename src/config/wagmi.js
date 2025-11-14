import { createConfig, http } from 'wagmi';
import { mainnet, base, arbitrum } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

// Get WalletConnect project ID from environment
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '';

// Configure supported chains
export const chains = [mainnet, base, arbitrum];

// Create wagmi config
export const config = createConfig({
  chains,
  connectors: [
    injected({ 
      target: 'metaMask',
    }),
    // WalletConnect connector (optional, requires project ID)
    ...(projectId ? [walletConnect({ projectId })] : [])
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [arbitrum.id]: http(),
  },
});

