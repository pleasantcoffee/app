import { useForm } from "@tanstack/react-form";
import { Text, View } from "react-native";
import { z } from "zod";
import {
  Button,
  FieldInfo,
  FormInfo,
  Input,
  PasswordInput,
} from "~/components/ui";
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
    onSubmit: ({ value: { email, password }, formApi }) => {
      mutate(
        { email, password },
        {
          onError: (error) => {
            formApi.setErrorMap({
              onSubmit: {
                form: error.message,
                fields: {},
              },
            });
          },
        },
      );
    },
    validators: { onSubmitAsync: formSchema },
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
            <PasswordInput
              value={field.state.value}
              onChangeText={field.handleChange}
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
      <form.Subscribe selector={(state) => state.errorMap.onSubmit}>
        {(formError) => {
          return <FormInfo formError={formError} />;
        }}
      </form.Subscribe>
    </View>
  );
};
