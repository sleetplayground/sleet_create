import React from 'react';
import { AccountCreationResult } from '../config/near';

interface AccountFormProps {
  isConnected: boolean;
  isCreating: boolean;
  error: string | null;
  accountName: string;
  isAvailable: boolean | null;
  accountInfo: AccountCreationResult | null;
  parentAccount?: string | null;
  onAccountNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCreateClick: () => void;
}

const AccountForm: React.FC<AccountFormProps> = ({
  isConnected,
  isCreating,
  error,
  accountName,
  isAvailable,
  accountInfo,
  parentAccount,
  onAccountNameChange,
  onCreateClick
}) => {
  return (
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
        placeholder={parentAccount ? "Enter sub-account name" : "Enter account name"}
        value={accountName}
        onChange={onAccountNameChange}
        disabled={isCreating || (parentAccount ? !parentAccount : false)}
      />
      
      {accountName && (
        <>
          {parentAccount && (
            <p className="full-account-name">Full account name: {accountName}.{parentAccount}</p>
          )}
          {isAvailable !== null && (
            <p className={`availability-message ${isAvailable ? 'available' : 'unavailable'}`}>
              {isAvailable ? '✓ Available' : '✗ Unavailable'}
            </p>
          )}
        </>
      )}
      
      <button
        className="button create-button"
        onClick={onCreateClick}
        disabled={!isConnected || !accountName || !isAvailable || isCreating}
      >
        {isCreating ? 'Creating...' : parentAccount ? 'Create Sub-Account' : 'Create Account'}
      </button>

      {accountInfo && (
        <div className="account-info">
          <h3>🎉 {parentAccount ? 'Sub-Account' : 'Account'} Created Successfully!</h3>
          <p><strong>Account ID:</strong> {accountInfo.accountId}</p>
          <p><strong>Public Key:</strong> {accountInfo.publicKey}</p>
          <p><strong>Private Key:</strong> {accountInfo.privateKey}</p>
          <p><strong>Seed Phrase:</strong> {accountInfo.seedPhrase}</p>
          <p className="warning"><strong>Important:</strong> Please save this information in a secure place. You will need it to access your account.</p>
        </div>
      )}
    </div>
  );
};

export default AccountForm;