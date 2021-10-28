import { Link } from "react-router-dom"

import './Footer.css'

function Footer() {
  return (
    <footer className="Footer">
      <nav>
        <Link to="/about">About Us</Link>
        <Link to="/how-it-works">How It Works</Link>
        <Link to="/blog">Blog</Link>
      </nav>
      <span>© 2022 CWO </span>
    </footer>
  )
}

export default Footer