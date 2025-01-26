import { useState, useEffect } from 'react';
import { NearWallet } from '../js/nearWallet';
import type { WalletState, AccountCreationResult } from '../config/near';

export interface UseWalletResult {
  wallet: NearWallet;
  isConnected: boolean;
  accountInfo: AccountCreationResult | null;
  isCreating: boolean;
  error: string | null;
  parentAccount: string | null;
  handleConnect: () => Promise<void>;
  setError: (error: string | null) => void;
  setIsCreating: (isCreating: boolean) => void;
  setAccountInfo: (info: AccountCreationResult | null) => void;
}

export const useWallet = (): UseWalletResult => {
  const [wallet] = useState(new NearWallet());
  const [isConnected, setIsConnected] = useState(false);
  const [accountInfo, setAccountInfo] = useState<AccountCreationResult | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parentAccount, setParentAccount] = useState<string | null>(null);

  useEffect(() => {
    const initWallet = async () => {
      try {
        const state = await wallet.init();
        setIsConnected(state.isConnected);
        if (state.accountId) {
          setParentAccount(state.accountId);
        }
      } catch (error) {
        console.error('Failed to initialize wallet:', error);
        setError('Failed to initialize wallet. Please try again.');
      }
    };
    initWallet();
  }, [wallet]);

  const handleConnect = async () => {
    try {
      setError(null);
      if (isConnected) {
        const state = await wallet.disconnect();
        setIsConnected(state.isConnected);
        setParentAccount(null);
      } else {
        const state = await wallet.connect();
        setIsConnected(state.isConnected);
        if (state.accountId) {
          setParentAccount(state.accountId);
        }
      }
    } catch (error: unknown) {
      console.error('Wallet connection error:', error);
      setError('Failed to connect wallet. Please try again.');
    }
  };

  return {
    wallet,
    isConnected,
    accountInfo,
    isCreating,
    error,
    parentAccount,
    handleConnect,
    setError,
    setIsCreating,
    setAccountInfo
  };
};