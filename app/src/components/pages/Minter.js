import { useEffect, useState } from 'react'

import { useParams } from 'react-router'
import { useHistory } from "react-router-dom"

import { useAuth } from '../../providers/AuthProvider'

import './Minter.css'

function Minter() {
  const { account } = useAuth()
  const { id } = useParams()
  const history = useHistory()

  const [data, setData] = useState()
  const [loading, setLoading] = useState(true)

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

  function selectImage(event) {
    console.log(event)
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
    } else {


    }
  }

  return (
    <form id="MinterForm" onSubmit={submit}>

      {loading && <p>Loading . . . </p>}

      {data && (
        <div className="Minter">
          {/* <div className="Header">
            <h1>Token Metadata</h1>
          </div> */}

          <div className="Metadata">
            <label htmlFor="name">
              <span>Name</span>
              <input
                name="name"
                type="text"
                placeholder="Token Name"
                defaultValue={data?.metadata?.name}
              />
            </label>

            <label htmlFor="description">
              <span>Description</span>
              <textarea
                name="description"
                placeholder="Token Description"
                defaultValue={data?.metadata?.description}
              />
            </label>

            <label>
              <span>Attributes</span>
              <p>Library: {data?.template?.type}</p>
              <p>Version: {data?.template?.version}</p>
              <p>Size: ??? Kb</p>
            </label>
          </div>

          <div className="Media">
            <label>
              <span>
                Image
                {/* <span style={{ float: 'right' }} onClick={selectImage}>Select</span> */}
              </span>
              <img width="450" alt="" src="http://localhost:4000/temp/618a387de837537de8437cd9/preview_1.png" />
              {/* <img width="450" alt="" src="http://localhost:4000/temp/618a387de837537de8437cd9/preview_2.png" />
              <img width="450" alt="" src="http://localhost:4000/temp/618a387de837537de8437cd9/preview_3.png" />
              <img width="450" alt="" src="http://localhost:4000/temp/618a387de837537de8437cd9/preview_4.png" />
              <img width="450" alt="" src="http://localhost:4000/temp/618a387de837537de8437cd9/preview_5.png" /> */}
              <input name="image" type="hidden" defaultValue="http://localhost:4000/temp/618a387de837537de8437cd9/preview_5.png" />
            </label>

            <label>
              <span>Animation</span>
              <video width="450" muted /*autoPlay*/ /*loop*/ controls controlsList="nodownload" src="http://localhost:4000/temp/618a387de837537de8437cd9/demo.mp4" />
              <input name="animation" type="hidden" defaultValue="http://localhost:4000/temp/618a387de837537de8437cd9/demo.mp4" />
            </label>
          </div>

          <div className="Actions">
            <button type="submit">Save</button>
          </div>
        </div>
      )}

    </form>
  )
}

export default Minter