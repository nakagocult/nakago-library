import { createThirdwebClient, getContract } from 'thirdweb';
import { ethereum } from 'thirdweb/chains';

// The client id is injected at deploy time. A harmless placeholder keeps
// server prerendering from throwing when the env var is absent locally —
// every real on-chain read still requires the production client id.
const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || 'placeholder-client-id';

if (typeof window !== 'undefined' && clientId === 'placeholder-client-id') {
  // Every on-chain read/write (claim, balances, NFT lookups) fails silently
  // against the placeholder id — surface it loudly instead of letting it
  // look like a random network error in production.
  console.error(
    '[naka] NEXT_PUBLIC_THIRDWEB_CLIENT_ID is not set — claim, balance, and NFT reads will fail.',
  );
}

export const client = createThirdwebClient({ clientId });

export const chain = ethereum;

export const NIPPO_ADDRESS =
  process.env.NEXT_PUBLIC_NIPPO_CONTRACT ?? '0x69411ADa5CccF7bbfb19428462a7bB6c38BCb4Cb';

export const FOUNDER_PASS_ADDRESS =
  process.env.NEXT_PUBLIC_FOUNDER_PASS_CONTRACT ?? '0x14Ab8f5c26eBABD31A66b89dC38d2D21D5E01C67';

export const nippoContract = getContract({ client, chain, address: NIPPO_ADDRESS });
export const founderPassContract = getContract({ client, chain, address: FOUNDER_PASS_ADDRESS });
