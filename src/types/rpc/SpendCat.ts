import { TransactionRecord } from '../TransactionRecord';

export interface SpendCatRequest {
    walletId: number;
    address: string;
    amount: string;
    fee: string;
    memos?: string[];
    waitForConfirmation?: boolean;
}

export interface SpendCatResponse {
    transaction: TransactionRecord;
    transactionId: string;
    success: true;
}
