import { Coin } from '../Coin';

export interface GetSpendableCoinsRequest {
    walletId: number;
    minCoinAmount?: number;
    maxCoinAmount?: number;
    excludedCoinAmounts?: number[];
    excludedCoinIds?: string[];
}

export interface GetSpendableCoinsResponse {
    confirmedRecords: Coin[];
    unconfirmedRemovals: Coin[];
    unconfirmedAdditions: Coin[];
}
