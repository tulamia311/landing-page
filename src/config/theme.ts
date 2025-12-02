/**
 * Theme Configuration
 *
 * This file defines the app's visual identity.
 * All values are exposed as CSS custom properties for easy customization.
 *
 * When integrating into a host platform, these can be overridden via CSS:
 *
 * .landing-page-app {
 *   --lp-primary: #your-color;
 *   --lp-font-family: 'Your Font', sans-serif;
 * }
 */

export interface ThemeConfig {
  // App namespace (used for CSS class prefix and localStorage keys)
  namespace: string;

  // Colors
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
    quaternary: string;
    quinary: string;
    senary: string;

    // Semantic colors
    background: string;
    backgroundDark: string;
    text: string;
    textDark: string;
    border: string;
    borderDark: string;
  };

  // Typography
  fonts: {
    primary: string;
    mono: string;
  };

  // Spacing scale (in px)
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };

  // Border radius
  radius: {
    sm: number;
    md: number;
    lg: number;
    full: number;
  };

  // Z-index scale (scoped to app)
  zIndex: {
    base: number;
    dropdown: number;
    modal: number;
    tooltip: number;
  };
}

// Default theme configuration
export const defaultTheme: ThemeConfig = {
  namespace: 'lp', // landing-page

  colors: {
    primary: '#1351af',
    secondary: '#1351fa',
    tertiary: '#af1703',
    quaternary: '#118501',
    quinary: '#ff8203',
    senary: '#170319',

    background: '#ffe0bf',
    backgroundDark: 'hsl(222.2 84% 4.9%)',
    text: '#0f172a',
    textDark: '#e5e7eb',
    border: 'rgba(0, 0, 0, 0.14)',
    borderDark: 'rgba(255, 255, 255, 0.14)',
  },

  fonts: {
    primary: 'system-ui, -apple-system, sans-serif',
    mono: 'ui-monospace, monospace',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  radius: {
    sm: 4,
    md: 8,
    lg: 16,
    full: 9999,
  },

  zIndex: {
    base: 1,
    dropdown: 10,
    modal: 100,
    tooltip: 50,
  },
};

/**
 * Generate CSS custom properties from theme config
 */
export function generateCSSVariables(theme: ThemeConfig): string {
  const { namespace: ns, colors, fonts, spacing, radius, zIndex } = theme;

  return `
    --${ns}-primary: ${colors.primary};
    --${ns}-secondary: ${colors.secondary};
    --${ns}-tertiary: ${colors.tertiary};
    --${ns}-quaternary: ${colors.quaternary};
    --${ns}-quinary: ${colors.quinary};
    --${ns}-senary: ${colors.senary};

    --${ns}-bg: ${colors.background};
    --${ns}-bg-dark: ${colors.backgroundDark};
    --${ns}-text: ${colors.text};
    --${ns}-text-dark: ${colors.textDark};
    --${ns}-border: ${colors.border};
    --${ns}-border-dark: ${colors.borderDark};

    --${ns}-font-primary: ${fonts.primary};
    --${ns}-font-mono: ${fonts.mono};

    --${ns}-space-xs: ${spacing.xs}px;
    --${ns}-space-sm: ${spacing.sm}px;
    --${ns}-space-md: ${spacing.md}px;
    --${ns}-space-lg: ${spacing.lg}px;
    --${ns}-space-xl: ${spacing.xl}px;

    --${ns}-radius-sm: ${radius.sm}px;
    --${ns}-radius-md: ${radius.md}px;
    --${ns}-radius-lg: ${radius.lg}px;
    --${ns}-radius-full: ${radius.full}px;

    --${ns}-z-base: ${zIndex.base};
    --${ns}-z-dropdown: ${zIndex.dropdown};
    --${ns}-z-modal: ${zIndex.modal};
    --${ns}-z-tooltip: ${zIndex.tooltip};
  `.trim();
}

/**
 * Get namespaced localStorage key
 */
export function getStorageKey(theme: ThemeConfig, key: string): string {
  return `${theme.namespace}-${key}`;
}

/**
 * Get namespaced CSS class
 */
export function getClassName(theme: ThemeConfig, className: string): string {
  return `${theme.namespace}-${className}`;
}
