import React from 'react'
import ReactDOM from 'react-dom'
import { MetaMaskProvider } from 'metamask-react'
import { BrowserRouter } from "react-router-dom"

import { AuthProvider } from "./providers/AuthProvider";

import App from './App'
import './index.css'

ReactDOM.render(
  <React.StrictMode>
    <MetaMaskProvider>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </MetaMaskProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
