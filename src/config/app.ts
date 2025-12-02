/**
 * App Configuration
 *
 * Central configuration for the React app.
 * This makes the app portable and easy to integrate into different platforms.
 */

import { defaultTheme } from './theme';
import type { ThemeConfig } from './theme';

export interface AppConfig {
  // Mount point element ID (default: 'root')
  mountId: string;

  // Theme configuration
  theme: ThemeConfig;

  // Feature flags
  features: {
    darkMode: boolean;
    i18n: boolean;
    analytics: boolean;
  };

  // API endpoints (if any)
  api: {
    baseUrl: string;
  };
}

// Default app configuration
export const defaultAppConfig: AppConfig = {
  mountId: 'root',

  theme: defaultTheme,

  features: {
    darkMode: true,
    i18n: true,
    analytics: false,
  },

  api: {
    baseUrl: '',
  },
};

/**
 * Merge user config with defaults
 */
export function createAppConfig(userConfig: Partial<AppConfig> = {}): AppConfig {
  return {
    ...defaultAppConfig,
    ...userConfig,
    theme: {
      ...defaultAppConfig.theme,
      ...userConfig.theme,
      colors: {
        ...defaultAppConfig.theme.colors,
        ...userConfig.theme?.colors,
      },
      fonts: {
        ...defaultAppConfig.theme.fonts,
        ...userConfig.theme?.fonts,
      },
      spacing: {
        ...defaultAppConfig.theme.spacing,
        ...userConfig.theme?.spacing,
      },
      radius: {
        ...defaultAppConfig.theme.radius,
        ...userConfig.theme?.radius,
      },
      zIndex: {
        ...defaultAppConfig.theme.zIndex,
        ...userConfig.theme?.zIndex,
      },
    },
    features: {
      ...defaultAppConfig.features,
      ...userConfig.features,
    },
    api: {
      ...defaultAppConfig.api,
      ...userConfig.api,
    },
  };
}

// Export singleton config (can be overridden at runtime)
export let appConfig = defaultAppConfig;

export function setAppConfig(config: Partial<AppConfig>): void {
  appConfig = createAppConfig(config);
}
