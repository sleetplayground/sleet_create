# NEAR Account Key Management Guide

## Basic Key Operations

### Adding Keys to Accounts

1. Add a full access key to an account:
```bash
near add-key account-name.testnet "ed25519:PUBLIC_KEY"
```

2. Add a new key with seed phrase:
```bash
near add-key account-name.testnet --seedPhrase "your seed phrase here"
```

### Removing Keys from Accounts

1. Remove a specific access key:
```bash
near delete-key account-name.testnet "ed25519:PUBLIC_KEY"
```

2. List all access keys for an account:
```bash
near keys account-name.testnet
```

## Function-Call Access Keys

### Creating Function-Call Access Keys

1. Add a function-call access key with specific permissions:
```bash
near add-key account-name.testnet "ed25519:PUBLIC_KEY" --contractId contract-name.testnet --methodNames "method1,method2" --allowance 10
```

Parameters explained:
- `--contractId`: The contract that this key can call
- `--methodNames`: Comma-separated list of methods this key can call (empty means any method)
- `--allowance`: Maximum amount of NEAR tokens this key can spend (in NEAR)

2. Create a key with access to all methods on a contract:
```bash
near add-key account-name.testnet "ed25519:PUBLIC_KEY" --contractId contract-name.testnet --allowance 10
```

## Managing Keys Across Multiple Accounts

### Using the Same Key for Multiple Accounts

1. Export the public key from an existing account:
```bash
near keys account-name.testnet
```

2. Add the exported public key to another account:
```bash
near add-key second-account.testnet "ed25519:PUBLIC_KEY"
```

### Best Practices for Multi-Account Key Management

1. Organize accounts with shared keys:
- Create a clear hierarchy of accounts
- Document which accounts share which keys
- Use descriptive names for accounts sharing keys

2. Security considerations:
- Limit the number of accounts sharing full-access keys
- Prefer function-call access keys when possible
- Regularly audit key permissions across accounts

## Key Management Best Practices

1. Security Guidelines:
- Store backup copies of keys securely
- Use different keys for development and production
- Regularly rotate keys for enhanced security
- Never share private keys or seed phrases

2. Access Key Organization:
- Document all access keys and their purposes
- Maintain an inventory of function-call access keys
- Regularly review and remove unused keys

3. Recovery Preparation:
- Always maintain backup access
- Store recovery phrases securely
- Test key recovery procedures regularly

## Important Notes

- Full access keys have complete control over the account
- Function-call access keys can only call specific contract methods
- Key allowance is measured in NEAR tokens
- Lost full access keys can result in lost account access
- Always verify public keys before adding them
- Keep track of key expiration dates if set

## Troubleshooting

1. Common Issues:
- "Access Key Not Found": Verify the public key is correct
- "Not Enough Balance": Ensure account has sufficient funds for operations
- "Invalid Public Key": Check key format and encoding

2. Recovery Steps:
- Use backup full access key if available
- Contact NEAR support if all access is lost
- Use account recovery methods if enabled

Remember to always test key operations on testnet first before performing them on mainnet.