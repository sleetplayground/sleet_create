const { generateSeedPhrase, parseSeedPhrase } = require('near-seed-phrase');

export const generateNewSeedPhrase = () => {
  const { seedPhrase, publicKey, secretKey } = generateSeedPhrase();
  return {
    seedPhrase,
    publicKey,
    privateKey: secretKey
  };
};

export const recoverKeysFromSeedPhrase = (seedPhrase) => {
  if (!seedPhrase) {
    throw new Error('Seed phrase is required');
  }

  try {
    const { publicKey, secretKey } = parseSeedPhrase(seedPhrase);
    return {
      publicKey,
      privateKey: secretKey
    };
  } catch {
    throw new Error('Invalid seed phrase');
  }
};