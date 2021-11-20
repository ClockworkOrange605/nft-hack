import { useState, useEffect } from 'react'

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
    <div className="Collection">
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
    <div className="Item">
      <div className="Image">
        <img src={metadata?.image} />
      </div>
      <p>{metadata?.name}</p>
    </div>
  )
}

export default Collection