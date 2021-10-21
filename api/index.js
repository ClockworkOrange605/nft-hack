import fs from 'fs'
import express from 'express'
import bodyParser from 'body-parser'

import ethSigUtils from 'eth-sig-util'

const port = 4000
const api = express()

api.use(bodyParser.json())

api.get('/', (req, res) => {
  res.send('Hello World!')
})


api.post('/auth/:address', (req, res) => {
  console.log('POST', '/auth/:address', req.params, req.query, req.body)

  const address = req.params.address
  const signature = req.body.signature
  const message = `${address}@crcode`

  const account = ethSigUtils.recoverPersonalSignature({ data: message, sig: signature })

  console.log({ address, signature, message, account })

  if (account == address)
    res.send({ status: 'ok' })
  else
    res.status(403).send({ error: 'Invalid signature' })
})


api.get('/test', async (req, res) => {
  const address = '0x9f45deB282DA4AA19E4965E3483DCA19D93CaE01'
  const project = '01'

  const dir = await fs.promises.opendir(`./storage/${address}/${project}/source/`);

  const fileTree = []
  let current

  while (current = dir.readSync()) {
    fileTree.push({
      name: current.name,
      isDir: current.isDirectory(),
      isFile: current.isFile(),
    })
  }
  dir.close()

  res.send({
    address, tree: fileTree
  })
})

api.get('/test2', async (req, res) => {
  const address = '0x9f45deB282DA4AA19E4965E3483DCA19D93CaE01'
  const project = '01'
  const filename = 'index.html'

  const path = `./storage/${address}/${project}/source/${filename}`

  const file = fs.readFileSync(path, 'utf-8')

  res.send(file)
})

api.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})