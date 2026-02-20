import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { graphql } from "gql.tada";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { client } from "~/gql";
import { sessionQuery } from "~/queries/session";

const HelloQuery = graphql(`
  query HelloQuery {
    posts {
      id
      title
    }
  }
`);

const helloQuery = queryOptions({
  queryKey: ["posts"],
  queryFn: () => client.request(HelloQuery),
});

const IndexScreen: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, error, isPending } = useQuery(helloQuery);

  if (isPending) {
    return <ActivityIndicator />;
  }

  if (error) {
    return (
      <View>
        <Text>There was an error</Text>
      </View>
    );
  }

  return (
    <View className="p-4">
      <Stack.Screen
        options={{
          title: "Pleasant",
        }}
      />
      <Pressable
        onPress={async () => {
          await SecureStore.deleteItemAsync("token");
          queryClient.setQueryData(sessionQuery.queryKey, {
            me: null,
          });
        }}
      >
        <Text>Log out</Text>
      </Pressable>
      <Text>total posts: {data.posts.length}</Text>
      <Pressable
        onPress={() => {
          router.push("/foo");
        }}
        className="rounded bg-red-300 px-4 py-2 text-red-950"
      >
        <Text>teasdfst</Text>
      </Pressable>
    </View>
  );
};

export default IndexScreen;
