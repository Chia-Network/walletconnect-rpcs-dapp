import {
    Button,
    ButtonGroup,
    Divider,
    FormControl,
    InputLabel,
    Link,
    MenuItem,
    Select,
    SxProps,
    Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { cloneElement, useState } from 'react';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { QRCodeModal } from './components/QRCodeModal';
import { useWalletConnect } from './contexts/WalletConnectContext';
import { useRpcUi } from './hooks/useRpcUi';

export default function Home() {
    const { client, session, pairings, connect, disconnect, connectionUri, showQRModal, setShowQRModal, isInitializing, fingerprint } =
        useWalletConnect();

    const [command, setCommand] = useState(0);
    const { commands, responseData } = useRpcUi();

    const commandEntry = Object.entries(commands)[command];

    const onConnect = () => {
        if (!client) throw new Error('WalletConnect is not initialized.');

        if (pairings.length === 1) {
            connect();
        } else if (pairings.length) {
            console.log('The pairing modal is not implemented.', pairings);
        } else {
            connect();
        }
    };

    return (
        <Box sx={styles.container}>
            <QRCodeModal 
                open={showQRModal} 
                uri={connectionUri} 
                onClose={() => setShowQRModal(false)} 
            />
            
            {isInitializing ? (
                <Box sx={styles.welcome}>
                    <Typography variant='h5'>Initializing WalletConnect...</Typography>
                    <Typography variant='body1' mt={2}>
                        Please wait while we set up the connection.
                    </Typography>
                </Box>
            ) : !client ? (
                <Box sx={styles.welcome}>
                    <Typography variant='h5' color="error">WalletConnect Failed to Initialize</Typography>
                    <Typography variant='body1' mt={2}>
                        Please check your environment configuration and try refreshing the page.
                    </Typography>
                    <Typography variant='body2' mt={1} color="text.secondary">
                        Make sure you have a .env file with VITE_PROJECT_ID, VITE_RELAY_URL, and VITE_CHAIN_ID.
                    </Typography>
                </Box>
            ) : !session ? (
                <Box sx={styles.welcome}>
                    <Typography variant='h5'>WalletConnect Example</Typography>

                    <Typography variant='body1' mt={2}>
                        Before you can test out the WalletConnect commands, you
                        will need to link the Chia wallet to this site. You can
                        download the latest version of the wallet on the{' '}
                        <Link href='https://www.chia.net/downloads'>
                            official download page
                        </Link>
                        .
                    </Typography>

                    <Typography variant='body1' mt={2}>
                        Once you have downloaded and started the wallet, make
                        sure it has completed syncing before connecting it. The
                        WalletConnect menu can be found on the top right corner
                        of the wallet. Click the button below to begin the
                        connection.
                    </Typography>

                    {client && (
                        <Typography variant='body2' sx={{ mt: 1, color: 'text.secondary' }}>
                            Client Status: {client ? 'Ready' : 'Not Ready'} | 
                            Sessions: {client?.session.length || 0} | 
                            Pairings: {pairings.length} |
                            Connected: {session ? 'Yes' : 'No'}
                        </Typography>
                    )}

                    {session && (
                        <Typography variant='body2' sx={{ mt: 1, color: 'success.main' }}>
                            ✅ Connected to Chia wallet! Fingerprint: {fingerprint}
                        </Typography>
                    )}

                    {!session && client && (
                        <Typography variant='body2' sx={{ mt: 1, color: 'warning.main' }}>
                            ⚠️ Ready to connect. Click "Link Wallet" to start.
                        </Typography>
                    )}

                    <Button
                        fullWidth
                        variant='contained'
                        onClick={onConnect}
                        sx={{ mt: 3 }}
                    >
                        Link Wallet
                    </Button>

                    <Button
                        fullWidth
                        variant='outlined'
                        color='error'
                        onClick={() => {
                            localStorage.clear();
                            window.location.href = '';
                        }}
                    >
                        Reset Storage
                    </Button>
                </Box>
            ) : (
                <>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel id='command-select-label'>
                            Command
                        </InputLabel>
                        <Select
                            labelId='command-select-label'
                            id='command-select-label'
                            value={command}
                            label='Command'
                            onChange={(e) =>
                                setCommand(e.target.value as number)
                            }
                        >
                            {Object.keys(commands).map((name, i) => (
                                <MenuItem key={i} value={i}>
                                    {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Divider sx={{ mt: 4 }} />

                    <Box sx={styles.command} mt={3}>
                        <Typography variant='h5' mb={2}>
                            <code>{commandEntry[0]}</code>
                        </Typography>

                        {commandEntry[1].map((element, i) =>
                            cloneElement(element, { key: i })
                        )}

                        <ButtonGroup variant='outlined'>
                            <Button
                                fullWidth
                                variant='outlined'
                                color='error'
                                onClick={() => disconnect()}
                            >
                                Unlink Wallet
                            </Button>

                            <Button
                                fullWidth
                                variant='outlined'
                                color='error'
                                onClick={() => {
                                    localStorage.clear();
                                    window.location.href = '';
                                }}
                            >
                                Reset Storage
                            </Button>
                        </ButtonGroup>
                    </Box>

                    <Divider sx={{ mt: 4 }} />

                    <Box sx={styles.response} mt={3}>
                        <Typography variant='h5'>Response</Typography>

                        <SyntaxHighlighter
                            customStyle={{
                                borderRadius: '8px',
                                display: 'inline-block',
                                width: '100%',
                                marginBottom: '0px',
                                background: 'transparent',
                            }}
                            language='json'
                            style={github}
                        >
                            {JSON.stringify(responseData, null, 4)}
                        </SyntaxHighlighter>
                    </Box>
                </>
            )}
        </Box>
    );
}

const styles: Record<string, SxProps> = {
    welcome: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    container: {
        paddingTop: '60px',
        width: { xs: '340px', md: '460px', lg: '540px' },
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    command: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        borderRadius: '8px',
    },
    response: {
        borderRadius: '8px',
    },
};
