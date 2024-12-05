# WalletConnect RPCs dApp

This is a dApp for testing the Chia wallet's WalletConnect commands.

## Setup

Run the following commands to start the dApp:

```bash
npm install
npm run dev
```

Note that the `.env` file contains `VITE_PROJECT_ID` and `VITE_CHAIN_ID` constants. The former is from WalletConnect and identifies your app inside of the wallet. The latter is either `chia:testnet` or `chia:mainnet`, and must match what your wallet is on.
