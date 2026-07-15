import { WalletType } from '../WalletType';

export interface CreateNewDidWalletRequest {
    amount: string;
    fee: string;
    backupDids: string[];
    numOfBackupIdsNeeded: number;
}

export interface CreateNewDidWalletResponse {
    myDid: string;
    type: WalletType.DecentralizedId;
    walletId: number;
    success: true;
}
