import { createConfig, http } from "wagmi";
import { sepolia, baseSepolia, arbitrumSepolia } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

// Get WalletConnect project ID from environment
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "";

// Configure supported chains - TESTNET MODE
export const chains = [sepolia, baseSepolia, arbitrumSepolia];

// Create wagmi config
export const config = createConfig({
  chains,
  connectors: [
    injected({
      target: "metaMask",
    }),
    // WalletConnect connector (optional, requires project ID)
    ...(projectId ? [walletConnect({ projectId })] : []),
  ],
  transports: {
    [sepolia.id]: http(),
    [baseSepolia.id]: http(),
    [arbitrumSepolia.id]: http(),
  },
});
