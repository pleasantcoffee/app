import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import { graphql } from "gql.tada";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { client, clearToken } from "~/gql";
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
    <View className="h-full flex-col justify-center p-4">
      <Stack.Screen
        options={{
          title: "Pleasant",
        }}
      />
      <Pressable
        onPress={async () => {
          await clearToken();
          await queryClient.invalidateQueries({
            queryKey: sessionQuery.queryKey,
          });
        }}
      >
        <Text>Log out</Text>
      </Pressable>
      <Text>total posts: {data.posts.length}</Text>
      <Pressable
        onPress={() => {
          router.push("/create");
        }}
        className="rounded bg-red-300 px-4 py-2 text-red-950"
      >
        <Text>teasdfst</Text>
      </Pressable>
    </View>
  );
};

export default IndexScreen;
