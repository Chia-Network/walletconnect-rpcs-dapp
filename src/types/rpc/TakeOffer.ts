import { Trade } from '../Trade';

export interface TakeOfferRequest {
    offer: string;
    fee: number;
}

export interface TakeOfferResponse {
    tradeRecord: Trade;
    success: true;
}
