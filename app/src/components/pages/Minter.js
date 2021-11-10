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
      fetch(`/${account}/nft/${id}/update/`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'x-auth-token': sessionStorage.getItem(account)
        },
        body: JSON.stringify({ metadata: data, image: "", animation_url: "" })
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
          <div>
            <label>
              <span>Name</span><br />
              <input
                name="name"
                type="text"
                placeholder="Token Name"
                defaultValue={data?.metadata?.name}
              />
            </label>
            <br /><br />
            <label>
              <span>Description</span><br />
              <textarea
                name="description"
                placeholder="Token Description"
                defaultValue={data?.metadata?.description}
              />
            </label>
            <br /><br />
            <label>
              <span>Attributes</span>
            </label>
            <br /><br />
          </div>

          <div>
            <label>
              <span>Image</span><br />
              <img width="450" src="http://localhost:4000/temp/example5.png" />
            </label>
            <br /><br />
            <label>
              <span>Animation</span><br />
              <video width="450" muted autoPlay loop controls controlsList="nodownload" src="http://localhost:4000/temp/demo.mp4" />
            </label>
            <br /><br />
          </div>

          <div>
            <input type="submit" value="Next Step" />
          </div>
        </div>
      )}

    </form>
  )
}

export default Minter