const { parseSeedPhrase, generateSeedPhrase } = require('near-seed-phrase');

// to create a seed phrase with its corresponding Keys
const {seedPhrase, publicKey, secretKey} = generateSeedPhrase()
