import { useState } from 'react';
import styles from '@/styles/account-creation.module.css';

export const SubAccountForm = () => {
  const [subAccountId, setSubAccountId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement sub-account creation logic
    console.log('Creating sub account:', subAccountId);
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="subAccountId">Sub Account Name</label>
        <input
          type="text"
          id="subAccountId"
          value={subAccountId}
          onChange={(e) => setSubAccountId(e.target.value)}
          placeholder="Enter sub account name"
          required
        />
      </div>
      <button type="submit" className={styles.submitButton}>
        Create Sub Account
      </button>
    </form>
  );
};