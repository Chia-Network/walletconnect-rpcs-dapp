import { TradeSummary } from '../TradeRecord';

export interface GetOfferSummaryRequest {
    offerData: string;
}

export interface GetOfferSummaryResponse {
    id: string;
    summary: TradeSummary;
    success: true;
}
