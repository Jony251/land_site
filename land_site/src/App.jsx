import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Nav from './Components/Nav/Nav.comp'
import ChatBot from './Components/ChatBot/ChatBot.comp'
import AccessibilityWidget from './Components/Accessibility/AccessibilityWidget.comp'
import Footer from './Components/Footer/Footer.comp'
import { useSiteCopy } from './i18n/siteCopy'
import { trackPageView } from './lib/analytics'

import './App.css'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Works = lazy(() => import('./pages/Works'))
const CaseStudy = lazy(() => import('./pages/CaseStudy'))
const Contact = lazy(() => import('./pages/Contact'))

const ScrollManager = () => {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname, location.hash])

  return null
}

const RouteTracker = () => {
  const location = useLocation()

  useEffect(() => {
    trackPageView(location.pathname)
  }, [location.pathname])

  return null
}

function App() {
  const sc = useSiteCopy()

  return (
    <Router>
      <div className="app">
        <ScrollManager />
        <RouteTracker />
        <Nav />
        <main>
          <Suspense fallback={<div className="route-loader">{sc('common.loading')}</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/works" element={<Works />} />
              <Route path="/works/:projectId" element={<CaseStudy />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <AccessibilityWidget />
        <ChatBot />
      </div>
    </Router>
  );
}

export default App