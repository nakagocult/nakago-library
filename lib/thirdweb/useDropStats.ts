'use client';

import { useReadContract } from 'thirdweb/react';
import { toEther } from 'thirdweb';
import {
  getActiveClaimCondition,
  getTotalClaimedSupply,
} from 'thirdweb/extensions/erc721';
import type { DropConfig } from './drops';
import { NATIVE_TOKEN } from './drops';

export interface DropStats {
  /** Tokens already claimed, read live from the contract. */
  claimed: number;
  /** Total supply for the drop — the live cap when available, otherwise the configured size. */
  total: number;
  /** Price per token, formatted in the claim currency. Null while loading. */
  priceLabel: string | null;
  /** Raw price per token in wei, for the claim call. */
  priceWei: bigint | null;
  currencySymbol: string;
  loading: boolean;
}

/** Pulls claimed count and the active claim condition (price, currency, cap) on-chain. */
export function useDropStats(drop: DropConfig): DropStats {
  const { data: claimedSupply, isLoading: claimedLoading } = useReadContract(
    getTotalClaimedSupply,
    { contract: drop.contract },
  );

  const { data: condition, isLoading: conditionLoading } = useReadContract(
    getActiveClaimCondition,
    { contract: drop.contract },
  );

  const claimed = claimedSupply != null ? Number(claimedSupply) : 0;

  const liveCap =
    condition?.maxClaimableSupply != null && condition.maxClaimableSupply > 0n
      ? Number(condition.maxClaimableSupply)
      : undefined;
  const total = liveCap && liveCap < 1e9 ? liveCap : drop.totalSupply;

  const priceWei = condition?.pricePerToken ?? null;
  const isNative =
    !condition?.currency || condition.currency.toLowerCase() === NATIVE_TOKEN;
  const currencySymbol = isNative ? 'ETH' : 'TOKEN';

  const priceLabel =
    priceWei != null ? `${trimEther(toEther(priceWei))} ${currencySymbol}` : null;

  return {
    claimed,
    total,
    priceLabel,
    priceWei,
    currencySymbol,
    loading: claimedLoading || conditionLoading,
  };
}

function trimEther(value: string): string {
  if (!value.includes('.')) return value;
  return value.replace(/\.?0+$/, '');
}
