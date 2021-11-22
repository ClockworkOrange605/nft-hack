import './styles.css'

function Loader({ message }) {
  return (
    <div className="loader">
      <div className="duo duo1">
        <div className="dot dot-a"></div>
        <div className="dot dot-b"></div>
      </div>
      <div className="duo duo2">
        <div className="dot dot-a"></div>
        <div className="dot dot-b"></div>
      </div>

      <div className="message">
        <h1>{message}</h1>
      </div>
    </div>
  )
}

export default Loader