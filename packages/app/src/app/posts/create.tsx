import { useCameraPermissions } from "expo-camera";
import { ActivityIndicator, Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CoffeeCam } from "~/components/CoffeeCam";

const CreatePostScreen: React.FC = () => {
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

  return <CoffeeCam />;
};

export default CreatePostScreen;
