// import { MongoClient } from 'mongodb'

import express from 'express'
import bodyParser from 'body-parser'

import fs from 'fs'
import path from 'path'

import jwt from 'jsonwebtoken'
import ethSigUtils from 'eth-sig-util'

const port = 4000
const secret = 'shhhhh'

const api = express()

console.log(process.env.ETHER_RPC)
console.log(process.env.MONGO_URI)

// const client = new MongoClient(process.env.MONGO_URI)

// const dbName = 'test';

// async function main() {
//   // Use connect method to connect to the server
//   await client.connect();
//   console.log('Connected successfully to server');
//   const db = client.db(dbName);
//   const collection = db.collection('test');

//   // the following code examples can be pasted here...
//   // const insertResult = await collection.insertMany([{ a: 1 }, { a: 2 }, { a: 3 }]);
//   // console.log('Inserted documents =>', insertResult);

//   return 'done.';
// }

// main()
//   .then(console.log)
//   .catch(console.error)
//   .finally(() => client.close());

api.use(bodyParser.json())

api.use('/preview', express.static('storage'))

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
  console.log('POST', '/auth/:address')

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
  console.log('GET', '/auth/:address/check', req.headers)

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

api.get('/test2', async (req, res) => {
  const address = '0x9f45deB282DA4AA19E4965E3483DCA19D93CaE01'
  const project = '01'
  const filename = 'index.html'

  // const path = `./storage/${address}/${project}/source/${filename}`
  const filePath = path.resolve(`./storage/${address}/${filename}`)

  const file = fs.readFileSync(filePath, 'utf-8')

  res.send(file)
})

api.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})