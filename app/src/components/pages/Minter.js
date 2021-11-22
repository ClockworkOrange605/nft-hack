import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useHistory } from "react-router-dom"

import { useAuth } from '../../providers/AuthProvider'
import Loader from '../Common/Loader'

import './Minter.css'

function Minter() {
  const history = useHistory()

  const { account } = useAuth()
  const { id } = useParams()

  const [data, setData] = useState()
  const [loading, setLoading] = useState(true)
  const [loaderMessage, setloaderMessage] = useState()

  useEffect(() => {
    if (account && id) {
      fetch(`/${account}/nft/${id}/`, {
        headers: {
          'x-auth-token': sessionStorage.getItem(account)
        }
      }).then(async (res) => {
        const data = await res.json()
        setData(data)
        setLoading(false)
      })
    }
  }, [account, id])


  function openPopup(event) {
    event.preventDefault()
    document.querySelector('.Popup').style.visibility = 'visible'
  }

  function closePopup(event) {
    event.preventDefault()
    document.querySelector('.Popup').style.visibility = 'hidden'
  }

  function changeImage(event) {
    event.preventDefault()
  }


  function check(data) {
    return Boolean(data?.name && data?.description)
  }

  function submit(event) {
    event.preventDefault()

    const form = new FormData(document.querySelector('form'))
    const data = {
      name: form.get('name'),
      description: form.get('description')
    }

    if (check(data)) {
      console.log(
        form.get('image'),
        form.get('animation')
      )

      setloaderMessage("Uploading Metadata to IPFS")
      setLoading(true)

      fetch(`/${account}/nft/${id}/update/`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'x-auth-token': sessionStorage.getItem(account)
        },
        body: JSON.stringify({
          metadata: data,
          image: form.get('image'),
          animation: form.get('animation')
        })
      }).then(async (res) => {
        const data = await res.json()
        console.log(data)
        history.push(`/account/nft/${id}/publish`)
      })
    }
  }

  return (
    <form id="MinterForm" onSubmit={submit}>

      {loading && <Loader message={loaderMessage} />}

      {!loading && data && (
        <div className="Minter">
          <div className="Header">
            {/* <h1>Token Metadata</h1> */}
          </div>

          <div className="Metadata">
            <label htmlFor="name">
              <span>Name</span>
              <input
                name="name"
                type="text"
                required
                placeholder="Token Name"
                defaultValue={data?.metadata?.name}
              />
            </label>

            <label htmlFor="description">
              <span>Description</span>
              <textarea
                name="description"
                required
                placeholder="Token Description"
                defaultValue={data?.metadata?.description}
              />
            </label>

            <label>
              <span>Attributes</span>
              <p>Library: {data?.template?.type}</p>
              <p>Version: {data?.template?.version}</p>
              <p>Source Files Size: ??? Kb</p>
            </label>
          </div>

          <div className="Media">
            <label>
              <span>
                Image
                <button style={{ float: 'right' }} onClick={openPopup}>🎨 Change</button>
              </span>
              <img width="450" alt="" src={`http://localhost:4000/preview/${account}/${id}/media/preview_5.png`} />
              <input name="image" type="hidden" defaultValue={`http://localhost:4000/preview/${account}/${id}/media/preview_5.png`} />
            </label>

            <label>
              <span>Animation</span>
              <video width="450" muted autoPlay loop controls controlsList="nodownload" src={`http://localhost:4000/preview/${account}/${id}/media/demo.mp4`} />
              <input name="animation" type="hidden" defaultValue={`http://localhost:4000/preview/${account}/${id}/media/demo.mp4`} />
            </label>
          </div>

          <div className="Actions">
            <button type="submit">Save</button>
          </div>

          <div className="Popup">
            <h2>Select Image</h2>
            <div className="Images">
              <picture>
                <img width="250" alt="" src={`http://localhost:4000/preview/${account}/${id}/media/preview_1.png`} />
              </picture>
              <picture>
                <img width="250" alt="" src={`http://localhost:4000/preview/${account}/${id}/media/preview_2.png`} />
              </picture>
              <picture>
                <img width="250" alt="" src={`http://localhost:4000/preview/${account}/${id}/media/preview_3.png`} />
              </picture>
              <picture>
                <img width="250" alt="" src={`http://localhost:4000/preview/${account}/${id}/media/preview_4.png`} />
              </picture>
              <picture className="selected">
                <img width="250" alt="" src={`http://localhost:4000/preview/${account}/${id}/media/preview_5.png`} />
              </picture>
              <picture>
                <img width="250" alt="" src={`http://localhost:4000/preview/${account}/${id}/media/preview_6.png`} />
              </picture>
              <picture>
                <img width="250" alt="" src={`http://localhost:4000/preview/${account}/${id}/media/preview_7.png`} />
              </picture>
              <picture>
                <img width="250" alt="" src={`http://localhost:4000/preview/${account}/${id}/media/preview_8.png`} />
              </picture>
              <picture>
                <img width="250" alt="" src={`http://localhost:4000/preview/${account}/${id}/media/preview_9.png`} />
              </picture>
            </div>
            <div>
              <button onClick={closePopup}>❌ Cancel</button>
              <button onClick={changeImage}>✅ Change</button>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}

export default Minter