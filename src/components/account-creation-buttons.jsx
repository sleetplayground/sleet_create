import { useState } from 'react';
import styles from '@/styles/account-creation.module.css';
import { NewAccountForm } from './new-account-form';
import { SubAccountForm } from './sub-account-form';

export const AccountCreationButtons = () => {
  const [activeForm, setActiveForm] = useState(null);

  return (
    <div className={styles.accountCreationContainer}>
      <div className={styles.buttonContainer}>
        <button
          className={`${styles.actionButton} ${activeForm === 'new' ? styles.active : ''}`}
          onClick={() => setActiveForm(activeForm === 'new' ? null : 'new')}
        >
          Create a New Account
        </button>
        <button
          className={`${styles.actionButton} ${activeForm === 'sub' ? styles.active : ''}`}
          onClick={() => setActiveForm(activeForm === 'sub' ? null : 'sub')}
        >
          Create a Sub Account
        </button>
      </div>
      {activeForm === 'new' && <NewAccountForm />}
      {activeForm === 'sub' && <SubAccountForm />}
    </div>
  );
};