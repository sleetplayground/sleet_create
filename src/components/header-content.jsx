import styles from '@/styles/header-content.module.css';

export const HeaderContent = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>SLEET<br/>CREATE</h1>
      <p className={styles.subtitle}>NEAR ACCOUNT CREATION<br/>AND LEARNING PLAYGROUND</p>
    </div>
  );
};