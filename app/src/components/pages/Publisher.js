import { useEffect, useRef, useState } from 'react'

import { useParams } from 'react-router'
// import { useHistory } from "react-router-dom"

import { useMetaMask } from 'metamask-react'

import { useAuth } from '../../providers/AuthProvider'

import * as monaco from 'monaco-editor'

import './Publisher.css'

function Publisher() {
  const codeRef = useRef()

  const { account: address, ethereum } = useMetaMask()

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
    // https://docs.metamask.io/guide/sending-transactions.html#example
    const transactionParameters = {
      nonce: '0x00', // ignored by MetaMask
      gasPrice: '0x09184e72a000', // customizable by user during MetaMask confirmation.
      gas: '0x2710', // customizable by user during MetaMask confirmation.
      to: '0x0000000000000000000000000000000000000000', // Required except during contract publications.
      from: ethereum.selectedAddress, // must match user's active address.
      value: '0x29a2241af62c0000', // Only required to send ether to the recipient from the initiating external account.
      data:
        '0x7f7465737432000000000000000000000000000000000000000000000000000000600057', // Optional, but used for defining smart contract creation and interaction.
      chainId: '0x3', // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
    };

    // txHash is a hex string
    // As with any RPC call, it may throw an error
    const txHash = await ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    })

    console.log(txHash)
  }

  return (
    <div className="Publisher">
      {loading && <p>Loading . . . </p>}

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