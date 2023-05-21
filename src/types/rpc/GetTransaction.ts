import { Transaction } from '../Transaction';

export interface GetTransactionRequest {
    transactionId: string;
}

export type GetTransactionResponse = Transaction;
