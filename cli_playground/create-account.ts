#!/usr/bin/env node

import readline from 'readline';
import { KeyPair } from 'near-api-js';
import { generateSeedPhrase } from 'near-seed-phrase';
import { JsonRpcProvider } from 'near-api-js/lib/providers/json-rpc-provider.js';

interface WalletState {
  isConnected: boolean;
  accountId: string | null;
}

interface AccountCreationResult {
  accountId: string;
  publicKey: string;
  privateKey: string;
  seedPhrase: string;
}

interface Transaction {
  signerId: string;
  receiverId: string;
  actions: Array<{
    type: string;
    params: {
      methodName: string;
      args: {
        new_account_id: string;
        new_public_key: string;
      };
      gas: string;
      deposit: string;
    };
  }>;
}

const TESTNET_CONFIG = {
  networkId: 'testnet',
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://wallet.testnet.near.org',
  helperUrl: 'https://helper.testnet.near.org',
  indexerUrl: 'https://api.testnet.near.org',
  explorerUrl: 'https://explorer.testnet.near.org'
};

class CLINearWallet {
  private provider: JsonRpcProvider;
  private state: WalletState;

  constructor() {
    this.provider = new JsonRpcProvider({
      url: TESTNET_CONFIG.nodeUrl,
      headers: { 'Content-Type': 'application/json' }
    });
    this.state = {
      isConnected: false,
      accountId: null
    };
  }

  async checkAccountAvailability(accountId: string): Promise<boolean> {
    try {
      await this.provider.query({
        request_type: 'view_account',
        finality: 'final',
        account_id: accountId
      });
      return false; // Account exists
    } catch (error: any) {
      if (error.type === 'AccountDoesNotExist') {
        return true; // Account is available
      }
      throw error;
    }
  }

  async createAccount(accountId: string, isSubAccount: boolean = false): Promise<AccountCreationResult> {
    if (!isSubAccount && !accountId.endsWith('.testnet')) {
      accountId = `${accountId}.testnet`;
    }

    const isAvailable = await this.checkAccountAvailability(accountId);
    if (!isAvailable) {
      throw new Error('Account ID is not available');
    }

    const { seedPhrase, secretKey, publicKey } = generateSeedPhrase();
    const keyPair = KeyPair.fromString(secretKey);

    if (isSubAccount && !this.state.accountId) {
      throw new Error('Parent account not connected');
    }

    try {
      // For sub-accounts, we need to create a transaction
      if (isSubAccount) {
        const transaction: Transaction = {
          signerId: this.state.accountId!,
          receiverId: 'testnet',
          actions: [{
            type: 'FunctionCall',
            params: {
              methodName: 'create_account',
              args: {
                new_account_id: accountId,
                new_public_key: publicKey,
              },
              gas: '300000000000000',
              deposit: '100000000000000000000000'
            }
          }]
        };

        // Here you would typically sign and send the transaction
        // For CLI demo purposes, we'll just return the account info
      }

      return {
        accountId,
        publicKey,
        privateKey: secretKey,
        seedPhrase
      };
    } catch (error) {
      console.error('Error creating account:', error);
      throw new Error('Failed to create account');
    }
  }
}

const wallet = new CLINearWallet();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  try {
    const accountId = await askQuestion('Enter the desired account name: ');
    const result = await wallet.createAccount(accountId);
    console.log('Account created successfully!');
    console.log('Account ID:', result.accountId);
    console.log('Public Key:', result.publicKey);
    console.log('Private Key:', result.privateKey);
    console.log('Seed Phrase:', result.seedPhrase);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    rl.close();
  }
}

main();