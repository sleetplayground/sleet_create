import { Navigation } from './components/navigation';
import { Footer } from './components/footer';
import { useEffect, useState } from 'react';
import { NetworkId } from './config.js';
import { NearContext, Wallet } from '@/wallets/near';

// Wallet instance
const wallet = new Wallet({ NetworkId: NetworkId });

function App() {
  const [signedAccountId, setSignedAccountId] = useState(null);

  useEffect(() => {
    wallet.startUp(setSignedAccountId);
  }, []);

  return (
    <NearContext.Provider value={{ wallet, signedAccountId }}>
      <div className="container d-flex flex-column min-vh-100">
        <Navigation />
        <main className="mt-4 flex-grow-1">
          {/* Add your main content components here */}
        </main>
        <Footer />
      </div>
    </NearContext.Provider>
  )
}

export default App
