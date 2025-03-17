import styles from '@/styles/header-content.module.css';
import sleetIcon from '@/assets/sleet_code_icon_trans.png';

export const HeaderContent = () => {
  return (
    <div className={styles.container}>
      <img src={sleetIcon} alt="Sleet Code Icon" className={styles.logo} />
      <h1 className={styles.title}>SLEET<br/>CREATE</h1>
      <p className={styles.subtitle}>NEAR ACCOUNT CREATION<br/>AND LEARNING PLAYGROUND</p>
    </div>
  );
};