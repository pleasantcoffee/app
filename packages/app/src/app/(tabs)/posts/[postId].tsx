import { useQuery } from "@tanstack/react-query";
import { Redirect, Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
import { postQuery } from "~/queries/post";

const PostScreen: React.FC = () => {
  const { postId } = useLocalSearchParams<"/posts/[postId]">();
  const { data, isPending } = useQuery(postQuery(Number(postId)));

  if (isPending) {
    return <ActivityIndicator />;
  }

  if (!data?.post) {
    return <Redirect href="/" />;
  }

  return (
    <View>
      <Stack.Screen options={{ headerTitle: data.post.title }} />
      <Text>{data.post.title}</Text>
    </View>
  );
};

export default PostScreen;
