import { Coin } from '../Coin';

export interface SelectCoinsRequest {
    walletId: number;
    amount: number;
    minCoinAmount?: number;
    maxCoinAmount?: number;
    excludedCoinAmounts?: number[];
    excludedCoinIds?: string[];
}

export type SelectCoinsResponse = Coin[];
