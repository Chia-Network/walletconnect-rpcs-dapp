import { TransactionRecord } from '../TransactionRecord';

export interface SendTransactionRequest {
    amount: string;
    fee: string;
    address: string;
    walletId?: number;
    waitForConfirmation?: boolean;
    memos?: string[];
}

export interface SendTransactionResponse {
    success: true;
    transaction: TransactionRecord;
    transactionId: string;
}
