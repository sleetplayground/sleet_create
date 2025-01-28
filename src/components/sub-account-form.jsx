import styles from '@/styles/account-creation.module.css';

export const SubAccountForm = () => {
  return (
    <div className={styles.formContainer}>
      <div className={styles.formGroup}>
        <h3>Sub-Account Creation Currently Unavailable</h3>
        <p>Sub-account creation through the web interface is not currently supported. Please use the NEAR CLI to create sub-accounts.</p>
        <div className={styles.cliExample}>
          <p>Example CLI command:</p>
          <code>near create-account sub1.myaccount.testnet --masterAccount myaccount.testnet --initialBalance 1</code>
        </div>
        <p>For detailed instructions on using NEAR CLI for sub-account creation, please refer to the official NEAR documentation.</p>
      </div>
    </div>
  );
};