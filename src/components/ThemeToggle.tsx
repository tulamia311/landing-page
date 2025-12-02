import { useEffect, useState } from 'react'
import { appConfig } from '../config'

const STORAGE_KEY = `${appConfig.theme.namespace}-theme`

function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored) return stored === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    if (typeof document === 'undefined') return

    // Find the app root element instead of body
    const appRoot = document.getElementById(appConfig.mountId)
    if (!appRoot) return

    if (isDark) {
      appRoot.classList.add('dark-mode')
      window.localStorage.setItem(STORAGE_KEY, 'dark')
    } else {
      appRoot.classList.remove('dark-mode')
      window.localStorage.setItem(STORAGE_KEY, 'light')
    }
  }, [isDark])

  return (
    <button
      className="lp-theme-toggle"
      onClick={() => setIsDark(prev => !prev)}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      type="button"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}

export default ThemeToggle
