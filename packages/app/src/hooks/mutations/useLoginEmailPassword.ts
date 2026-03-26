import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import { graphql } from "gql.tada";
import { client } from "~/gql";
import { sessionQuery } from "~/queries/session";

const LoginEmailPasswordMutation = graphql(`
  mutation LoginEmailPassword($email: String!, $password: String!) {
    signInWithEmailPassword(input: { email: $email, password: $password })
  }
`);

type UserCredentials = {
  email: string;
  password: string;
};

const loginEmailPassword = async ({ email, password }: UserCredentials) => {
  try {
    const res = await client.request(LoginEmailPasswordMutation, {
      email,
      password,
    });

    await SecureStore.setItemAsync(
      "token",
      res.signInWithEmailPassword as string,
    );
    return res;
  } catch (error) {
    throw new Error("Login failed");
  }
};

export const useLoginEmailPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: loginEmailPassword,
    onSuccess: async () => {
      // Invalidate the session query to refetch user data
      await queryClient.invalidateQueries({ queryKey: sessionQuery.queryKey });
    },
  });
};
