import * as SecureStore from "expo-secure-store";
import { GraphQLClient } from "graphql-request";

export const client = new GraphQLClient("http://localhost:3000/graphql", {
  headers: () => {
    const token = SecureStore.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
    };
  },
});
