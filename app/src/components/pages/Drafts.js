import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../providers/AuthProvider'

import './Drafts.css'

function Drafts() {
  const { account } = useAuth()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (account) {
      fetch(`/${account}/nft/list`, {
        headers: {
          'x-auth-token': sessionStorage.getItem(account)
        }
      }).then(
        async (res) => {
          const data = await res.json()
          setData(data)
          setLoading(false)
        }
      )
    }
  }, [account])

  return (
    <div className="Drafts">
      {loading && <p>Loading</p>}
      {data && data.map(item =>
        <Link to={`/account/nft/${item._id}/edit`}>
          <div key={item._id} className="Draft">
            <p>{item._id.slice(0, 5)} . . . {item._id.slice(-5)}</p>
          </div>
        </Link>)}
      {!loading &&
        <Link to='/account/nft/create'>
          <div key={0} className="Draft">
            <p>Create New NFT</p>
          </div>
        </Link>}
    </div>
  )
}

export default Drafts