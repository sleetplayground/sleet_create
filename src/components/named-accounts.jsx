import { useState, useEffect, useContext } from 'react';
import styles from '@/styles/named-accounts.module.css';
import { Wallet } from '@/wallets/near';
import { NearContract } from '@/config';
import { NearContext } from '@/wallets/near';

export const NamedAccounts = () => {
  const { networkId } = useContext(NearContext);
  const [accountId, setAccountId] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [error, setError] = useState('');
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    const initWallet = async () => {
      const walletInstance = new Wallet({ networkId });
      await walletInstance.startUp(() => {});
      setWallet(walletInstance);
    };
    initWallet();
  }, [networkId]);

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

      // Validate account ID format
      if (!/^[a-z0-9-_]+\.testnet$/.test(accountId) && !/^[a-z0-9-_]+\.near$/.test(accountId)) {
        setError('Invalid account ID format. Must end with .near or .testnet and contain only lowercase letters, numbers, - or _');
        return;
      }

      // Validate public key format
      if (!/^ed25519:[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{43,44}$/.test(publicKey)) {
        setError('Invalid public key format. Must start with "ed25519:" followed by base58 characters');
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
      // Parse and display user-friendly error message
      let errorMessage = 'Failed to create account';
      try {
        const errorObj = JSON.parse(err.message);
        if (errorObj.kind && errorObj.kind.account_id) {
          errorMessage = `Account creation failed: The account ${errorObj.kind.account_id} is not available`;
        }
      } catch {
        errorMessage = err.message;
      }
      setError(errorMessage);
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
            placeholder={`Enter account ID (without .${networkId === 'mainnet' ? 'near' : 'testnet'})`}
            value={accountId.split('.')[0]}
            onChange={(e) => {
              const baseAccountId = e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '');
              const suffix = networkId === 'mainnet' ? 'near' : 'testnet';
              setAccountId(baseAccountId ? `${baseAccountId}.${suffix}` : '');
            }}
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