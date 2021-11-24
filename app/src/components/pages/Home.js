import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Loader from '../Common/Loader'
import './Home.css'

function Home() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState()

  useEffect(() => {
    fetch('/collection/latests')
      .then(res =>
        res.json()
          .then(data => {
            setData(data)
            setLoading(false)
          }))
  }, [])

  return (
    <div className="Home">
      {loading && <Loader />}

      {data && (
        <div className="Block">
          <h2>
            <Link to="/collection">Latests NFT`s</Link>
          </h2>
          <div className="Tokens">
            {data?.tokens && data.tokens.map(token => (
              <Token key={token.id} token={token} />
            ))}
          </div>
        </div>
      )}

      {data && (
        <div className="Block">
          <h2>
            <Link to="/collection">NFT`s On Auction</Link>
          </h2>
          <div className="Tokens">
            {data?.tokens && data.tokens.map(token => (
              <Token key={token.id} token={token} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Token({ token }) {

  const [metadata, setMetadata] = useState()

  useEffect(() => {
    fetch(token.uri)
      .then(res =>
        res.json().then(metadata =>
          setMetadata(metadata)
        )
      )
  }, [token])

  return (
    <Link to={`/collection/${token.id}`}>
      <div className="Item">
        <img width="250" src={metadata?.image} alt="" />
        <p style={{ "line-height": "28px", "padding-bottom": "20px" }}>
          #{token.id} {metadata?.name}

          <span style={{ color: '#888888', float: 'left' }}>
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

export default Home