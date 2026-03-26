import { useForm } from "@tanstack/react-form";
import { Text, View } from "react-native";
import { z } from "zod";
import { Button, FieldInfo, Input } from "~/components/ui";
import { useLoginEmailPassword } from "~/hooks/mutations/useLoginEmailPassword";

const formSchema = z.object({
  email: z.email({ error: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters long" }),
});

export const LoginForm: React.FC = () => {
  const { mutate, isPending } = useLoginEmailPassword();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value: { email, password } }) => {
      try {
        mutate({ email, password });
      } catch (error) {
        console.error("Unable to log in:", error);
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
              className="rounded-md bg-white p-4"
              placeholder="j.doe@email.com"
              keyboardType="email-address"
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
            <Input
              className="rounded-md bg-white p-2"
              keyboardType="visible-password"
              value={field.state.value}
              onChangeText={field.handleChange}
              secureTextEntry
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
              disabled={!canSubmit || isSubmitting || isPending}
            >
              {isSubmitting || isPending ? "Submitting..." : "Submit"}
            </Button>
          </>
        )}
      </form.Subscribe>
    </View>
  );
};
