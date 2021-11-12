import { useEffect, useRef, useState } from 'react'
import { Fragment } from 'react'

import { useParams } from 'react-router'
// import { useHistory } from "react-router-dom"

import { useMetaMask } from 'metamask-react'

import { useAuth } from '../../providers/AuthProvider'

import * as monaco from 'monaco-editor'

import './Publisher.css'

const metadata = {
  "description": "Friendly OpenSea Creature that enjoys long swims in the ocean.",
  "external_url": "https://openseacreatures.io/3",
  "image": "https://storage.googleapis.com/opensea-prod.appspot.com/puffs/3.png",
  "name": "Dave Starbelly",
  // image:
  // animation_url:
}

// const code = Fragment(metadata)

function Publisher() {
  const codeRef = useRef()

  const { account: address, ethereum } = useMetaMask()

  const { account } = useAuth()
  const { id } = useParams()
  // const history = useHistory()



  const [data, setData] = useState()
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
        const code = await monaco.editor.colorize(JSON.stringify(data.metadata, null, '\t'), 'json')

        setData(data)
        setCode(code)

        setLoading(false)
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
        {/* <h1></h1> */}
      </div>

      <div className="Preview">
        <img width="450" src="http://localhost:4000/temp/618a387de837537de8437cd9/preview_5.png" />
      </div>

      <div className="Metadata">
        <code ref={codeRef} />
      </div>

      <div className="Actions">
        <button onClick={publish}>Publish</button>
      </div>
    </div>
  )
}

export default Publisher