import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './i18n/LanguageProvider.jsx'
import { AccessibilityProvider } from './a11y/AccessibilityProvider.jsx'
import { ThemeProvider } from './theme/ThemeProvider.jsx'
import { initAnalytics } from './lib/analytics.js'

initAnalytics();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AccessibilityProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </AccessibilityProvider>
    </ThemeProvider>
  </StrictMode>,
)
