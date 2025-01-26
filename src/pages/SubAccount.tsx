import React from 'react';
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { NearWallet } from '../js/nearWallet';
import type { WalletState, AccountCreationResult } from '../js/nearWallet';
import '@near-wallet-selector/modal-ui/styles.css';
import '../css/index.css';
import '../css/colors.css';
import '../css/fonts.css';
import '../css/layout.css';
import '../css/buttons.css';
import '../css/footer.css';
import '../css/header.css';
import '../css/account.css';

const SubAccount = () => {
  const [wallet] = useState(new NearWallet());
  const [isConnected, setIsConnected] = useState(false);
  const [subAccountName, setSubAccountName] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
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
        const state: WalletState = await wallet.connect();
        setIsConnected(state.isConnected);
        if (state.accountId) {
          setParentAccount(state.accountId);
        }
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      setError('Failed to connect wallet. Please try again.');
    }
  };

  const handleSubAccountNameChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value.toLowerCase();
    setSubAccountName(name);
    setError(null);
    
    if (name && parentAccount) {
      try {
        const fullAccountName = `${name}.${parentAccount}`;
        const available = await wallet.checkAccountAvailability(fullAccountName);
        setIsAvailable(available);
      } catch (error) {
        console.error('Error checking account availability:', error);
        setError('Failed to check account availability. Please try again.');
      }
    } else {
      setIsAvailable(null);
    }
  };

  const handleCreate = async () => {
    if (!isConnected || !subAccountName || !isAvailable || !parentAccount) return;
    
    setIsCreating(true);
    setError(null);
    
    try {
      const fullAccountName = `${subAccountName}.${parentAccount}`;
      const result = await wallet.createAccount(fullAccountName);
      setAccountInfo(result);
    } catch (error) {
      console.error('Error creating sub-account:', error);
      setError('Failed to create sub-account. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Layout>
      <header className="header">
        <div className="container">
          <h1>Create NEAR Sub-Account</h1>
        </div>
      </header>

      <article className="main-content">
        <div className="account-controls">
          <button 
            className="button wallet-connect" 
            onClick={handleConnect}
            disabled={isCreating}
          >
            {isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
          </button>
        </div>

        <div className="account-form">
          {error && (
            <p className="error-message">{error}</p>
          )}

          {parentAccount && (
            <p className="parent-account">Parent Account: {parentAccount}</p>
          )}
          
          <input
            type="text"
            className="text-input"
            placeholder="Enter sub-account name"
            value={subAccountName}
            onChange={handleSubAccountNameChange}
            disabled={isCreating || !parentAccount}
          />
          
          {subAccountName && parentAccount && (
            <>
              <p className="full-account-name">Full account name: {subAccountName}.{parentAccount}</p>
              {isAvailable !== null && (
                <p className={`availability-message ${isAvailable ? 'available' : 'unavailable'}`}>
                  {isAvailable ? '✓ Available' : '✗ Unavailable'}
                </p>
              )}
            </>
          )}
          
          <button
            className="button create-button"
            onClick={handleCreate}
            disabled={!isConnected || !subAccountName || !isAvailable || isCreating || !parentAccount}
          >
            {isCreating ? 'Creating...' : 'Create Sub-Account'}
          </button>

          {accountInfo && (
            <div className="account-info">
              <h3>🎉 Sub-Account Created Successfully!</h3>
              <p><strong>Account ID:</strong> {accountInfo.accountId}</p>
              <p><strong>Public Key:</strong> {accountInfo.publicKey}</p>
              <p><strong>Private Key:</strong> {accountInfo.privateKey}</p>
              <p><strong>Seed Phrase:</strong> {accountInfo.seedPhrase}</p>
              <p className="warning"><strong>Important:</strong> Please save this information in a secure place. You will need it to access your account.</p>
            </div>
          )}
        </div>

        <p className="disclaimer">
          Sub-accounts are useful for organizing your NEAR ecosystem presence.
          Make sure you understand the implications of creating sub-accounts
          before proceeding.
        </p>
      </article>
    </Layout>
  );
};

export default SubAccount;