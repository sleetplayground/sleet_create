import { Navigation } from './components/navigation';
import { Footer } from './components/footer';
import { MainContent } from './components/main-content';
import { useEffect, useState, useCallback } from 'react';
import { NearContext, Wallet } from '@/wallets/near';
import { networkConfig } from '@/services/network-config';

function App() {
  const [signedAccountId, setSignedAccountId] = useState(null);
  const [networkId, setNetworkId] = useState(() => networkConfig.getCurrentNetwork());
  const [wallet, setWallet] = useState(() => new Wallet({ networkId, createAccessKeyFor: signedAccountId }));

  useEffect(() => {
    wallet.startUp(setSignedAccountId);
    const unsubscribe = networkConfig.addListener(setNetworkId);
    return () => unsubscribe();
  }, [wallet]);

  const handleNetworkChange = useCallback(async (newNetwork) => {
    if (signedAccountId) {
      const confirmed = window.confirm('Please log out before changing networks to ensure proper wallet state management.');
      if (!confirmed) return;
      await wallet.signOut();
    }
    
    const success = await networkConfig.switchNetwork(newNetwork);
    if (success) {
      const newWallet = new Wallet({ networkId: newNetwork, createAccessKeyFor: signedAccountId });
      await newWallet.startUp(setSignedAccountId);
      setWallet(newWallet);
    }
  };

  return (
    <NearContext.Provider value={{ wallet, signedAccountId, networkId, onNetworkChange: handleNetworkChange }}>
      <div className="container d-flex flex-column min-vh-100">
        <Navigation />
        <main className="mt-4 flex-grow-1">
          <MainContent />
        </main>
        <Footer />
      </div>
    </NearContext.Provider>
  )
}

export default App
