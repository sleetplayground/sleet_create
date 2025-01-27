import { useContext,useEffect, useState } from 'react';

import SleetLogo from '@/assets/sleet_icon.svg';
import SleetLightLogo from '@/assets/sleet_light.svg';
import { NearContext } from '@/wallets/near';
import { Link } from "react-router-dom";
import styles from '@/styles/app.module.css';

export const Navigation = () => {
  const { signedAccountId, wallet } = useContext(NearContext);
  const [action, setAction] = useState(() => {});
  const [label, setLabel] = useState('Loading...');

  useEffect(() => {
    if (!wallet) return;

    if (signedAccountId) {
      setAction(() => wallet.signOut);
      setLabel(`Logout ${signedAccountId}`);
    } else {
      setAction(() => wallet.signIn);
      setLabel('Login');
    }
  }, [signedAccountId, wallet]);

  return (
    <nav className={`${styles.navbar} navbar navbar-expand-lg`}>
      <div className="container-fluid">
        <Link to="/" className="d-flex align-items-center text-decoration-none">
          <picture>
            <source srcSet={SleetLightLogo} media="(prefers-color-scheme: dark)" />
            <img src={SleetLogo} alt="Sleet" width="30" height="24" className={styles.logo} />
          </picture>
          <div className="ms-3">
            <div className="text-uppercase fw-bold">Sleet Account</div>
            <div className="small text-uppercase" style={{ color: 'var(--light-accent)' }}>near account creation playground</div>
          </div>
        </Link>
        <div className="navbar-nav pt-1">
          <button className={`btn ${styles.loginButton}`} onClick={action}>
            {label}
          </button>
        </div>
      </div>
    </nav>
  );
};
