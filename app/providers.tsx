'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, getDefaultConfig, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ThirdwebProvider } from 'thirdweb/react';
import { WagmiThirdwebBridge } from '@/components/shared/WagmiThirdwebBridge';

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ?? 'YOUR_PROJECT_ID';

if (typeof window !== 'undefined' && projectId === 'YOUR_PROJECT_ID') {
  // WalletConnect (Trust Wallet, MetaMask Mobile, etc. when not used as the
  // in-app browser) silently fails to connect against the placeholder id.
  console.error(
    '[naka] NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is not set — WalletConnect-based wallets will fail to connect.',
  );
}

const config = getDefaultConfig({
  appName: 'Naka Cult',
  projectId,
  chains: [mainnet],
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#FF4D00',
            accentColorForeground: 'white',
            borderRadius: 'large',
            fontStack: 'system',
          })}
        >
          <ThirdwebProvider>
            <WagmiThirdwebBridge />
            {children}
          </ThirdwebProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
