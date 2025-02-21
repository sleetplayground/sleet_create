import styles from '@/styles/account-creation.module.css';
import { AccountCreator } from '@/utils/account-creation';
import { useState } from 'react';
import { useWallet } from '@near-wallet-selector/core';

export const SubAccountForm = () => {
  const [subAccountId, setSubAccountId] = useState('');
  const [parentAccountId, setParentAccountId] = useState('');
  const [initialBalance, setInitialBalance] = useState('1');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [accountInfo, setAccountInfo] = useState(null);
  const wallet = useWallet();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setAccountInfo(null);

    try {
      const accountCreator = new AccountCreator(wallet);
      const result = await accountCreator.createSubAccount(subAccountId, parentAccountId, initialBalance);

      if (result.success) {
        setSuccess(true);
        setAccountInfo(result);
      } else {
        setError(result.error || 'Failed to create sub-account');
      }
    } catch (error) {
      setError(error.message || 'An error occurred while creating the sub-account');
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formGroup}>
        <h3>Create Sub-Account</h3>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="subAccountId">Sub-Account Name:</label>
            <input
              type="text"
              id="subAccountId"
              value={subAccountId}
              onChange={(e) => setSubAccountId(e.target.value)}
              placeholder="Enter sub-account name"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="parentAccountId">Parent Account ID:</label>
            <input
              type="text"
              id="parentAccountId"
              value={parentAccountId}
              onChange={(e) => setParentAccountId(e.target.value)}
              placeholder="Enter parent account ID"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="initialBalance">Initial Balance (NEAR):</label>
            <input
              type="number"
              id="initialBalance"
              value={initialBalance}
              onChange={(e) => setInitialBalance(e.target.value)}
              min="0.1"
              step="0.1"
              required
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Create Sub-Account
          </button>
        </form>

        {error && <div className={styles.error}>{error}</div>}
        
        {success && accountInfo && (
          <div className={styles.success}>
            <h4>Sub-Account Created Successfully!</h4>
            <p>Account ID: {accountInfo.accountId}</p>
            <p>Public Key: {accountInfo.publicKey}</p>
            <p>Private Key: {accountInfo.privateKey}</p>
            <div className={styles.warning}>
              Important: Save your private key in a secure location. You will not be able to recover it if lost.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};