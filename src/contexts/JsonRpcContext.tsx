import { createContext, PropsWithChildren, useContext } from 'react';
import { ChiaMethod } from '../constants/wallet-connect';
import { GetNfts } from '../types/GetNfts';
import { SignMessageById } from '../types/SignMessageById';
import { useWalletConnect } from './WalletConnectContext';

interface JsonRpc {
    signMessageById: (message: string, id: string) => Promise<SignMessageById>;
    getNfts: (
        walletId: number,
        num: number,
        startIndex: number
    ) => Promise<GetNfts>;
}

export const JsonRpcContext = createContext<JsonRpc>({} as JsonRpc);

export function JsonRpcProvider({ children }: PropsWithChildren) {
    const { client, session, chainId, fingerprint } = useWalletConnect();

    async function request<T>(method: ChiaMethod, data: any): Promise<T> {
        if (!client) throw new Error('WalletConnect is not initialized');
        if (!session) throw new Error('Session is not connected');
        if (!fingerprint) throw new Error('Fingerprint is not loaded.');

        const result = await client!.request<
            { data: T } | { error: { data: { error: string } } }
        >({
            topic: session!.topic,
            chainId,
            request: {
                method,
                params: { fingerprint, ...data },
            },
        });

        if ('error' in result) throw new Error(result.error.data.error);

        return result.data;
    }

    async function signMessageById(message: string, id: string) {
        return await request<SignMessageById>(ChiaMethod.SignMessageById, {
            message,
            id,
        });
    }

    async function getNfts(walletId: number, num: number, startIndex: number) {
        return await request<GetNfts>(ChiaMethod.GetNfts, {
            walletId,
            num,
            startIndex,
        });
    }

    return (
        <JsonRpcContext.Provider value={{ signMessageById, getNfts }}>
            {children}
        </JsonRpcContext.Provider>
    );
}

export function useJsonRpc() {
    const context = useContext(JsonRpcContext);

    if (context === undefined) {
        throw new Error(
            'useJsonRpc must be used within a JsonRpcContextProvider'
        );
    }

    return context;
}
