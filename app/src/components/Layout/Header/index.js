import { Link } from "react-router-dom"
import { useMetaMask } from 'metamask-react'

import Avatar from "./Avatar"

import './styles/index.css'

function Header() {
  const { account: address } = useMetaMask()

  return (
    <header className="Header">
      <div className="Logo">
        <Link to="/">Creative Coding NFT's</Link>
        <nav id="mainMenu" className="nav">
          <Link to="/collection">Collection</Link>
        </nav>
      </div>
      <div className="Account">
        <Avatar address={address} />
        {address &&
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

export default Header