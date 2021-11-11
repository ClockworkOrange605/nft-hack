import React, { useEffect } from 'react'
import { useMetaMask } from 'metamask-react'

import AuthProvider from './providers/AuthProvider'

import Main from './components/layout/Main'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'

import './App.css'

function App() {
  const { account: address } = useMetaMask()

  useEffect(() => {
    // Set Color Scheme
    if (address) {
      document.documentElement.style.setProperty(
        '--primary-account-color', `#${address.slice(2, 8)}`
      )
      document.documentElement.style.setProperty(
        '--secondary-account-color', `#${address.slice(-6)}`
      )
    } else {
      // return defaults after logout
      document.documentElement.style.setProperty('--primary-account-color', '#111111')
      document.documentElement.style.setProperty('--secondary-account-color', '#aaaaaa')
    }
  }, [address])

  return (
    <div className="App">
      <AuthProvider>
        <Header />
        <Main />
        <Footer />
      </AuthProvider>
    </div>
  )
}

export default App;
