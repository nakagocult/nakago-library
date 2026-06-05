/**
 * Standalone drop verifier — confirms the two NFT contracts are claimable
 * thirdweb Drops with a live claim condition, and prints the on-chain price,
 * currency and supply. Run this anywhere with network access (it cannot run
 * inside the build sandbox, whose network policy blocks RPC endpoints).
 *
 *   node scripts/verify-drops.mjs
 *   RPC_URL=https://your-rpc node scripts/verify-drops.mjs
 *
 * Exit code is 0 when both drops are live and claimable, 1 otherwise.
 */

import { JsonRpcProvider, Contract, formatEther } from 'ethers';

const RPC_URL = process.env.RPC_URL ?? 'https://ethereum-rpc.publicnode.com';

const CONTRACTS = [
  { name: 'NIPPO Pedigree Archives', address: '0x69411ADa5CccF7bbfb19428462a7bB6c38BCb4Cb' },
  { name: 'Naka Labs Founder Pass', address: '0x14Ab8f5c26eBABD31A66b89dC38d2D21D5E01C67' },
];

const NATIVE = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

const ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function contractType() view returns (bytes32)',
  'function nextTokenIdToMint() view returns (uint256)',
  'function totalMinted() view returns (uint256)',
  'function getActiveClaimConditionId() view returns (uint256)',
  'function getClaimConditionById(uint256 conditionId) view returns (tuple(uint256 startTimestamp, uint256 maxClaimableSupply, uint256 supplyClaimed, uint256 quantityLimitPerWallet, bytes32 merkleRoot, uint256 pricePerToken, address currency, string metadata))',
];

const safe = async (fn) => { try { return await fn(); } catch { return undefined; } };

async function inspect(provider, { name, address }) {
  const c = new Contract(address, ABI, provider);
  console.log(`\n── ${name}`);
  console.log(`   ${address}`);

  const code = await provider.getCode(address);
  if (code === '0x') {
    console.log('   ❌ No contract deployed at this address on this network.');
    return false;
  }

  const [nm, sym, type, minted] = await Promise.all([
    safe(() => c.name()),
    safe(() => c.symbol()),
    safe(() => c.contractType()),
    safe(async () => (await safe(() => c.totalMinted())) ?? (await c.nextTokenIdToMint())),
  ]);

  if (nm || sym) console.log(`   token: ${nm ?? '?'} (${sym ?? '?'})`);
  if (type) console.log(`   contractType: ${Buffer.from(type.slice(2), 'hex').toString('utf8').replace(/\0/g, '')}`);
  if (minted !== undefined) console.log(`   minted so far: ${minted.toString()}`);

  const conditionId = await safe(() => c.getActiveClaimConditionId());
  if (conditionId === undefined) {
    console.log('   ⚠️  No active claim condition / not a standard Drop.');
    console.log('       → Use <TransactionButton> against the real claim function instead of <ClaimButton>.');
    return false;
  }

  const cond = await safe(() => c.getClaimConditionById(conditionId));
  if (!cond) {
    console.log('   ⚠️  Active condition id found but details unreadable.');
    return false;
  }

  const price = cond.pricePerToken;
  const isNative = cond.currency.toLowerCase() === NATIVE;
  const start = Number(cond.startTimestamp) * 1000;
  const live = Date.now() >= start;
  const remaining = cond.maxClaimableSupply - cond.supplyClaimed;

  console.log(`   price: ${formatEther(price)} ${isNative ? 'ETH' : cond.currency}`);
  console.log(`   cap: ${cond.maxClaimableSupply.toString()} | claimed: ${cond.supplyClaimed.toString()} | remaining: ${remaining.toString()}`);
  console.log(`   per-wallet limit: ${cond.quantityLimitPerWallet.toString()}`);
  console.log(`   starts: ${new Date(start).toISOString()} ${live ? '(live)' : '(NOT live yet)'}`);

  if (live && remaining > 0n) {
    console.log('   ✅ Drop is live and claimable — ClaimButton ERC721 wiring is correct.');
    return true;
  }
  if (!live) console.log('   ⚠️  Claim condition not started yet.');
  if (remaining <= 0n) console.log('   ⚠️  Fully claimed.');
  return false;
}

async function main() {
  console.log(`RPC: ${RPC_URL}`);
  const provider = new JsonRpcProvider(RPC_URL);
  let allGood = true;
  for (const contract of CONTRACTS) {
    const ok = await inspect(provider, contract).catch((e) => {
      console.log(`   ❌ ${e.message}`);
      return false;
    });
    allGood = allGood && ok;
  }
  console.log(`\n${allGood ? '✅ Both drops are live and claimable.' : '⚠️  One or more drops need attention (see above).'}`);
  process.exit(allGood ? 0 : 1);
}

main();
