import { useState } from 'react';
import { KeyPair } from 'near-api-js';
import styles from '@/styles/key-pairs.module.css';

export const KeyPairs = () => {
  const [keyPair, setKeyPair] = useState(null);

  const generateKeyPair = () => {
    const newKeyPair = KeyPair.fromRandom('ed25519');
    setKeyPair(newKeyPair);
  };

  const saveToMarkdown = () => {
    if (!keyPair) return;

    const content = `# NEAR Key Pair Information

⚠️ **IMPORTANT: Keep this information secure and private!**

## Public Key
```
${keyPair.getPublicKey().toString()}
```

## Private Key
⚠️ **WARNING: Never share your private key with anyone!**
```
${keyPair.toString()}
```

## Security Notes
- Store this information in a secure location
- Never share your private key
- Make sure to backup this information
- Required for account recovery
`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'near-keypair.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Create Key Pairs</h2>
      <p className={styles.description}>
        Generate a new key pair that can be used independently or for future NEAR accounts.
        This includes a public key (shared) and private key (secret).
      </p>
      <div className={styles.actionArea}>
        <button
          className={styles.button}
          onClick={generateKeyPair}
          style={{ marginRight: '1rem' }}
        >
          Generate New Key Pair
        </button>
        <button
          className={styles.button}
          onClick={saveToMarkdown}
          disabled={!keyPair}
        >
          Save as Markdown
        </button>

        {keyPair && (
          <div className={styles.keyInfo}>
            <div className={styles.warningBox}>
              ⚠️ Warning: Keep your private key secure and never share it with anyone!
              Make sure to save and backup this information if you plan to use it for a NEAR account.
            </div>
            <div className={styles.keyBox}>
              <h3>Public Key</h3>
              <pre>{keyPair.getPublicKey().toString()}</pre>
            </div>
            <div className={styles.keyBox}>
              <h3>Private Key</h3>
              <pre>{keyPair.toString()}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
};