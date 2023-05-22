import { Transaction } from '../Transaction';

export interface SendTransactionRequest {
    walletId: number;
    amount: number;
    fee: number;
    address: string;
    memos?: string[];
    waitForConfirmation?: boolean;
}

export interface SendTransactionResponse {
    success: true;
    transaction: Transaction;
    transactionId: string;
}
