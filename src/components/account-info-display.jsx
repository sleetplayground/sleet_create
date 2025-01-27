import styles from '@/styles/account-creation.module.css';
import PropTypes from 'prop-types';

export const AccountInfoDisplay = ({ accountInfo }) => {
  if (!accountInfo) return null;

  return (
    <div className={styles.formContainer}>
      <h2>Account Created Successfully!</h2>
      <div className={styles.formGroup}>
        <label>Account Name</label>
        <p>{accountInfo.accountId}</p>
      </div>
      <div className={styles.formGroup}>
        <label>Public Key</label>
        <p className={styles.keyDisplay}>{accountInfo.publicKey}</p>
      </div>
      <div className={styles.formGroup}>
        <label>Private Key</label>
        <p className={styles.keyDisplay}>{accountInfo.privateKey}</p>
      </div>
      <div className={styles.formGroup}>
        <label>Seed Phrase</label>
        <p className={styles.keyDisplay}>{accountInfo.seedPhrase}</p>
      </div>
      <div className={styles.warning}>
        <p>WARNING: Save your private key and seed phrase in a secure place. Never share them with anyone!</p>
      </div>
    </div>
  );
};

AccountInfoDisplay.propTypes = {
  accountInfo: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    publicKey: PropTypes.string.isRequired,
    privateKey: PropTypes.string.isRequired,
    seedPhrase: PropTypes.string.isRequired
  })
};