import { Summary } from '../TradeRecord';

export interface GetOfferSummaryRequest {
    offerData: string;
}

export interface GetOfferSummaryResponse {
    id: string;
    summary: Summary;
    success: true;
}
