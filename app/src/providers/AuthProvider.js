import { createContext, useState, useMemo, useContext } from 'react'

const apiPrefix = ''

const AuthContext = createContext({})

function AuthProvider({ children }) {
  const [account, setAccount] = useState()
  const [isLoading, setloading] = useState(false)
  const [isRequired, setReqired] = useState(false)

  async function auth(address, signature) {
    setloading(true)

    fetch(`${apiPrefix}/auth/${address}`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ signature })
    })
      .then(async (res) => {
        const data = await res.json()
        sessionStorage.setItem(data.account, data.token)

        setAccount(data.account)
        setloading(false)
      })
  }

  function check(address) {
    const token = sessionStorage.getItem(address)

    return fetch(`${apiPrefix}/auth/${address}/check`, {
      headers: { 'x-auth-token': token }
    })
      .then(async (res) => {
        const data = await res.json()
        setAccount(data.account)

        return data.account
      })
  }

  const memoedValue = useMemo(
    () => ({
      account,
      isLoading,
      isRequired,
      auth, check,
      setReqired
    }),
    [account, isLoading, isRequired]
  )

  return (
    <AuthContext.Provider value={memoedValue}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  return useContext(AuthContext)
}

export default useAuth
export { useAuth, AuthProvider }