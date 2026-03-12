import { TradeRecord } from '../TradeRecord';

export interface CreateOfferForIdsRequest {
    offer: any;
    driverDict: any;
    validateOnly?: boolean;
    disableJSONFormatting?: boolean;
    extraConditions?: any[];
}

export interface CreateOfferForIdsResponse {
    offer: string;
    tradeRecord: TradeRecord;
}
