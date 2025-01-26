import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupModal } from '@near-wallet-selector/modal-ui';
import { setupNearWallet } from '@near-wallet-selector/near-wallet';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet';

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
    selector = await setupWalletSelector({
        network: currentConfig.networkId,
        modules: [
            setupNearWallet(),
            setupMyNearWallet(),
            setupMeteorWallet()
        ],
    });

    modal = setupModal(selector, {
        contractId: 'testnet'
    });

    const state = selector.store.getState();
    updateWalletButtonState(state);

    selector.store.observable.subscribe((state) => {
        updateWalletButtonState(state);
    });
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
function handleNetworkToggle() {
    const networkSwitch = document.getElementById('network-switch');
    currentConfig = networkSwitch.checked ? config.mainnet : config.testnet;
    
    // Reinitialize NEAR with new network
    initNear();
}

// Handle wallet connection
async function handleWalletConnection() {
    if (!selector) return;

    const state = selector.store.getState();
    if (state.accounts.length > 0) {
        const wallet = await selector.wallet();
        await wallet.signOut();
    } else {
        modal.show();
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
            contractId: currentConfig.networkId,
            methodName: 'create_account',
            args: {
                new_account_id: fullAccountName,
                new_public_key: null // The wallet will automatically use the connected account's public key
            },
            gas: '300000000000000', // 300 TGas
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