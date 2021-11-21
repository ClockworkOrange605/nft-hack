import express from 'express'
import { MongoClient, ObjectId } from 'mongodb'

import fs from 'fs'
import path from 'path'
import glob from 'glob'

import axios from 'axios'

import jwt from 'jsonwebtoken'
import ethSigUtils from 'eth-sig-util'

import puppeteer from 'puppeteer'
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder'
import ffmpeg from 'fluent-ffmpeg'

import Web3 from 'web3'

const config = {
  app: {
    port: 4000,
    hostname: process.env.APP_HOST || 'http://localhost:4000/'
  },
  auth: {
    secret: 'shhhhh'
  },
  db: {
    uri: process.env.MONGO_URI || 'http://localhost:9545',
    name: 'crcode'
  },
  rpc: {
    uri: process.env.ETHER_RPC || 'mongodb://localhost:27017',
    contract: process.env.ETHER_CONTRACT || '0x4248971983B1714e6FD93939e703398ff664c3a0',
    mint_value: '100000000000000000'
  },
  ipfs: {
    nft_storage_uri: 'https://api.nft.storage',
    nft_storage_key: process.env.NFT_STORAGE_KEY || 'SET_UP_KEY',
  }
}

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

  const imageFile = fs.readFileSync(image.replace('http://localhost:4000/preview', './storage/nfts'))
  const animationFile = fs.readFileSync(animation.replace('http://localhost:4000/preview', './storage/nfts'))

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

  const result = fs.writeFileSync(path, content)

  res.send({
    debug: true,
    result
  })
})

// apt install chromium ffmpeg
api.post('/:address/nft/:id/media', authMiddleware, async (req, res) => {
  const { address, id } = req.params
  const { account } = res.locals

  const url = `${config.app.hostname}preview/${account}/${id}/source/index.html`
  const path = `./storage/nfts/${account}/${id}/media/`

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: {
      deviceScaleFactor: 1,
      // width: 1920, height: 1080,
      width: 1280, height: 720,
    }
  })

  console.time('video')

  const page = await browser.newPage()
  const recorder = new PuppeteerScreenRecorder(page)
  await page.goto(url, { waitUntil: 'domcontentloaded' })

  await recorder.start(`${path}demo.mp4`)
  await page.waitForTimeout(1000 * 5)
  await recorder.stop()

  await browser.close()

  console.timeEnd('video')
  console.time('frames')

  ffmpeg(`${path}demo.mp4`)
    .screenshots({
      folder: path,
      filename: 'preview.png',
      count: 9,
    })
    .on('end', function () {
      console.timeEnd('frames')
      res.send({
        debug: true
      })
    })
})


/* Collection */
//TODO: completly refactor
const abi = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "approved",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "ApprovalForAll",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getApproved",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "isApprovedForAll",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ownerOf",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "_data",
        "type": "bytes"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "tokenByIndex",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "tokenOfOwnerByIndex",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "metadata",
        "type": "string"
      }
    ],
    "name": "mint",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

api.post('/:address/nft/:id/mint', authMiddleware, async (req, res) => {
  const { address, id } = req.params
  const { metadata } = req.body
  const { account } = res.locals

  // TODO: estimate normal gas price
  const gasPrice = '20000000000'

  const web3 = new Web3(config.rpc.uri)
  const contract = new web3.eth.Contract(abi, config.rpc.contract)
  const call = await contract.methods.mint(account, metadata)

  const tx = {
    from: account,
    to: config.rpc.contract,
    // value: web3.utils.toHex(config.rpc.mint_value),
    gasPrice: web3.utils.toHex(gasPrice),
    gas: (await call.estimateGas()).toString(),
    data: await call.encodeABI()
  }

  res.send({
    debug: true,
    tx
  })
})

api.get('/collection/:txId/status', async (req, res) => {
  const { txId } = req.params

  const web3 = new Web3(config.rpc.uri)
  const tx = await web3.eth.getTransactionReceipt(txId)

  console.log(tx)

  res.send({
    debug: true,
    id: web3.utils.hexToNumber(tx.logs[0].topics[3]),
    tx
  })
})

api.get('/collection/list', async (req, res) => {
  const web3 = new Web3(config.rpc.uri)
  const contract = new web3.eth.Contract(abi, config.rpc.contract)

  const tokens = []
  const total = await contract.methods.totalSupply().call()
  for (let index = 0; index < total; index++) {
    const id = await contract.methods.tokenByIndex(index).call()
    const uri = await contract.methods.tokenURI(id).call()
    const owner = await contract.methods.ownerOf(id).call()

    tokens.push({ id, owner, uri })
  }

  res.send({
    debug: true,
    tokens
  })
})

api.get('/collection/latests', async (req, res) => {
  const web3 = new Web3(config.rpc.uri)
  const contract = new web3.eth.Contract(abi, config.rpc.contract)

  const tokens = []
  const total = await contract.methods.totalSupply().call()
  // console.log(total, typeof total)
  for (let index = total - 1; index > total - 4; index--) {
    const id = await contract.methods.tokenByIndex(index).call()
    const uri = await contract.methods.tokenURI(id).call()
    const owner = await contract.methods.ownerOf(id).call()

    tokens.push({ id, owner, uri })
  }

  console.log(tokens)

  res.send({
    debug: true,
    tokens
  })
})

api.get('/collection/:id/', async (req, res) => {
  const { id } = req.params

  const web3 = new Web3(config.rpc.uri)
  const contract = new web3.eth.Contract(abi, config.rpc.contract)

  const uri = await contract.methods.tokenURI(id).call()
  const owner = await contract.methods.ownerOf(id).call()

  //TODO: check contract indexed values
  // https://ethereum.stackexchange.com/a/74438/28459
  const events = await contract.getPastEvents("allEvents", {
    fromBlock: "earliest", toBlock: "latest",
    filter: { "tokenId": id.toString(), "2": id.toString() },
  })

  res.send({
    debug: true,
    token: { id, owner, uri },
    events: events.filter(event => event.returnValues.tokenId == id)
  })
})

api.get('/:address/collection/list', authMiddleware, async (req, res) => {
  const { address } = req.params
  const { account } = res.locals

  const web3 = new Web3(config.rpc.uri)
  const contract = new web3.eth.Contract(abi, config.rpc.contract)

  const tokens = []
  const total = await contract.methods.balanceOf(account).call()
  for (let index = 0; index < total; index++) {
    const id = await contract.methods.tokenOfOwnerByIndex(account, index).call()
    const uri = await contract.methods.tokenURI(id).call()
    // const owner = await contract.methods.ownerOf(id).call()

    tokens.push({ id, owner: account, uri })
  }

  res.send({
    debug: true,
    tokens
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