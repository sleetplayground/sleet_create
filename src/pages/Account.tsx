import React from 'react';
import { useState } from 'react';
import Layout from '../components/Layout';
import { useWallet } from '../hooks/useWallet';
import '@near-wallet-selector/modal-ui/styles.css';
import '../css/index.css';
import '../css/colors.css';
import '../css/fonts.css';
import '../css/layout.css';
import '../css/buttons.css';
import '../css/footer.css';
import '../css/header.css';
import '../css/account.css';

const Account = () => {
  const { wallet, isConnected, accountInfo, isCreating, error, handleConnect, setError, setIsCreating, setAccountInfo } = useWallet();
  const [accountName, setAccountName] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const handleAccountNameChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value.toLowerCase();
    setAccountName(name);
    setError(null);
    
    if (name) {
      try {
        const available = await wallet.checkAccountAvailability(name + '.testnet');
        setIsAvailable(available);
      } catch (error: unknown) {
        console.error('Error checking account availability:', error);
        setError('Failed to check account availability. Please try again.');
      }
    } else {
      setIsAvailable(null);
    }
  };

  const handleCreate = async () => {
    if (!isConnected || !accountName || !isAvailable) return;
    
    setIsCreating(true);
    setError(null);
    
    try {
      const result = await wallet.createAccount(accountName);
      setAccountInfo(result);
    } catch (error: unknown) {
      console.error('Error creating account:', error);
      setError('Failed to create account. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Layout>
      <header className="header">
        <div className="container">
          <h1>Create NEAR Account</h1>
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
          
          <input
            type="text"
            className="text-input"
            placeholder="Enter account name"
            value={accountName}
            onChange={handleAccountNameChange}
            disabled={isCreating}
          />
          
          {accountName && (
            <p className={`availability-message ${isAvailable ? 'available' : 'unavailable'}`}>
              {isAvailable ? '✓ Available' : '✗ Unavailable'}
            </p>
          )}
          
          <button
            className="button create-button"
            onClick={handleCreate}
            disabled={!isConnected || !accountName || !isAvailable || isCreating}
          >
            {isCreating ? 'Creating...' : 'Create Account'}
          </button>

          {accountInfo && (
            <div className="account-info">
              <h3>🎉 Account Created Successfully!</h3>
              <p><strong>Account ID:</strong> {accountInfo.accountId}</p>
              <p><strong>Public Key:</strong> {accountInfo.publicKey}</p>
              <p><strong>Private Key:</strong> {accountInfo.privateKey}</p>
              <p><strong>Seed Phrase:</strong> {accountInfo.seedPhrase}</p>
              <p className="warning"><strong>Important:</strong> Please save this information in a secure place. You will need it to access your account.</p>
            </div>
          )}
        </div>

        <p className="disclaimer">
          The recommended way for users to create new NEAR accounts
          is with a NEAR wallet app like Meteor Wallet or MyNearWallet.<br/>
          Only use this tool if you know what you are doing.
        </p>
      </article>
    </Layout>
  );
};

export default Account;