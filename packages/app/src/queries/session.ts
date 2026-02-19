import { queryOptions } from "@tanstack/react-query";
import { graphql } from "gql.tada";
import { client } from "~/gql";

const SessionQuery = graphql(`
  query Session {
    me {
      name
    }
  }
`);

export const sessionQuery = queryOptions({
  queryKey: ["session"],
  queryFn: () => client.request(SessionQuery),
});
