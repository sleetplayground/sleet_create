import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupModal } from '@near-wallet-selector/modal-ui';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupNearWallet } from '@near-wallet-selector/near-wallet';
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet';
import { JsonRpcProvider } from 'near-api-js/lib/providers';

// Configure RPC endpoints
const TESTNET_RPC_URL = 'https://rpc.testnet.near.org';
const MAINNET_RPC_URL = 'https://rpc.mainnet.near.org';

let wallet = null;
let accountId = null;
let network = 'testnet';

// DOM Elements
const connectButton = document.querySelector('.wallet-connect');
const networkToggle = document.querySelector('#network-switch');
const accountInput = document.querySelector('.text-input');
const createButton = document.querySelector('.create-button');

// Initialize wallet selector with simplified configuration
async function initWalletSelector() {
    try {
        console.log(`Initializing wallet selector on ${network}`);
        const selector = await setupWalletSelector({
            network: {
                networkId: network,
                nodeUrl: network === 'testnet' ? TESTNET_RPC_URL : MAINNET_RPC_URL
            },
            modules: [
                setupMyNearWallet(),
                setupNearWallet(),
                setupMeteorWallet()
            ]
        });

        const modal = setupModal(selector, {
            contractId: 'near',
            theme: 'light',
            description: 'Please select a wallet to sign in'
        });

        // Add event listener for modal events
        modal.on('onHide', () => {
            console.log('Modal was hidden');
        });

        modal.on('onSelect', (walletId) => {
            console.log(`Selected wallet: ${walletId}`);
        });

        return { selector, modal };
    } catch (error) {
        console.error('Failed to initialize wallet selector:', error);
        throw error;
    }
}

// Initialize the wallet connection with improved state management
async function initWallet() {
    try {
        console.log(`Initializing wallet on ${network}`);
        const { selector, modal } = await initWalletSelector();
        let isInitializing = false;
        
        // Check if already signed in
        const state = selector.store.getState();
        const { accounts } = state;
        
        if (accounts.length > 0) {
            accountId = accounts[0].accountId;
            wallet = await selector.wallet();
            connectButton.textContent = 'Disconnect';
            console.log(`Connected to account: ${accountId}`);
        }

        // Remove any existing click listeners
        const newConnectButton = connectButton.cloneNode(true);
        connectButton.parentNode.replaceChild(newConnectButton, connectButton);
        const connectButtonRef = document.querySelector('.wallet-connect');

        connectButtonRef.addEventListener('click', async () => {
            if (isInitializing) {
                console.log('Wallet initialization in progress...');
                return;
            }

            if (!wallet) {
                try {
                    isInitializing = true;
                    console.log('Opening wallet selector modal');
                    modal.show();

                    // Handle wallet selection and connection
                    selector.on('signedIn', async ({ accounts }) => {
                        if (accounts.length > 0) {
                            wallet = await selector.wallet();
                            accountId = accounts[0].accountId;
                            connectButtonRef.textContent = 'Disconnect';
                            console.log(`Connected to account: ${accountId}`);
                        }
                        isInitializing = false;
                    });
                } catch (err) {
                    console.error('Error connecting wallet:', err);
                    alert('Failed to connect wallet. Please try again.');
                    isInitializing = false;
                }
            } else {
                try {
                    console.log('Disconnecting wallet');
                    await wallet.signOut();
                    wallet = null;
                    accountId = null;
                    connectButtonRef.textContent = 'Connect Wallet';
                } catch (err) {
                    console.error('Error disconnecting wallet:', err);
                    alert('Failed to disconnect wallet. Please try again.');
                }
            }
        });

        // Subscribe to changes
        selector.store.observable.subscribe((state) => {
            if (!state.accounts.length) {
                wallet = null;
                accountId = null;
                connectButtonRef.textContent = 'Connect Wallet';
                console.log('Wallet disconnected');
            }
        });

        return { selector, modal };
    } catch (error) {
        console.error('Failed to initialize wallet:', error);
        alert('Failed to initialize wallet. Please try again.');
        throw error;
    }
}

// Handle network toggle with improved initialization
networkToggle.addEventListener('change', async (e) => {
    try {
        network = e.target.checked ? 'mainnet' : 'testnet';
        console.log(`Switching to ${network}`);
        
        // Clear existing wallet state
        if (wallet) {
            await wallet.signOut();
            wallet = null;
            accountId = null;
            connectButton.textContent = 'Connect Wallet';
        }

        // Reinitialize wallet with new network
        const { selector, modal } = await initWalletSelector();
        await initWallet();
        console.log(`Network switched to ${network} and wallet reinitialized`);
    } catch (error) {
        console.error('Failed to switch network:', error);
        alert('Failed to switch network. Please try again.');
    }
});

// Validate account name
function isValidAccountName(name) {
    return /^[a-z0-9-_]+$/.test(name) && name.length >= 2 && name.length <= 64;
}

// Create new account with improved error handling
async function createAccount(accountName) {
    try {
        if (!wallet || !accountId) {
            throw new Error('Please connect your wallet first');
        }

        if (!isValidAccountName(accountName)) {
            throw new Error('Invalid account name. Use only lowercase letters, numbers, - and _');
        }

        const fullAccountName = `${accountName}.${network === 'testnet' ? 'testnet' : 'near'}`;
        
        // Create the account using wallet's built-in functionality
        const publicKey = await wallet.getPublicKey();
        if (!publicKey) {
            throw new Error('Failed to get public key from wallet');
        }

        // Create the account with improved transaction handling
        const result = await wallet.signAndSendTransaction({
            signerId: accountId,
            receiverId: 'near',
            actions: [
                {
                    type: 'CreateAccount',
                    params: {
                        newAccountId: fullAccountName,
                        publicKey: publicKey,
                        amount: '0.1' // Initial balance in NEAR
                    }
                }
            ]
        });

        if (result && result.status.successValue !== undefined) {
            displayAccountInfo({
                accountId: fullAccountName,
                publicKey: publicKey,
                privateKey: keyPair.toString(),
                seedPhrase: 'Not available for ed25519 keys'
            });
        } else {
            throw new Error('Transaction failed to complete');
        }
    } catch (error) {
        console.error('Account creation failed:', error);
        alert(`Error: ${error.message}`);
    }
}

// Display the new account information
function displayAccountInfo(info) {
    const infoDiv = document.createElement('div');
    infoDiv.className = 'account-info';
    infoDiv.innerHTML = `
        <h3>🎉 Account Created Successfully!</h3>
        <p><strong>Account ID:</strong> ${info.accountId}</p>
        <p><strong>Public Key:</strong> ${info.publicKey}</p>
        <p><strong>Private Key:</strong> ${info.privateKey}</p>
        <p><strong>Important:</strong> Please save this information in a secure place. You will need it to access your account.</p>
    `;

    const existingInfo = document.querySelector('.account-info');
    if (existingInfo) {
        existingInfo.remove();
    }
    document.querySelector('.account-form').appendChild(infoDiv);
}

// Handle create button click
createButton.addEventListener('click', () => {
    const accountName = accountInput.value.trim();
    if (accountName) {
        createAccount(accountName);
    } else {
        alert('Please enter an account name');
    }
});

// Initialize the application
initWallet();