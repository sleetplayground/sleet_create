import { useState, useContext, useEffect } from 'react';
import styles from '@/styles/account-creation.module.css';
import { AccountCreator } from '@/utils/account-creation';
import { AccountInfoDisplay } from './account-info-display';
import { NearContext } from '@/wallets/near';

export const NewAccountForm = () => {
  const { wallet, signedAccountId } = useContext(NearContext);
  const [accountId, setAccountId] = useState('');
  const [accountInfo, setAccountInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [providedPublicKey, setProvidedPublicKey] = useState('');
  const [generatedKeyPair, setGeneratedKeyPair] = useState(null);

  useEffect(() => {
    const checkAvailability = async () => {
      if (!accountId || !wallet) return;
      
      setIsChecking(true);
      setAvailability(null);
      setError(null);

      try {
        const accountCreator = new AccountCreator(wallet);
        const result = await accountCreator.checkAccountAvailability(accountId);
        setAvailability(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsChecking(false);
      }
    };

    const timeoutId = setTimeout(checkAvailability, 500);
    return () => clearTimeout(timeoutId);
  }, [accountId, wallet]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!wallet) {
      setError('Please connect your wallet first');
      setIsLoading(false);
      return;
    }

    if (!signedAccountId) {
      setError('Please sign in to create a new account');
      setIsLoading(false);
      return;
    }

    try {
      const accountCreator = new AccountCreator(wallet);
      const result = await accountCreator.createAccount(accountId);

      if (result.success) {
        setAccountInfo(result);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateKeyPair = () => {
    const accountCreator = new AccountCreator(wallet);
    const newKeyPair = accountCreator.generateKeyPair();
    setGeneratedKeyPair(newKeyPair);
    setProvidedPublicKey(newKeyPair.publicKey);
  };

  return (
    <div>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="accountId">Account Name</label>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              id="accountId"
              value={accountId}
              onChange={(e) => {
                const value = e.target.value.toLowerCase();
                if (value === '' || /^[a-z0-9-_]*$/.test(value)) {
                  setAccountId(value);
                }
              }}
              placeholder="Enter account name (lowercase letters, numbers, hyphens, and underscores only)"
              pattern="[a-z0-9-_]+"
              required
            />
            {isChecking && <span className={styles.checking}>Checking...</span>}
            {!isChecking && availability && (
              <span className={availability.available ? styles.available : styles.unavailable}>
                {availability.available ? '✓ Available' : '✗ Unavailable'}
              </span>
            )}
          </div>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="publicKey">Public Key</label>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              id="publicKey"
              value={providedPublicKey}
              onChange={(e) => setProvidedPublicKey(e.target.value)}
              placeholder="Enter or generate a public key"
              required
            />
            <button
              type="button"
              className={styles.generateButton}
              onClick={handleGenerateKeyPair}
            >
              Generate New Keypair
            </button>
          </div>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        {generatedKeyPair && !accountInfo && (
          <div className={styles.keyPairInfo}>
            <h3>Generated Key Pair</h3>
            <p>Public Key: {generatedKeyPair.publicKey}</p>
            <p>Private Key: {generatedKeyPair.privateKey}</p>
            <div className={styles.warning}>
              <p>⚠️ IMPORTANT: Save your private key in a secure place. Never share it with anyone!</p>
            </div>
          </div>
        )}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading || !availability?.available || !providedPublicKey}
        >
          {isLoading ? 'Creating...' : 'Create Account'}
        </button>
      </form>
      {accountInfo && <AccountInfoDisplay accountInfo={accountInfo} />}
    </div>
  );
};