export const TESTNET_CONFIG = {
  networkId: 'testnet',
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://wallet.testnet.near.org',
  helperUrl: 'https://helper.testnet.near.org',
  indexerUrl: 'https://api.testnet.near.org',
  explorerUrl: 'https://explorer.testnet.near.org'
};

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