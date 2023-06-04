import { Trade } from '../Trade';

export interface GetOfferDataRequest {
    offerId: string;
}

export interface GetOfferDataResponse {
    offer: string;
    tradeRecord: Trade;
    success: true;
}
