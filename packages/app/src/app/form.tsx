import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { graphql, type VariablesOf } from "gql.tada";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { client } from "~/gql";
import { postQuery } from "~/queries/post";

const CreatePostMutation = graphql(`
  mutation CreatePost($input: MutationCreatePostInput!) {
    createPost(input: $input) {
      id
      title
    }
  }
`);

const FormScreen: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (variables: VariablesOf<typeof CreatePostMutation>) =>
      client.request(CreatePostMutation, variables),
    onSuccess: (data) => {
      queryClient.setQueryData(postQuery(data.createPost.id).queryKey, () => ({
        post: data.createPost,
      }));
      router.replace({
        pathname: "/posts/[postId]",
        params: { postId: data.createPost.id },
      });
    },
  });

  const [title, setTitle] = useState("");

  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <ActivityIndicator />;
  }

  if (!permission.granted) {
    return (
      <>
        <Text>we need permission to do it</Text>
        <Pressable onPress={requestPermission}>
          <Text>grant permission</Text>
        </Pressable>
      </>
    );
  }

  return (
    <View className="gap-4 p-4">
      <Pressable onPress={() => {}}>
        <Text>from photo</Text>
      </Pressable>
      <TextInput
        className="border bg-white p-4"
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <Pressable
        disabled={isPending}
        className="h-12 items-center justify-center rounded-md bg-blue-300 px-3"
        onPress={() => {
          mutate({
            input: {
              title,
            },
          });
        }}
      >
        {isPending ? (
          <ActivityIndicator />
        ) : (
          <Text className="font-medium text-md">Create post</Text>
        )}
      </Pressable>
    </View>
  );
};

export default FormScreen;
