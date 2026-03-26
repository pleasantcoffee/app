import { SignupForm } from "~/components/forms/SignupForm";
import { DefaultSheetView, Heading } from "~/components/ui";

const SignupScreen: React.FC = () => {
  return (
    <DefaultSheetView className="flex-col gap-10">
      <Heading>Create an Account</Heading>
      <SignupForm />
    </DefaultSheetView>
  );
};

export default SignupScreen;
