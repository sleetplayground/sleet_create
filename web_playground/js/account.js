import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupModal } from '@near-wallet-selector/modal-ui';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupNearWallet } from '@near-wallet-selector/near-wallet';
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet';
import * as nearAPI from 'near-api-js';

let wallet = null;
let accountId = null;
let network = 'testnet';

// DOM Elements
const connectButton = document.querySelector('.wallet-connect');
const networkToggle = document.querySelector('#network-switch');
const accountInput = document.querySelector('.text-input');
const createButton = document.querySelector('.create-button');

// Initialize wallet selector
async function initWalletSelector() {
    const selector = await setupWalletSelector({
        network: network,
        modules: [
            setupMyNearWallet(),
            setupNearWallet(),
            setupMeteorWallet()
        ],
    });

    const modal = setupModal(selector, { contractId: '' });
    return { selector, modal };
}

// Initialize the wallet connection
async function initWallet() {
    const { selector, modal } = await initWalletSelector();
    
    connectButton.addEventListener('click', async () => {
        if (!wallet) {
            modal.show();
            wallet = await selector.wallet();
            const accounts = await wallet.getAccounts();
            if (accounts.length > 0) {
                accountId = accounts[0].accountId;
                connectButton.textContent = 'Disconnect';
            }
        } else {
            await wallet.signOut();
            wallet = null;
            accountId = null;
            connectButton.textContent = 'Connect Wallet';
        }
    });
}

// Handle network toggle
networkToggle.addEventListener('change', async (e) => {
    network = e.target.checked ? 'mainnet' : 'testnet';
    if (wallet) {
        await wallet.signOut();
        wallet = null;
        accountId = null;
        connectButton.textContent = 'Connect Wallet';
        await initWallet();
    }
});

// Validate account name
function isValidAccountName(name) {
    return /^[a-z0-9-_]+$/.test(name) && name.length >= 2 && name.length <= 64;
}

// Create new account
async function createAccount(accountName) {
    try {
        if (!wallet || !accountId) {
            throw new Error('Please connect your wallet first');
        }

        if (!isValidAccountName(accountName)) {
            throw new Error('Invalid account name. Use only lowercase letters, numbers, - and _');
        }

        const fullAccountName = `${accountName}.${network === 'testnet' ? 'testnet' : 'near'}`;
        
        // Generate key pair for the new account
        const keyPair = nearAPI.KeyPair.fromRandom('ed25519');
        const publicKey = keyPair.getPublicKey().toString();

        // Create the account
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
        }
    } catch (error) {
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