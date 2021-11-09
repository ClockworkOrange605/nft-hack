import { createContext, useContext, useMemo } from 'react'
import { useState, useEffect } from 'react'
import { useMetaMask } from 'metamask-react'

const AuthContext = createContext({})

function AuthProvider({ children }) {
  const { account: address, chainId, ethereum, connect } = useMetaMask()

  const [account, setAccount] = useState()

  const memoedValue = useMemo(() => ({ account, check, auth }), [account])

  // TODO: add chainId verification
  // if (chainId != 0x1)

  useEffect(async () => {
    if (!address) await connect()
  }, [address])

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

    const response = await fetch(`/auth/${address}`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ signature })
    })

    const data = await response.json()
    sessionStorage.setItem(data.account, data.token)
    setAccount(data.account)

    return data.account
  }

  async function check() {
    const token = sessionStorage.getItem(address)

    const response = await fetch(`/auth/${address}/check`, {
      headers: { 'x-auth-token': token }
    })

    const data = await response.json()
    setAccount(data.account)

    return data.account
  }

  return (
    <AuthContext.Provider value={memoedValue}>
      {children}
      <div className="Overlay" style={{
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

export default AuthProvider
export { useAuth }