import { useContext } from 'react';
import styles from '@/styles/navigation.module.css';
import networkStyles from '@/styles/network-toggle.module.css';
import { NearContext } from '@/wallets/near';

export const Navigation = () => {
  const { networkId, onNetworkChange, signedAccountId, wallet } = useContext(NearContext);

  const handleNetworkToggle = (e) => {
    const newNetwork = e.target.checked ? 'mainnet' : 'testnet';
    onNetworkChange(newNetwork);
  };

  const handleLogin = () => {
    if (!signedAccountId) {
      wallet.signIn();
    } else {
      wallet.signOut();
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContent}>
        <div className={styles.toggleContainer}>
          <div className={networkStyles.networkToggle}>
            <input
              type="checkbox"
              className={networkStyles.networkToggleInput}
              id="networkToggle"
              checked={networkId === 'mainnet'}
              onChange={handleNetworkToggle}
            />
            <label className={networkStyles.networkToggleLabel} htmlFor="networkToggle">
              <div className={networkStyles.networkToggleInner}>
                <div className={networkStyles.networkToggleSwitch} />
              </div>
            </label>
          </div>
        </div>
        <button className={styles.loginButton} onClick={handleLogin}>
          {signedAccountId ? 'Logout' : 'Login'}
        </button>
      </div>
    </nav>
  );
};
