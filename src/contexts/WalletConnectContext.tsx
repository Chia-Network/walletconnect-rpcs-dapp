import Client from '@walletconnect/sign-client';
import { PairingTypes, SessionTypes } from '@walletconnect/types';
import { getSdkError } from '@walletconnect/utils';
import { Web3Modal } from '@web3modal/standalone';

import {
    createContext,
    PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { METADATA, REQUIRED_NAMESPACES } from '../constants/wallet-connect';

interface WalletConnect {
    client?: Client;
    web3Modal?: Web3Modal;
    session?: SessionTypes.Struct;
    chainId: string;
    fingerprint?: string;
    connect: (pairing?: { topic: string }) => Promise<void>;
    disconnect: () => Promise<void>;
    isInitializing: boolean;
    pairings: PairingTypes.Struct[];
    accounts: string[];
}

export const WalletConnectContext = createContext<WalletConnect>(
    {} as WalletConnect
);

export interface WalletConnectProviderProps extends PropsWithChildren {
    projectId: string;
    relayUrl: string;
    chainId: string;
}

export function WalletConnectProvider({
    projectId,
    relayUrl,
    chainId,
    children,
}: WalletConnectProviderProps) {
    const [web3Modal, setWeb3Modal] = useState<Web3Modal>();
    const [client, setClient] = useState<Client>();
    const [pairings, setPairings] = useState<PairingTypes.Struct[]>([]);
    const [session, setSession] = useState<SessionTypes.Struct>();
    const [fingerprint, setFingerprint] = useState<string>();
    const [isInitializing, setIsInitializing] = useState(false);
    const [accounts, setAccounts] = useState<string[]>([]);

    const reset = () => {
        setSession(undefined);
        setAccounts([]);
    };

    const onSessionConnected = useCallback((session: SessionTypes.Struct) => {
        const allNamespaceAccounts = Object.values(session.namespaces)
            .map((namespace) => namespace.accounts)
            .flat();

        setSession(session);
        setAccounts(allNamespaceAccounts);
        setFingerprint(allNamespaceAccounts[0].split(':')[2]);
    }, []);

    const connect = useCallback(
        async (pairing: any) => {
            if (!client) {
                throw new Error('WalletConnect is not initialized');
            }

            if (!web3Modal) {
                throw new Error('Web3Modal is not initialized');
            }

            try {
                const { uri, approval } = await client.connect({
                    pairingTopic: pairing?.topic,
                    requiredNamespaces: REQUIRED_NAMESPACES,
                });

                if (uri) {
                    web3Modal.openModal({ uri });
                    const session = await approval();
                    onSessionConnected(session);
                    setPairings(client.pairing.getAll({ active: true }));
                }
            } catch (e) {
                if (e) {
                    console.error(e);
                }
            } finally {
                web3Modal.closeModal();
            }
        },
        [client, onSessionConnected]
    );

    const disconnect = useCallback(async () => {
        if (!client) {
            throw new Error('WalletConnect is not initialized');
        }

        if (!session) {
            throw new Error('Session is not connected');
        }

        await client.disconnect({
            topic: session.topic,
            reason: getSdkError('USER_DISCONNECTED'),
        });

        reset();
    }, [client, session]);

    const subscribeToEvents = useCallback(
        async (client: Client) => {
            if (!client) {
                throw new Error('WalletConnect is not initialized');
            }

            client.on('session_update', ({ topic, params }) => {
                const { namespaces } = params;
                const session = client.session.get(topic);
                const updatedSession = { ...session, namespaces };
                onSessionConnected(updatedSession);
            });

            client.on('session_delete', () => {
                reset();
            });
        },
        [onSessionConnected]
    );

    const checkPersistedState = useCallback(
        async (client: Client) => {
            if (!client) {
                throw new Error('WalletConnect is not initialized.');
            }

            setPairings(client.pairing.getAll({ active: true }));

            if (session) return;

            if (client.session.length) {
                const lastKeyIndex = client.session.keys.length - 1;
                const session = client.session.get(
                    client.session.keys[lastKeyIndex]
                );

                onSessionConnected(session);

                return session;
            }
        },
        [session, onSessionConnected]
    );

    const createClient = useCallback(async () => {
        try {
            setIsInitializing(true);

            const client = await Client.init({
                relayUrl: relayUrl,
                projectId: projectId,
                metadata: METADATA,
            });

            setClient(client);

            const web3Modal = new Web3Modal({
                projectId,
                standaloneChains: [chainId],
                walletConnectVersion: 2,
            });

            setWeb3Modal(web3Modal);

            await subscribeToEvents(client);
            await checkPersistedState(client);
        } catch (err) {
            throw err;
        } finally {
            setIsInitializing(false);
        }
    }, [checkPersistedState, subscribeToEvents]);

    useEffect(() => {
        if (!client) {
            createClient();
        }
    }, [createClient]);

    const value = useMemo(
        () => ({
            pairings,
            isInitializing,
            accounts,
            client,
            web3Modal,
            session,
            fingerprint,
            connect,
            disconnect,
        }),
        [
            pairings,
            isInitializing,
            accounts,
            client,
            web3Modal,
            session,
            fingerprint,
            connect,
            disconnect,
        ]
    );

    return (
        <WalletConnectContext.Provider
            value={{
                chainId,
                ...value,
            }}
        >
            {children}
        </WalletConnectContext.Provider>
    );
}

export function useWalletConnect() {
    const context = useContext(WalletConnectContext);

    if (!context) {
        throw new Error(
            'useWalletConnectClient must be used within a WalletConnectContext provider'
        );
    }

    return context;
}
