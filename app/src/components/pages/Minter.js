import { useEffect, useState } from 'react'

import { useParams } from 'react-router'

import { useAuth } from '../../providers/AuthProvider'

import './Minter.css'

function Minter() {
  const { account } = useAuth()
  const { id } = useParams()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (account && id) {
      fetch(`/${account}/nft/${id}/`, {
        headers: {
          'x-auth-token': sessionStorage.getItem(account)
        }
      }).then(async (res) => {
        const data = await res.json()
        console.log(data)
        setData(data)
        setLoading(false)
      })
    }
  }, [account, id])

  return (
    <div>
      {data && (
        <div>
          <p>{data._id}</p>
        </div>
      )}
    </div>
  )
}

export default Minter