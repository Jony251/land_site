import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Nav from './Components/Nav/Nav.comp'
import Info from './Components/Info/Info.comp'
import ChatBot from './Components/ChatBot/ChatBot.comp'

import './App.css'

// Page Components
const Home = () => (
  <div className="page-content">
    <h1>Welcome to Blue Cat</h1>
    <p>This is the home page content.</p>
  </div>
)

const About = () => (
  <div className="page-content">
    <h1>About Me</h1>
    <p>Learn more about me and my skills.</p>
  </div>
)

const Works = () => (
  <div className="page-content">
    <h1>My Works</h1>
    <p>Check out my latest projects.</p>
  </div>
)

const Contact = () => (
  <div className="page-content">
    <h1>Contact Me</h1>
    <p>Get in touch with me.</p>
  </div>
)

function App() {
  return (
    <Router>
      <div className="app">
        <Nav />
        <main>
          <Routes>
            <Route path="/" element={
              <>
                <Home />
                <Info />
              </>
            } />
            <Route path="/about" element={<About />} />
            <Route path="/works" element={<Works />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <ChatBot />
      </div>
    </Router>
  );
}

export default App