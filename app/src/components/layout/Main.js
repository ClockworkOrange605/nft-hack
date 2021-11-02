import { Switch, Route } from "react-router-dom"

import './Main.css'

import Home from "../pages/Home"
import Collection from "../pages/Collection"
import IDE from '../pages/Editor'

const Main = () => {
  return (
    <main className="Main">
      <Switch>
        <Route path="/account/editor">
          <IDE />
        </Route>

        <Route path="/account/tokens">
          <p>Tokens goes here ...</p>
        </Route>

        <Route path="/account/drafts">
          <p>Token drafts goes here ...</p>
        </Route>

        <Route path="/collection">
          <Collection />
        </Route>

        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </main>
  )
}

export default Main