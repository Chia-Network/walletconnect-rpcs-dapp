import {
    Button,
    ButtonGroup,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormGroup,
    InputLabel,
    Link,
    MenuItem,
    Select,
    SxProps,
    TextField,
    Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { cloneElement, useState } from 'react';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useJsonRpc } from './contexts/JsonRpcContext';
import { useWalletConnect } from './contexts/WalletConnectContext';

export default function Home() {
    const { client, session, pairings, connect, disconnect } =
        useWalletConnect();
    const {
        // Wallet
        logIn,
        getWallets,
        getTransaction,
        getWalletBalance,
        getCurrentAddress,
        sendTransaction,
        signMessageById,
        signMessageByAddress,
        verifySignature,
        getNextAddress,
        getSyncStatus,

        // Offers
        getAllOffers,
        getOffersCount,
        createOfferForIds,
        cancelOffer,
        checkOfferValidity,
        takeOffer,
        getOfferSummary,
        getOfferData,
        getOfferRecord,

        // CATs
        createNewCatWallet,
        getCatWalletInfo,
        getCatAssetId,
        spendCat,
        addCatToken,

        // NFTs
        getNfts,
        getNftInfo,
        transferNft,
        getNftsCount,

        // DIDs
        createNewDidWallet,
        setDidName,
        setNftDid,
        getNftWalletsWithDids,
    } = useJsonRpc();

    const [command, setCommand] = useState(0);
    const [response, setResponse] = useState<any>(null);

    const [fingerprint, setFingerprint] = useState(0);

    const [message, setMessage] = useState('');
    const [did, setDid] = useState('');
    const [publicKey, setPublicKey] = useState('');
    const [signature, setSignature] = useState('');
    const [signingMode, setSigningMode] = useState('');

    const [walletId, setWalletId] = useState(0);
    const [transactionId, setTransactionId] = useState('');
    const [coinId, setCoinId] = useState('');
    const [launcherId, setLauncherId] = useState('');

    const [walletIds, setWalletIds] = useState('');
    const [memos, setMemos] = useState('');

    const [address, setAddress] = useState('');

    const [amount, setAmount] = useState(0);
    const [fee, setFee] = useState(0);

    const [number, setNumber] = useState(50);
    const [startIndex, setStartIndex] = useState(0);

    const [includeData, setIncludeData] = useState(false);
    const [waitForConfirmation, setWaitForConfirmation] = useState(false);

    const onConnect = () => {
        if (!client) throw new Error('WalletConnect is not initialized.');

        if (pairings.length) console.log('Pairing Modal TODO', pairings);
        else connect();
    };

    function handle(promise: Promise<any>) {
        promise
            .then((data) => {
                console.log(data);
                setResponse(data);
            })
            .catch((error) => {
                console.error(error);
                setResponse({ error: error.message });
            });
    }

    const stringOption = (
        name: string,
        value: string,
        setValue: React.Dispatch<React.SetStateAction<string>>
    ) => (
        <TextField
            fullWidth
            label={name}
            variant='outlined'
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
    );

    const numberOption = (
        name: string,
        value: number,
        setValue: React.Dispatch<React.SetStateAction<number>>
    ) => (
        <TextField
            fullWidth
            type='number'
            label={name}
            variant='outlined'
            value={value}
            onChange={(e) => setValue(+e.target.value)}
        />
    );

    const booleanOption = (
        name: string,
        value: boolean,
        setValue: React.Dispatch<React.SetStateAction<boolean>>
    ) => (
        <FormGroup>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={value}
                        onChange={(e) => setValue(e.target.checked)}
                    />
                }
                label={name}
            />
        </FormGroup>
    );

    const requestButton = (name: string, request: () => Promise<any>) => (
        <Button fullWidth variant='contained' onClick={() => handle(request())}>
            {name}
        </Button>
    );

    const commands = {
        // Wallet
        chia_logIn: [
            numberOption('Fingerprint', fingerprint, setFingerprint),
            requestButton('Log In', () => logIn({ fingerprint })),
        ],
        chia_getWallets: [
            booleanOption('Include Data', includeData, setIncludeData),
            requestButton('Get Wallets', () => getWallets({ includeData })),
        ],
        chia_getTransaction: [
            stringOption('Transaction Id', transactionId, setTransactionId),
            requestButton('Get Transaction', () =>
                getTransaction({ transactionId })
            ),
        ],
        chia_getWalletBalance: [
            numberOption('Wallet Id', walletId, setWalletId),
            requestButton('Get Wallet Balance', () =>
                getWalletBalance({ walletId })
            ),
        ],
        chia_getCurrentAddress: [
            numberOption('Wallet Id', walletId, setWalletId),
            requestButton('Get Current Address', () =>
                getCurrentAddress({ walletId })
            ),
        ],
        chia_sendTransaction: [
            numberOption('Wallet Id', walletId, setWalletId),
            numberOption('Amount', amount, setAmount),
            numberOption('Fee', fee, setFee),
            stringOption('Address', address, setAddress),
            stringOption('Memos', memos, setMemos),
            booleanOption(
                'Wait For Confirmation',
                waitForConfirmation,
                setWaitForConfirmation
            ),
            requestButton('Send Transaction', () =>
                sendTransaction({
                    walletId,
                    amount,
                    fee,
                    address,
                    memos: memos.trim().length
                        ? memos.split(',').map((memo) => memo.trim())
                        : [],
                    waitForConfirmation,
                })
            ),
        ],
        chia_signMessageById: [
            stringOption('Message', message, setMessage),
            stringOption('DID', did, setDid),
            requestButton('Sign Message By Id', () =>
                signMessageById({ message, id: did })
            ),
        ],
        chia_signMessageByAddress: [
            stringOption('Message', message, setMessage),
            stringOption('Address', address, setAddress),
            requestButton('Sign Message By Address', () =>
                signMessageByAddress({ message, address: address })
            ),
        ],
        chia_verifySignature: [
            stringOption('Message', message, setMessage),
            stringOption('Public Key', publicKey, setPublicKey),
            stringOption('Signature', signature, setSignature),
            stringOption('Address', address, setAddress),
            stringOption('Signing Mode', signingMode, setSigningMode),
            requestButton('Verify Signature', () =>
                verifySignature({
                    message,
                    pubkey: publicKey,
                    signature,
                    address: address || undefined,
                    signingMode: signingMode || undefined,
                })
            ),
        ],

        // DID

        // NFT
        chia_getNFTs: [
            numberOption('Wallet Id', walletId, setWalletId),
            numberOption('Number', number, setNumber),
            numberOption('Start Index', startIndex, setStartIndex),
            requestButton('Get NFTs', () =>
                getNfts({ walletIds: [walletId], num: number, startIndex })
            ),
        ],
        chia_getNFTInfo: [
            stringOption('Coin Id', coinId, setCoinId),
            requestButton('Get NFT Info', () => getNftInfo({ coinId })),
        ],
        chia_transferNFT: [
            numberOption('Wallet Id', walletId, setWalletId),
            stringOption('Coin Id', coinId, setCoinId),
            stringOption('Launcher Id', launcherId, setLauncherId),
            stringOption('Address', address, setAddress),
            numberOption('Fee', fee, setFee),
            requestButton('Transfer NFT', () =>
                transferNft({
                    walletId,
                    nftCoinId: coinId,
                    launcherId,
                    targetAddress: address,
                    fee,
                })
            ),
        ],
        chia_getNftsCount: [
            stringOption('Wallet Ids', walletIds, setWalletIds),
            requestButton('Get NFTs Count', () =>
                getNftsCount({
                    walletIds: walletIds.trim().length
                        ? walletIds.split(',').map((id) => +id.trim())
                        : [],
                })
            ),
        ],
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
                        onClick={onConnect}
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
