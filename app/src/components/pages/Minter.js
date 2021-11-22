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
  const [size, setSize] = useState()
  const [loading, setLoading] = useState(true)
  const [loaderMessage, setloaderMessage] = useState()

  const [selectedImage, selectImage] = useState(`http://localhost:4000/preview/${account}/${id}/media/preview_5.png`)

  function sizeConverter(Num = 0, dec = 2) {
    if (Num < 1000)
      return Num + " Bytes"
    Num = ("0".repeat((Num += "").length * 2 % 3) + Num).match(/.{3}/g)
    return Number(Num[0]) + "." + Num[1].substring(0, dec) + " " + "  kMGTPEZY"[Num.length] + "B"
  }

  useEffect(() => {
    if (account && id) {
      console.log(`./storage/nfts/${account}/${id}/source/`)

      fetch(`/${account}/nft/${id}/`, {
        headers: {
          'x-auth-token': sessionStorage.getItem(account)
        }
      }).then(async (res) => {
        const data = await res.json()
        setData(data)
        setLoading(false)
      })

      fetch(`/${account}/nft/${id}/files`, {
        headers: {
          'x-auth-token': sessionStorage.getItem(account)
        }
      }).then(async (res) => {
        const data = await res.json()
        setSize(data.size)
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

  function check(data) {
    return Boolean(data?.name && data?.description)
  }

  function submit(event) {
    event.preventDefault()

    const form = new FormData(document.querySelector('form'))
    const metadata = {
      name: form.get('name'),
      description: form.get('description'),
      attributes: [
        {
          trait_type: "library",
          value: data?.template?.library?.name
        },
        {
          trait_type: "library_version",
          value: data?.template?.library?.version
        },
        {
          trait_type: "sources_size",
          value: sizeConverter(size)
        },
      ]
    }

    if (check(metadata)) {
      setloaderMessage("Uploading Metadata to IPFS")
      setLoading(true)

      fetch(`/${account}/nft/${id}/update/`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'x-auth-token': sessionStorage.getItem(account)
        },
        body: JSON.stringify({
          metadata,
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
              <p>Library: {data?.template?.library?.name}</p>
              <p>Library Version: {data?.template?.library?.version}</p>
              <p>Sources Size: {sizeConverter(size)}</p>
            </label>
          </div>

          <div className="Media">
            <label>
              <span>
                Image
                <button style={{ float: 'right' }} onClick={openPopup}>🎨 Change</button>
              </span>
              <img width="450" alt="" src={selectedImage} />
              <input name="image" type="hidden" defaultValue={selectedImage} />
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
            <h1>Select Image</h1>
            <a onClick={closePopup} className="CloseButton">❌</a>
            <div className="Images">
              {new Array(9).fill("", 0, 9).map((p, i) =>
                <picture
                  key={i}
                  className={selectedImage == `http://localhost:4000/preview/${account}/${id}/media/preview_${i + 1}.png` ? 'selected' : ''}
                  onClick={() => {
                    selectImage(`http://localhost:4000/preview/${account}/${id}/media/preview_${i + 1}.png`)
                  }}
                >
                  <img width="250" alt={p} src={`http://localhost:4000/preview/${account}/${id}/media/preview_${i + 1}.png`} />
                </picture>
              )}

              {/* <picture className={selectedImage == `http://localhost:4000/preview/${account}/${id}/media/preview_1.png` ? 'selected' : ''}>
                <img width="250" alt="" src={`http://localhost:4000/preview/${account}/${id}/media/preview_1.png`} />
              </picture>
              <picture className={selectedImage == `http://localhost:4000/preview/${account}/${id}/media/preview_2.png` ? 'selected' : ''}>
                <img width="250" alt="" src={`http://localhost:4000/preview/${account}/${id}/media/preview_2.png`} />
              </picture>
              <picture className={selectedImage == `http://localhost:4000/preview/${account}/${id}/media/preview_3.png` ? 'selected' : ''}>
                <img width="250" alt="" src={`http://localhost:4000/preview/${account}/${id}/media/preview_3.png`} />
              </picture>
              <picture className={selectedImage == `http://localhost:4000/preview/${account}/${id}/media/preview_4.png` ? 'selected' : ''}>
                <img width="250" alt="" src={`http://localhost:4000/preview/${account}/${id}/media/preview_4.png`} />
              </picture>
              <picture className={selectedImage == `http://localhost:4000/preview/${account}/${id}/media/preview_5.png` ? 'selected' : ''}>
                <img width="250" alt="" src={`http://localhost:4000/preview/${account}/${id}/media/preview_5.png`} />
              </picture>
              <picture className={selectedImage == `http://localhost:4000/preview/${account}/${id}/media/preview_6.png` ? 'selected' : ''}>
                <img width="250" alt="" src={`http://localhost:4000/preview/${account}/${id}/media/preview_6.png`} />
              </picture>
              <picture className={selectedImage == `http://localhost:4000/preview/${account}/${id}/media/preview_7.png` ? 'selected' : ''}>
                <img width="250" alt="" src={`http://localhost:4000/preview/${account}/${id}/media/preview_7.png`} />
              </picture>
              <picture className={selectedImage == `http://localhost:4000/preview/${account}/${id}/media/preview_8.png` ? 'selected' : ''}>
                <img width="250" alt="" src={`http://localhost:4000/preview/${account}/${id}/media/preview_8.png`} />
              </picture>
              <picture className={selectedImage == `http://localhost:4000/preview/${account}/${id}/media/preview_9.png` ? 'selected' : ''}>
                <img width="250" alt="" src={`http://localhost:4000/preview/${account}/${id}/media/preview_9.png`} />
              </picture> */}
            </div>
            <div>
              {/* <button onClick={closePopup}>❌ Close</button> */}
              {/* <button onClick={changeImage}>✅ Change</button> */}
            </div>
          </div>
        </div>
      )}
    </form>
  )
}

export default Minter