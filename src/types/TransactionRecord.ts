import { Peer } from './Peer';
import { SpendBundle } from './SpendBundle';
import { TransactionType } from './TransactionType';

export interface AdditionsOrRemovals {
    amount: number;
    parentCoinInfo: string;
    puzzleHash: string;
}

export interface TransactionRecord {
    additions: AdditionsOrRemovals[];
    amount: number;
    confirmed: boolean;
    confirmedAtHeight: number;
    createdAtTime: number;
    feeAmount: number;
    memos: Record<string, string>;
    name: string;
    removals: AdditionsOrRemovals[];
    sent: number;
    sentTo: Peer[];
    spendBundle: SpendBundle | null;
    toAddress: string;
    toPuzzleHash: string;
    tradeId: string | null;
    type: TransactionType;
    walletId: number;
}
