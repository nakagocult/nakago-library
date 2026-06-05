import { createThirdwebClient, getContract } from 'thirdweb';
import { ethereum } from 'thirdweb/chains';

// The client id is injected at deploy time. A harmless placeholder keeps
// server prerendering from throwing when the env var is absent locally —
// every real on-chain read still requires the production client id.
const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || 'placeholder-client-id';

export const client = createThirdwebClient({ clientId });

export const chain = ethereum;

export const NIPPO_ADDRESS =
  process.env.NEXT_PUBLIC_NIPPO_CONTRACT ?? '0x69411ADa5CccF7bbfb19428462a7bB6c38BCb4Cb';

export const FOUNDER_PASS_ADDRESS =
  process.env.NEXT_PUBLIC_FOUNDER_PASS_CONTRACT ?? '0x14Ab8f5c26eBABD31A66b89dC38d2D21D5E01C67';

export const nippoContract = getContract({ client, chain, address: NIPPO_ADDRESS });
export const founderPassContract = getContract({ client, chain, address: FOUNDER_PASS_ADDRESS });
