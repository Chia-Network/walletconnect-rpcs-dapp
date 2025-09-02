import { CssBaseline } from '@mui/material';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { JsonRpcProvider } from './contexts/JsonRpcContext.tsx';
import { WalletConnectProvider } from './contexts/WalletConnectContext.tsx';

// Default configuration values
const PROJECT_ID = import.meta.env.VITE_PROJECT_ID || 'b919da6c796177dc819d12110ce22cc4';
const RELAY_URL = import.meta.env.VITE_RELAY_URL || 'wss://relay.walletconnect.com';
const CHAIN_ID = import.meta.env.VITE_CHAIN_ID || 'chia:testnet';

const root = createRoot(document.querySelector('#root')!);

root.render(
    <StrictMode>
        <WalletConnectProvider
            projectId={PROJECT_ID}
            relayUrl={RELAY_URL}
            chainId={CHAIN_ID}
        >
            <JsonRpcProvider>
                <CssBaseline />
                <App />
            </JsonRpcProvider>
        </WalletConnectProvider>
    </StrictMode>
);
