import { useEffect, useRef, useState } from 'react'

import { useParams } from 'react-router'
import { useHistory } from "react-router-dom"

import { useMetaMask } from 'metamask-react'

import { useAuth } from '../../providers/AuthProvider'

import * as monaco from 'monaco-editor'

import Loader from '../Common/Loader'

import './Publisher.css'

function Publisher() {
  const codeRef = useRef()

  const { account: address, ethereum, chainId } = useMetaMask()

  const { account } = useAuth()
  const { id } = useParams()
  const history = useHistory()

  const [data, setData] = useState()
  const [metadata, setMetadata] = useState()
  const [code, setCode] = useState()
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

        fetch(data.metadata_url)
          .then(async (res) => {
            console.log(res)

            const metadata = await res.json()
            setLoading(false)

            console.log(metadata)

            const code = await monaco.editor.colorize(
              JSON.stringify(metadata, null, '\t'), 'json')

            setMetadata(metadata)
            setCode(code)
          })
      })
    }
  }, [account, id])

  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.innerHTML = code
    }
  }, [code, codeRef])

  async function publish() {
    //TODO: add env variables
    const chain = '0x539'

    //TODO: make account check
    if (address !== account) {
      return alert('wrong metamask account selected')
    }

    //TODO: make notification for wrong chain
    if (chainId !== chain) {
      return alert('wrong chain selected')
    }

    fetch(`/${account}/nft/${id}/mint`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        'x-auth-token': sessionStorage.getItem(account)
      },
      body: JSON.stringify({ metadata: data.metadata_url })
    })
      .then(res => {
        console.log(res)
        res.json()
          .then(({ tx }) => {
            console.log(tx)

            ethereum.request({
              method: 'eth_sendTransaction',
              params: [tx],
            })
              .then(txId => {
                console.log(txId)

                fetch(`/collection/${txId}/status`)
                  .then(res =>
                    res.json()
                      .then(data => {
                        console.log(data.id)
                        history.push(`/collection/${data.id}`)
                      })
                  )
              })
          })
      })
  }

  return (
    <div className="Publisher">
      {loading && <Loader />}

      {!loading &&
        <div className="Header">
          {/* <h1>Review Metadata and Publish</h1> */}
        </div>
      }

      {!loading &&
        <div className="Metadata">
          <h2>
            Metadata <a href={data?.metadata_url} target="_blank" rel="noreferer">{data?.metadata_url}</a>
          </h2>
          <code ref={codeRef} />
        </div>
      }

      {!loading &&
        <div className="Image">
          <h2>
            Image <a href={metadata?.image} target="_blank" rel="noreferer">{metadata?.image}</a>
          </h2>
          <img width="450" src={metadata?.image} />
        </div>
      }

      {!loading &&
        <div className="Animation">
          <h2>
            Animation <a href={metadata?.animation_url} target="_blank" rel="noreferer">{metadata?.animation_url}</a>
          </h2>
          <video width="450" muted autoPlay /*loop*/ controls controlsList="nodownload" src={metadata?.animation_url} />
        </div>
      }

      {!loading &&
        <div className="Actions">
          <button onClick={publish}>Publish</button>
        </div>
      }
    </div>
  )
}

export default Publisher