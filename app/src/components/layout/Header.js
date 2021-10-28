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
            <Link to="/account/tokens">My Tokens</Link>
            <Link to="/account/drafts">My Drafts</Link>
          </nav>
        }
      </div>
    </header>
  )
}

function Avatar() {
  const { status, account, connect } = useMetaMask()

  const auth = async () => {
    if (!account) {
      const [address] = await connect()
      // const message = `${address}@crcode`

      // const signature = await ethereum.request({
      //   method: 'personal_sign',
      //   from: address,
      //   params: [message, address]
      // })

      // const response = await fetch(`auth/${address}`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-type': 'application/json'
      //   },
      //   body: JSON.stringify({ signature })
      // })

      // console.log(await response.json())
    }
  }

  return (
    <p className="Address"
      onClick={auth}
    >
      {status === 'initializing' &&
        <span>Initializing...</span>}

      {status === 'connecting' &&
        <span>Connecting...</span>}

      {status === 'unavailable' &&
        <span><a href="https://metamask.io/" rel="noreferrer" target="_blank">MetaMask Required</a></span>}

      {status === 'notConnected' &&
        <span>Connect</span>}

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