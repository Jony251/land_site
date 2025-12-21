import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Nav from './Components/Nav/Nav.comp'
import ChatBot from './Components/ChatBot/ChatBot.comp'
import AccessibilityWidget from './Components/Accessibility/AccessibilityWidget.comp'
import Footer from './Components/Footer/Footer.comp'
import Home from './pages/Home'
import About from './pages/About'
import Works from './pages/Works'
import Contact from './pages/Contact'

import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Nav />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/works" element={<Works />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
        <AccessibilityWidget />
        <ChatBot />
      </div>
    </Router>
  );
}

export default App