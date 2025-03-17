# SLEET CREATE
create keypair and near accounts

This is a part of the sleet web3 playground project by Nathan Renfroe & The SunShining.


Note: the recommend way for users to create new near accounts is with a near wallet app like meteor wallet or bitte. only use this tool if you know what you are doing!

---


### 1. Create Key Pairs
Generate a new key pair for your NEAR account. This includes a public key (shared) and private key (secret).

```bash
near generate-key my-account.testnet
```

### 2. Create Implicit Accounts
Create an account using just a public key - useful for quick testing or temporary accounts.

```bash
# First deposit NEAR to the public key-based account
near send sender.testnet ed25519:GENERATED_PUBLIC_KEY 10
```

### 3. Create New NEAR Named Accounts
Create a human-readable account name on NEAR (requires existing account).

```bash
near create-account new-account.testnet --masterAccount funding-account.testnet --initialBalance 10
```

### 4. Create New Subacccounts
Create accounts under your main account (e.g., app.myaccount.near).

```bash
near create-account sub1.myaccount.testnet --masterAccount myaccount.testnet --initialBalance 5
```

---


copyright 2025 by SLEET