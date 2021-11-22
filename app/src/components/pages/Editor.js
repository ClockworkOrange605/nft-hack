import { useRef } from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { useHistory } from "react-router-dom"
import { Console, Hook, Decode } from 'console-feed'

import { useAuth } from '../../providers/AuthProvider'

import Loader from '../Common/Loader'

import * as monaco from 'monaco-editor'

import './Editor.css'

function IDE() {
  const history = useHistory()

  const { id } = useParams()
  const [logs, setLogs] = useState([])

  const iframeRef = useRef()
  const consoleRef = useRef()

  const { account } = useAuth()
  const [file, setFile] = useState('index.html')
  const [files, setFiles] = useState([])

  const [saveMethod, setSaveMethod] = useState()

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (account && id) {
      fetch(`/${account}/nft/${id}/files`, {
        headers: {
          'x-auth-token': sessionStorage.getItem(account)
        }
      }).then(async (res) => {
        const data = await res.json()
        setFiles(data.files)
      })
    }
  }, [account, id])

  useEffect(() => {
    if (account) { reload() }
  }, [account])

  function reload() {
    iframeRef.current.src = `/preview/${account}/${id}/source/index.html`
    setLogs([])
  }

  function stop() {
    iframeRef.current.src = ''
    setLogs([])
  }

  function captureLogs() {
    Hook(iframeRef.current.contentWindow.console,
      log => setLogs(logs => [...logs, Decode(log)])
    )
  }

  function generateMedia() {
    setLoading(true)
    fetch(`/${account}/nft/${id}/media`, {
      method: 'POST',
      headers: {
        'x-auth-token': sessionStorage.getItem(account)
      }
    }).then(res => {
      history.push(`/account/nft/${id}/mint`)
      setLoading(false)
    })
  }

  // AutoScroll Console div
  useEffect(() => {
    consoleRef.current.scrollTop = consoleRef.current.scrollHeight
  }, [logs])

  return (
    <div className="IDE">
      {loading && <Loader message="Generating Media Files" />}

      {!loading && (
        <div className="Header">
          {/* <h1>Create your Coding</h1> */}
        </div>
      )}
      {!loading && (
        <div className="Workspace">
          <div className="fileTree">
            {files && (
              files.map(file => (
                <p onClick={() => setFile(file.name)}>{file.name}</p>
              ))
            )}
          </div>

          <Editor
            draftId={id}
            fileName={file}
            previewFrame={iframeRef}
            consoleFrame={consoleRef}
            setSaveMethod={setSaveMethod}
            reloadFrame={reload}
          />
        </div>
      )}
      {!loading && (
        <div className="Preview">
          <div className="Controls">
            <div style={{ float: "left" }}>
              <button onClick={() => saveMethod()}>▶ Run</button>
              <button onClick={() => stop()}>◼ Stop</button>
            </div>

            <label htmlFor="AutoReload" style={{ float: "right", color: "#aaa", cursor: "not-allowed" }}>
              <input id="AutoReload" type="checkbox" disabled></input>
              Auto Reload
            </label>
          </div>

          <iframe
            className="Window"
            ref={iframeRef}
            onLoad={captureLogs}
          />

          <div className="Console" ref={consoleRef}>
            <Console
              variant="dark"
              logs={logs}
            />
          </div>
        </div>
      )}
      {!loading && (
        <div className="Actions">
          <a onClick={generateMedia}>Save</a>
        </div>
      )}
    </div>
  )
}

function Editor({ draftId, fileName, previewFrame, consoleFrame, setSaveMethod, reloadFrame }) {
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
          tabSize: 2
        })
      )
    }
  })

  useEffect(() => {
    if (account) {
      const indexFile = `/preview/${account}/${draftId}/source/${fileName}`

      if (editor) {
        fetch(indexFile)
          .then(async (res) => {
            const source = await res.text()
            const language = res.headers.get('Content-type').split(';')[0].split('/')[1]

            monaco.editor.setModelLanguage(editor.getModel(), language)
            editor.setValue(source)
          })

        setSaveMethod(() => save)
      }
    }
  }, [account, editor, fileName])

  function save() {
    const content = editor.getValue()
    console.log(fileName, content)
    fetch(`/${account}/nft/${draftId}/files/${fileName}/save`, {
      method: 'POST',
      headers: {
        'Content-type': 'text/plain',
        'x-auth-token': sessionStorage.getItem(account)
      },
      body: content
    }).then(async (res) => {
      const data = await res.json()
      reloadFrame()
    })
  }

  return (
    <div ref={editorRef} className="EditorInstance" />
  )
}

export default IDE