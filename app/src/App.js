import { useMetaMask } from 'metamask-react'

import Main from './components/layout/Main'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'

import './App.css'
import { useEffect } from 'react'

function App() {
  const { account } = useMetaMask()

  useEffect(() => {
    if (account) {
      document.documentElement.style.setProperty(
        '--primary-account-color', `#${account.slice(2, 8)}`
      )
      document.documentElement.style.setProperty(
        '--secondary-account-color', `#${account.slice(-6)}`
      )
    } else {
      // return defaults after logout
      document.documentElement.style.setProperty('--primary-account-color', '#111111')
      document.documentElement.style.setProperty('--secondary-account-color', '#aaaaaa')
    }
  }, [account])

  return (
    <div className="App">
      <Header />
      <Main />
      <Footer />
    </div>
  )
}

export default App;
