import styles from '@/styles/named-accounts.module.css';

export const NamedAccounts = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Create NEAR Named Accounts</h2>
      <p className={styles.description}>
        Create a human-readable account name on NEAR. This requires an existing account
        to act as the funding account.
      </p>
      <div className={styles.actionArea}>
        {/* Action buttons and forms will be added here later */}
      </div>
    </div>
  );
};