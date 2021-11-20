import { useEffect, useRef, useState } from 'react'

import { useParams } from 'react-router'
// import { useHistory } from "react-router-dom"

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
  // const history = useHistory()

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
            const metadata = await res.json()
            setMetadata(metadata)
            const code = await monaco.editor.colorize(JSON.stringify(metadata, null, '\t'), 'json')

            setCode(code)
            setLoading(false)
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
    const contract = '0x4248971983B1714e6FD93939e703398ff664c3a0'

    //TODO: make account check
    if (address !== account) {
      return alert('wrong metamask account selected')
    }

    //TODO: make notification for wrong chain
    if (chainId !== chain) {
      return alert('wrong chain selected')
    }

    // https://docs.metamask.io/guide/sending-transactions.html#example
    const transactionParameters = {
      chainId: chain,

      from: account,
      to: contract,
      // to: "0xd426db87ac25281e25abdbab3de547b344756a8c",

      // value: '0x16345785d8a0000',
      gasPrice: '0x4a817c800',
      // gas: '0x30f08',
      gas: '0x71668',

      data: '0xd0def5210000000000000000000000003ed7afcc7ea8b7a00c5fbc75faa888009d1c26530000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000005068747470733a2f2f697066732e696f2f697066732f6261666b7265696463786f646d69336f667536746b6c6f78727063327770786d337a6e79783367696e6b72366a673573616c646c347172356b6a7500000000000000000000000000000000',
    }

    const txHash = await ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    })

    console.log(txHash)
  }

  return (
    <div className="Publisher">
      {loading && <Loader />}

      <div className="Header">
        {/* <h1>Review Metadata and Publish</h1> */}
      </div>

      <div className="Metadata">
        <h2>
          Metadata <a href={data?.metadata_url} target="_blank" rel="noreferer">{data?.metadata_url}</a>
        </h2>
        <code ref={codeRef} />
      </div>

      <div className="Image">
        <h2>
          Image <a href={metadata?.image} target="_blank" rel="noreferer">{metadata?.image}</a>
        </h2>
        <img width="450" src={metadata?.image} />
      </div>

      <div className="Animation">
        <h2>
          Animation <a href={metadata?.animation_url} target="_blank" rel="noreferer">{metadata?.animation_url}</a>
        </h2>
        <video width="450" muted autoPlay /*loop*/ controls controlsList="nodownload" src={metadata?.animation_url} />
      </div>

      <div className="Actions">
        <button onClick={publish}>Publish</button>
      </div>
    </div>
  )
}

export default Publisher