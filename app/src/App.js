import { MetaMaskProvider } from 'metamask-react'
import { useState } from 'react'

import Main from './components/layout/Main'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import './App.css'

function App() {
  const [account, setAccount] = useState()

  return (
    <div className="App">
      <MetaMaskProvider>
        <Header
          authorize={setAccount}
        />

        <Main
          account={account}
        />

        <Footer />
      </MetaMaskProvider>
    </div>
  )
}

export default App;
