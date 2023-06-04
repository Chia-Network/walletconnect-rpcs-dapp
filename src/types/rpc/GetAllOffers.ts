import { Trade } from '../Trade';

export interface GetAllOffersRequest {
    start?: number;
    end?: number;
    sortKey?: string;
    reverse?: boolean;
    includeMyOffers?: boolean;
    includeTakenOffers?: boolean;
}

export type GetAllOffersResponse = Trade[];
