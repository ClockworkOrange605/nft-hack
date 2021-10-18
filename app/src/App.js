import { MetaMaskProvider, useMetaMask } from 'metamask-react'
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>Creative Coding NFT</p>
        <MetaMaskProvider>
          <MetaMask />
        </MetaMaskProvider>
      </header>
    </div>
  )
}

function MetaMask() {
  const { status, account, /*ethereum,*/ connect } = useMetaMask()

  const avatarStyle = account ? { background: `linear-gradient(90deg, #${account.slice(2, 8)}, #${account.slice(-6)})` } : {}

  return (
    <div className="account">
      {(status === 'initializing' || status === 'connecting') &&
        <p>Connecting...</p>
      }

      {status === 'unavailable' &&
        <p>
          <a href="https://metamask.io/" rel="noreferrer" target="_blank">MetaMask</a> Required
        </p>
      }

      {status === 'notConnected' &&
        <button onClick={connect}>Connect</button>
      }

      {status === 'connected' &&
        <p className="address">
          <span>{account.slice(0, 8)}...{account.slice(-6)}</span>
          <span className="avatar" style={avatarStyle}></span>
        </p>
      }
    </div>
  )
}

export default App;
