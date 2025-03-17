import styles from '@/styles/implicit-accounts.module.css';

export const ImplicitAccounts = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Create Implicit Accounts</h2>
      <p className={styles.description}>
        Implicit accounts are denoted by a 64 character address, which corresponds to a unique
        public/private key-pair.
      </p>
      <div className={styles.actionArea}>
        {/* Action buttons and forms will be added here later */}
      </div>
    </div>
  );
};