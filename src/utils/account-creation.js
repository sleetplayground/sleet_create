import { KeyPair, providers } from 'near-api-js';

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

    if (!/^[a-z0-9-_]+$/.test(accountId)) {
      throw new Error('Account ID can only contain lowercase letters, numbers, hyphens, and underscores');
    }

    if (accountId.startsWith('-') || accountId.endsWith('-') || accountId.startsWith('_') || accountId.endsWith('_')) {
      throw new Error('Account ID cannot start or end with a hyphen or underscore');
    }
  }

  checkAccountAvailability = async (accountId) => {
    try {
      // First validate the account ID format
      this.validateAccountId(accountId);
      
      // Append the network suffix
      const networkSuffix = this.wallet.networkId === 'mainnet' ? '.near' : '.testnet';
      const fullAccountId = accountId + networkSuffix;
      
      try {
        // Try to get the account state instead of just balance
        const provider = new providers.JsonRpcProvider({ url: `https://rpc.${this.wallet.networkId}.near.org` });
        await provider.query({
          request_type: 'view_account',
          account_id: fullAccountId,
          finality: 'final'
        });
        
        return {
          available: false,
          error: 'Account already exists'
        };
      } catch (error) {
        // Check for specific RPC error codes that indicate account doesn't exist
        const errorMessage = error.toString().toLowerCase();
        if (
          errorMessage.includes('does not exist') ||
          errorMessage.includes('not found') ||
          errorMessage.includes('unknown account') ||
          error.type === 'AccountDoesNotExist'
        ) {
          return {
            available: true,
            error: null
          };
        }

        // For connection or RPC errors, we should be more informative
        if (errorMessage.includes('failed to fetch') || errorMessage.includes('network error')) {
          return {
            available: false,
            error: 'Network error: Unable to check account availability'
          };
        }

        // For any other errors, return as unavailable with a clearer error message
        return {
          available: false,
          error: 'Unable to verify account availability: ' + error.message
        };
      }
    } catch (error) {
      // This is for validation errors
      return {
        available: false,
        error: error.message || 'Invalid account format'
      };
    }
  };

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