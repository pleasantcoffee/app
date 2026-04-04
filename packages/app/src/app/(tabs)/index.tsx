import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { graphql } from "gql.tada";
import { ActivityIndicator, Text, View } from "react-native";
import { Button, DefaultSheetView } from "~/components/ui";
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
    <DefaultSheetView>
      <Stack.Screen
        options={{
          title: "Pleasant",
        }}
      />
      <Button
        onPress={async () => {
          await SecureStore.deleteItemAsync("token");
          await queryClient.invalidateQueries({
            queryKey: sessionQuery.queryKey,
          });
        }}
      >
        Log out
      </Button>
      <Text>total posts: {data.posts.length}</Text>
      <Text>{JSON.stringify(data.posts, null, 2)}</Text>
      <Button
        onPress={() => {
          router.push("/create");
        }}
        className="bg-red-300"
      >
        <Text className="text-red-950">teasdfst</Text>
      </Button>
    </DefaultSheetView>
  );
};

export default IndexScreen;
