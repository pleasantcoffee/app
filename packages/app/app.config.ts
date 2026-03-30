import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  slug: "pleasant",
  name: "Pleasant",
  plugins: [
    "expo-router",
    [
      "expo-file-system",
      {
        supportsOpeningDocumentsInPlace: true,
        enableFileSharing: true,
      },
    ],
    "expo-apple-authentication",
    "expo-secure-store",
    "expo-camera",
  ],
  scheme: "plsnt",
  android: {
    package: "ca.pleasantcoffee.app",
    icon: "./assets/images/android-icon.png",
  },
  ios: {
    bundleIdentifier: "ca.pleasantcoffee.app",
    usesAppleSignIn: true,
    icon: {
      light: "./assets/images/ios-light.png",
      dark: "./assets/images/ios-dark.png",
      tinted: "./assets/images/ios-tinted.png",
    },
  },
  experiments: {
    typedRoutes: true,
  },
});
