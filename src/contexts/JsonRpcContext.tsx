import { createContext, PropsWithChildren, useContext } from 'react';
import { ChiaMethod } from '../constants/wallet-connect';
import { GetNftInfoRequest, GetNftInfoResponse } from '../types/rpc/GetNftInfo';
import { GetNftsRequest, GetNftsResponse } from '../types/rpc/GetNfts';
import {
    SignMessageByIdRequest,
    SignMessageByIdResponse,
} from '../types/rpc/SignMessageById';
import { useWalletConnect } from './WalletConnectContext';

interface JsonRpc {
    signMessageById: (
        data: SignMessageByIdRequest
    ) => Promise<SignMessageByIdResponse>;
    getNfts: (data: GetNftsRequest) => Promise<GetNftsResponse>;
    getNftInfo: (data: GetNftInfoRequest) => Promise<GetNftInfoResponse>;
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

    async function signMessageById(data: SignMessageByIdRequest) {
        return await request<SignMessageByIdResponse>(
            ChiaMethod.SignMessageById,
            data
        );
    }

    async function getNfts(data: GetNftsRequest) {
        return await request<GetNftsResponse>(ChiaMethod.GetNfts, data);
    }

    async function getNftInfo(data: GetNftInfoRequest) {
        return await request<GetNftInfoResponse>(ChiaMethod.GetNftInfo, data);
    }

    return (
        <JsonRpcContext.Provider
            value={{ signMessageById, getNfts, getNftInfo }}
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
