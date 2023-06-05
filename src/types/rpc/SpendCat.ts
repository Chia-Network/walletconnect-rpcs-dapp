import { Transaction } from '../TransactionRecord';

export interface SpendCatRequest {
    walletId: number;
    address: string;
    amount: number;
    fee: number;
    memos?: string[];
    waitForConfirmation?: boolean;
}

export interface SpendCatResponse {
    transaction: Transaction;
    transactionId: string;
    success: true;
}
