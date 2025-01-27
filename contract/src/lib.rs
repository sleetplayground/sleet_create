use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen, AccountId, Promise, PublicKey};

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct AccountManager {
    owner_id: AccountId,
}

#[near_bindgen]
impl AccountManager {
    #[init]
    pub fn new(owner_id: AccountId) -> Self {
        Self { owner_id }
    }

    pub fn create_account(&mut self, new_account_id: AccountId, new_public_key: PublicKey) -> Promise {
        assert_eq!(
            env::predecessor_account_id(),
            self.owner_id,
            "Only the owner can create accounts"
        );

        Promise::new(new_account_id)
            .create_account()
            .add_full_access_key(new_public_key)
            .transfer(1) // Minimum balance for account existence (1 yoctoNEAR)
    }

    pub fn add_access_key(&mut self, account_id: AccountId, public_key: PublicKey) -> Promise {
        assert_eq!(
            env::predecessor_account_id(),
            account_id,
            "Only the account owner can add keys"
        );

        Promise::new(account_id).add_full_access_key(public_key)
    }
}