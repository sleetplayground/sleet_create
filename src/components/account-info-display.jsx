import styles from '@/styles/account-creation.module.css';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { NearContext } from '@/wallets/near';

export const AccountInfoDisplay = ({ accountInfo }) => {
  const { wallet } = useContext(NearContext);
  
  if (!accountInfo) return null;
  const networkSuffix = wallet.networkId === 'mainnet' ? '.near' : '.testnet';
  const fullAccountId = accountInfo.accountId + networkSuffix;

  return (
    <div className={styles.formContainer}>
      <h2>Account Created Successfully!</h2>
      <div className={styles.formGroup}>
        <label>Full Account Name</label>
        <p className={styles.keyDisplay}>{fullAccountId}</p>
      </div>
      <div className={styles.formGroup}>
        <label>Public Key</label>
        <p className={styles.keyDisplay}>{accountInfo.publicKey}</p>
      </div>
      <div className={styles.formGroup}>
        <label>Private Key</label>
        <p className={styles.keyDisplay}>{accountInfo.privateKey}</p>
      </div>
      <div className={styles.warning}>
        <p>⚠️ IMPORTANT: Save your private key in a secure place. Never share it with anyone!</p>
        <p>Your account will be permanently lost if you lose these credentials.</p>
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