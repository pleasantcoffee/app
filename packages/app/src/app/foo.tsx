import { useQueryClient } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import { Pressable, Text } from "react-native";
import { sessionQuery } from "~/queries/session";

const FooScreen: React.FC = () => {
  const queryClient = useQueryClient();
  return (
    <Text>
      <Pressable
        onPress={async () => {
          await SecureStore.deleteItemAsync("token");
          queryClient.setQueryData(sessionQuery.queryKey, {
            me: null,
          });
        }}
      >
        <Text>Log out</Text>
      </Pressable>
    </Text>
  );
};

export default FooScreen;
