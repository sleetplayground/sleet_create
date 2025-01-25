// Import NEAR API JS
import { connect, keyStores, WalletConnection } from 'near-api-js';

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
let walletConnection = null;

// Initialize NEAR
async function initNear() {
    const near = await connect({
        ...currentConfig,
        keyStore: new keyStores.BrowserLocalStorageKeyStore()
    });
    walletConnection = new WalletConnection(near);
    updateWalletButtonState();
}

// Update wallet button state
function updateWalletButtonState() {
    const walletButton = document.querySelector('.wallet-connect');
    if (walletConnection.isSignedIn()) {
        walletButton.textContent = 'Disconnect Wallet';
    } else {
        walletButton.textContent = 'Connect Wallet';
    }
}

// Handle network toggle
function handleNetworkToggle() {
    const networkSwitch = document.getElementById('network-switch');
    currentConfig = networkSwitch.checked ? config.mainnet : config.testnet;
    
    // If wallet is connected, disconnect when switching networks
    if (walletConnection && walletConnection.isSignedIn()) {
        walletConnection.signOut();
        updateWalletButtonState();
    }
    
    // Reinitialize NEAR with new network
    initNear();
}

// Handle wallet connection
async function handleWalletConnection() {
    if (!walletConnection) return;

    if (walletConnection.isSignedIn()) {
        walletConnection.signOut();
    } else {
        walletConnection.requestSignIn();
    }
    updateWalletButtonState();
}

// Validate account name
function validateAccountName(accountName) {
    const validRegex = /^[a-z0-9-_]+$/;
    return validRegex.test(accountName) && accountName.length >= 2 && accountName.length <= 64;
}

// Create new account
async function createAccount(accountName) {
    if (!walletConnection || !walletConnection.isSignedIn()) {
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

        // Create account transaction
        const result = await walletConnection.account().createAccount({
            newAccountId: fullAccountName,
            amount: '0.1' // 0.1 NEAR for account creation fee
        });

        alert(`Account ${fullAccountName} created successfully!`);
        return result;
    } catch (error) {
        console.error('Error creating account:', error);
        alert('Error creating account. Please try again.');
    }
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    const networkSwitch = document.getElementById('network-switch');
    const walletButton = document.querySelector('.wallet-connect');
    const createButton = document.querySelector('.create-button');
    const accountInput = document.querySelector('.text-input');

    networkSwitch.addEventListener('change', handleNetworkToggle);
    walletButton.addEventListener('click', handleWalletConnection);
    
    createButton.addEventListener('click', () => {
        const accountName = accountInput.value.trim();
        if (accountName) {
            createAccount(accountName);
        } else {
            alert('Please enter an account name');
        }
    });

    // Initialize NEAR
    initNear();
});