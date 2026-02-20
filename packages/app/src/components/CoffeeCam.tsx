import { CameraView } from "expo-camera";
import { useRouter } from "expo-router";
import { useRef } from "react";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const CoffeeCam: React.FC = () => {
  const router = useRouter();
  const cameraRef = useRef<React.ComponentRef<typeof CameraView>>(null);
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
          className="size-16 rounded-full bg-white"
          onPress={async () => {
            if (!cameraRef.current) {
              return;
            }

            // const picture = await cameraRef.current.takePictureAsync({
            //   quality: 0.5,
            //   base64: true,
            // });

            router.replace("/form");
          }}
        />
      </SafeAreaView>
    </>
  );
};
