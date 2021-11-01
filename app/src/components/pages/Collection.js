import Loader from '../common/Loader'

import './Collection.css'

function Collection() {
  // const tokens = []

  const tokens = [
    {
      owner: "",
      image: "https://images.squarespace-cdn.com/content/v1/5c12933f365f02733c923e4e/1623457826739-RFS8YBP06I1W5WW2CSCG/tyler-hobbs-fidenza-612.png"
    },
    {
      owner: "",
      image: "https://images.squarespace-cdn.com/content/v1/5c12933f365f02733c923e4e/1623380092808-2TDJ7SCS3QPFR7SJGAPH/tyler-hobbs-fidenza-debug-view.png"
    },
    {
      owner: "",
      image: "https://images.squarespace-cdn.com/content/v1/5c12933f365f02733c923e4e/1623380723446-2WDA6T5POR2DAY2A0R1T/tyler-hobbs-fidenza-shape-example.png"
    }
  ]

  return (
    <div className="Collection">
      <div className="Filter"></div>
      {tokens ?
        <div className="List">
          {tokens.map(data => <CollectionItem token={data} />)}
        </div> : <Loader />}
    </div>
  )
}

function CollectionItem({ token }) {
  return (
    <div className="Item">
      <div className="Image">
        <img src={token.image} />
      </div>
    </div>
  )
}

export default Collection