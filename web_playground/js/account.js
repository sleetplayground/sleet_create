import { walletManager } from './wallets/near';
import { createNewAccount } from './utils/createAccount';

// DOM Elements
const connectButton = document.querySelector('.wallet-connect');
const networkToggle = document.querySelector('#network-switch');
const accountInput = document.querySelector('.text-input');
const createButton = document.querySelector('.create-button');

// Initialize the wallet
async function init() {
    try {
        await walletManager.init();
        setupEventListeners();
    } catch (error) {
        console.error('Failed to initialize:', error);
        throw error;
    }
}

// Set up event listeners for UI elements
function setupEventListeners() {
    if (networkToggle) {
        networkToggle.addEventListener('change', (event) => {
            const newNetwork = event.target.checked ? 'mainnet' : 'testnet';
            walletManager.setNetwork(newNetwork);
        });
    }

    if (connectButton) {
        connectButton.addEventListener('click', async () => {
            const modal = walletManager.getModal();
            modal.show();
        });
    }

    if (createButton && accountInput) {
        createButton.addEventListener('click', async () => {
            const accountId = accountInput.value.trim();
            try {
                const result = await createNewAccount(accountId);
                displayAccountInfo(result);
            } catch (error) {
                console.error('Failed to create account:', error);
                alert('Failed to create account: ' + error.message);
            }
        });
    }
}

// Display the created account information
function displayAccountInfo(accountInfo) {
    const infoDiv = document.createElement('div');
    infoDiv.className = 'account-info';
    infoDiv.innerHTML = `
        <h3>Account Created Successfully!</h3>
        <p>Account ID: ${accountInfo.accountId}</p>
        <p>Network: ${accountInfo.network}</p>
        <p>Public Key: ${accountInfo.publicKey}</p>
        <p class="warning">Please save this information securely:</p>
        <p>Private Key: ${accountInfo.privateKey}</p>
    `;
    document.body.appendChild(infoDiv);
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