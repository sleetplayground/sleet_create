export const TESTNET_CONFIG = {
  networkId: 'testnet',
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://wallet.testnet.near.org',
  helperUrl: 'https://helper.testnet.near.org',
  indexerUrl: 'https://api.testnet.near.org',
  explorerUrl: 'https://explorer.testnet.near.org'
};

export const INITIAL_DEPOSIT = '100000000000000000000000'; // 0.1 NEAR in yoctoNEAR

export interface WalletState {
  isConnected: boolean;
  accountId: string | null;
}

export interface AccountCreationResult {
  accountId: string;
  publicKey: string;
  privateKey: string;
  seedPhrase: string;
}