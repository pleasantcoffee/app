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
  },
  ios: {
    bundleIdentifier: "ca.pleasantcoffee.app",
    usesAppleSignIn: true,
  },
  experiments: {
    typedRoutes: true,
  },
});
