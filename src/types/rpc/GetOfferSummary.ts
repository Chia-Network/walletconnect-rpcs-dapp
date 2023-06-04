import { Summary } from '../Trade';

export interface GetOfferSummaryRequest {
    offerData: string;
}

export interface GetOfferSummaryResponse {
    id: string;
    summary: Summary;
    success: true;
}
