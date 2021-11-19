import { useEffect, useState } from 'react'
import './Home.css'

function Home() {
  const [data, setData] = useState()

  useEffect(() => {
    fetch('/collection/latests')
      .then(res => res.json().then(data => setData(data)))
  }, [])

  return (
    <div className="Home">
      <div className="Latest">
        <h2>Latests NFT`s</h2>
        <div className="Tokens">
          {data?.tokens && data.tokens.map(token => (
            <Token token={token} />
          ))}
        </div>
      </div>
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
  }, [])

  return (
    <div className="Item">
      <img width="250" src={metadata?.image} />
      <p>{metadata?.name}</p>

      <p>{token.id}</p>
      <p>{token.owner}</p>
    </div>
  )
}

export default Home