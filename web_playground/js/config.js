import { keyStores, connect } from 'near-api-js';

const getConfig = (network) => {
    const config = {
        networkId: network,
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        nodeUrl: `https://rpc.${network}.near.org`,
        walletUrl: `https://wallet.${network}.near.org`,
        helperUrl: `https://helper.${network}.near.org`,
        explorerUrl: `https://explorer.${network}.near.org`
    };
    return config;
};

export const initNearConnection = async (network) => {
    const nearConfig = getConfig(network);
    const near = await connect(nearConfig);
    return near;
};