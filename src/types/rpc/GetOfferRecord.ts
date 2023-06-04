import { Trade } from '../Trade';

export interface GetOfferRecordRequest {
    offerId: string;
}

export interface GetOfferRecordResponse {
    offer: null;
    tradeRecord: Trade;
    success: true;
}
