import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// Dual-mode build:
// - Default (npm run build): ES modules for GitHub Pages
// - TYPO3 (npm run build:typo3): Single IIFE bundle for TYPO3 integration
const isTypo3Build = process.env.BUILD_TARGET === 'typo3'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // GitHub Pages base path (standalone only)
  base: isTypo3Build ? './' : '/landing-page/',

  build: {
    outDir: isTypo3Build ? 'dist-typo3' : 'dist',
    // Extract CSS to separate file (important for TYPO3)
    cssCodeSplit: false,

    rollupOptions: isTypo3Build
      ? {
          output: {
            // TYPO3 mode: Single IIFE bundle
            format: 'iife' as const,
            inlineDynamicImports: true,
            entryFileNames: 'app.js',
            assetFileNames: (assetInfo) => {
              // Keep CSS as app.css, other assets keep their names
              if (assetInfo.name?.endsWith('.css')) {
                return 'app.css'
              }
              return 'assets/[name][extname]'
            },
            // Prevent chunk splitting
            manualChunks: undefined,
          },
        }
      : {
          // Standalone mode: Default Vite behavior (ES modules, code-split)
        },
  },
})
