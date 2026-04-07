import "../global.css";

import { FloatingDevTools } from "@buoy-gg/core";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { sessionQuery } from "~/queries/session";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const RootLayout: React.FC = () => {
  const { isLoading, data } = useQuery(sessionQuery, queryClient);
  const isLoggedIn = !!data?.me;

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hide();
    }
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="sign-up" options={{ headerTitle: "" }} />
        </Stack.Protected>
        <Stack.Protected guard={isLoggedIn}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>
      </Stack>
      <StatusBar style="auto" />
      <FloatingDevTools />
    </QueryClientProvider>
  );
};

export default RootLayout;
