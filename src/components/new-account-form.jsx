import { useState, useContext } from 'react';
import styles from '@/styles/account-creation.module.css';
import { AccountCreator } from '@/utils/account-creation';
import { AccountInfoDisplay } from './account-info-display';
import { NearContext } from '@/wallets/near';

export const NewAccountForm = () => {
  const { wallet, signedAccountId } = useContext(NearContext);
  const [accountId, setAccountId] = useState('');
  const [accountInfo, setAccountInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!wallet) {
      setError('Please connect your wallet first');
      setIsLoading(false);
      return;
    }

    if (!signedAccountId) {
      setError('Please sign in to create a new account');
      setIsLoading(false);
      return;
    }

    try {
      const accountCreator = new AccountCreator(wallet);
      const result = await accountCreator.createAccount(accountId);

      if (result.success) {
        setAccountInfo(result);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="accountId">Account Name</label>
          <input
            type="text"
            id="accountId"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            placeholder="Enter account name"
            required
          />
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <button type="submit" className={styles.submitButton} disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Create New Account'}
        </button>
      </form>
      {accountInfo && <AccountInfoDisplay accountInfo={accountInfo} />}
    </div>
  );
};