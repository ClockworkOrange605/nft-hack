import { useState, useEffect } from 'react'
import { useRef } from 'react'
import { MetaMaskProvider } from 'metamask-react'
import { useMetaMask } from 'metamask-react'
import './App.css'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import * as monaco from 'monaco-editor'
import 'react-tabs/style/react-tabs.css'

function App() {
  return (
    <div className="App">
      <header className="Header">
        <p>Creative Coding NFT</p>
        <MetaMaskProvider>
          <MetaMask />
        </MetaMaskProvider>
      </header>
      <main className="Main">
        <IDE />
      </main>
      <footer className="Footer" />
    </div>
  )
}

function IDE() {
  return (
    <Tabs defaultIndex="3">
      <TabList>
        <Tab>index.html</Tab>
        <Tab>style.css</Tab>
        <Tab>main.js</Tab>
      </TabList>

      <TabPanel>
        <Editor
          id="editorHTML"
          language="html"
          source={'<!DOCTYPE html>\n<html lang="en">\n\t<head>\n\t\t<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js"></script>\n\t\t<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/addons/p5.sound.min.js"></script>\n\t\t<link rel="stylesheet" type="text/css" href="style.css">\n\t\t<meta charset="utf-8" />\n\t</head>\n\t<body>\n\t\t<script src="sketch.js"></script>\n\t</body>\n</html>'}
        />
      </TabPanel>
      <TabPanel>
        <Editor
          id="editorCSS"
          language="css"
          source={"html, body {\n\tmargin: 0;\n\tpadding: 0;\n}\ncanvas {\n\tdisplay: block;\n}"}
        />
      </TabPanel>
      <TabPanel>
        <Editor
          id="editorJS"
          language="javascript"
          source={"function setup() {\n\tcreateCanvas(400, 400);\n}\n\nfunction draw() {\n\tbackground(220);\n}"}
        />
      </TabPanel>
    </Tabs>
  )
}

function Editor({ id, language, source }) {
  const editorRef = useRef()
  const [editor, setEditor] = useState(null)

  //TODO: refactor editor init
  useEffect(() => {
    if (!editor) {
      setEditor(
        monaco.editor.create(editorRef.current, {
          theme: 'vs-dark',
          scrollBeyondLastLine: false,

          language: language,
          value: source,
        })
      )
    }
  }, [])

  return (
    <div id={id} ref={editorRef} style={{ width: "50vw", height: "70vh" }} />
  )
}

function MetaMask() {
  const { status, account, /*ethereum,*/ connect } = useMetaMask()

  const avatarStyle = account ? { background: `linear-gradient(135deg, #${account.slice(2, 8)}, #${account.slice(-6)})` } : {}

  return (
    <div className="account">
      {(status === 'initializing' || status === 'connecting') &&
        <p>Connecting...</p>
      }

      {status === 'unavailable' &&
        <p>
          <a href="https://metamask.io/" rel="noreferrer" target="_blank">MetaMask</a> Required
        </p>
      }

      {status === 'notConnected' &&
        <button onClick={connect}>Connect</button>
      }

      {status === 'connected' &&
        <p className="address">
          <span>{account.slice(0, 8)}...{account.slice(-6)}</span>
          <span className="avatar" style={avatarStyle}></span>
        </p>
      }
    </div>
  )
}

export default App;
