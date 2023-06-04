import { SpendBundle } from '../SpendBundle';

export interface TransferNftRequest {
    walletId: number;
    nftCoinId: string;
    launcherId: string;
    targetAddress: string;
    fee: number;
}

export interface TransferNftResponse {
    walletId: number | number[];
    spendBundle: SpendBundle;
    txNum?: number;
}
