import fs from 'fs'

import Web3 from 'web3'

// let web3 = new Web3('http://rpc:9545')
let web3 = new Web3('http://localhost:9545')

console.log('value',
  web3.utils.fromWei('100000000000000000'),
  web3.utils.toHex('100000000000000000'),
)
console.log('gasPrice',
  web3.utils.fromWei('20000000000'),
  web3.utils.toHex(20000000000),
)

let abi = []
const abiPath = '../contracts/build/contracts'
const abiDir = fs.opendirSync(abiPath)

console.time('abi')
let current
while (current = abiDir.readSync()) {
  const file = fs.readFileSync(`${abiPath}/${current.name}`).toString()

  // console.log('reading', `${abiPath}/${current.name}`)
  const currentAbi = JSON.parse(file).abi
  abi = [...abi, ...currentAbi]
}

// console.log(abi)
console.timeEnd('abi')

const address = "0x4248971983B1714e6FD93939e703398ff664c3a0";
const contract = new web3.eth.Contract(abi, address);

// console.log(contract.methods)
// contract.methods.name().call((err, res) => {
//   console.log(err, res)
// });

(async function () {
  console.log(
    await contract.methods.name().call(),
    await contract.methods.symbol().call(),
  )
  console.log('supportsInterface',
    await contract.methods.supportsInterface('0x80ac58cd').call(),
    await contract.methods.supportsInterface('0x5b5e139f').call(), //ERC721Metadata
    await contract.methods.supportsInterface('0x780e9d63').call(), //ERC721Enumerable
    await contract.methods.supportsInterface('0x150b7a02').call(), //ERC721TokenReceiver
  )

  const owner = "0x3Ed7afcc7Ea8B7a00c5FBC75FAa888009D1c2653"
  const tokenURI = "https://ipfs.io/ipfs/bafkreidcxodmi3ofu6tkloxrpc2wpxm3znyx3ginkr6jg5saldl4qr5kju"

  console.log('gas',
    await contract.methods.mint(owner, tokenURI).estimateGas(),
    web3.utils.toHex(
      await contract.methods.mint(owner, tokenURI).estimateGas() * 2
    ),
  )

  console.log('data',
    contract.methods.mint(owner, tokenURI).encodeABI(),
  )

  console.log(
    await contract.methods.totalSupply().call(),
    await contract.methods.totalSupply().call(),
  )

  console.log(
    await contract.methods.balanceOf(owner).call()
  )
}());


