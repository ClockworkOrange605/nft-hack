import { useEffect } from "react"
import { Switch, Route } from "react-router-dom"

import { useAuth } from '../../providers/AuthProvider'
import { useMetaMask } from 'metamask-react'

import Home from "../pages/Home"
import Collection from "../pages/Collection"

import Templates from '../pages/Templates'
import Drafts from '../pages/Drafts'
import Editor from '../pages/Editor'
import Minter from "../pages/Minter"
import Publisher from "../pages/Publisher"

import './Main.css'

const Main = () => {
  return (
    <main className="Main">
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/collection">
          <Collection />
        </Route>

        <PrivateRoute path="/account/nft/create">
          <Templates />
        </PrivateRoute>
        <PrivateRoute path="/account/nft/:id/edit">
          <Editor />
        </PrivateRoute>
        <PrivateRoute path="/account/nft/:id/mint">
          <Minter />
        </PrivateRoute>
        <PrivateRoute path="/account/nft/:id/publish">
          <Publisher />
        </PrivateRoute>
        <PrivateRoute path="/account/nft/list">
          <Drafts />
        </PrivateRoute>

        <Route path="/account/tokens">
          <p>Tokens goes here ...</p>
        </Route>

        <Route path="*">
          <p>Not Found - 404 Page</p>
        </Route>
      </Switch>
    </main>
  )
}

function PrivateRoute({ children, ...rest }) {
  const { account: address, connect, ethereum } = useMetaMask()
  let { account, check, auth, setConnecting, setAuthorizing } = useAuth()

  useEffect(() => {
    async function authorize() {
      if (!address) {
        setConnecting(true)
        await connect()
        setConnecting(false)
      }

      if (address && !account)
        if (!await check(address)) {
          setAuthorizing(true)

          const signature = await ethereum.request({
            method: 'personal_sign', from: address,
            params: [`${address}@crcode`, address]
          })
          await auth(address, signature)

          setAuthorizing(false)
        }
    }

    authorize()
  }, [address, account])

  return (
    <Route {...rest}
      render={() => account && (children)}
    />
  );
}

export default Main