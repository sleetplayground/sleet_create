import { useState, useEffect } from 'react';
import styles from '@/styles/named-accounts.module.css';
import { Wallet } from '@/wallets/near';
import { NearContract, NetworkId } from '@/config';

export const NamedAccounts = () => {
  const [accountId, setAccountId] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [error, setError] = useState('');
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    const initWallet = async () => {
      const walletInstance = new Wallet({ networkId: NetworkId });
      await walletInstance.startUp(() => {});
      setWallet(walletInstance);
    };
    initWallet();
  }, []);

  const handleCreateAccount = async () => {
    try {
      setError('');
      if (!accountId || !publicKey) {
        setError('Please fill in both account ID and public key');
        return;
      }

      if (!wallet) {
        setError('Wallet is not initialized');
        return;
      }

      await wallet.callMethod({
        contractId: NearContract,
        method: 'create_account',
        args: {
          new_account_id: accountId,
          new_public_key: publicKey
        }
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Create NEAR Named Accounts</h2>
      <p className={styles.description}>
        Create a human-readable account name on NEAR. This requires an existing account
        to act as the funding account.
      </p>
      <div className={styles.actionArea}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Enter account ID (e.g. myaccount.near)"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Enter public key (ed25519:...)"
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            className={styles.input}
          />
          <button
            onClick={handleCreateAccount}
            className={styles.button}
          >
            Create Account
          </button>
        </div>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
};