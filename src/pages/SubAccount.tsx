import React from 'react';
import { useState } from 'react';
import Layout from '../components/Layout';
import '../css/index.css';
import '../css/colors.css';
import '../css/fonts.css';
import '../css/layout.css';
import '../css/buttons.css';
import '../css/footer.css';
import '../css/header.css';
import '../css/account.css';

const SubAccount = () => {
  const [accountInfo, setAccountInfo] = useState<{
    accountId: string;
    publicKey: string;
    privateKey: string;
    seedPhrase: string;
  } | null>(null);

  return (
    <Layout>
      <header className="header">
        <div className="container">
          <h1>Sub Account</h1>
        </div>
      </header>

      <article className="main-content">
        <div className="account-controls">
          <button className="button wallet-connect">Connect Wallet</button>
          <div className="network-toggle">
            <input type="checkbox" id="network-switch" className="toggle-input" />
            <label htmlFor="network-switch" className="toggle-label">
              <span className="toggle-text">Testnet</span>
              <span className="toggle-text">Mainnet</span>
            </label>
          </div>
        </div>

        <div className="account-form">
          <input type="text" className="text-input" placeholder="Enter sub-account name" />
          <button className="button create-button">Create</button>
          {accountInfo && (
            <div className="account-info">
              <h3>🎉 Sub Account Created Successfully!</h3>
              <p><strong>Account ID:</strong> {accountInfo.accountId}</p>
              <p><strong>Public Key:</strong> {accountInfo.publicKey}</p>
              <p><strong>Private Key:</strong> {accountInfo.privateKey}</p>
              <p><strong>Seed Phrase:</strong> {accountInfo.seedPhrase}</p>
              <p><strong>Important:</strong> Please save this information in a secure place. You will need it to access your account.</p>
            </div>
          )}
        </div>

        <p>
          This is a tool for creating sub accounts.
          <br/>
          Only use this tool if you know what you are doing.
        </p>
      </article>
    </Layout>
  );
};

export default SubAccount;