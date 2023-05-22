import { createContext, PropsWithChildren, useContext } from 'react';
import { ChiaMethod } from '../constants/wallet-connect';
import {
    GetCurrentAddressRequest,
    GetCurrentAddressResponse,
} from '../types/rpc/GetCurrentAddress';
import { GetNftInfoRequest, GetNftInfoResponse } from '../types/rpc/GetNftInfo';
import { GetNftsRequest, GetNftsResponse } from '../types/rpc/GetNfts';
import {
    GetNftsCountRequest,
    GetNftsCountResponse,
} from '../types/rpc/GetNftsCount';
import {
    GetTransactionRequest,
    GetTransactionResponse,
} from '../types/rpc/GetTransaction';
import {
    GetWalletBalanceRequest,
    GetWalletBalanceResponse,
} from '../types/rpc/GetWalletBalance';
import { GetWalletsRequest, GetWalletsResponse } from '../types/rpc/GetWallets';
import { LogInRequest, LogInResponse } from '../types/rpc/LogIn';
import {
    SendTransactionRequest,
    SendTransactionResponse,
} from '../types/rpc/SendTransaction';
import {
    SignMessageByAddressRequest,
    SignMessageByAddressResponse,
} from '../types/rpc/SignMessageByAddress';
import {
    SignMessageByIdRequest,
    SignMessageByIdResponse,
} from '../types/rpc/SignMessageById';
import {
    TransferNftRequest,
    TransferNftResponse,
} from '../types/rpc/TransferNft';
import {
    VerifySignatureRequest,
    VerifySignatureResponse,
} from '../types/rpc/VerifySignature';
import { useWalletConnect } from './WalletConnectContext';

interface JsonRpc {
    // Wallet
    logIn: (data: LogInRequest) => Promise<LogInResponse>;
    getWallets: (data: GetWalletsRequest) => Promise<GetWalletsResponse>;
    getTransaction: (
        data: GetTransactionRequest
    ) => Promise<GetTransactionResponse>;
    getWalletBalance: (
        data: GetWalletBalanceRequest
    ) => Promise<GetWalletBalanceResponse>;
    getCurrentAddress: (
        data: GetCurrentAddressRequest
    ) => Promise<GetCurrentAddressResponse>;
    sendTransaction: (
        data: SendTransactionRequest
    ) => Promise<SendTransactionResponse>;
    signMessageByAddress: (
        data: SignMessageByAddressRequest
    ) => Promise<SignMessageByAddressResponse>;
    verifySignature: (
        data: VerifySignatureRequest
    ) => Promise<VerifySignatureResponse>;

    // DID
    signMessageById: (
        data: SignMessageByIdRequest
    ) => Promise<SignMessageByIdResponse>;

    // NFT
    getNfts: (data: GetNftsRequest) => Promise<GetNftsResponse>;
    getNftInfo: (data: GetNftInfoRequest) => Promise<GetNftInfoResponse>;
    transferNft: (data: TransferNftRequest) => Promise<TransferNftResponse>;
    getNftsCount: (data: GetNftsCountRequest) => Promise<GetNftsCountResponse>;
}

export const JsonRpcContext = createContext<JsonRpc>({} as JsonRpc);

export function JsonRpcProvider({ children }: PropsWithChildren) {
    const { client, session, chainId, fingerprint } = useWalletConnect();

    async function request<T>(method: ChiaMethod, data: any): Promise<T> {
        if (!client) throw new Error('WalletConnect is not initialized');
        if (!session) throw new Error('Session is not connected');
        if (!fingerprint) throw new Error('Fingerprint is not loaded.');

        const result = await client!.request<{ data: T } | { error: any }>({
            topic: session!.topic,
            chainId,
            request: {
                method,
                params: { fingerprint, ...data },
            },
        });

        if ('error' in result) throw new Error(JSON.stringify(result.error));

        return result.data;
    }

    // Wallet
    async function logIn(data: LogInRequest) {
        return await request<LogInResponse>(ChiaMethod.LogIn, data);
    }

    async function getWallets(data: GetWalletsRequest) {
        return await request<GetWalletsResponse>(ChiaMethod.GetWallets, data);
    }

    async function getTransaction(data: GetTransactionRequest) {
        return await request<GetTransactionResponse>(
            ChiaMethod.GetTransaction,
            data
        );
    }

    async function getWalletBalance(data: GetWalletBalanceRequest) {
        return await request<GetWalletBalanceResponse>(
            ChiaMethod.GetWalletBalance,
            data
        );
    }

    async function getCurrentAddress(data: GetCurrentAddressRequest) {
        return await request<GetCurrentAddressResponse>(
            ChiaMethod.GetCurrentAddress,
            data
        );
    }

    async function sendTransaction(data: SendTransactionRequest) {
        return await request<SendTransactionResponse>(
            ChiaMethod.SendTransaction,
            data
        );
    }

    async function signMessageByAddress(data: SignMessageByAddressRequest) {
        return await request<SignMessageByAddressResponse>(
            ChiaMethod.SignMessageByAddress,
            data
        );
    }

    async function verifySignature(data: VerifySignatureRequest) {
        return await request<VerifySignatureResponse>(
            ChiaMethod.VerifySignature,
            data
        );
    }

    // DID
    async function signMessageById(data: SignMessageByIdRequest) {
        return await request<SignMessageByIdResponse>(
            ChiaMethod.SignMessageById,
            data
        );
    }

    // NFT
    async function getNfts(data: GetNftsRequest) {
        return await request<GetNftsResponse>(ChiaMethod.GetNfts, data);
    }

    async function getNftInfo(data: GetNftInfoRequest) {
        return await request<GetNftInfoResponse>(ChiaMethod.GetNftInfo, data);
    }

    async function transferNft(data: TransferNftRequest) {
        return await request<TransferNftResponse>(ChiaMethod.TransferNft, data);
    }

    async function getNftsCount(data: GetNftsCountRequest) {
        return await request<GetNftsCountResponse>(
            ChiaMethod.GetNftsCount,
            data
        );
    }

    return (
        <JsonRpcContext.Provider
            value={{
                // Wallet
                logIn,
                getWallets,
                getTransaction,
                getWalletBalance,
                getCurrentAddress,
                sendTransaction,
                signMessageByAddress,
                verifySignature,

                // DID
                signMessageById,

                // NFT
                getNfts,
                getNftInfo,
                transferNft,
                getNftsCount,
            }}
        >
            {children}
        </JsonRpcContext.Provider>
    );
}

export function useJsonRpc() {
    const context = useContext(JsonRpcContext);

    if (!context)
        throw new Error(
            'Calls to `useJsonRpc` must be used within a `JsonRpcProvider`.'
        );

    return context;
}
