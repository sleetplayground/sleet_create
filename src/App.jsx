import { Navigation } from './components/navigation';
import Home from './pages/home';

import { useEffect, useState } from 'react';
import { NetworkId } from './config.js';
import { NearContext, Wallet } from '@/wallets/near';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Wallet instance
const wallet = new Wallet({ NetworkId: NetworkId });

function App() {
  const [signedAccountId, setSignedAccountId] = useState(null);

  useEffect(() => {
    wallet.startUp(setSignedAccountId);
  }, []);

  return (
    <NearContext.Provider value={{ wallet, signedAccountId }}>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </NearContext.Provider>
  )
}

export default App
