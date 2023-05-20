import { createContext, PropsWithChildren, useContext } from 'react';
import { ChiaMethod } from '../constants/wallet-connect';
import { GetNftInfo } from '../types/rpc/GetNftInfo';
import { GetNfts } from '../types/rpc/GetNfts';
import { SignMessageById } from '../types/rpc/SignMessageById';
import { useWalletConnect } from './WalletConnectContext';

interface JsonRpc {
    signMessageById: (message: string, id: string) => Promise<SignMessageById>;
    getNfts: (
        walletIds: number[],
        num: number,
        startIndex: number
    ) => Promise<GetNfts>;
    getNftInfo: (coinId: string) => Promise<GetNftInfo>;
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

    async function signMessageById(message: string, id: string) {
        return await request<SignMessageById>(ChiaMethod.SignMessageById, {
            message,
            id,
        });
    }

    async function getNfts(
        walletIds: number[],
        num: number,
        startIndex: number
    ) {
        return await request<GetNfts>(ChiaMethod.GetNfts, {
            walletIds,
            num,
            startIndex,
        });
    }

    async function getNftInfo(coinId: string) {
        return await request<GetNftInfo>(ChiaMethod.GetNftInfo, { coinId });
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
