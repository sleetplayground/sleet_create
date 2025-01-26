import React from 'react';
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { NearWallet } from '../js/nearWallet';
import type { WalletState } from '../js/nearWallet';
import '../css/index.css';
import '../css/colors.css';
import '../css/fonts.css';
import '../css/layout.css';
import '../css/buttons.css';
import '../css/footer.css';
import '../css/header.css';
import '../css/account.css';

const Account = () => {
  const [wallet] = useState(new NearWallet());
  const [isConnected, setIsConnected] = useState(false);
  const [network, setNetwork] = useState<'testnet' | 'mainnet'>('testnet');
  const [accountName, setAccountName] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [accountInfo, setAccountInfo] = useState<{
    accountId: string;
    publicKey: string;
    privateKey: string;
    seedPhrase: string;
  } | null>(null);

  useEffect(() => {
    wallet.init().then((state) => {
      setIsConnected(state.isConnected);
      setNetwork(state.network);
    });
  }, [wallet]);

  const handleConnect = async () => {
    if (isConnected) {
      const state = await wallet.disconnect();
      setIsConnected(state.isConnected);
    } else {
      const state: WalletState = await wallet.connect();
      setIsConnected(state.isConnected);
    }
  };

  const handleNetworkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newNetwork = event.target.checked ? 'mainnet' : 'testnet';
    setNetwork(newNetwork);
    wallet.setNetwork(newNetwork);
  };

  const handleAccountNameChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value.toLowerCase();
    setAccountName(name);
    if (name) {
      const available = await wallet.checkAccountAvailability(name + '.near');
      setIsAvailable(available);
    } else {
      setIsAvailable(null);
    }
  };

  const handleCreate = async () => {
    // TODO: Implement account creation transaction
    console.log('Creating account:', accountName + '.near');
  };

  return (
    <Layout>
      <header className="header">
        <div className="container">
          <h1>Account</h1>
        </div>
      </header>

      <article className="main-content">
        <div className="account-controls">
          <button className="button wallet-connect" onClick={handleConnect}>
            {isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
          </button>
          <div className="network-toggle">
            <input
              type="checkbox"
              id="network-switch"
              className="toggle-input"
              checked={network === 'mainnet'}
              onChange={handleNetworkChange}
            />
            <label htmlFor="network-switch" className="toggle-label">
              <span className="toggle-text">Testnet</span>
              <span className="toggle-text">Mainnet</span>
            </label>
          </div>
        </div>

        <div className="account-form">
          <input
            type="text"
            className="text-input"
            placeholder="Enter account name"
            value={accountName}
            onChange={handleAccountNameChange}
          />
          {accountName && (
            <p className={`availability-message ${isAvailable ? 'available' : 'unavailable'}`}>
              {isAvailable ? '✓ Available' : '✗ Unavailable'}
            </p>
          )}
          <button
            className="button create-button"
            onClick={handleCreate}
            disabled={!isConnected || !accountName || !isAvailable}
          >
            Create
          </button>
          {accountInfo && (
            <div className="account-info">
              <h3>🎉 Account Created Successfully!</h3>
              <p><strong>Account ID:</strong> {accountInfo.accountId}</p>
              <p><strong>Public Key:</strong> {accountInfo.publicKey}</p>
              <p><strong>Private Key:</strong> {accountInfo.privateKey}</p>
              <p><strong>Seed Phrase:</strong> {accountInfo.seedPhrase}</p>
              <p><strong>Important:</strong> Please save this information in a secure place. You will need it to access your account.</p>
            </div>
          )}
        </div>

        <p>
          The recommended way for users to create new near accounts
          is with a near wallet app like meteor wallet or bitte.<br/>
          Only use this tool if you know what you are doing.
        </p>

      </article>
    </Layout>
  );
};

export default Account;