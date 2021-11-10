import { useEffect, useState } from 'react'

import { useParams } from 'react-router'
// import { useHistory } from "react-router-dom"

import { useMetaMask } from 'metamask-react'

import { useAuth } from '../../providers/AuthProvider'

import './Publisher.css'

function Publisher() {
  const { account: address, ethereum } = useMetaMask()

  const { account } = useAuth()
  const { id } = useParams()
  // const history = useHistory()

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

  async function publish() {
    // https://docs.metamask.io/guide/sending-transactions.html#example
    const transactionParameters = {
      nonce: '0x00', // ignored by MetaMask
      gasPrice: '0x09184e72a000', // customizable by user during MetaMask confirmation.
      gas: '0x2710', // customizable by user during MetaMask confirmation.
      to: '0x0000000000000000000000000000000000000000', // Required except during contract publications.
      from: ethereum.selectedAddress, // must match user's active address.
      value: '0x00', // Only required to send ether to the recipient from the initiating external account.
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
    <div>
      {loading && <p>Loading . . . </p>}

      {data && (
        <div>
          <p>{data.metadata.name}</p>
          <p>{data.metadata.description}</p>

          <button onClick={publish}>Publish</button>
        </div>
      )}
    </div>
  )
}

export default Publisher