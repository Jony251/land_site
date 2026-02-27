import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './i18n/LanguageProvider.jsx'
import { AccessibilityProvider } from './a11y/AccessibilityProvider.jsx'

/**
 * Application bootstrap.
 *
 * Output:
 * - Mounts the React app into `#root`.
 * - Wraps the app with providers (a11y, i18n) and React Router.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AccessibilityProvider>
      <LanguageProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </LanguageProvider>
    </AccessibilityProvider>
  </StrictMode>,
)
