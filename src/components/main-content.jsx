import styles from '@/styles/main-content.module.css';
import { AccountCreationButtons } from './account-creation-buttons';

export const MainContent = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>SLEET ACCOUNT</h1>
      <p className={styles.subtitle}>NEAR ACCOUNT CREATION PLAYGROUND</p>
      <AccountCreationButtons />
      <div className={styles.notice}>
        <p>NOTE: THE RECOMMEND WAY FOR USERS TO CREATE NEW NEAR ACCOUNTS IS WITH A NEAR WALLET APP LIKE METEOR WALLET OR BITTE. ONLY USE THIS TOOL IF YOU KNOW WHAT YOU ARE DOING!</p>
      </div>
    </div>
  );
};