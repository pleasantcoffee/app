import "../global.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  AppleAuthenticationButton,
  AppleAuthenticationButtonStyle,
  AppleAuthenticationButtonType,
  AppleAuthenticationScope,
  signInAsync,
} from "expo-apple-authentication";
import * as Device from "expo-device";
import { CodedError } from "expo-modules-core";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

const queryClient = new QueryClient();

const RootLayout: React.FC = () => {
  const user = null;

  if (!user) {
    return (
      <View className="flex-1 justify-center">
        <Text>sdaf</Text>
        {Device.brand === "Apple" && (
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
                console.log(credential.identityToken);
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
        )}
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack />
      <StatusBar style="auto" />
    </QueryClientProvider>
  );
};

export default RootLayout;
