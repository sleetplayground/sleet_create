import { JsonRpcProvider } from 'near-api-js/lib/providers';
import { TESTNET_CONFIG } from '../config/near';

export async function checkAccountAvailability(accountId: string): Promise<boolean> {
  if (!accountId) return false;
  
  try {
    const provider = new JsonRpcProvider({ 
      url: TESTNET_CONFIG.nodeUrl,
      headers: { 'Content-Type': 'application/json' }
    });

    try {
      await provider.query({
        request_type: 'view_account',
        finality: 'final',
        account_id: accountId
      });
      return false; // Account exists
    } catch (error: any) {
      if (error.type === 'AccountDoesNotExist') {
        return true; // Account is available
      }
      console.error('Error querying account:', error);
      return false;
    }
  } catch (error) {
    console.error('Error initializing provider:', error);
    return false;
  }
}