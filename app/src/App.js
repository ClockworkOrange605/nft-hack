import { useEffect, useState } from 'react'
import { useMetaMask } from 'metamask-react'

import Main from './components/layout/Main'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'

import './App.css'

// const apiPrefix = ''
// const apiPrefix = '/api'
// const apiPrefix = 'http://api.nft.pi.local'

function App() {
  const { account } = useMetaMask()
  const [authState, setAuthState] = useState(false)

  useEffect(() => {
    //Check Auth
    // if (account) {
    //   fetch(`${apiPrefix}/auth/check/${account}`, {
    //     headers: {
    //       'x-auth-token': '1234'
    //     }
    //   })
    //     .then(async (res) => {
    //       console.log('auth status', res.status)
    //       console.log('auth ok', res.ok)
    //       console.log('auth res', res)
    //       console.log('auth json', await res.json())
    //     })
    //     .catch(err => {
    //       console.error(err)
    //     })
    // }

    // Set Color Scheme
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

      {/* <div
        className="overlay"
        style={{
          position: "absolute",
          background: "rgba(0, 0, 0, 0.95)",
          width: "1000px",
          height: "calc(100vh - 140px)",
          padding: "-5px",
          top: "80px",
          textAlign: "center",
          textJustify: "center",
          margin: "auto",
          fontSize: '50px',
          // visibility: 'hidden'
        }}
      >
        <p>Sign Message to continue</p>
      </div> */}
    </div>
  )
}

export default App;
