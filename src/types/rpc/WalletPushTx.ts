export interface WalletPushTxRequest {
    spendBundle: any;
    fee?: number;
}

export interface WalletPushTxResponse {
    success: boolean;
}
