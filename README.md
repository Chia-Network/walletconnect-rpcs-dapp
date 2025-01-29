# WalletConnect RPCs dApp

This is a dApp for testing the Chia wallet's WalletConnect commands.

## Setup

Run the following commands to start the dApp:

```bash
npm install
npm run dev
```

Note that the `.env` file contains `VITE_PROJECT_ID` and `VITE_CHAIN_ID` constants. The former is from WalletConnect and identifies your app inside of the wallet. The latter is either `chia:testnet` or `chia:mainnet`, and must match what your wallet is on.

## Important Notice
This repository is intended for demonstration purposes only. The primary goal of this code is to provide examples of how to integrate with WalletConnect. It is not designed to be run as-is or serve as a production-ready solution.

### Security and Maintenance
Please be aware that this repository is not actively maintained and does not receive regular updates for security patches.  Any dependencies, libraries, or other necessary components are also not actively maintained by us. If you choose to use this code as a starting point for your own projects, you are strongly encouraged to:

1. Update Dependencies: Ensure that you review and update all dependencies to their latest versions.
2. Address Security Issues: Conduct thorough assessments for any potential security vulnerabilities present in outdated dependencies or libraries.

### Licensing
This code is licensed under the [Apache License 2.0](./LICENSE), which grants you the freedom to use, modify, and distribute the code with proper attribution. Please review the license for further details on its terms and conditions.
By using this repository, you signify that you have read, understood, and agree to this disclaimer. If you do not agree with these terms, please refrain from using the code.

### Limitation of Liability
Pursuant to the Apache license above, by using this code, you acknowledge and agree that you do so at your own risk. 
