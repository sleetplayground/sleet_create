// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM Content Loaded, waiting for dependencies...');
    
    // Wait for all scripts to load
    const checkDependencies = () => {
        const dependencies = {
            core: typeof window["@near-wallet-selector/core"] !== 'undefined' && typeof window["@near-wallet-selector/core"].setupWalletSelector === 'function',
            modalUi: typeof window["@near-wallet-selector/modal-ui"] !== 'undefined' && typeof window["@near-wallet-selector/modal-ui"].setupModal === 'function',
            nearWallet: typeof window["@near-wallet-selector/near-wallet"] !== 'undefined' && typeof window["@near-wallet-selector/near-wallet"].setupNearWallet === 'function',
            myNearWallet: typeof window["@near-wallet-selector/my-near-wallet"] !== 'undefined' && typeof window["@near-wallet-selector/my-near-wallet"].setupMyNearWallet === 'function',
            meteorWallet: typeof window["@near-wallet-selector/meteor-wallet"] !== 'undefined' && typeof window["@near-wallet-selector/meteor-wallet"].setupMeteorWallet === 'function'
        };

        const missing = Object.entries(dependencies)
            .filter(([_, value]) => !value)
            .map(([key]) => key);

        if (missing.length > 0) {
            console.warn('Waiting for dependencies:', missing.join(', '));
            return false;
        }
        return true;
    };

    const waitForDependencies = () => {
        return new Promise((resolve, reject) => {
            if (checkDependencies()) {
                console.log('All dependencies loaded successfully');
                resolve();
            } else {
                console.log('Waiting for dependencies to load...');
                let attempts = 0;
                const maxAttempts = 20; // 20 attempts * 500ms = 10 seconds
                
                const interval = setInterval(() => {
                    attempts++;
                    if (checkDependencies()) {
                        clearInterval(interval);
                        console.log('All dependencies loaded successfully');
                        resolve();
                    } else if (attempts >= maxAttempts) {
                        clearInterval(interval);
                        const error = new Error('Dependency loading timed out');
                        console.error(error);
                        reject(error);
                    }
                }, 500);
            }
        });
    };

    try {
        console.log('Starting dependency check...');
        await waitForDependencies();

        // Get global objects from CDN scripts
        const setupWalletSelector = window["@near-wallet-selector/core"]?.setupWalletSelector;
        const setupModal = window["@near-wallet-selector/modal-ui"]?.setupModal;
        const setupNearWallet = window["@near-wallet-selector/near-wallet"]?.setupNearWallet;
        const setupMyNearWallet = window["@near-wallet-selector/my-near-wallet"]?.setupMyNearWallet;
        const setupMeteorWallet = window["@near-wallet-selector/meteor-wallet"]?.setupMeteorWallet;

        if (!setupWalletSelector || !setupModal || !setupNearWallet || !setupMyNearWallet || !setupMeteorWallet) {
            throw new Error('One or more NEAR dependencies failed to load properly');
        }
        
        console.log('All NEAR dependencies loaded successfully');

        // Initialize wallet selector
        await initNear(setupWalletSelector, setupModal, setupNearWallet, setupMyNearWallet, setupMeteorWallet);

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
async function initNear(setupWalletSelector, setupModal, setupNearWallet, setupMyNearWallet, setupMeteorWallet) {
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
    
    // Get global objects for reinitialization
    const setupWalletSelector = window["@near-wallet-selector/core"].setupWalletSelector;
    const setupModal = window["@near-wallet-selector/modal-ui"].setupModal;
    const setupNearWallet = window["@near-wallet-selector/near-wallet"].setupNearWallet;
    const setupMyNearWallet = window["@near-wallet-selector/my-near-wallet"].setupMyNearWallet;
    const setupMeteorWallet = window["@near-wallet-selector/meteor-wallet"].setupMeteorWallet;

    // Reinitialize NEAR with new network
    await initNear(setupWalletSelector, setupModal, setupNearWallet, setupMyNearWallet, setupMeteorWallet);
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