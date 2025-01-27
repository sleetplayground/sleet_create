import { KeyPair, utils } from 'near-api-js';
import { Buffer } from 'buffer';

export class AccountCreator {
  constructor(wallet) {
    this.wallet = wallet;
  }

  generateKeyPair = () => {
    const keyPair = KeyPair.fromRandom('ed25519');
    const publicKey = keyPair.getPublicKey().toString();
    const privateKey = keyPair.toString();
    const seedPhrase = this.generateSeedPhrase();
    
    return {
      publicKey,
      privateKey,
      seedPhrase
    };
  };

  generateSeedPhrase = () => {
    // Generate a random 32-byte buffer for the seed phrase
    const entropy = Buffer.from(Array.from({ length: 32 }, () => Math.floor(Math.random() * 256)));
    return utils.serialize.base_encode(entropy);
  };

  validateAccountId = (accountId) => {
    // Check if account ID already has a network suffix
    if (accountId.endsWith('.testnet') || accountId.endsWith('.near')) {
      throw new Error('Please enter the account name without .testnet or .near suffix');
    }

    // Check for valid characters (lowercase, digits, - or _)
    if (!/^[a-z0-9-_]+$/.test(accountId)) {
      throw new Error('Account name can only contain lowercase letters, digits, - or _');
    }

    // Check length (minimum 2 characters, maximum 32 characters)
    if (accountId.length < 2 || accountId.length > 32) {
      throw new Error('Account name must be between 2 and 32 characters long');
    }
  };

  createAccount = async (accountId) => {
    try {
      this.validateAccountId(accountId);
      
      // Append the network suffix based on the wallet's network
      const networkSuffix = this.wallet.networkId === 'mainnet' ? '.near' : '.testnet';
      const fullAccountId = accountId + networkSuffix;
      
      const { publicKey, privateKey, seedPhrase } = this.generateKeyPair();
      
      // Create the account using the wallet's createAccount method
      await this.wallet.createAccount(fullAccountId, publicKey);

      return {
        accountId,
        publicKey,
        privateKey,
        seedPhrase,
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