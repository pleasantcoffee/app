import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  slug: "pleasant",
  name: "Pleasant",
  plugins: [
    "expo-router",
    "expo-apple-authentication",
    "expo-secure-store",
    "expo-camera",
  ],
  scheme: "plsnt",
  ios: {
    bundleIdentifier: "ca.pleasantcoffee.app",
    usesAppleSignIn: true,
  },
  experiments: {
    typedRoutes: true,
  },
});
