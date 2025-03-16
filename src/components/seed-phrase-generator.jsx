import { useState } from 'react';
import { generateNewSeedPhrase } from '@/utils/seed-phrase';
import { SeedPhraseDisplay } from './seed-phrase-display';
import styles from '@/styles/main-content.module.css';

export const SeedPhraseGenerator = () => {
  const [keys, setKeys] = useState(null);

  const handleGenerateSeedPhrase = () => {
    const newKeys = generateNewSeedPhrase();
    setKeys(newKeys);
  };

  return (
    <div className={styles.seedPhraseSection}>
      <h2>Generate Seed Phrase</h2>
      <p className={styles.description}>
        Generate a new seed phrase to create NEAR accounts or use with existing wallets.
      </p>
      <button
        onClick={handleGenerateSeedPhrase}
        className={styles.button}
      >
        Generate New Seed Phrase
      </button>
      {keys && (
        <SeedPhraseDisplay
          seedPhrase={keys.seedPhrase}
          publicKey={keys.publicKey}
          privateKey={keys.privateKey}
        />
      )}
    </div>
  );
};