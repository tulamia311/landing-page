import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n'
import './styles/standalone.css' // Standalone mode: centers #root in body
import './styles/app.css'
import App from './App.tsx'
import { appConfig } from './config'

createRoot(document.getElementById(appConfig.mountId)!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
