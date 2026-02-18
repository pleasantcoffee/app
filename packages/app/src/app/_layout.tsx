import "../global.css";

import {
  QueryClient,
  QueryClientProvider,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { graphql } from "gql.tada";
import { useEffect } from "react";
import { LoginScreen } from "~/components/LoginScreen";
import { client } from "~/gql";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const SessionQuery = graphql(
  `
    query Session {
      me {
        id
        name
      }
    }
  `,
);

const sessionQuery = queryOptions({
  queryKey: ["session"],
  queryFn: () => client.request(SessionQuery),
});

const RootLayout: React.FC = () => {
  const { isPending, data } = useQuery(sessionQuery, queryClient);

  useEffect(() => {
    if (!isPending) {
      SplashScreen.hide();
    }
  }, [isPending]);

  if (isPending) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      {!data?.me ? (
        <LoginScreen />
      ) : (
        <>
          <Stack />
          <StatusBar style="auto" />
        </>
      )}
    </QueryClientProvider>
  );
};

export default RootLayout;
