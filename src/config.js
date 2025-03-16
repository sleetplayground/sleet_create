const contractPerNetwork = {
  mainnet: 'near',
  testnet: 'testnet',
};


const networkId = localStorage.getItem('networkId') || 'testnet';
export const NetworkId = networkId;


export const NearContract = contractPerNetwork[NetworkId];