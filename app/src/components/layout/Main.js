import { Switch, Route } from "react-router-dom"

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

        <Route path="/account/nft/create">
          <Templates />
        </Route>
        <Route path="/account/nft/:id/edit">
          <Editor />
        </Route>
        <Route path="/account/nft/:id/mint">
          <Minter />
        </Route>
        <Route path="/account/nft/:id/publish">
          <Publisher />
        </Route>
        <Route path="/account/nft/list">
          <Drafts />
        </Route>

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

export default Main