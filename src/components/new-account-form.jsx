import { useState } from 'react';
import styles from '@/styles/account-creation.module.css';

export const NewAccountForm = () => {
  const [accountId, setAccountId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement account creation logic
    console.log('Creating new account:', accountId);
  };

  return (
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
      <button type="submit" className={styles.submitButton}>
        Create New Account
      </button>
    </form>
  );
};