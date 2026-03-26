import { useForm } from "@tanstack/react-form";
import { Text, View } from "react-native";
import { z } from "zod";
import { Button, FieldInfo, Input, PasswordInput } from "~/components/ui";
import { useCreateUser } from "~/hooks/mutations/useCreateUser";

const formSchema = z
  .object({
    email: z.email({ error: "Please enter a valid email address" }),
    password: z
      .string()
      .min(8, { error: "Password must be at least 8 characters long" }),
    confirmPassword: z
      .string()
      .min(8, { error: "Password must be at least 8 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password fields must match",
  });

export const SignupForm: React.FC = () => {
  const { mutate } = useCreateUser();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value: { email, password } }) => {
      try {
        mutate({ email, password });
      } catch (error) {
        console.error("Error creating user:", error);
      }
    },
    validators: {
      onSubmitAsync: formSchema,
    },
  });

  return (
    <View className="flex-col justify-center gap-4">
      <form.Field name="email">
        {(field) => (
          <>
            <Text>Email</Text>
            <Input
              className="rounded-md bg-white p-2"
              placeholder="j.doe@email.com"
              value={field.state.value}
              onChangeText={field.handleChange}
            />
            <FieldInfo field={field} />
          </>
        )}
      </form.Field>
      <form.Field name="password">
        {(field) => (
          <>
            <Text>Password</Text>
            <PasswordInput
              value={field.state.value}
              onChangeText={field.handleChange}
            />
            <FieldInfo field={field} />
          </>
        )}
      </form.Field>
      <form.Field name="confirmPassword">
        {(field) => (
          <>
            <Text>Confirm Password</Text>
            <PasswordInput
              value={field.state.value}
              onChangeText={field.handleChange}
              placeholder="Confirm your password"
            />
            <FieldInfo field={field} />
          </>
        )}
      </form.Field>
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <>
            <Button
              onPress={() => form.handleSubmit()}
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </>
        )}
      </form.Subscribe>
    </View>
  );
};
