// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('Starting NEAR initialization...');
        
        // Initialize wallet selector
        await initNear();

        // Set up event listeners
        document.querySelector('.wallet-connect').addEventListener('click', handleWalletConnection);
        document.getElementById('network-switch').addEventListener('change', handleNetworkToggle);
        document.querySelector('.create-button').addEventListener('click', () => {
            const accountName = document.querySelector('.text-input').value;
            createAccount(accountName);
        });

        console.log('Wallet selector and event listeners initialized successfully');
    } catch (error) {
        console.error('Error during initialization:', error);
        alert('Failed to initialize the application. Please refresh the page.');
    }
});

// Configuration for NEAR networks
const config = {
    testnet: {
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org',
        explorerUrl: 'https://explorer.testnet.near.org',
    },
    mainnet: {
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.mainnet.near.org',
        walletUrl: 'https://wallet.near.org',
        helperUrl: 'https://helper.mainnet.near.org',
        explorerUrl: 'https://explorer.mainnet.near.org',
    }
};

let currentConfig = config.testnet;
let selector = null;
let modal = null;

// Initialize NEAR Wallet Selector
async function initNear() {
    try {
        selector = await setupWalletSelector({
            network: currentConfig.networkId,
            modules: [
                setupNearWallet(),
                setupMyNearWallet(),
                setupMeteorWallet()
            ],
        });

        modal = setupModal(selector, {
            contractId: currentConfig.networkId
        });

        const state = selector.store.getState();
        updateWalletButtonState(state);

        selector.store.observable.subscribe((state) => {
            updateWalletButtonState(state);
        });

        console.log('NEAR wallet selector initialized successfully');
    } catch (error) {
        console.error('Error initializing NEAR wallet selector:', error);
        alert('Failed to initialize wallet selector. Please refresh the page.');
    }
}

// Update wallet button state
function updateWalletButtonState(state) {
    const walletButton = document.querySelector('.wallet-connect');
    if (state.accounts.length > 0) {
        walletButton.textContent = 'Disconnect Wallet';
    } else {
        walletButton.textContent = 'Connect Wallet';
    }
}

// Handle network toggle
async function handleNetworkToggle() {
    const networkSwitch = document.getElementById('network-switch');
    currentConfig = networkSwitch.checked ? config.mainnet : config.testnet;
    
    // Reinitialize NEAR with new network
    await initNear();
}

// Handle wallet connection
async function handleWalletConnection() {
    console.log('Handling wallet connection...');
    if (!selector) {
        console.error('Wallet selector not initialized');
        return;
    }

    try {
        const state = selector.store.getState();
        console.log('Current wallet state:', state);

        if (state.accounts.length > 0) {
            console.log('Signing out...');
            const wallet = await selector.wallet();
            await wallet.signOut();
            console.log('Successfully signed out');
        } else {
            console.log('Opening wallet modal...');
            modal.show();
        }
    } catch (error) {
        console.error('Error handling wallet connection:', error);
        alert('Failed to connect wallet. Please try again.');
    }
}

// Validate account name
function validateAccountName(accountName) {
    const validRegex = /^[a-z0-9-_]+$/;
    return validRegex.test(accountName) && accountName.length >= 2 && accountName.length <= 64;
}

// Create new account
async function createAccount(accountName) {
    if (!selector) {
        alert('Please wait for wallet initialization');
        return;
    }

    const state = selector.store.getState();
    if (state.accounts.length === 0) {
        alert('Please connect your wallet first');
        return;
    }

    if (!validateAccountName(accountName)) {
        alert('Invalid account name. Use only lowercase letters, numbers, - and _');
        return;
    }

    const fullAccountName = `${accountName}.${currentConfig.networkId}`;

    try {
        // Check if account exists
        const response = await fetch(`${currentConfig.nodeUrl}/account/${fullAccountName}`);
        if (response.status === 200) {
            alert('This account name is already taken');
            return;
        }

        const wallet = await selector.wallet();
        const account = wallet.account();

        // Create account transaction
        const result = await account.functionCall({
            contractId: 'testnet',
            methodName: 'create_account',
            args: {
                new_account_id: fullAccountName,
                new_public_key: await wallet.getPublicKey()
            },
            gas: '300000000000000', // 300 TGas
            amount: '100000000000000000000000' // 0.1 NEAR in yoctoNEAR
        });

        alert(`Account ${fullAccountName} created successfully!`);
        return result;
    } catch (error) {
        console.error('Error creating account:', error);
        alert('Error creating account. Please try again.');
    }
}