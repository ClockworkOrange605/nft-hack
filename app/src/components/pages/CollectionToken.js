import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

import Loader from '../Common/Loader'

import './CollectionToken.css'

function CollectionToken() {
  const { id } = useParams()

  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState()
  const [events, setEvents] = useState()
  const [metadata, setMetaData] = useState()

  useEffect(() => {
    fetch(`/collection/${id}`)
      .then(res =>
        res.json()
          .then((data) => {
            setToken(data.token)
            setEvents(data.events)

            fetch(data.token.uri)
              .then(res =>
                res.json()
                  .then(metadata => {
                    setMetaData(metadata)
                    setLoading(false)
                  })
              )
          })
      )
  }, [id])

  return (
    <div className="Token">
      {loading && <Loader />}

      {token && (
        <div className="Info">
          <img width="245" src={metadata?.image} alt={metadata?.name} />

          <br />

          <div>
            <b>ID:</b>
            <span style={{ color: '#888888', float: 'right' }}>{token?.id}</span>
          </div>

          <div>
            <b>Name:</b>
            <span style={{ color: '#888888', float: 'right' }}>{metadata?.name}</span>
          </div>

          <div>
            <b>Owner:</b>
            <span style={{ color: '#888888', float: 'right' }}>
              0x
              <span style={{ 'color': `#${token?.owner.slice(2, 8)}` }}>
                {token.owner.slice(2, 8)}
              </span>
              . . .
              <span style={{ 'color': `#${token?.owner.slice(-6)}` }}>
                {token.owner.slice(-6)}
              </span>
            </span>
          </div>
        </div>
      )}

      {token && (
        <div className="Details">
          <video width="550" muted autoPlay loop controls controlsList="nodownload" src={metadata?.animation_url} />

          <div>
            <h3>Description</h3>
            {metadata?.description}
          </div>

          <div>
            <h3>Token Events</h3>
            {events && events.map(event => (
              <div key={event.id}>
                <p>{event.event} [{event.type}]</p>
                <p>from: {event.returnValues.from}</p>
                <p>to: {event.returnValues.to}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CollectionToken