import {
    Button,
    Divider,
    FormControl,
    InputLabel,
    Link,
    MenuItem,
    Select,
    SxProps,
    TextField,
    Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useJsonRpc } from './contexts/JsonRpcContext';
import { useWalletConnect } from './contexts/WalletConnectContext';

export default function Home() {
    const { connect, disconnect, session } = useWalletConnect();
    const { signMessageById, getNfts, getNftInfo } = useJsonRpc();

    const [command, setCommand] = useState(0);
    const [response, setResponse] = useState<any>(null);

    const [message, setMessage] = useState('');
    const [did, setDid] = useState('');
    const [walletId, setWalletId] = useState(0);
    const [num, setNum] = useState(50);
    const [startIndex, setStartIndex] = useState(0);
    const [coinId, setCoinId] = useState('');

    const commands = {
        chia_signMessageById: (
            <>
                <TextField
                    fullWidth
                    label='Message'
                    variant='outlined'
                    sx={{ mt: 2 }}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <TextField
                    fullWidth
                    label='DID'
                    variant='outlined'
                    value={did}
                    onChange={(e) => setDid(e.target.value)}
                />
                <Button
                    fullWidth
                    variant='contained'
                    onClick={() =>
                        signMessageById(message, did)
                            .then((data) => setResponse(data))
                            .catch((error) => {
                                console.error(error);
                                setResponse({ error: error.message });
                            })
                    }
                >
                    Sign Message By Id
                </Button>
            </>
        ),

        chia_getNFTs: (
            <>
                <TextField
                    fullWidth
                    label='Wallet Id'
                    variant='outlined'
                    type='number'
                    sx={{ mt: 2 }}
                    value={walletId}
                    onChange={(e) => setWalletId(+e.target.value)}
                />
                <TextField
                    fullWidth
                    label='Num'
                    variant='outlined'
                    type='number'
                    value={num}
                    onChange={(e) => setNum(+e.target.value)}
                />
                <TextField
                    fullWidth
                    label='Start Index'
                    variant='outlined'
                    type='number'
                    value={startIndex}
                    onChange={(e) => setStartIndex(+e.target.value)}
                />
                <Button
                    fullWidth
                    variant='contained'
                    onClick={() =>
                        getNfts([walletId], num, startIndex)
                            .then((data) => setResponse(data))
                            .catch((error) => {
                                console.error(error);
                                setResponse({ error: error.message });
                            })
                    }
                >
                    Get NFTs
                </Button>
            </>
        ),

        chia_getNFTInfo: (
            <>
                <TextField
                    fullWidth
                    label='Coin Id'
                    variant='outlined'
                    sx={{ mt: 2 }}
                    value={coinId}
                    onChange={(e) => setCoinId(e.target.value)}
                />
                <Button
                    fullWidth
                    variant='contained'
                    onClick={() =>
                        getNftInfo(coinId)
                            .then((data) => setResponse(data))
                            .catch((error) => {
                                console.error(error);
                                setResponse({ error: error.message });
                            })
                    }
                >
                    Get NFT Info
                </Button>
            </>
        ),
    };

    const commandEntry = Object.entries(commands)[command];

    return (
        <Box sx={styles.container}>
            {!session ? (
                <>
                    <Typography variant='body1'>
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

                    <Button
                        fullWidth
                        variant='contained'
                        onClick={() => connect()}
                        sx={{ mt: 3 }}
                    >
                        Link Wallet
                    </Button>
                </>
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
                        <Typography variant='h5'>
                            <code>{commandEntry[0]}</code>
                        </Typography>
                        {commandEntry[1]}
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
                            Clear Local Storage
                        </Button>
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
                            {JSON.stringify(response, null, 4)}
                        </SyntaxHighlighter>
                    </Box>
                </>
            )}
        </Box>
    );
}

const styles: Record<string, SxProps> = {
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
