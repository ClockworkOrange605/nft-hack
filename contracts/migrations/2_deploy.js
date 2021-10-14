const NFT = artifacts.require("NFT");

module.exports = async function(deployer) {
  deployer.deploy(NFT, "Creative Coding NFT", "CRCODE")
};