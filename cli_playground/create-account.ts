#!/usr/bin/env ts-node

import readline from 'readline';
import { KeyPair, keyStores } from 'near-api-js';
import { generateSeedPhrase } from 'near-seed-phrase';
import { providers } from 'near-api-js';
const { JsonRpcProvider } = providers;
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import open from 'open';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface AccountCreationResult {
  accountId: string;
  publicKey: string;
  privateKey: string;
  seedPhrase: string;
}

const TESTNET_CONFIG = {
  networkId: 'testnet',
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://wallet.testnet.near.org',
  helperUrl: 'https://helper.testnet.near.org',
  indexerUrl: 'https://api.testnet.near.org',
  explorerUrl: 'https://explorer.testnet.near.org'
};

import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupModal } from '@near-wallet-selector/modal-ui';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';

interface WalletState {
  isConnected: boolean;
  accountId: string | null;
}

async function connectWallet(): Promise<WalletState> {
  const selector = await setupWalletSelector({
    network: {
      networkId: TESTNET_CONFIG.networkId,
      nodeUrl: TESTNET_CONFIG.nodeUrl,
      helperUrl: TESTNET_CONFIG.helperUrl,
      indexerUrl: TESTNET_CONFIG.indexerUrl,
      explorerUrl: TESTNET_CONFIG.explorerUrl
    },
    modules: [
      setupMyNearWallet({
        walletUrl: TESTNET_CONFIG.walletUrl,
        iconUrl: 'https://my-near-wallet-beta.near.org/assets/favicon.ico'
      })
    ]
  });

  const modal = setupModal(selector, {
    contractId: 'account-manager.testnet',
    theme: 'light',
    description: 'Please connect your wallet to create a new account'
  });

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Connection timeout - please try again'));
    }, 300000); // 5 minutes timeout

    const handleSignIn = () => {
      clearTimeout(timeout);
      const { accounts } = selector.store.getState();
      if (accounts.length > 0) {
        resolve({
          isConnected: true,
          accountId: accounts[0].accountId
        });
      } else {
        reject(new Error('No account selected'));
      }
    };

    const handleClose = () => {
      clearTimeout(timeout);
      reject(new Error('Connection cancelled'));
    };

    selector.on('signedIn', handleSignIn);
    modal.on('onHide', handleClose);
    modal.show();
  });
}

async function main() {
  try {
    console.log('Welcome to NEAR Account Creator CLI!');
    console.log('This tool will help you create a new NEAR testnet account.\n');

    console.log('First, please connect your existing NEAR wallet...');
    const walletState = await connectWallet();
    console.log('\nWallet connected successfully!');
    console.log('Connected account:', walletState.accountId);

    const accountId = await askQuestion('\nEnter the desired account name (without .testnet): ');
    const result = await createAccount(accountId);

    console.log('\nAccount creation process initiated!');
    console.log('Please save the following information securely:\n');
    console.log('Account ID:', result.accountId);
    console.log('Public Key:', result.publicKey);
    console.log('Private Key:', result.privateKey);
    console.log('Seed Phrase:', result.seedPhrase);
    console.log('\nIMPORTANT: Save this information in a secure location. You will need it to access your account.');
  } catch (error: any) {
    console.error('Error:', error.message);
  } finally {
    rl.close();
  }
}

main();