import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { ActivityIndicator, Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FooScreen: React.FC = () => {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return (
      <SafeAreaView>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView>
        <Text>we need permission to do it</Text>
        <Pressable onPress={requestPermission}>
          <Text>grant permission</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <>
      <CameraView style={{ flex: 1 }} />
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
          onPress={() => {
            router.replace("/form");
          }}
        />
      </SafeAreaView>
    </>
  );
};

export default FooScreen;
