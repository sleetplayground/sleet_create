import { setupWalletSelector, Wallet, WalletSelector } from '@near-wallet-selector/core';
import '@near-wallet-selector/modal-ui/styles.css';
import { setupModal, WalletSelectorModal } from '@near-wallet-selector/modal-ui';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupHereWallet } from '@near-wallet-selector/here-wallet';
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet';
import { KeyPair } from 'near-api-js';
import { JsonRpcProvider } from 'near-api-js/lib/providers';
import { generateSeedPhrase } from 'near-seed-phrase';
import { checkAccountAvailability } from './accountUtils';
import { TESTNET_CONFIG, WalletState, AccountCreationResult } from '../config/near';
import { Action, Transaction } from '@near-wallet-selector/core';

export class NearWallet {
  private selector: WalletSelector | null = null;
  private modal: WalletSelectorModal | null = null;
  private wallet: Wallet | null = null;
  private provider: JsonRpcProvider | null = null;
  private state: WalletState = {
    isConnected: false,
    accountId: null
  };

  async init() {
    try {
      if (!this.selector) {
        this.provider = new JsonRpcProvider({
          url: TESTNET_CONFIG.nodeUrl,
          headers: { 'Content-Type': 'application/json' }
        });
        
        this.selector = await setupWalletSelector({
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
            }),
            setupHereWallet(),
            setupMeteorWallet()
          ]
        });

        const { accounts } = this.selector.store.getState();
        this.state.isConnected = accounts.length > 0;
        this.state.accountId = accounts[0]?.accountId || null;

        this.modal = setupModal(this.selector, {
          contractId: 'account-manager.testnet',
          theme: 'light',
          description: 'Please select a wallet to connect with Sleet Account Manager'
        });

        this.selector.on('signedOut', () => {
          this.state.isConnected = false;
          this.state.accountId = null;
        });

        this.selector.on('signedIn', async () => {
          const { accounts } = this.selector!.store.getState();
          if (accounts.length > 0) {
            this.state.isConnected = true;
            this.state.accountId = accounts[0].accountId;
          }
        });
      }

      return this.state;
    } catch (error) {
      console.error('Wallet initialization error:', error);
      throw new Error('Failed to initialize wallet: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  async connect() {
    if (!this.selector || !this.modal) {
      await this.init();
    }
    try {
      if (!this.selector || !this.modal) {
        throw new Error('Wallet selector or modal not initialized properly');
      }
      this.modal.show();
      return new Promise<WalletState>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Connection timeout - please try again'));
        }, 300000); // 5 minutes timeout

        const handleSignIn = () => {
          clearTimeout(timeout);
          const { accounts } = this.selector!.store.getState();
          if (accounts.length > 0) {
            this.state.isConnected = true;
            this.state.accountId = accounts[0].accountId;
            resolve(this.state);
          } else {
            reject(new Error('No account selected'));
          }
        };

        const handleClose = () => {
          clearTimeout(timeout);
          reject(new Error('Connection cancelled'));
        };

        this.selector!.on('signedIn', handleSignIn);
        this.modal!.on('onHide', handleClose);
      });
    } catch (error) {
      console.error('Connection error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to connect wallet');
    }
  }

  async disconnect() {
    if (!this.wallet) {
      this.wallet = await this.selector!.wallet();
    }
    await this.wallet.signOut();
    return this.state;
  }

  async checkAccountAvailability(accountId: string): Promise<boolean> {
    return checkAccountAvailability(accountId);
  }

  async createAccount(accountId: string): Promise<AccountCreationResult> {
    if (!this.state.isConnected || !this.state.accountId) {
      throw new Error('Wallet not connected');
    }

    if (!accountId.endsWith('.testnet')) {
      accountId = `${accountId}.testnet`;
    }

    const isAvailable = await this.checkAccountAvailability(accountId);
    if (!isAvailable) {
      throw new Error('Account ID is not available');
    }

    const { seedPhrase, secretKey, publicKey } = generateSeedPhrase();
    const keyPair = KeyPair.fromString(secretKey);

    if (!this.wallet) {
      this.wallet = await this.selector!.wallet();
    }

    try {
      const transaction: Transaction = {
        signerId: this.state.accountId,
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

      await this.wallet.signAndSendTransaction(transaction);

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

  getState(): WalletState {
    return this.state;
  }
}