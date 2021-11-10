import express from 'express'
import { MongoClient, ObjectId } from 'mongodb'

import fs from 'fs'
import path from 'path'
import glob from 'glob'

import jwt from 'jsonwebtoken'
import ethSigUtils from 'eth-sig-util'

const config = {
  app: {
    port: 4000
  },
  auth: {
    secret: 'shhhhh'
  },
  db: {
    uri: process.env.MONGO_URI,
    name: 'crcode'
  },
  rpc: {
    uri: process.env.ETHER_RPC
  }
}

const api = express()
api.use(express.json())

const client = new MongoClient(config.db.uri)

api.get('/', (req, res) => {
  res.send({ timestamp: Date.now() })
})

/* Auth */
function authMiddleware(req, res, next) {
  const { address } = req.params
  const { "x-auth-token": token } = req.headers

  try {
    const { account } = jwt.verify(token, config.auth.secret)
    res.locals.account = account

    if (account == address) next()
    else res.status(403).send({ error: 'Invalid token' })
  }
  catch (error) {
    res.status(403).send({ error: error.message })
  }
}

api.post('/auth/:address', (req, res) => {
  const { address } = req.params
  const { signature } = req.body

  const account = ethSigUtils.recoverPersonalSignature({
    data: `${address}@crcode`,
    sig: signature
  })
  const token = jwt.sign({ account, signature }, config.auth.secret)

  if (account == address)
    res.send({ account, token })
  else
    res.status(403).send({ error: 'Invalid signature' })
})

api.get('/auth/:address/check', authMiddleware, (req, res) => {
  res.send(res.locals)
})

/* NFT */
api.post('/:address/nft/create/', authMiddleware, async (req, res) => {
  const { address } = req.params
  const { type, version } = req.body
  const { account } = res.locals

  //TODO: refactor DB connection
  await client.connect()
  const db = client.db(config.db.name)
  const collection = db.collection('nfts')

  const { insertedId: id } = await collection.insertOne({
    address: account,
    template: {
      type, version
    },
    created_at: Date.now()
  })

  const templatePath = `/storage/templates/${type}/${version}/*`
  const nftSourcePath = `/storage/nfts/${account}/${id}/source/`

  console.log(templatePath, '->', nftSourcePath)
  copy(templatePath, nftSourcePath)

  res.send({ id })
})

api.get('/:address/nft/list/', authMiddleware, async (req, res) => {
  const { address } = req.params
  const { account } = res.locals

  //TODO: refactor DB connection
  await client.connect()
  const db = client.db(config.db.name)
  const collection = db.collection('nfts')

  const nfts = await collection.find({ address: account }).toArray()

  res.send(nfts)
})

api.get('/:address/nft/:id/', authMiddleware, async (req, res) => {
  const { address, id } = req.params
  const { account } = res.locals

  //TODO: refactor DB connection
  await client.connect()
  const db = client.db(config.db.name)
  const collection = db.collection('nfts')

  const nft = await collection.findOne({ _id: ObjectId(id), address: account })

  res.send(nft)
})

api.post('/:address/nft/:id/update', authMiddleware, async (req, res) => {
  const { address, id } = req.params
  const { metadata } = req.body
  const { account } = res.locals

  console.log(req.body)
  console.log(metadata)

  //TODO: refactor DB connection
  await client.connect()
  const db = client.db(config.db.name)
  const collection = db.collection('nfts')

  const nft = await collection.updateOne(
    { _id: ObjectId(id), address: account },
    { $set: { metadata: metadata } }
  )
  console.log(nft)

  res.send(nft)
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

//TODO: add auth middlware (Make sure preview page keep working)
api.use('/preview', express.static('storage/nfts'))

//TODO: remove
api.use('/temp', express.static('storage/temp'))


api.listen(config.app.port, () => {
  console.log(`Example app listening at http://localhost:${config.app.port}`)
})

/* Utils */
function copy(from, to) { //accepting glob pattern
  const wildcard = from.indexOf('*') !== -1;
  const pattern = !wildcard && fs.lstatSync(from).isDirectory() ? `${from}/**/*` : from;
  glob.sync(pattern).forEach(file => {
    const fromDirname = path.dirname(from.replace(/\/\*.*/, '/wildcard'));
    const target = file.replace(fromDirname, to);
    const [targetDir, recursive] = [path.dirname(target), true];
    !fs.existsSync(targetDir) && fs.mkdirSync(targetDir, { recursive });
    fs.lstatSync(file).isDirectory() ?
      fs.mkdirSync(target, { recursive }) : fs.copyFileSync(file, target);
  })
}