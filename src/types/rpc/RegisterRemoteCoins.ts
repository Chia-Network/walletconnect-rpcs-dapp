export interface RegisterRemoteCoinsRequest {
    walletId: number; // uint32
    coinIds: string[]; // list[bytes32]
}

export interface RegisterRemoteCoinsResponse {
    success: true;
}

