import { useMutation } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import { graphql } from "gql.tada";
import { client } from "~/gql";

const CreateUserMutation = graphql(`
  mutation CreateUser($email: String!, $password: String!) {
    createUser(input: { email: $email, password: $password })
  }
`);

type UserCredentials = {
  email: string;
  password: string;
};

const createUser = async ({ email, password }: UserCredentials) => {
  try {
    const res = await client.request(CreateUserMutation, {
      email,
      password,
    });

    SecureStore.setItemAsync("token", res.createUser as string);
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const useCreateUser = () =>
  useMutation({
    mutationKey: ["createUser"],
    mutationFn: createUser,
    onSuccess: (data) => {
      console.log("User created successfully:", data);
    },
  });
