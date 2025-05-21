import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Picolo",
  slug: "picolo",
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
    bundleIdentifier: "com.yourcompany.picolo"
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#0B0E1A"
    },
    package: "com.yourcompany.picolo"
  },
  extra: {
    eas: {
      projectId: "your-eas-project-id"
    },
    // Environment variables access
    RC_KEY_IOS: process.env.RC_KEY_IOS,
    RC_KEY_ANDROID: process.env.RC_KEY_ANDROID,
    POSTHOG_KEY: process.env.POSTHOG_KEY,
    POSTHOG_HOST: process.env.POSTHOG_HOST || "https://eu.posthog.com",
    SENTRY_DSN: process.env.SENTRY_DSN
  },
  plugins: [
    ["@sentry/react-native/expo"],
    [
      "react-native-purchases",
      {
        "appUserID": null,
        "apiKey": {
          "ios": process.env.RC_KEY_IOS,
          "android": process.env.RC_KEY_ANDROID
        }
      }
    ]
  ]
}); 