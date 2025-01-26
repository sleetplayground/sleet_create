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
        // Get the current network state from toggle
        const currentNetwork = networkToggle?.checked ? 'mainnet' : 'testnet';
        walletManager.setNetwork(currentNetwork);

        // Initialize wallet manager with current network
        await walletManager.init();
        
        // Setup event listeners after initialization
        setupEventListeners();
        
        // Check if already signed in
        const selector = walletManager.getSelector();
        if (selector) {
            const state = selector.store.getState();
            if (state.accounts.length > 0) {
                accountId = state.accounts[0].accountId;
                connectButton.textContent = `Connected: ${accountId}`;
            }
        }
    } catch (error) {
        console.error('Failed to initialize:', error);
        alert('Failed to initialize wallet. Please try again.');
    }
}

// Set up event listeners for UI elements
function setupEventListeners() {
    if (connectButton) {
        connectButton.addEventListener('click', async () => {
            const modal = walletManager.getModal();
            modal.show();
        });
    }

    if (networkToggle) {
        networkToggle.addEventListener('change', (event) => {
            const newNetwork = event.target.checked ? 'mainnet' : 'testnet';
            walletManager.setNetwork(newNetwork);
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

// Initialize variables
let network = 'testnet';
let wallet = null;
let accountId = null;

// Display the created account information
function displayAccountInfo(accountInfo) {
    const infoDiv = document.createElement('div');
    infoDiv.className = 'account-info';
    infoDiv.innerHTML = `
        <h3>🎉 Account Created Successfully!</h3>
        <p><strong>Account ID:</strong> ${accountInfo.accountId}</p>
        <p><strong>Public Key:</strong> ${accountInfo.publicKey}</p>
        <p><strong>Private Key:</strong> ${accountInfo.privateKey}</p>
        <p><strong>Important:</strong> Please save this information in a secure place. You will need it to access your account.</p>
    `;

    const existingInfo = document.querySelector('.account-info');
    if (existingInfo) {
        existingInfo.remove();
    }
    document.querySelector('.account-form').appendChild(infoDiv);
}

// Initialize the application
init();