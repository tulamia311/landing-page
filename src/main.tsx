import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/standalone.css' // Standalone mode: centers #root in body
import './styles/app.css'
import { appConfig, setAppConfig } from './config'

/**
 * Read configuration from data attributes on #root element.
 * This allows TYPO3 or other host platforms to override settings.
 *
 * Example:
 * <div id="root"
 *      data-locales-path="/fileadmin/landing_page_app/locales"
 *      data-cache-duration="0">
 * </div>
 */
function initConfigFromDataAttributes(): void {
  const rootElement = document.getElementById(appConfig.mountId)
  if (!rootElement) return

  const localesPath = rootElement.dataset.localesPath
  const cacheDuration = rootElement.dataset.cacheDuration
  const supportedLngs = rootElement.dataset.supportedLngs
  const fallbackLng = rootElement.dataset.fallbackLng

  if (localesPath || cacheDuration || supportedLngs || fallbackLng) {
    setAppConfig({
      content: {
        localesPath: localesPath || appConfig.content.localesPath,
        cacheDuration: cacheDuration ? parseInt(cacheDuration) : appConfig.content.cacheDuration,
        supportedLngs: supportedLngs ? supportedLngs.split(',') : appConfig.content.supportedLngs,
        fallbackLng: fallbackLng || appConfig.content.fallbackLng,
      },
    })
  }
}

// Initialize config from data attributes BEFORE importing i18n
initConfigFromDataAttributes()

// Now import i18n (uses updated appConfig)
import('./i18n').then(() => {
  import('./App.tsx').then(({ default: App }) => {
    createRoot(document.getElementById(appConfig.mountId)!).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  })
})
