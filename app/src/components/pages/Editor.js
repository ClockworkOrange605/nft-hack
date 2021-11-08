import { useRef } from 'react'
import { useState, useEffect } from 'react'
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { Console, Hook } from 'console-feed'

import { useAuth } from '../../providers/AuthProvider'

import * as monaco from 'monaco-editor'

// import 'react-tabs/style/react-tabs.css'
import './Editor.css'
import { useParams } from 'react-router'

function IDE() {
  const { id } = useParams()
  const params = useParams()
  console.log(params, id)
  const [logs, setLogs] = useState([])

  const iframeRef = useRef()
  const consoleRef = useRef()

  // AutoScroll Console div
  useEffect(() => {
    consoleRef.current.scrollTop = consoleRef.current.scrollHeight
  }, [logs])

  // iframeRef.current.onLoad(() => {
  //   console.log(loaded)
  // })

  function captureLogs() {
    Hook(
      iframeRef.current.contentWindow.console,
      log => setLogs(logs => [...logs, ...log])
    )
  }

  return (
    <div className="IDE">
      <div className="toolbox">
        <button>Remove</button>
        <button>Mint</button>
      </div>
      <div className="workspace">
        <Editor draftId={id} previewFrame={iframeRef} consoleFrame={consoleRef} />

        {/* <Tabs defaultIndex={2}>
          <TabList>
            <Tab>index.html</Tab>
            <Tab>style.css</Tab>
            <Tab>main.js</Tab>
            <Tab>+</Tab>
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
        </Tabs> */}
      </div>
      <div className="Preview">
        <iframe
          className="Window"
          ref={iframeRef}
          onLoad={captureLogs}
        // sandbox="allow-same-origin allow-scripts"
        />
        <div className="Console" ref={consoleRef}>
          <Console
            logs={logs}
            // filter={['log']}
            variant="dark"
          />
        </div>
      </div>
    </div>
  )
}

function Editor({ draftId, previewFrame, consoleFrame }) {
  const { account } = useAuth()

  const editorRef = useRef()
  const [editor, setEditor] = useState(null)

  useEffect(() => {
    if (!editor) {
      setEditor(
        monaco.editor.create(editorRef.current, {
          theme: 'vs-dark',
          scrollBeyondLastLine: false,
          minimap: { enabled: false },
          // rulers: [60, 120],
        })
      )
    }
  })

  useEffect(() => {
    if (account) {
      const indexFile = `/preview/${account}/${draftId}/source/index.html`

      if (editor) {
        fetch(indexFile)
          .then(async (res) => {
            const source = await res.text()
            const language = res.headers.get('Content-type').split(';')[0].split('/')[1]

            monaco.editor.setModelLanguage(editor.getModel(), language)
            editor.setValue(source)
          })
      }

      if (editor) { previewFrame.current.src = indexFile }
    }
  }, [account, editor])

  return (
    <div ref={editorRef} className="EditorInstance" />
  )
}

export default IDE