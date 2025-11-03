import { Link } from 'react-router-dom'
import './Nav.comp.css'

const Nav = () => {
  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to="/" className="logo-link">
          <img 
            src="/vite.svg" 
            className="logo" 
            alt="Logo" 
          />
          <span>Blue Cat</span>
        </Link>
      </div>
      
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/works">Blue Cat Works</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
    </nav>
  )
}

export default Nav