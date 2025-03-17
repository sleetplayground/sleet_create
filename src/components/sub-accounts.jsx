import { useState } from 'react';
import styles from '@/styles/sub-accounts.module.css';

export const SubAccounts = () => {
  const [masterAccount, setMasterAccount] = useState('');
  const [subAccountId, setSubAccountId] = useState('');
  const [publicKey, setPublicKey] = useState('');

  const getCliCommand = () => {
    if (!masterAccount || !subAccountId) return '';
    const fullSubAccountId = `${subAccountId}.${masterAccount}`;
    let command = `near create-account ${fullSubAccountId} --masterAccount ${masterAccount} --initialBalance 1`;
    if (publicKey) {
      command += ` --publicKey ${publicKey}`;
    }
    return command;
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Create NEAR Subaccounts</h2>
      <p className={styles.description}>
        Create accounts under your main account (e.g., app.myaccount.near). This requires
        an existing account to act as the parent account.
      </p>
      <div className={styles.actionArea}>
        <div className={styles.formGroup}>
          <input
            type="text"
            placeholder="Master Account (e.g., myaccount.near)"
            value={masterAccount}
            onChange={(e) => setMasterAccount(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <input
            type="text"
            placeholder="Subaccount ID (e.g., app)"
            value={subAccountId}
            onChange={(e) => setSubAccountId(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <input
            type="text"
            placeholder="Public Key (optional)"
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.cliPreview}>
          <h3>CLI Command Preview:</h3>
          <pre>{getCliCommand() || 'near create-account app.myaccount.near --masterAccount myaccount.near --initialBalance 1'}</pre>
        </div>
      </div>
    </div>
  );
};