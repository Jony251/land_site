import './Footer.comp.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-branding">
          <strong>Blue Cat</strong>
          <p>Web development focused on performance, clarity, and conversion.</p>
        </div>

        <nav className="footer-links" aria-label="Footer navigation">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/works">Portfolio</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <div className="footer-meta">
          <a href="https://github.com/Jony251" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/evgeny-nemchenko/" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href="/Blue-Cat-CV.txt" download>
            Download CV
          </a>
        </div>

        <p className="footer-copyright">© {year} Blue Cat. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
