import { Navigation } from './components/navigation';
import { Footer } from './components/footer';
import { MainContent } from './components/main-content';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { Wallet } from '@/wallets/near';
import { NearContext } from '@/wallets/near';
import { NetworkId } from '@/config';

function App() {
  const [signedAccountId, setSignedAccountId] = useState(null);
  const networkId = localStorage.getItem('networkId') || NetworkId;
  const wallet = useMemo(() => new Wallet({ networkId, createAccessKeyFor: signedAccountId }), [networkId, signedAccountId]);

  useEffect(() => {
    wallet.startUp(setSignedAccountId);
  }, [wallet]);

  const handleNetworkChange = useCallback(async (newNetwork) => {
    if (signedAccountId) {
      return;
    }
    
    localStorage.setItem('networkId', newNetwork);
    window.location.reload();
  }, [signedAccountId]);

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
