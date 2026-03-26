import { useMutation } from "@tanstack/react-query";
import { type CameraCapturedPicture, CameraView } from "expo-camera";
import { graphql } from "gql.tada";
import { useRef } from "react";
import { Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { client } from "~/gql";

const CreatePostFromImageMutation = graphql(`
  mutation CreatePostFromImage($image: String!) {
    createPostFromImage(image: $image) {
      title
    }
  }
`);

const PresignedUrlMutation = graphql(`
  mutation PresignedUrl($fileName: String!) {
    presignedUrl: getPresignedUrl(fileName: $fileName) {
      url
      key
    }
  }
`);

export const CoffeeCam: React.FC = () => {
  const cameraRef = useRef<React.ComponentRef<typeof CameraView>>(null);

  const { data, mutate, isPending } = useMutation({
    mutationFn: async (picture: CameraCapturedPicture) => {
      const { pathname } = new URL(picture.uri);
      const fileName = pathname.split("/").pop() || "image";
      const { presignedUrl } = await client.request(PresignedUrlMutation, {
        fileName,
      });

      const blob = await fetch(picture.uri).then((res) => res.blob());
      await fetch(presignedUrl.url, {
        method: "PUT",
        body: blob,
      });

      return client.request(CreatePostFromImageMutation, {
        image: presignedUrl.key,
      });
    },
  });

  if (data) {
    return (
      <SafeAreaView>
        <TextInput defaultValue={data.createPostFromImage.title} />
      </SafeAreaView>
    );
  }

  return (
    <>
      <CameraView ref={cameraRef} style={{ flex: 1 }} />
      <SafeAreaView
        edges={["bottom", "left", "right"]}
        style={{
          position: "absolute",
          insetInline: 0,
          bottom: 0,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Pressable
          disabled={isPending}
          className="size-16 rounded-full bg-white"
          onPress={async () => {
            if (!cameraRef.current) {
              return;
            }

            const picture = await cameraRef.current.takePictureAsync({
              quality: 0.75,
            });

            mutate(picture);
          }}
        />
      </SafeAreaView>
    </>
  );
};
