import { WalletType } from '../WalletType';

export interface CreateNewCatWalletRequest {
    amount: string;
    fee: string;
}

export interface CreateNewCatWalletResponse {
    assetId: string;
    type: WalletType.Cat;
    walletId: number;
    success: true;
}
