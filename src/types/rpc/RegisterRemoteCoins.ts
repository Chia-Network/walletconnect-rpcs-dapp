export interface RegisterRemoteCoinsRequest {
    wallet_id: number; // uint32
    coin_ids: string[]; // list[bytes32]
}

export interface RegisterRemoteCoinsResponse {
    success: true;
}

