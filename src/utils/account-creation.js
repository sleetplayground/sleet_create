import { KeyPair } from 'near-api-js';

export class AccountCreator {
  constructor(wallet) {
    this.wallet = wallet;
  }

  validateAccountId = (accountId) => {
    if (!accountId) {
      throw new Error('Account ID is required');
    }

    if (accountId.length < 2 || accountId.length > 64) {
      throw new Error('Account ID must be between 2 and 64 characters');
    }

    if (!/^[a-z0-9-]+$/.test(accountId)) {
      throw new Error('Account ID can only contain lowercase letters, numbers, and hyphens');
    }

    if (accountId.startsWith('-') || accountId.endsWith('-')) {
      throw new Error('Account ID cannot start or end with a hyphen');
    }
  }

  generateKeyPair = () => {
    const keyPair = KeyPair.fromRandom('ed25519');
    const publicKey = keyPair.getPublicKey().toString();
    const privateKey = keyPair.toString();
    
    return {
      publicKey,
      privateKey
    };
  };

  createAccount = async (accountId) => {
    try {
      this.validateAccountId(accountId);
      
      // Append the network suffix based on the wallet's network
      const networkSuffix = this.wallet.networkId === 'mainnet' ? '.near' : '.testnet';
      const fullAccountId = accountId + networkSuffix;
      
      const { publicKey, privateKey } = this.generateKeyPair();
      
      // Create the account using the wallet's createAccount method
      await this.wallet.createAccount(fullAccountId, publicKey);

      return {
        accountId,
        publicKey,
        privateKey,
        success: true
      };
    } catch (error) {
      console.error('Error creating account:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };
}