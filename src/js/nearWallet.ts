import { setupWalletSelector, Wallet } from '@near-wallet-selector/core';
import { setupModal, WalletSelectorModal } from '@near-wallet-selector/modal-ui';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { WalletSelector } from '@near-wallet-selector/core';
import { JsonRpcProvider } from 'near-api-js/lib/providers';

export interface WalletState {
  isConnected: boolean;
  accountId: string | null;
  network: 'testnet' | 'mainnet';
}

export class NearWallet {
  private selector: WalletSelector | null = null;
  private modal: WalletSelectorModal | null = null;
  private wallet: Wallet | null = null;
  private state: WalletState = {
    isConnected: false,
    accountId: null,
    network: 'testnet'
  };

  async init() {
    if (!this.selector) {
      this.selector = await setupWalletSelector({
        network: this.state.network,
        modules: [setupMyNearWallet()]
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
    try {
      const provider = new JsonRpcProvider({ url: `https://rpc.${this.state.network}.near.org` });
      try {
        await provider.query({
          request_type: 'view_account',
          finality: 'final',
          account_id: accountId
        });
        return false; // Account exists
      } catch (error: any) {
        return error.type === 'AccountDoesNotExist';
      }
    } catch (error) {
      console.error('Error checking account availability:', error);
      return false;
    }
  }

  setNetwork(network: 'testnet' | 'mainnet') {
    this.state.network = network;
  }

  getState(): WalletState {
    return this.state;
  }
}