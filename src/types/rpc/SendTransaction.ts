import { Transaction } from '../Transaction';

export interface SendTransactionRequest {
    amount: number;
    fee: number;
    address: string;
    walletId?: number;
    waitForConfirmation?: boolean;
    memos?: string[]; // untested
}

export interface SendTransactionResponse {
    success: true;
    transaction: Transaction;
    transactionId: string;
}