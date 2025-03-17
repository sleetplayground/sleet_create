import styles from '@/styles/sub-accounts.module.css';

export const SubAccounts = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Create NEAR Subaccounts</h2>
      <p className={styles.description}>
        Create accounts under your main account (e.g., app.myaccount.near). This requires
        an existing account to act as the parent account.
      </p>
      <div className={styles.actionArea}>
        {/* Action buttons and forms will be added here later */}
      </div>
    </div>
  );
};