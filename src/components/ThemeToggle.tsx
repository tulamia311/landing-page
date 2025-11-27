import { useEffect, useState } from 'react'

function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    const stored = window.localStorage.getItem('landing-page-theme')
    if (stored) return stored === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    if (typeof document === 'undefined') return

    if (isDark) {
      document.body.classList.add('dark-mode')
      window.localStorage.setItem('landing-page-theme', 'dark')
    } else {
      document.body.classList.remove('dark-mode')
      window.localStorage.setItem('landing-page-theme', 'light')
    }
  }, [isDark])

  return (
    <button
      className="theme-toggle"
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
