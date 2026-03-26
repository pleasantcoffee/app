import { View } from "react-native";
import { SignupForm } from "~/components/forms/SignupForm";
import { Heading } from "~/components/ui";

const SignupScreen: React.FC = () => {
  return (
    <View className="flex-1 flex-col justify-center gap-10 px-12">
      <Heading>Create an Account</Heading>
      <SignupForm />
    </View>
  );
};

export default SignupScreen;
