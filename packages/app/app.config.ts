import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  slug: "pleasant",
  name: "Pleasant",
  plugins: ["expo-router", "expo-apple-authentication"],
  scheme: "plsnt",
  ios: {
    usesAppleSignIn: true,
  },
});
