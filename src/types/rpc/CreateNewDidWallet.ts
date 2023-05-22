export interface CreateNewDidWalletRequest {
    amount: number;
    fee: number;
    backupDids: string[];
    numOfBackupIdsNeeded: number;
}

export interface CreateNewDidWalletResponse {}
