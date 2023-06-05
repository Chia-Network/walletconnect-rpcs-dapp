import { Trade } from '../TradeRecord';

export interface CreateOfferForIdsRequest {
    walletIdsAndAmounts: any;
    driverDict: any;
    validateOnly?: boolean;
    disableJSONFormatting?: boolean;
}

export interface CreateOfferForIdsResponse {
    offer: string;
    tradeRecord: Trade;
}
