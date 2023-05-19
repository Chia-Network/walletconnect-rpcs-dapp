import { NftInfo } from './NftInfo';

export interface GetNfts {
    walletId: number;
    nftList: NftInfo[];
}
