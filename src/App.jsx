import { Navigation } from './components/navigation';
import { Footer } from './components/footer';
import { MainContent } from './components/main-content';
import { useEffect, useState, useCallback } from 'react';
import { NearContext, Wallet } from '@/wallets/near';
import { NetworkId } from '@/config';

function App() {
  const [signedAccountId, setSignedAccountId] = useState(null);
  const networkId = localStorage.getItem('networkId') || NetworkId;
  const wallet = new Wallet({ networkId, createAccessKeyFor: signedAccountId });

  useEffect(() => {
    wallet.startUp(setSignedAccountId);
  }, [wallet]);

  const handleNetworkChange = useCallback(async (newNetwork) => {
    if (signedAccountId) {
      await wallet.signOut();
    }
    
    localStorage.setItem('networkId', newNetwork);
    window.location.reload();
  }, [wallet, signedAccountId]);

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
