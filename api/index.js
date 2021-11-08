// import { MongoClient } from 'mongodb'

import express from 'express'
import bodyParser from 'body-parser'

import fs from 'fs'
import path from 'path'

import jwt from 'jsonwebtoken'
import ethSigUtils from 'eth-sig-util'

// console.log(process.env.ETHER_RPC)
// console.log(process.env.MONGO_URI)

const port = 4000
const secret = 'shhhhh'

const api = express()

api.use(bodyParser.json())

api.get('/', (req, res) => {
  res.send({
    timestamp: Date.now()
  })
})

/* Auth */
function authMiddleware(req, res, next) {
  const address = req.params.address
  const token = req.headers['x-auth-token']

  const { account } = jwt.verify(token, secret)
  res.locals.account = account

  if (account == address)
    next()
  else
    res.status(403).send({ error: 'Invalid token' })
}

api.post('/auth/:address', (req, res) => {
  const address = req.params.address
  const signature = req.body.signature

  const message = `${address}@crcode`
  const account = ethSigUtils.recoverPersonalSignature({ data: message, sig: signature })

  const token = jwt.sign({ account, signature }, secret)
  console.log(token)

  if (account == address)
    res.send({ account, token })
  else
    res.status(403).send({ error: 'Invalid signature' })
})

api.get('/auth/:address/check', authMiddleware, async (req, res) => {
  res.send(res.locals)
})

/* Editor */
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

api.use('/preview', express.static('storage'))

// api.get('/test2', async (req, res) => {
//   const address = '0x9f45deB282DA4AA19E4965E3483DCA19D93CaE01'
//   const project = '01'
//   const filename = 'index.html'

//   // const path = `./storage/${address}/${project}/source/${filename}`
//   const filePath = path.resolve(`./storage/${address}/${filename}`)

//   const file = fs.readFileSync(filePath, 'utf-8')

//   res.send(file)
// })

api.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})