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

    const rpc = useJsonRpc();

    const [command, setCommand] = useState(0);
    const [response, setResponse] = useState<any>(null);

    const [fingerprint, setFingerprint] = useState(0);
    const [amount, setAmount] = useState(0);
    const [fee, setFee] = useState(0);
    const [number, setNumber] = useState(50);
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(0);
    const [backupDidsNeeded, setBackupDidsNeeded] = useState(0);

    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [did, setDid] = useState('');
    const [publicKey, setPublicKey] = useState('');
    const [signature, setSignature] = useState('');
    const [signingMode, setSigningMode] = useState('');
    const [address, setAddress] = useState('');
    const [sortKey, setSortKey] = useState('');
    const [offerData, setOfferData] = useState('');

    const [walletIdsAndAmounts, setWalletIdsAndAmounts] = useState('');
    const [driverDict, setDriverDict] = useState('');

    const [walletId, setWalletId] = useState(0);
    const [transactionId, setTransactionId] = useState('');
    const [coinId, setCoinId] = useState('');
    const [launcherId, setLauncherId] = useState('');
    const [tradeId, setTradeId] = useState('');
    const [offerId, setOfferId] = useState('');
    const [assetId, setAssetId] = useState('');
    const [nftCoinIds, setNftCoinIds] = useState('');
    const [walletIds, setWalletIds] = useState('');
    const [backupDids, setBackupDids] = useState('');
    const [memos, setMemos] = useState('');

    const [includeData, setIncludeData] = useState(false);
    const [newAddress, setNewAddress] = useState(false);
    const [waitForConfirmation, setWaitForConfirmation] = useState(false);
    const [includeMyOffers, setIncludeMyOffers] = useState(false);
    const [includeTakenOffers, setIncludeTakenOffers] = useState(false);
    const [reverse, setReverse] = useState(false);
    const [disableJsonFormatting, setDisableJsonFormatting] = useState(false);
    const [validateOnly, setValidateOnly] = useState(false);
    const [secure, setSecure] = useState(false);

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
            value={value || ''}
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
            requestButton('Log In', () => rpc.logIn({ fingerprint })),
        ],
        chia_getWallets: [
            booleanOption('Include Data', includeData, setIncludeData),
            requestButton('Get Wallets', () => rpc.getWallets({ includeData })),
        ],
        chia_getTransaction: [
            stringOption('Transaction Id', transactionId, setTransactionId),
            requestButton('Get Transaction', () =>
                rpc.getTransaction({ transactionId })
            ),
        ],
        chia_getWalletBalance: [
            numberOption('Wallet Id', walletId, setWalletId),
            requestButton('Get Wallet Balance', () =>
                rpc.getWalletBalance({ walletId })
            ),
        ],
        chia_getCurrentAddress: [
            numberOption('Wallet Id', walletId, setWalletId),
            requestButton('Get Current Address', () =>
                rpc.getCurrentAddress({ walletId })
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
                rpc.sendTransaction({
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
                rpc.signMessageById({ message, id: did })
            ),
        ],
        chia_signMessageByAddress: [
            stringOption('Message', message, setMessage),
            stringOption('Address', address, setAddress),
            requestButton('Sign Message By Address', () =>
                rpc.signMessageByAddress({ message, address: address })
            ),
        ],
        chia_verifySignature: [
            stringOption('Message', message, setMessage),
            stringOption('Public Key', publicKey, setPublicKey),
            stringOption('Signature', signature, setSignature),
            stringOption('Address', address, setAddress),
            stringOption('Signing Mode', signingMode, setSigningMode),
            requestButton('Verify Signature', () =>
                rpc.verifySignature({
                    message,
                    pubkey: publicKey,
                    signature,
                    address: address || undefined,
                    signingMode: signingMode || undefined,
                })
            ),
        ],
        chia_getNextAddress: [
            numberOption('Wallet Id', walletId, setWalletId),
            booleanOption('New Address', newAddress, setNewAddress),
            requestButton('Get Next Address', () =>
                rpc.getNextAddress({
                    walletId: walletId || undefined,
                    newAddress,
                })
            ),
        ],
        chia_getSyncStatus: [
            requestButton('Get Sync Status', () => rpc.getSyncStatus({})),
        ],

        // Offers
        chia_getAllOffers: [
            numberOption('Start Index', startIndex, setStartIndex),
            numberOption('End Index', endIndex, setEndIndex),
            booleanOption(
                'Include My Offers',
                includeMyOffers,
                setIncludeMyOffers
            ),
            booleanOption(
                'Include Taken Offers',
                includeTakenOffers,
                setIncludeTakenOffers
            ),
            booleanOption('Reverse', reverse, setReverse),
            stringOption('Sort Key', sortKey, setSortKey),
            requestButton('Get All Offers', () =>
                rpc.getAllOffers({
                    start: startIndex || undefined,
                    end: endIndex || undefined,
                    includeMyOffers,
                    includeTakenOffers,
                    reverse,
                    sortKey: sortKey || undefined,
                })
            ),
        ],
        chia_getOffersCount: [
            requestButton('Get Offers Count', () => rpc.getOffersCount({})),
        ],
        chia_createOfferForIds: [
            booleanOption(
                'Disable JSON Formatting',
                disableJsonFormatting,
                setDisableJsonFormatting
            ),
            booleanOption('Validate Only', validateOnly, setValidateOnly),
            stringOption(
                'Wallet Ids And Amounts',
                walletIdsAndAmounts,
                setWalletIdsAndAmounts
            ),
            stringOption('Driver Dict', driverDict, setDriverDict),
            requestButton('Create Offer For Ids', () =>
                rpc.createOfferForIds({
                    disableJSONFormatting: disableJsonFormatting,
                    validateOnly,
                    walletIdsAndAmounts: JSON.parse(
                        walletIdsAndAmounts || '{}'
                    ),
                    driverDict: JSON.parse(driverDict || '{}'),
                })
            ),
        ],
        chia_cancelOffer: [
            numberOption('Fee', fee, setFee),
            booleanOption('Secure', secure, setSecure),
            stringOption('Trade Id', tradeId, setTradeId),
            requestButton('Cancel Offer', () =>
                rpc.cancelOffer({
                    fee,
                    secure,
                    tradeId,
                })
            ),
        ],
        chia_checkOfferValidity: [
            stringOption('Offer Data', offerData, setOfferData),
            requestButton('Check Offer Validity', () =>
                rpc.checkOfferValidity({ offerData })
            ),
        ],
        chia_takeOffer: [
            numberOption('Fee', fee, setFee),
            stringOption('Offer Data', offerData, setOfferData),
            requestButton('Take Offer', () =>
                rpc.takeOffer({ fee, offer: offerData })
            ),
        ],
        chia_getOfferSummary: [
            stringOption('Offer Data', offerData, setOfferData),
            requestButton('Get Offer Summary', () =>
                rpc.getOfferSummary({ offerData })
            ),
        ],
        chia_getOfferData: [
            stringOption('Offer Id', offerId, setOfferId),
            requestButton('Get Offer Data', () =>
                rpc.getOfferData({ offerId })
            ),
        ],
        chia_getOfferRecord: [
            stringOption('Offer Id', offerId, setOfferId),
            requestButton('Get Offer Record', () =>
                rpc.getOfferRecord({ offerId })
            ),
        ],

        // CATs
        chia_createNewCATWallet: [
            numberOption('Amount', amount, setAmount),
            numberOption('Fee', fee, setFee),
            requestButton('Create New CAT Wallet', () =>
                rpc.createNewCatWallet({ amount, fee })
            ),
        ],
        chia_getCATWalletInfo: [
            stringOption('Asset Id', assetId, setAssetId),
            requestButton('Get CAT Wallet Info', () =>
                rpc.getCatWalletInfo({ assetId })
            ),
        ],
        chia_getCATAssetId: [
            numberOption('Wallet Id', walletId, setWalletId),
            requestButton('Get CAT Asset Id', () =>
                rpc.getCatAssetId({ walletId })
            ),
        ],
        chia_spendCAT: [
            numberOption('Wallet Id', walletId, setWalletId),
            stringOption('Address', address, setAddress),
            numberOption('Amount', amount, setAmount),
            numberOption('Fee', fee, setFee),
            booleanOption(
                'Wait For Confirmation',
                waitForConfirmation,
                setWaitForConfirmation
            ),
            requestButton('Spend CAT', () =>
                rpc.spendCat({
                    walletId,
                    address,
                    amount,
                    fee,
                    memos: memos.trim().length
                        ? memos.split(',').map((memo) => memo.trim())
                        : undefined,
                    waitForConfirmation,
                })
            ),
        ],
        chia_addCATToken: [
            stringOption('Name', name, setName),
            stringOption('Asset Id', assetId, setAssetId),
            requestButton('Add CAT Token', () =>
                rpc.addCatToken({ name, assetId })
            ),
        ],

        // NFTs
        chia_getNFTs: [
            numberOption('Wallet Id', walletId, setWalletId),
            numberOption('Number', number, setNumber),
            numberOption('Start Index', startIndex, setStartIndex),
            requestButton('Get NFTs', () =>
                rpc.getNfts({ walletIds: [walletId], num: number, startIndex })
            ),
        ],
        chia_getNFTInfo: [
            stringOption('Coin Id', coinId, setCoinId),
            requestButton('Get NFT Info', () => rpc.getNftInfo({ coinId })),
        ],
        chia_transferNFT: [
            numberOption('Wallet Id', walletId, setWalletId),
            stringOption('Coin Id', coinId, setCoinId),
            stringOption('Launcher Id', launcherId, setLauncherId),
            stringOption('Address', address, setAddress),
            numberOption('Fee', fee, setFee),
            requestButton('Transfer NFT', () =>
                rpc.transferNft({
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
                rpc.getNftsCount({
                    walletIds: walletIds.trim().length
                        ? walletIds.split(',').map((id) => +id.trim())
                        : [],
                })
            ),
        ],

        // DIDs
        chia_createNewDIDWallet: [
            numberOption('Amount', amount, setAmount),
            numberOption('Fee', fee, setFee),
            numberOption(
                'Number of Backup Dids Needed',
                backupDidsNeeded,
                setBackupDidsNeeded
            ),
            stringOption('Backup Dids', backupDids, setBackupDids),
            requestButton('Create New DID Wallet', () =>
                rpc.createNewDidWallet({
                    amount,
                    fee,
                    backupDids: backupDids.trim().length
                        ? backupDids.split(',').map((id) => id.trim())
                        : [],
                    numOfBackupIdsNeeded: backupDidsNeeded,
                })
            ),
        ],
        chia_setDIDName: [
            numberOption('Wallet Id', walletId, setWalletId),
            stringOption('Name', name, setName),
            requestButton('Set DID Name', () =>
                rpc.setDidName({ name, walletId })
            ),
        ],
        chia_setNFTDID: [
            numberOption('Wallet Id', walletId, setWalletId),
            stringOption('NFT Coin Ids', nftCoinIds, setNftCoinIds),
            stringOption('Launcher Id', launcherId, setLauncherId),
            stringOption('DID', did, setDid),
            numberOption('Fee', fee, setFee),
            requestButton('Set NFT DID', () =>
                rpc.setNftDid({
                    walletId,
                    nftCoinIds: nftCoinIds.trim().length
                        ? nftCoinIds.split(',').map((id) => id.trim())
                        : [],
                    nftLauncherId: launcherId,
                    did,
                    fee,
                })
            ),
        ],
        chia_getNFTWalletsWithDIDs: [
            requestButton('Get NFT Wallets With DIDs', () =>
                rpc.getNftWalletsWithDids({})
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
