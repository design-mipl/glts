import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { FoundationThemeProvider } from './design-system/ThemeContext'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FoundationThemeProvider>
      <App />
    </FoundationThemeProvider>
  </StrictMode>,
)
