import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupModal } from '@near-wallet-selector/modal-ui';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupNearWallet } from '@near-wallet-selector/near-wallet';
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet';
import { getConfig } from '../config';

class WalletManager {
  constructor() {
    this.selector = null;
    this.modal = null;
    this.network = 'testnet';
    this.accountId = null;
  }

  async init() {
    try {
      console.log(`Initializing wallet selector on ${this.network}`);
      
      this.selector = await setupWalletSelector({
        network: this.network,
        modules: [
          setupMyNearWallet(),
          setupNearWallet(),
          setupMeteorWallet()
        ]
      });

      this.modal = setupModal(this.selector, {
        contractId: 'near',
        theme: 'light',
        description: 'Please select a wallet to sign in'
      });

      this._setupEventListeners();
      return this;
    } catch (error) {
      console.error('Failed to initialize wallet selector:', error);
      throw error;
    }
  }

  _setupEventListeners() {
    this.modal.on('onHide', () => {
      console.log('Modal was hidden');
    });

    this.modal.on('onSelect', (walletId) => {
      console.log(`Selected wallet: ${walletId}`);
    });
  }

  setNetwork(network) {
    this.network = network;
  }

  getModal() {
    return this.modal;
  }

  getSelector() {
    return this.selector;
  }

  async requestSignIn() {
    try {
      const wallet = await this.selector.wallet();
      await wallet.signIn();
      return wallet;
    } catch (error) {
      console.error('Failed to sign in:', error);
      throw error;
    }
  }
}

export const walletManager = new WalletManager();