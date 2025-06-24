import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const isEas = process.env.EAS_BUILD === 'true';
  // Build plugins array with correct typing
  const plugins: (string | [string, any])[] = [
    'expo-localization',
  ];

  // Ajoute le plugin Sentry uniquement si une DSN est fournie
  if (process.env.SENTRY_DSN) {
    plugins.unshift('@sentry/react-native/expo');
  }

  return {
    ...config,
    name: "SIP&GO!",
    slug: "sip-and-go",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "dark",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#0B0E1A"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: false,
      bundleIdentifier: "com.sipandgoapp.first",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#0B0E1A",
      },
      package: "com.sipandgoapp.first",
    },
    web: {
      favicon: "./assets/icon.png",
      name: "SIP&GO! - Jeu à Boire",
      shortName: "SIP&GO!",
      description: "Application de jeu à boire ultime pour vos soirées",
      lang: "fr",
      scope: "/",
      startUrl: "/",
      display: "standalone",
      orientation: "portrait",
      themeColor: "#0B0E1A",
      backgroundColor: "#0B0E1A",
      bundler: "metro"
    },
    extra: {
      eas: {
        projectId: "9f20c5ac-4959-4e50-a5c7-bff348faa999"
      },
      // Environment variables access
      POSTHOG_KEY: process.env.POSTHOG_KEY,
      POSTHOG_HOST: process.env.POSTHOG_HOST || "https://eu.posthog.com",
      SENTRY_DSN: process.env.SENTRY_DSN,
    },
    plugins
  };
}; 