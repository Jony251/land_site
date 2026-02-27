import Nav from './Components/Nav/Nav.comp'
import AccessibilityWidget from './Components/Accessibility/AccessibilityWidget.comp'
import Footer from './Components/Footer/Footer.comp'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Works from './pages/Works'
import InWork from './pages/in_Work/InWork'
import Contact from './pages/Contact'
import { Route, Routes, useLocation } from 'react-router-dom'

import './App.css'

/**
 * Home route wrapper.
 *
 * Output:
 * - Renders the landing page inside the main layout container.
 */
const HomeRoute = () => (
  <main className="landing-route">
    <section id="home" className="app-section">
      <Home />
    </section>
  </main>
)

/**
 * Main application component.
 *
 * Output:
 * - Renders navigation and page routing.
 * - Conditionally renders `Footer` (hidden on `/contact`).
 *
 * Input:
 * - Current location from React Router.
 */
function App() {
  const location = useLocation()
  const isContactRoute = location.pathname === '/contact'

  return (
    <div className="app">
      <Nav />
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/works" element={<Works />} />
        <Route path="/works/:id" element={<InWork />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      {!isContactRoute && <Footer />}
      <AccessibilityWidget />
    </div>
  );
}

export default App