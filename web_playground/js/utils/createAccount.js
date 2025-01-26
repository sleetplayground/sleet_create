import { connect, keyStores, utils } from 'near-api-js';
import { walletManager } from '../wallets/near';
import { getConfig } from '../config';

export async function createNewAccount(accountId) {
  try {
    if (!accountId || !utils.format.isValidAccountId(accountId)) {
      throw new Error('Invalid account ID');
    }

    const nearConfig = getConfig(walletManager.network);
    const keyStore = new keyStores.BrowserLocalStorageKeyStore();

    const near = await connect({
      ...nearConfig,
      keyStore,
      headers: {}
    });

    const wallet = await walletManager.requestSignIn();
    if (!wallet) {
      throw new Error('Wallet connection failed');
    }

    // Create the account
    const account = await near.account(accountId);
    const newKeyPair = utils.KeyPair.fromRandom('ed25519');
    
    await account.createAccount(accountId, newKeyPair.publicKey);

    // Return the account information
    return {
      accountId,
      publicKey: newKeyPair.publicKey.toString(),
      privateKey: newKeyPair.secretKey,
      network: walletManager.network
    };
  } catch (error) {
    console.error('Failed to create account:', error);
    throw error;
  }
}