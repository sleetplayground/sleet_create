import { JsonRpcProvider } from 'near-api-js/lib/providers';

const TESTNET_CONFIG = {
  networkId: 'testnet',
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://wallet.testnet.near.org',
  helperUrl: 'https://helper.testnet.near.org',
  indexerUrl: 'https://api.testnet.near.org'
};

export async function checkAccountAvailability(accountId: string): Promise<boolean> {
  try {
    const provider = new JsonRpcProvider({ url: TESTNET_CONFIG.nodeUrl });
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