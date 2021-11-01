import { Switch, Route } from "react-router-dom"
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'

import * as monaco from 'monaco-editor'

import { useRef } from 'react'
import { useState, useEffect } from 'react'
import './Main.css'

import Home from "../pages/Home"
import Collection from "../pages/Collection"

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

function IDE() {
  return (
    <div className="IDE">
      <div className="workspace">
        <Tabs defaultIndex={2}>
          <TabList>
            <Tab>index.html</Tab>
            <Tab>style.css</Tab>
            <Tab>main.js</Tab>
            {/* <Tab>+</Tab> */}
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
      </div>
      <div className="preview">
        <iframe
          // https://stackoverflow.com/questions/13432821/is-it-possible-to-add-request-headers-to-an-iframe-src-request
          // srcDoc={'<!DOCTYPE html>\n<html lang="en">\n\t<head>\n\t\t<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js"></script>\n\t\t<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/addons/p5.sound.min.js"></script>\n\t\t<link rel="stylesheet" type="text/css" href="style.css">\n\t\t<meta charset="utf-8" />\n\t</head>\n\t<body>\n\t\t<script src="sketch.js"></script>\n\t</body>\n</html>'}
          src="http://localhost:4000/preview/0x9f45deB282DA4AA19E4965E3483DCA19D93CaE01/01/source/index.html?token=test"
        // style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
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

          minimap: { enabled: false },
          rulers: [60, 120],
        })
      )
    }
  }, [])

  return (
    <div ref={editorRef} id={id} className="EditorInstance" />
  )
}

export default Main