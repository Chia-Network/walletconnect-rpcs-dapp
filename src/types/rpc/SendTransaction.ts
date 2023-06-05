import { Transaction } from '../TransactionRecord';

export interface SendTransactionRequest {
    amount: number;
    fee: number;
    address: string;
    walletId?: number;
    waitForConfirmation?: boolean;
    memos?: string[];
}

export interface SendTransactionResponse {
    success: true;
    transaction: Transaction;
    transactionId: string;
}
