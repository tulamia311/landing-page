# NPM Scripts Guide

## Quick Reference

| Command | Purpose | Output |
|---------|---------|--------|
| `npm run dev` | Start development server | http://localhost:5173 |
| `npm run build` | Build for GitHub Pages | `dist/` |
| `npm run build:typo3` | Build for TYPO3 integration | `dist-typo3/` |
| `npm run deploy` | Build & deploy to GitHub Pages | Published to gh-pages |

---

## `npm run dev`

Start the Vite development server with hot module replacement (HMR).

```bash
npm run dev
```

**What happens:**
- Starts local server at `http://localhost:5173/landing-page/`
- Watches for file changes and auto-reloads
- Shows errors in browser overlay
- Fast refresh for React components

**Use when:**
- Developing new features
- Testing changes locally
- Debugging issues

---

## `npm run build`

Build the app for **standalone deployment** (GitHub Pages).

```bash
npm run build
```

**What happens:**
- TypeScript compilation (`tsc -b`)
- Vite production build
- Output to `dist/` folder
- ES modules with code-splitting
- Base path: `/landing-page/`

**Output structure:**
```
dist/
├── index.html
├── locales/
│   ├── en.json
│   └── de.json
└── assets/
    ├── index-xxx.js
    ├── style-xxx.css
    └── ... (code-split chunks)
```

**Use when:**
- Preparing for GitHub Pages deployment
- Testing production build locally

---

## `npm run build:typo3`

Build the app for **TYPO3 integration** (single IIFE bundle).

```bash
npm run build:typo3
```

**What happens:**
- TypeScript compilation
- Vite production build with TYPO3 config
- Output to `dist-typo3/` folder
- Single `app.js` (IIFE format, no ES modules)
- Single `app.css`
- Base path: `./` (relative)

**Output structure:**
```
dist-typo3/
├── index.html
├── app.js        ← Single bundle (IIFE)
├── app.css       ← All styles combined
├── locales/
│   ├── en.json
│   └── de.json
└── assets/
    └── ... (images, fonts)
```

**Use when:**
- Preparing for TYPO3 import via `typo3-react-importer`
- Testing TYPO3 build locally

---

## `npm run deploy`

Build and deploy to GitHub Pages in one command.

```bash
npm run deploy
```

**What happens:**
1. Runs `npm run build`
2. Pushes `dist/` to `gh-pages` branch
3. GitHub Pages serves the site

**Result:**
- Live at: `https://tulamia311.github.io/landing-page/`

**Use when:**
- Ready to publish changes to production
- After testing locally with `npm run build`

---

## Workflow Examples

### Daily Development

```bash
# Start dev server
npm run dev

# Make changes, see live updates
# When done, stop with Ctrl+C
```

### Deploy to GitHub Pages

```bash
# Option 1: One command
npm run deploy

# Option 2: Step by step
npm run build          # Build first
npx serve dist         # Test locally (optional)
npm run deploy         # Deploy when ready
```

### Prepare for TYPO3

```bash
# Build TYPO3 bundle
npm run build:typo3

# Check output
ls -la dist-typo3/

# Import to TYPO3 using typo3-react-importer
```

---

## Environment Differences

| Aspect | `dev` | `build` | `build:typo3` |
|--------|-------|---------|---------------|
| Format | ES modules | ES modules | IIFE |
| Code-split | Yes | Yes | No (single file) |
| Base path | `/landing-page/` | `/landing-page/` | `./` |
| Output | Memory | `dist/` | `dist-typo3/` |
| Source maps | Yes | No | No |
| Minified | No | Yes | Yes |
