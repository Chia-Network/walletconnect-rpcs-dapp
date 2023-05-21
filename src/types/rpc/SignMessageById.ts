export interface SignMessageByIdRequest {
    message: string;
    id: string;
}

export interface SignMessageByIdResponse {
    latestCoinId: string;
    pubkey: string;
    signature: string;
    success: true;
}
