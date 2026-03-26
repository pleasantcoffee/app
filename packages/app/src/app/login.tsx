import { Image } from "expo-image";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { LoginForm } from "~/components/forms/LoginForm";
import { SSOLogin } from "~/components/SSOLogin";
import { DefaultSheetView, Heading } from "~/components/ui";

const LoginScreen: React.FC = () => {
  return (
    <DefaultSheetView className="flex-col gap-10">
      <Image source="assets/images/flower.svg" />
      <Heading>Log into your Account</Heading>
      <LoginForm />
      <View className="flex items-center">
        <Text>- Or -</Text>
      </View>
      <SSOLogin />
      <Text className="text-center">
        Don't have an account?{" "}
        <Link href="/sign-up" className="overflow-hidden rounded-md">
          <Text className="text-purple-600">Sign up</Text>
        </Link>
      </Text>
    </DefaultSheetView>
  );
};

export default LoginScreen;
