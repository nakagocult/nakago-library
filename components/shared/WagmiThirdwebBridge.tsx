'use client';

import { useEffect, useRef } from 'react';
import { useWalletClient, useChainId } from 'wagmi';
import { useConnect, useActiveAccount } from 'thirdweb/react';
import { viemAdapter } from 'thirdweb/adapters/viem';
import { defineChain } from 'thirdweb';
import { client } from '@/lib/thirdweb/client';

export function WagmiThirdwebBridge() {
  const { data: walletClient } = useWalletClient();
  const chainId = useChainId();
  const { connect } = useConnect();
  const account = useActiveAccount();
  const connectedAddress = useRef<string | null>(null);

  useEffect(() => {
    if (!walletClient) {
      connectedAddress.current = null;
      return;
    }
    if (connectedAddress.current === walletClient.account.address && account) return;

    connectedAddress.current = walletClient.account.address;
    connect(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const wallet = viemAdapter.wallet.fromViem({ walletClient: walletClient as any });
      await wallet.connect({ client, chain: defineChain(chainId) });
      return wallet;
    });
  }, [walletClient, chainId, connect, account]);

  return null;
}
