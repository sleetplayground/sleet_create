import { useState } from 'react';
import PropTypes from 'prop-types';
import styles from '@/styles/account-creation.module.css';

export const SeedPhraseDisplay = ({ seedPhrase, publicKey, privateKey }) => {
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copySuccess, setCopySuccess] = useState(''));

  const handleCopy = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(`${type} copied!`);
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h3>Account Keys</h3>
      <div className={styles.formGroup}>
        <label>Public Key</label>
        <div className={styles.keyDisplayContainer}>
          <p className={styles.keyDisplay}>{publicKey}</p>
          <button
            onClick={() => handleCopy(publicKey, 'Public key')}
            className={styles.copyButton}
          >
            Copy
          </button>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label>
          Private Key
          <button
            onClick={() => setShowPrivateKey(!showPrivateKey)}
            className={styles.toggleButton}
          >
            {showPrivateKey ? 'Hide' : 'Show'}
          </button>
        </label>
        {showPrivateKey && (
          <div className={styles.keyDisplayContainer}>
            <p className={styles.keyDisplay}>{privateKey}</p>
            <button
              onClick={() => handleCopy(privateKey, 'Private key')}
              className={styles.copyButton}
            >
              Copy
            </button>
          </div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label>
          Seed Phrase
          <button
            onClick={() => setShowSeedPhrase(!showSeedPhrase)}
            className={styles.toggleButton}
          >
            {showSeedPhrase ? 'Hide' : 'Show'}
          </button>
        </label>
        {showSeedPhrase && (
          <div className={styles.keyDisplayContainer}>
            <p className={styles.keyDisplay}>{seedPhrase}</p>
            <button
              onClick={() => handleCopy(seedPhrase, 'Seed phrase')}
              className={styles.copyButton}
            >
              Copy
            </button>
          </div>
        )}
      </div>

      {copySuccess && (
        <div className={styles.copySuccess}>{copySuccess}</div>
      )}

      <div className={styles.warning}>
        <p>⚠️ IMPORTANT: Store your seed phrase and private key securely!</p>
        <ul>
          <li>Never share these with anyone</li>
          <li>Store them in a secure location</li>
          <li>Loss of these credentials means permanent loss of account access</li>
        </ul>
      </div>
    </div>
  );
};

SeedPhraseDisplay.propTypes = {
  seedPhrase: PropTypes.string.isRequired,
  publicKey: PropTypes.string.isRequired,
  privateKey: PropTypes.string.isRequired
};