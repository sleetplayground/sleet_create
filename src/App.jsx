import { Navigation } from './components/navigation';
import { Footer } from './components/footer';
import { useEffect, useState } from 'react';
import { NearContext, Wallet } from '@/wallets/near';

function App() {
  const [signedAccountId, setSignedAccountId] = useState(null);
  const [networkId, setNetworkId] = useState(() => {
    return localStorage.getItem('networkId') || 'testnet';
  });
  const [wallet, setWallet] = useState(() => new Wallet({ networkId }));

  useEffect(() => {
    wallet.startUp(setSignedAccountId);
    return () => {
      wallet.cleanup();
    };
  }, [wallet]);

  const handleNetworkChange = async (newNetwork) => {
    await wallet.cleanup();
    localStorage.setItem('networkId', newNetwork);
    setNetworkId(newNetwork);
    const newWallet = new Wallet({ networkId: newNetwork });
    await newWallet.startUp(setSignedAccountId);
    setWallet(newWallet);
    window.location.reload();
  };

  return (
    <NearContext.Provider value={{ wallet, signedAccountId, networkId, onNetworkChange: handleNetworkChange }}>
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
