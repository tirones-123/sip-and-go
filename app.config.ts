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
    icon: "./assets/logo-jauneclair.png",
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
        foregroundImage: "./assets/logo-jauneclair.png",
        backgroundColor: "#0B0E1A",
      },
      package: "com.sipandgoapp.first",
    },
    web: {
      favicon: "./assets/logo-jauneclair.png",
      name: "SIP&GO! - Jeu à Boire",
      shortName: "SIP&GO!",
      description: "L'application de jeu à boire ultime pour vos soirées. Plus de 1500 questions et défis !",
      lang: "fr",
      scope: "/",
      startUrl: "/",
      display: "standalone",
      orientation: "portrait",
      themeColor: "#FF784F",
      backgroundColor: "#0B0E1A",
      bundler: "metro",
      // PWA Configuration for full screen
      manifest: {
        display: "standalone",
        orientation: "portrait",
        theme_color: "#FF784F",
        background_color: "#0B0E1A",
        start_url: "/",
        scope: "/",
        categories: ["games", "entertainment", "lifestyle"],
        prefer_related_applications: false,
        display_override: ["standalone", "fullscreen", "minimal-ui"],
        // Ajout des icônes pour une meilleure installation
        icons: [
          {
            src: "./assets/logo-jauneclair.png",
            sizes: "any",
            type: "image/png",
            purpose: "any maskable"
          },
          {
            src: "./assets/logo-jauneclair.png",
            sizes: "48x48",
            type: "image/png"
          },
          {
            src: "./assets/logo-jauneclair.png",
            sizes: "72x72",
            type: "image/png"
          },
          {
            src: "./assets/logo-jauneclair.png",
            sizes: "96x96",
            type: "image/png"
          },
          {
            src: "./assets/logo-jauneclair.png",
            sizes: "128x128",
            type: "image/png"
          },
          {
            src: "./assets/logo-jauneclair.png",
            sizes: "144x144",
            type: "image/png"
          },
          {
            src: "./assets/logo-jauneclair.png",
            sizes: "152x152",
            type: "image/png"
          },
          {
            src: "./assets/logo-jauneclair.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "./assets/logo-jauneclair.png",
            sizes: "256x256",
            type: "image/png"
          },
          {
            src: "./assets/logo-jauneclair.png",
            sizes: "384x384",
            type: "image/png"
          },
          {
            src: "./assets/logo-jauneclair.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      },
      // Meta tags for iOS full screen
      meta: {
        "apple-mobile-web-app-capable": "yes",
        "apple-mobile-web-app-status-bar-style": "black-translucent",
        "apple-mobile-web-app-title": "SIP&GO!",
        "mobile-web-app-capable": "yes",
        "viewport": "width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no, viewport-fit=cover, minimal-ui",
        // Forcer le mode standalone
        "apple-touch-fullscreen": "yes"
      }
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