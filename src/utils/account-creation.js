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
      this.validateAccountId(accountId);
      
      const networkSuffix = this.wallet.networkId === 'mainnet' ? '.near' : '.testnet';
      const fullAccountId = accountId + networkSuffix;
      
      try {
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

        if (errorMessage.includes('failed to fetch') || errorMessage.includes('network error')) {
          return {
            available: false,
            error: 'Network error: Unable to check account availability'
          };
        }

        return {
          available: false,
          error: 'Unable to verify account availability: ' + error.message
        };
      }
    } catch (error) {
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
      
      const networkSuffix = this.wallet.networkId === 'mainnet' ? '.near' : '.testnet';
      const fullAccountId = accountId + networkSuffix;
      
      const { publicKey, privateKey } = this.generateKeyPair();
      
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

  validateSubAccountId = (subAccountId, parentAccountId) => {
    this.validateAccountId(subAccountId);

    const networkSuffix = this.wallet.networkId === 'mainnet' ? '.near' : '.testnet';
    const fullParentId = parentAccountId + networkSuffix;
    const fullSubAccountId = subAccountId + '.' + fullParentId;

    if (fullSubAccountId.length > 64) {
      throw new Error('Full sub-account ID must be 64 characters or less');
    }

    if (subAccountId.includes(parentAccountId)) {
      throw new Error('Sub-account name should not contain the parent account name');
    }

    if (subAccountId.includes('.')) {
      throw new Error('Sub-account name cannot contain dots');
    }
  };

  createSubAccount = async (subAccountId, parentAccountId, initialBalance = '1') => {
    try {
      const walletSelector = await this.wallet.selector;
      const isSignedIn = walletSelector.isSignedIn();
      
      if (!isSignedIn) {
        throw new Error('You must be signed in to create a sub-account');
      }

      if (!parentAccountId) {
        throw new Error('Parent account ID is required');
      }

      this.validateSubAccountId(subAccountId, parentAccountId);
      
      const networkSuffix = this.wallet.networkId === 'mainnet' ? '.near' : '.testnet';
      const fullParentId = parentAccountId.endsWith(networkSuffix) ? parentAccountId : parentAccountId + networkSuffix;
      const fullSubAccountId = `${subAccountId}.${fullParentId}`;
      
      const { publicKey } = this.generateKeyPair();
      
      try {
        const selectedWallet = await walletSelector.wallet();
        
        // Create the sub-account using the create_account function call
        const actions = [
          {
            type: 'FunctionCall',
            params: {
              methodName: 'create_account',
              args: {
                new_account_id: fullSubAccountId,
                new_public_key: publicKey
              },
              gas: '300000000000000',
              deposit: initialBalance
            }
          }
        ];

        await selectedWallet.signAndSendTransaction({
          receiverId: fullParentId,
          actions: actions
        });

        return {
          accountId: fullSubAccountId,
          publicKey,
          success: true
        };
      } catch (error) {
        if (error.message.includes('cannot be created by')) {
          throw new Error('You do not have permission to create sub-accounts. Make sure you are using the correct parent account.');
        }
        throw error;
      }
    } catch (error) {
      console.error('Error creating sub-account:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };
}