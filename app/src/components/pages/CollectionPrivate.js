import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import Loader from '../Common/Loader'

import { useAuth } from '../../providers/AuthProvider'

import './CollectionPrivate.css'

function Collection() {
  const { account } = useAuth()

  const [tokens, setTokens] = useState()

  useEffect(() => {
    fetch(`/${account}/collection/list/`, {
      headers: {
        'x-auth-token': sessionStorage.getItem(account)
      }
    })
      .then(res => {
        res.json()
          .then(data => {
            setTokens(data.tokens)
            console.log(data)
          })
      })
  }, [])

  return (
    <div className="CollectionPrivate">
      <div className="Filter"></div>
      {tokens ?
        <div className="List">
          {tokens.map(item => <CollectionItem key={item.id} token={item} />)}
        </div> : <Loader />}
    </div>
  )
}

function CollectionItem({ token }) {
  const [metadata, setMetadata] = useState([])

  useEffect(() => {
    console.log(token.uri)
    if (token.uri) {
      fetch(token.uri)
        .then(data => data.json().then(metadata => setMetadata(metadata)))
    }
  }, [token])

  return (
    <Link to={`/collection/${token.id}`}>
      <div className="Item">
        <div className="Image">
          <img src={metadata?.image} />
        </div>
        <p>
          #{token.id} {metadata?.name}
          <span style={{ color: '#888888', float: 'right' }}>
            0x
            <span style={{ 'color': `#${token.owner.slice(2, 8)}` }}>
              {token.owner.slice(2, 8)}
            </span>
            . . .
            <span style={{ 'color': `#${token.owner.slice(-6)}` }}>
              {token.owner.slice(-6)}
            </span>
          </span>
        </p>
      </div>
    </Link>
  )
}

export default Collection