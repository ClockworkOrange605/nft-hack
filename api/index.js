import express from 'express'
import { MongoClient, ObjectId } from 'mongodb'

import fs from 'fs'
import path from 'path'
import glob from 'glob'

import axios from 'axios'

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
    uri: process.env.MONGO_URI || 'http://localhost:9545',
    name: 'crcode'
  },
  rpc: {
    uri: process.env.ETHER_RPC || 'mongodb://localhost:27017'
  },
  ipfs: {
    nft_storage_uri: 'https://api.nft.storage',
    nft_storage_key: process.env.NFT_STORAGE_KEY || 'SET_UP_KEY',
  }
}

console.log(config.ipfs.nft_storage_key)

const api = express()
api.use(express.json())
api.use(express.text({ type: 'text/*' }))

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
  const { metadata, image, animation } = req.body
  const { account } = res.locals

  const imageFile = fs.readFileSync(image.replace('http://localhost:4000', './storage'))
  const animationFile = fs.readFileSync(animation.replace('http://localhost:4000', './storage'))

  const uploadResult = await Promise.all([
    axios.post(`${config.ipfs.nft_storage_uri}/upload`, imageFile, {
      headers: { "Authorization": `Bearer ${config.ipfs.nft_storage_key}` }
    }),
    axios.post(`${config.ipfs.nft_storage_uri}/upload`, animationFile, {
      headers: { "Authorization": `Bearer ${config.ipfs.nft_storage_key}` }
    }),
  ])

  const [image_url, animation_url] =
    uploadResult.map(res => `https://ipfs.io/ipfs/${res.data.value.cid}`)

  const metadataFile = Buffer.from(
    JSON.stringify({ ...metadata, image: image_url, animation_url }, null, '\t')
  )

  const metadataUpload = await axios.post(`${config.ipfs.nft_storage_uri}/upload`, metadataFile, {
    headers: { "Authorization": `Bearer ${config.ipfs.nft_storage_key}` }
  })

  const metadataUrl = `https://ipfs.io/ipfs/${metadataUpload.data.value.cid}`

  //TODO: refactor DB connection
  await client.connect()
  const db = client.db(config.db.name)
  const collection = db.collection('nfts')

  const result = await collection.updateOne(
    { _id: ObjectId(id), address: account },
    {
      $set: {
        metadata_url: metadataUrl,
        metadata: { ...metadata, image: image_url, animation_url }
      }
    }
  )

  res.send(result)
})

/* Editor */
api.get('/:address/nft/:id/files', authMiddleware, async (req, res) => {
  const { address, id } = req.params
  const { account } = res.locals

  const dir = await fs.promises.opendir(`./storage/nfts/${account}/${id}/source/`)

  const files = []
  let current

  while (current = dir.readSync()) {
    files.push({
      name: current.name,
      isDir: current.isDirectory(),
      isFile: current.isFile(),
    })
  }
  dir.close()

  res.send({ files })
})

api.post('/:address/nft/:id/files/:file/save', authMiddleware, async (req, res) => {
  const { address, id, file } = req.params
  const content = req.body
  const { account } = res.locals

  const path = `./storage/nfts/${account}/${id}/source/${file}`

  // console.log(path, content)

  const result = fs.writeFileSync(path, content)

  res.send({
    debug: true,
    result
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