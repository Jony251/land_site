import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AccessibilityProvider } from '../a11y/AccessibilityProvider'
import { LanguageProvider } from '../i18n/LanguageProvider'

/**
 * Builds a wrapper with the app's providers.
 *
 * Input:
 * - `route` (string): initial router path.
 *
 * Output:
 * - React component usable as a Testing Library `wrapper`.
 */
export const createWrapper = ({ route = '/' } = {}) =>
  function Wrapper({ children }) {
    return (
      <AccessibilityProvider>
        <LanguageProvider>
          <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
        </LanguageProvider>
      </AccessibilityProvider>
    )
  }

/**
 * Renders UI inside the app's providers.
 *
 * Input:
 * - `ui` (React element), `{ route }`.
 *
 * Output:
 * - Testing Library render result.
 */
export const renderWithProviders = (ui, { route = '/' } = {}) =>
  render(ui, { wrapper: createWrapper({ route }) })
