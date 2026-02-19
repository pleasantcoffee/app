import * as SecureStore from "expo-secure-store";
import { GraphQLClient } from "graphql-request";

export const client = new GraphQLClient("http://localhost:3000/graphql", {
  headers: () => {
    const headers = new Headers();

    const token = SecureStore.getItem("token");
    if (token) {
      headers.append("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});
