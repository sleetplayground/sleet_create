import { NetworkId as DefaultNetwork } from '@/config';

class NetworkConfigService {
  constructor() {
    this.networkId = this.getStoredNetwork() || DefaultNetwork;
    this.listeners = new Set();
  }

  getStoredNetwork() {
    return localStorage.getItem('networkId');
  }

  getCurrentNetwork() {
    return this.networkId;
  }

  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners() {
    this.listeners.forEach(callback => callback(this.networkId));
  }

  async switchNetwork(newNetwork) {
    if (newNetwork === this.networkId) return;

    try {
      localStorage.setItem('networkId', newNetwork);
      this.networkId = newNetwork;
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Failed to switch network:', error);
      return false;
    }
  }
}

export const networkConfig = new NetworkConfigService();