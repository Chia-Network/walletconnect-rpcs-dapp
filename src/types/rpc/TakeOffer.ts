import { TradeRecord } from '../TradeRecord';

export interface TakeOfferRequest {
    offer: string;
    fee: number;
    extraConditions?: any[];
}

export interface TakeOfferResponse {
    tradeRecord: TradeRecord;
    success: true;
}
