import { TradeRecord } from '../TradeRecord';

export interface TakeOfferRequest {
    offer: string;
    fee: string;
}

export interface TakeOfferResponse {
    tradeRecord: TradeRecord;
    success: true;
}
