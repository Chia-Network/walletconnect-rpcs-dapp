export interface GetHeightInfoRequest {}

export interface GetHeightInfoResponse {
    height: number;
    isTransactionBlock: boolean | null;
    prevTransactionBlockHeight: number | null;
}
