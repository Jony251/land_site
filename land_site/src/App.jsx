import Nav from './Components/Nav/Nav.comp'
import AccessibilityWidget from './Components/Accessibility/AccessibilityWidget.comp'
import Footer from './Components/Footer/Footer.comp'
import Home from './pages/Home'
import About from './pages/About'
import Works from './pages/Works'
import Contact from './pages/Contact'
import TechStrip from './Components/TechStrip/TechStrip.comp'

import './App.css'

function App() {
  return (
    <div className="app">
      <Nav />
      <main>
        <section id="home" className="app-section">
          <Home />
        </section>
        <section id="about" className="app-section">
          <About />
        </section>
        <section id="works" className="app-section">
          <Works />
        </section>
        <section className="app-section">
          <TechStrip />
        </section>
        <section id="contact" className="app-section">
          <Contact />
        </section>
      </main>
      <Footer />
      <AccessibilityWidget />
    </div>
  );
}

export default App