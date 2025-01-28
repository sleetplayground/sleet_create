# How to Create NEAR Accounts with NEAR CLI



## Creating a New Account

### Regular Account Creation

1. Create the account:
```bash
near create-account my-account.testnet --masterAccount funding-account.testnet --initialBalance 5
```
Note: Replace `funding-account.testnet` with your existing account that will fund the new account.

2. Create account using faucet (testnet only):
```bash
near create-account my-account.testnet --useFaucet
```
Note: The account will be created with a key stored in your system's keychain.

### Sub-account Creation

1. Create a sub-account (must be done by the parent account):
```bash
near create-account sub1.myaccount.testnet --masterAccount myaccount.testnet --initialBalance 1
```

## Account Management Commands

### Check Account State
```bash
near state my-account.testnet
```

### View Account Balance
```bash
near view-account my-account.testnet
```

### Delete Account
```bash
near delete-account my-account.testnet --beneficiaryId beneficiary-account.testnet
```

### Export Account
```bash
near account export-account my-account.testnet
```

## Important Notes

- Account IDs can only contain lowercase letters, digits, and separators (`-` or `_`)
- Account IDs must be between 2-64 characters long
- Sub-accounts can only be created by their parent account
- Always keep your private keys and seed phrases secure and never share them
- Initial balance is in NEAR tokens (1 NEAR = 10^24 yoctoNEAR)

## Common Issues and Solutions

1. "Account already exists":
   - Choose a different account name
   - Check if the account exists using `near state`

2. "Not enough balance":
   - Ensure funding account has sufficient balance
   - Reduce initial balance amount

3. "Invalid account ID":
   - Verify account name follows naming rules
   - Check for typos in account name

## Best Practices

1. Always test on testnet first
2. Keep secure backups of key pairs and seed phrases
3. Use descriptive account names
4. Document account hierarchies for sub-accounts
5. Maintain sufficient funds in master account for creating sub-accounts

## Key Management

### Key Storage
1. By default, NEAR CLI v0.18.0 stores keys in your system's keychain for enhanced security
2. To generate a seed phrase for backup, always use the `--seedPhrase` flag when creating accounts
3. The keychain storage provides better security but makes it harder to export keys

### Security Best Practices
1. Always use `--seedPhrase` flag when creating important accounts to ensure you have a backup
2. Store seed phrases securely offline
3. Never share your private keys or seed phrases
4. Use different keys for testnet and mainnet
5. Consider using hardware wallets for large holdings
6. Rotate keys periodically for enhanced security

