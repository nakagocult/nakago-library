'use client';

import { useEffect } from 'react';
import { useWalletClient } from 'wagmi';
import { useConnect } from 'thirdweb/react';
import { viemAdapter } from 'thirdweb/adapters/viem';

export function WagmiThirdwebBridge() {
  const { data: walletClient } = useWalletClient();
  const { connect } = useConnect();

  useEffect(() => {
    if (!walletClient) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wallet = viemAdapter.wallet.fromViem({ walletClient: walletClient as any });
    connect(async () => wallet);
  }, [walletClient, connect]);

  return null;
}
