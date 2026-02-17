import Nav from './Components/Nav/Nav.comp'
import AccessibilityWidget from './Components/Accessibility/AccessibilityWidget.comp'
import Footer from './Components/Footer/Footer.comp'
import Home from './pages/Home'
import About from './pages/About'
import Works from './pages/Works'
import Contact from './pages/Contact'
import TechStrip from './Components/TechStrip/TechStrip.comp'
import { Route, Routes, useLocation } from 'react-router-dom'

import './App.css'

const HomeRoute = () => (
  <main>
    <section id="home" className="app-section">
      <Home />
    </section>
    <section id="about" className="app-section">
      <About />
    </section>
    <section className="app-section">
      <TechStrip />
    </section>
  </main>
)

function App() {
  const location = useLocation()
  const isContactRoute = location.pathname === '/contact'

  return (
    <div className="app">
      <Nav />
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/works" element={<Works />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      {!isContactRoute && <Footer />}
      <AccessibilityWidget />
    </div>
  );
}

export default App