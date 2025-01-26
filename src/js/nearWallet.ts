import { setupWalletSelector, Wallet, WalletSelector } from '@near-wallet-selector/core';
import '@near-wallet-selector/modal-ui/styles.css';
import { setupModal, WalletSelectorModal } from '@near-wallet-selector/modal-ui';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupHereWallet } from '@near-wallet-selector/here-wallet';
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet';
import { KeyPair } from 'near-api-js';
import { generateSeedPhrase } from 'near-seed-phrase';
import { checkAccountAvailability } from './accountUtils';
import { TESTNET_CONFIG, INITIAL_DEPOSIT, WalletState, AccountCreationResult } from '../config/near';

interface CreateAccountAction {
  type: 'CreateAccount';
  params: {
    accountId: string;
    publicKey: string;
    amount: string;
  };
}

export class NearWallet {
  private selector: WalletSelector | null = null;
  private modal: WalletSelectorModal | null = null;
  private wallet: Wallet | null = null;
  private state: WalletState = {
    isConnected: false,
    accountId: null
  };

  async init() {
    if (!this.selector) {
      this.selector = await setupWalletSelector({
        network: {
          networkId: TESTNET_CONFIG.networkId,
          nodeUrl: TESTNET_CONFIG.nodeUrl,
          helperUrl: TESTNET_CONFIG.helperUrl,
          explorerUrl: TESTNET_CONFIG.explorerUrl,
          indexerUrl: TESTNET_CONFIG.indexerUrl
        },
        modules: [
          setupMyNearWallet(),
          setupHereWallet(),
          setupMeteorWallet()
        ]
      });

      const { accounts } = this.selector.store.getState();
      this.state.isConnected = accounts.length > 0;
      this.state.accountId = accounts[0]?.accountId || null;

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

      this.modal = setupModal(this.selector, {
        contractId: ''
      });
    }

    return this.state;
  }

  async connect() {
    if (!this.selector || !this.modal) {
      await this.init();
    }
    this.modal!.show();
    return new Promise<WalletState>((resolve) => {
      this.selector!.on('signedIn', () => {
        resolve(this.state);
      });
    });
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
    if (!accountId.endsWith('.testnet')) {
      accountId = `${accountId}.testnet`;
    }

    const { seedPhrase, secretKey, publicKey } = generateSeedPhrase();
    const keyPair = KeyPair.fromString(secretKey);

    if (!this.wallet) {
      this.wallet = await this.selector!.wallet();
    }

    try {
      const action: CreateAccountAction = {
        type: 'CreateAccount',
        params: {
          accountId: accountId,
          publicKey: publicKey,
          amount: INITIAL_DEPOSIT
        }
      };

      await this.wallet.signAndSendTransaction({
        signerId: this.state.accountId!,
        receiverId: 'testnet',
        actions: [action]
      });

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