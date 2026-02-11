export interface GetCoinRecordsByNamesRequest {
    /**
     * Coin names / coin ids (bytes32[]) as hex strings.
     *
     * Example: ["0xabc...", "0xdef..."]
     */
    names: string[];
    startHeight?: number;
    endHeight?: number;
    includeSpentCoins?: boolean;
}

// Wallet responses vary by implementation; keep permissive for debug tool use.
export type GetCoinRecordsByNamesResponse = any;

