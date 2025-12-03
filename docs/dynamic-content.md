# Dynamic Text Content

## Overview

The landing page app supports dynamic text content that can be updated without rebuilding the application. Content is loaded at runtime from JSON files.

---

## How It Works

```
┌─────────────────────────────────────────────────────────────────────┐
│                     CONTENT LOADING FLOW                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   1. App starts                                                     │
│      ↓                                                              │
│   2. Read data attributes from #root (if any)                       │
│      ↓                                                              │
│   3. Initialize i18n with configured localesPath                    │
│      ↓                                                              │
│   4. Fetch /locales/en.json (or configured path)                    │
│      ↓                                                              │
│   5. If fetch fails → use bundled fallback                          │
│      ↓                                                              │
│   6. Render app with loaded translations                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## File Locations

### Standalone Mode (GitHub Pages)

```
public/
└── locales/
    ├── en.json    ← Edit these files
    └── de.json
```

After build, these are copied to `dist/locales/`.

### TYPO3 Integration

```
fileadmin/
└── landing_page_app/
    └── locales/
        ├── en.json    ← Editable via Filelist module
        └── de.json
```

---

## Configuration via Data Attributes

When embedding in TYPO3 or other platforms, configure the app via data attributes:

```html
<div id="root"
     data-locales-path="/fileadmin/landing_page_app/locales"
     data-cache-duration="0"
     data-supported-lngs="en,de"
     data-fallback-lng="en">
</div>
```

| Attribute | Description | Default |
|-----------|-------------|---------|
| `data-locales-path` | Base path to locale JSON files | `/locales` |
| `data-cache-duration` | Cache duration in seconds (0 = no cache) | `300` |
| `data-supported-lngs` | Comma-separated list of languages | `en,de` |
| `data-fallback-lng` | Fallback language if detection fails | `en` |

---

## JSON File Structure

```json
{
  "outerSquares": {
    "1": {
      "label": "Square 1",
      "tooltipTitle": "Tooltip title 1",
      "modalBody": "Modal body content..."
    }
  },
  "innerSquares": {
    "6": {
      "topic": "Infrastructure"
    }
  },
  "centerCircle": {
    "states": {
      "poem-intro": {
        "title": "I am Tulamia D. Luffy.",
        "description": "Welcome message..."
      }
    }
  }
}
```

---

## Updating Content

### Standalone (GitHub Pages)

1. Edit `public/locales/en.json` or `de.json`
2. Commit and push
3. GitHub Actions rebuilds and deploys

### TYPO3

1. Go to **Filelist** module
2. Navigate to `fileadmin/landing_page_app/locales/`
3. Edit `en.json` or `de.json`
4. Save → changes are live immediately (if `cache-duration="0"`)

---

## Fallback Behavior

If the runtime fetch fails (network error, file not found), the app falls back to bundled translations from `src/locales/`. This ensures the app always works, even if external files are missing.

```
Fetch /locales/en.json
    ↓
Success? → Use fetched content
    ↓
Failed? → Use bundled src/locales/en.json
```

---

## TYPO3 Fluid Template Example

```html
<html xmlns:f="http://typo3.org/ns/TYPO3/CMS/Fluid/ViewHelpers"
      data-namespace-typo3-fluid="true">

<f:layout name="Default" />

<f:section name="Main">
    <div id="root"
         data-locales-path="/fileadmin/landing_page_app/locales"
         data-cache-duration="0">
    </div>
</f:section>

</html>
```

---

## Adding a New Language

1. Create `public/locales/fr.json` (copy from `en.json`)
2. Translate the content
3. Update `data-supported-lngs="en,de,fr"` in the template
4. Rebuild and deploy
