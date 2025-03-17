import styles from '@/styles/header-content.module.css';

export const HeaderContent = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>SLEET CREATE</h1>
      <p className={styles.subtitle}>NEAR ACCOUNT CREATION PLAYGROUND</p>
      <div className={styles.notice}>
        <p>NOTE: THE RECOMMEND WAY FOR USERS TO CREATE NEW NEAR ACCOUNTS IS WITH A NEAR WALLET APP LIKE METEOR WALLET OR BITTE. ONLY USE THIS TOOL IF YOU KNOW WHAT YOU ARE DOING!</p>
      </div>
    </div>
  );
};