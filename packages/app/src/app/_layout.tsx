import "../global.css";

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { LoginScreen } from "~/components/LoginScreen";
import { sessionQuery } from "~/queries/session";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const RootLayout: React.FC = () => {
  const { isLoading, data } = useQuery(sessionQuery, queryClient);

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
      {!data?.me ? (
        <LoginScreen />
      ) : (
        <>
          <Stack>
            <Stack.Screen name="foo" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
        </>
      )}
    </QueryClientProvider>
  );
};

export default RootLayout;
