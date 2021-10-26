import { Link } from "react-router-dom"

import { useMetaMask } from 'metamask-react'

import './Header.css'

function Header() {
  return (
    <header className="Header">
      <div className="Logo">
        <Link to="/">Creative Coding NFT</Link>
        <nav className="nav mainNav">
          <Link to="/">Home</Link>
          <Link to="/collection">Collection</Link>
        </nav>
      </div>
      <div className="Account">
        <Avatar />
        <nav className="nav accountNav">
          <Link to="/account/tokens">My Tokens</Link>
          <Link to="/account/drafts">My Drafts</Link>
        </nav>
      </div>
    </header>
  )
}

function Avatar() {
  const { status, account, connect } = useMetaMask()

  const avatarStyle = account ? { background: `linear-gradient(135deg, #${account.slice(2, 8)}, #${account.slice(-6)})` } : {}

  // const auth = async () => {
  //   if (!account) {
  //     const [address] = await connect()
  //     const message = `${address}@crcode`

  //     const signature = await ethereum.request({
  //       method: 'personal_sign',
  //       from: address,
  //       params: [message, address]
  //     })

  //     const response = await fetch(`auth/${address}`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-type': 'application/json'
  //       },
  //       body: JSON.stringify({ signature })
  //     })

  //     console.log(await response.json())
  //   }
  // }

  return (
    <p className="address"
      onClick={connect}
    >
      {status === 'initializing' &&
        <span>Initializing...</span>}

      {status === 'connecting' &&
        <span>Connecting...</span>}

      {status === 'unavailable' &&
        <span><a href="https://metamask.io/" rel="noreferrer" target="_blank">MetaMask</a> Required</span>}

      {status === 'notConnected' &&
        <span>Connect</span>}

      {status === 'connected' &&
        <span>{account.slice(0, 10)}...{account.slice(-8)}</span>}

      <span className="avatar" style={avatarStyle}></span>
    </p>
  )
}

export default Header