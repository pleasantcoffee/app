import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AppleAuthenticationButton,
  AppleAuthenticationButtonStyle,
  AppleAuthenticationButtonType,
  AppleAuthenticationScope,
  signInAsync,
} from "expo-apple-authentication";
import { CodedError } from "expo-modules-core";
import * as SecureStore from "expo-secure-store";
import { graphql, type VariablesOf } from "gql.tada";
import { client } from "~/gql";
import { sessionQuery } from "~/queries/session";

const SignInWithAppleMutation = graphql(`
  mutation SignInWithApple($idToken: String!) {
    signInWithApple(idToken: $idToken)
  }
`);

export const SSOLogin: React.FC = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (variables: VariablesOf<typeof SignInWithAppleMutation>) =>
      client.request(SignInWithAppleMutation, variables),
    onSuccess: async (data) => {
      await SecureStore.setItemAsync("token", data.signInWithApple);
      queryClient.invalidateQueries(sessionQuery);
    },
  });
  return (
    <AppleAuthenticationButton
      buttonType={AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthenticationButtonStyle.BLACK}
      style={{ height: 40 }}
      onPress={async () => {
        try {
          const credential = await signInAsync({
            requestedScopes: [
              AppleAuthenticationScope.FULL_NAME,
              AppleAuthenticationScope.EMAIL,
            ],
          });

          if (credential.identityToken) {
            mutate({
              idToken: credential.identityToken,
            });
          }
        } catch (error) {
          if (error instanceof CodedError) {
            if (error.code === "ERR_REQUEST_CANCELED") {
              // handle that the user canceled the sign-in flow
            } else {
              // handle other errors
            }
          }
        }
      }}
    />
  );
};
