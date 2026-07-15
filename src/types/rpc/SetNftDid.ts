import { SpendBundle } from '../SpendBundle';

export interface SetNftDidRequest {
    walletId: number;
    nftLauncherId: string;
    nftCoinIds: string[];
    did: string;
    fee: string;
}

export interface SetNftDidResponse {
    spendBundle: SpendBundle;
    walletId: number;
    success: true;
}
