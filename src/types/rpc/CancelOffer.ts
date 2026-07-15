export interface CancelOfferRequest {
    tradeId: string;
    secure: boolean;
    fee: string;
}

export interface CancelOfferResponse {
    success: true;
}
