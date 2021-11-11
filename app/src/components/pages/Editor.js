import { useRef } from 'react'
import { useState, useEffect } from 'react'
import { Console, Hook } from 'console-feed'

import { useAuth } from '../../providers/AuthProvider'

import * as monaco from 'monaco-editor'

import './Editor.css'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'

function IDE() {
  const { id } = useParams()
  const [logs, setLogs] = useState([])

  const iframeRef = useRef()
  const consoleRef = useRef()

  // AutoScroll Console div
  useEffect(() => {
    consoleRef.current.scrollTop = consoleRef.current.scrollHeight
  }, [logs])

  const { account } = useAuth()
  const [files, setFiles] = useState([])

  useEffect(() => {
    if (account && id) {
      fetch(`/${account}/nft/${id}/files`, {
        headers: {
          'x-auth-token': sessionStorage.getItem(account)
        }
      }).then(async (res) => {
        const data = await res.json()
        setFiles(data.files)
        console.log(files)
      })
    }
  }, [account, id])

  useEffect(() => {
    if (account) {
      const indexFile = `/preview/${account}/${id}/source/index.html`
      iframeRef.current.src = indexFile
    }
  }, [account])

  function captureLogs() {
    Hook(
      iframeRef.current.contentWindow.console,
      log => setLogs(logs => [...logs, ...log])
    )
  }

  const [file, setFile] = useState('index.html')

  // function selectFile(filename) {
  //   setFile(filename)
  // }

  return (
    <div className="IDE">
      <div className="toolbox">
        <Link to={`/account/nft/${id}/mint`}>
          <button style={{ float: 'right' }}>Mint</button>
        </Link>
      </div>
      <div className="workspace">
        <div>
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
        />
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

function Editor({ draftId, fileName, previewFrame, consoleFrame }) {
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
      const indexFile = `/preview/${account}/${draftId}/source/${fileName}`

      if (editor) {
        fetch(indexFile)
          .then(async (res) => {
            const source = await res.text()
            const language = res.headers.get('Content-type').split(';')[0].split('/')[1]

            monaco.editor.setModelLanguage(editor.getModel(), language)
            editor.setValue(source)
          })

        // editor.getModel().onDidChangeContent((event) => {
        //   console.log(event)
        // })
      }
    }
  }, [account, editor, fileName])

  return (
    <div ref={editorRef} className="EditorInstance" />
  )
}

export default IDE