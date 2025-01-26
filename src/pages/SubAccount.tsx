import { useState } from 'react';
import '../styles/index.css';
import '../styles/colors.css';
import '../styles/fonts.css';
import '../styles/layout.css';
import '../styles/buttons.css';
import '../styles/footer.css';
import '../styles/header.css';
import '../styles/account.css';

const SubAccount = () => {
  const [accountInfo, setAccountInfo] = useState<{
    accountId: string;
    publicKey: string;
    privateKey: string;
  } | null>(null);

  return (
    <div>
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
              <p><strong>Important:</strong> Please save this information in a secure place. You will need it to access your account.</p>
            </div>
          )}
        </div>

        <p>
          The recommended way for users to create new near sub-accounts
          is with a near wallet app like meteor wallet or bitte.<br/>
          Only use this tool if you know what you are doing.
        </p>
      </article>
    </div>
  );
};

export default SubAccount;