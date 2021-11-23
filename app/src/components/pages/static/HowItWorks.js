import './HowItWorks.css'

function HowItWorks() {
  return (
    <div className="HowTo">
      <div className="Links">
        <p id="toCollectors" >to Collectors</p>
        <p id="toCreators" >to Creators</p>
      </div>

      <div className="Content">
        <div id="forCollectors" className="Page">
          <div className="Block">
            <img src="/assets/screens/collectors/browse.png" alt="Browse Collection" />
            <p>
              <b>Browse</b> Collection Tokens on this site or any marketplace that support Ethereum ERC-721 Tokens, like <a href="https://opensea.io/" target="_blank" rel="noreferrer">OpenSea</a> or <a href="https://rarible.com/" target="_blank" rel="noreferrer">Rarible</a>
            </p>
          </div>
          <div className="Block">
            <img src="/assets/screens/collectors/collect.png" alt="Collect NFT`s" />
            <p><i>Collect</i> Tokens that you like</p>
          </div>
          <div className="Block">
            <img src="/assets/screens/collectors/explore.png" alt="Explore NFT`s" />
            <p><b>Explore</b> Source Code of Collected Tokens </p>
          </div>
          <div className="Block">
            <img src="/assets/screens/collectors/resale.png" alt="Resale NFT`s" />
            <p>Resale Tokens if you want</p>
          </div>
        </div>

        <div id="forCreators" className="Page">
          <div className="Block">
            <img src="/assets/screens/creators/create.png" alt="Create NFT`s" />
            <p>Create tokens with coding</p>
          </div>
          <div className="Block">
            <img src="/assets/screens/creators/publish.png" alt="Publish NFT`s" />
            <p>Publish your Creations</p>
          </div>
          <div className="Block">
            <img src="/assets/screens/creators/sell.png" alt="Sell NFT`s" />
            <p>Put your Creations on sell</p>
          </div>
          <div className="Block">
            <img src="/assets/screens/creators/gain.png" alt="Gain Commisiion" />
            <p>Gain Commison with every resale</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HowItWorks