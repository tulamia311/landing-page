# React App Portability Standards

## Overview

This document defines standards for building React apps that can be:
1. **Standalone** – Deployed to GitHub Pages, Netlify, etc.
2. **Embedded** – Integrated into TYPO3, WordPress, or other platforms

---

## 1. Styling Isolation

### ❌ DON'T style global elements

```css
/* BAD - conflicts with host platform */
* { margin: 0; padding: 0; }
body { background: #fff; }
html { font-size: 16px; }
main, header, footer { ... }
```

### ✅ DO scope all styles to `#root`

```css
/* GOOD - isolated to app */
#root {
  --lp-bg: #ffe0bf;
  background: var(--lp-bg);
  font-family: system-ui;
}
```

---

## 2. CSS Class Naming

### ❌ DON'T use generic class names

```css
/* BAD - will conflict with host */
.container { }
.button { }
.modal { }
.header { }
```

### ✅ DO prefix all classes with app namespace

```css
/* GOOD - namespaced */
.lp-container { }
.lp-button { }
.lp-modal { }
.lp-header-row { }
```

---

## 3. Theme Configuration

### Use CSS Custom Properties

All colors, fonts, spacing should be CSS variables defined on `#root`:

```css
#root {
  /* Colors */
  --lp-primary: #1351af;
  --lp-secondary: #1351fa;
  --lp-bg: #ffe0bf;
  --lp-text: #0f172a;

  /* Typography */
  --lp-font-primary: system-ui, sans-serif;

  /* Spacing */
  --lp-space-md: 16px;

  /* Border radius */
  --lp-radius-md: 8px;
}
```

### Host platform can override

```css
/* In TYPO3/WordPress theme */
.landing-page-app #root {
  --lp-primary: #your-brand-color;
  --lp-font-primary: 'Your Font', sans-serif;
}
```

---

## 4. Dark Mode

### ❌ DON'T use `body.dark-mode`

```css
/* BAD - affects entire page */
body.dark-mode { background: #000; }
```

### ✅ DO use `#root.dark-mode`

```css
/* GOOD - scoped to app */
#root.dark-mode {
  --lp-bg: hsl(222 84% 5%);
  --lp-text: #e5e7eb;
}
```

### In JavaScript

```tsx
// Toggle dark mode on #root, not body
const appRoot = document.getElementById('root')
appRoot?.classList.toggle('dark-mode')
```

---

## 5. localStorage Keys

### ❌ DON'T use generic keys

```ts
// BAD - will conflict
localStorage.setItem('theme', 'dark')
localStorage.setItem('language', 'en')
```

### ✅ DO prefix with app namespace

```ts
// GOOD - namespaced
localStorage.setItem('lp-theme', 'dark')
localStorage.setItem('lp-language', 'en')
```

---

## 6. Z-Index Scale

### Define scoped z-index values

```css
#root {
  --lp-z-base: 1;
  --lp-z-dropdown: 10;
  --lp-z-tooltip: 50;
  --lp-z-modal: 100;
}

.lp-modal { z-index: var(--lp-z-modal); }
.lp-tooltip { z-index: var(--lp-z-tooltip); }
```

---

## 7. JavaScript Best Practices

### Clean up on unmount

```tsx
useEffect(() => {
  const handler = () => { /* ... */ }
  window.addEventListener('resize', handler)

  // Always clean up!
  return () => window.removeEventListener('resize', handler)
}, [])
```

### Namespace global variables

```ts
// BAD
window.myApp = { ... }

// GOOD
window.__LANDING_PAGE_APP__ = { ... }
```

---

## 8. TypeScript Configuration

### Use strict mode

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

---

## 9. Dependencies

### Use peer dependencies for React

```json
// package.json
{
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  }
}
```

---

## 10. Build Output

### Dual-build strategy

| Build | Command | Output | Use Case |
|-------|---------|--------|----------|
| Standalone | `npm run build` | `dist/` (ES modules) | GitHub Pages |
| TYPO3 | `npm run build:typo3` | `dist-typo3/app.js` | TYPO3 integration |

---

## 11. Mount Point

### Make mount ID configurable

```ts
// config/app.ts
export const appConfig = {
  mountId: 'root', // Can be overridden
}

// main.tsx
const container = document.getElementById(appConfig.mountId)
```

---

## 12. File Structure

```
src/
├── components/       # React components
├── config/           # App & theme configuration
│   ├── app.ts
│   ├── theme.ts
│   └── index.ts
├── styles/           # Scoped CSS
│   └── app.css
├── hooks/            # Custom hooks
├── utils/            # Utility functions
├── i18n/             # Translations
├── App.tsx
└── main.tsx
```

---

## Checklist for New Apps

- [ ] All styles scoped to `#root`
- [ ] All class names prefixed (e.g., `lp-`)
- [ ] CSS variables for theming
- [ ] Dark mode on `#root`, not `body`
- [ ] localStorage keys prefixed
- [ ] Z-index scale defined
- [ ] Event listeners cleaned up
- [ ] TypeScript strict mode
- [ ] Dual-build configured
- [ ] No global element styling
