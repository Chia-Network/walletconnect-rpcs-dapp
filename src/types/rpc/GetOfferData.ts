import { Trade } from '../TradeRecord';

export interface GetOfferDataRequest {
    offerId: string;
}

export interface GetOfferDataResponse {
    offer: string;
    tradeRecord: Trade;
    success: true;
}
