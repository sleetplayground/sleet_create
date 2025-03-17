import styles from '@/styles/key-pairs.module.css';

export const KeyPairs = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Create Key Pairs</h2>
      <p className={styles.description}>
        Generate a new key pair that can be used independently or for future NEAR accounts.
        This includes a public key (shared) and private key (secret).
      </p>
      <div className={styles.actionArea}>
        {/* Action buttons and forms will be added here later */}
      </div>
    </div>
  );
};