import { SpendBundle } from './SpendBundle';
import { TransactionType } from './TransactionType';

interface AdditionsOrRemovals {
    amount: number;
    parentCoinInfo: string;
    puzzleHash: string;
}

type Peer = [string, number, string | null];

export interface Transaction {
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
