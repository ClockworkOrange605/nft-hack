import { createContext, useState, useMemo, useContext, useEffect } from 'react'
import { useMetaMask } from 'metamask-react'

const AuthContext = createContext({})

const apiPrefix = ''

function AuthProvider({ children }) {
  const { account: address, chainId, ethereum, connect } = useMetaMask()

  const [account, setAccount] = useState()

  const memoedValue = useMemo(() => ({
    account, auth, check,
  }), [account])

  useEffect(async () => {
    if (!address) await connect()
  }, [address])

  //TODO: add chainId verification
  //  if (chainId != 0x1)

  useEffect(async () => {
    if (!account && address)
      if (!await check())
        await auth()
  }, [address, account])

  async function auth() {
    const signature = await ethereum.request({
      method: 'personal_sign',
      from: address,
      params: [`${address}@crcode`, address]
    })

    return fetch(`${apiPrefix}/auth/${address}`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ signature })
    })
      .then(async (res) => {
        const data = await res.json()

        setAccount(data.account)
        sessionStorage.setItem(data.account, data.token)

        return data.account
      })
  }

  async function check() {
    const token = sessionStorage.getItem(address)

    const response = await fetch(
      `${apiPrefix}/auth/${address}/check`,
      { headers: { 'x-auth-token': token } }
    )
    const data = await response.json()

    setAccount(data.account)

    return data.account
  }

  return (
    <AuthContext.Provider value={memoedValue}>
      {children}
      <div className="overlay" style={{
        visibility: (!address || !account) ? 'visible' : 'hidden'
      }}>
        {!address && <p>Connect To Metamask</p>}
        {!account && <p>Sign Message to continue</p>}
      </div>
    </AuthContext.Provider>
  )
}

function useAuth() {
  return useContext(AuthContext)
}

export default useAuth
export { useAuth, AuthProvider }