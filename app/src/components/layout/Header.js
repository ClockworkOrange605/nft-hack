import { Link } from "react-router-dom"
import { useMetaMask } from 'metamask-react'
import './Header.css'

function Header() {
  const { account } = useMetaMask()

  return (
    <header className="Header">
      <div className="Logo">
        <Link to="/">Creative Coding NFT's</Link>
        <nav id="mainMenu" className="nav">
          <Link to="/collection">Collection</Link>
        </nav>
      </div>
      <div className="Account">
        <Avatar />
        {account &&
          <nav id="accountMenu" className="nav">
            <Link to="/account/nft/create">Create New NFT</Link>
            <Link to="/account/nft/list">My Sketches</Link>
            <hr style={{ border: '1px dashed #aaaaaa' }} />
            <Link to="/account/tokens">My Collection</Link>
          </nav>
        }
      </div>
    </header>
  )
}

function Avatar() {
  const { status, account, connect } = useMetaMask()

  return (
    <p className="Address">
      {status === 'initializing' &&
        <span>Initializing...</span>}

      {status === 'connecting' &&
        <span>Connecting...</span>}

      {status === 'unavailable' &&
        <span><a href="https://metamask.io/" rel="noreferrer" target="_blank">MetaMask Required</a></span>}

      {status === 'notConnected' &&
        <span onClick={connect}>Connect</span>}

      {status === 'connected' &&
        <span style={{ color: '#888888' }}>
          0x
          <span style={{ 'color': 'var(--primary-account-color)' }}>
            {account.slice(2, 8)}
          </span>
          . . .
          <span style={{ 'color': 'var(--secondary-account-color)' }}>
            {account.slice(-6)}
          </span>
        </span>}

      <span className="Avatar"></span>
    </p>
  )
}

export default Header