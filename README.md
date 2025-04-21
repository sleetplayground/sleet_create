# SLEET CREATE
create keypair and near accounts

This is a part of the sleet web3 playground project by Nathan Renfroe & The SunShining.


Note: the recommend way for users to create new near accounts is with a near wallet app like meteor wallet or bitte. only use this tool if you know what you are doing!

---

### DEV
```sh
pnpm i
pnpm dev
pnpm build

# web4 deploy
NEAR_SIGNER_KEY=ed25519:your_key_here
pnpm run web4_testnet
pnpm run web4_mainnet
```

---

## NEAR ACCOUNT CREATION AND LEARNING PLAYGROUND

### 1. Create Key Pairs

Generate a new key pair that can be used independently or for future NEAR accounts. This includes a public key (shared) and private key (secret).



### 2. Create Implicit Accounts
Implicit accounts are denoted by a 64 character address, which corresponds to a unique public/private key-pair. 

```bash
near account create-account fund-later use-auto-generation save-to-folder ~/.near-credentials/implicit
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