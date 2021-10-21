import { useMetaMask } from 'metamask-react'

import './Header.css'

const Header = ({ authorize }) => {
  return (
    <header className="Header">
      <div className="Logo">
        <a href="/">Creative Coding NFT</a>
        <nav className="nav mainNav">
          <a href="#">Home</a>
          <a href="#">Collection</a>
        </nav>
      </div>
      <div className="Account">
        <Avatar authorize={authorize} />
        <nav className="nav accountNav">
          <a href="#">My Collection</a>
          <a href="#">My Sketches</a>
        </nav>
      </div>
    </header>
  )
}

function Avatar({ authorize }) {
  const { status, account, ethereum, connect } = useMetaMask()
  const avatarStyle = account ? { background: `linear-gradient(135deg, #${account.slice(2, 8)}, #${account.slice(-6)})` } : {}

  const auth = async () => {
    if (!account) {
      const [address] = await connect()
      const message = `${address}@crcode`

      const signature = await ethereum.request({
        method: 'personal_sign',
        from: address,
        params: [message, address]
      })

      const response = await fetch(`auth/${address}`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ signature })
      })

      console.log(await response.json())
    }
  }

  return (
    <p className="address" onClick={auth}>
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