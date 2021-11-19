import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

import './CollectionToken.css'

function CollectionToken() {
  const { id } = useParams()

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
              .then(res => res.json().then(metadata => setMetaData(metadata)))
          })
      )
  }, [])

  return (
    <div className="Token">
      <div className="Info">
        <img width="245" src={metadata?.image} alt={metadata?.name} />

        <p>
          <b>Name:</b> {metadata?.name}
        </p>

        <p>
          <b>Owner:</b> {token?.owner}
        </p>

        {/* <p>{token?.id}</p> */}
        {/* <p>{token?.uri}</p> */}
      </div>

      <div className="Details">
        <p>
          <b>Description:</b> {metadata?.description} Description  Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description
        </p>

        <video width="550" muted autoPlay loop controls controlsList="nodownload" src={metadata?.animation_url} />

        <p>
          {events && events.map(event => (
            <p>
              <span>{event.event}</span>
              <span>{event.returnValues.from}</span>
              <span>{event.returnValues.to}</span>
            </p>
          ))}
        </p>
      </div>
    </div>
  )
}

export default CollectionToken