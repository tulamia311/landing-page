import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpBackend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { appConfig } from './config'

// Bundled translations as fallback
import enFallback from './locales/en.json'
import deFallback from './locales/de.json'

const fallbackResources: Record<string, Record<string, unknown>> = {
  en: enFallback,
  de: deFallback,
}

/**
 * Initialize i18next with HTTP backend for dynamic content loading.
 *
 * Content is fetched from:
 * - Standalone: /locales/en.json (from public folder)
 * - TYPO3: /fileadmin/landing_page_app/locales/en.json (configurable via data attributes)
 *
 * Falls back to bundled translations if fetch fails.
 */
i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: appConfig.content.fallbackLng,
    supportedLngs: appConfig.content.supportedLngs,

    interpolation: {
      escapeValue: false,
    },

    backend: {
      // Load path from config (can be overridden via data attributes)
      loadPath: `${appConfig.content.localesPath}/{{lng}}.json`,

      // Custom request with fallback to bundled translations
      request: async (
        _options: object,
        url: string,
        _payload: unknown,
        callback: (err: Error | null, result: { status: number; data: unknown }) => void
      ) => {
        try {
          // Add cache-busting if cacheDuration is 0
          const fetchUrl = appConfig.content.cacheDuration === 0
            ? `${url}?t=${Date.now()}`
            : url

          const response = await fetch(fetchUrl)
          if (!response.ok) throw new Error(`HTTP ${response.status}`)

          const data = await response.json()
          callback(null, { status: 200, data })
        } catch (error) {
          // Fallback to bundled translations
          const lng = url.match(/\/(\w+)\.json/)?.[1] || 'en'
          const fallback = fallbackResources[lng] || fallbackResources.en
          console.warn(`[i18n] Failed to fetch ${url}, using bundled fallback`)
          callback(null, { status: 200, data: fallback })
        }
      },
    },
  })

export default i18n
