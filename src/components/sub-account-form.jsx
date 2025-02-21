import { useState, useContext } from 'react';
import styles from '@/styles/account-creation.module.css';
import { AccountCreator } from '@/utils/account-creation';
import { NearContext } from '@/wallets/near';

export const SubAccountForm = () => {
  const [subAccountId, setSubAccountId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [accountInfo, setAccountInfo] = useState(null);
  const { wallet, signedAccountId } = useContext(NearContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setAccountInfo(null);

    if (!wallet) {
      setError('Please connect your wallet first');
      return;
    }

    if (!signedAccountId) {
      setError('Please sign in to create a sub-account');
      return;
    }

    try {
      const accountCreator = new AccountCreator(wallet);
      const result = await accountCreator.createSubAccount(subAccountId, signedAccountId);

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
              onChange={(e) => {
                const value = e.target.value.toLowerCase();
                if (value === '' || /^[a-z0-9-_]*$/.test(value)) {
                  setSubAccountId(value);
                }
              }}
              placeholder="Enter sub-account name"
              pattern="[a-z0-9-_]+"
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