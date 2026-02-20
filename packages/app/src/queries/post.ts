import { queryOptions } from "@tanstack/react-query";
import { graphql } from "gql.tada";
import { client } from "~/gql";

const PostQuery = graphql(`
  query Post($postId: Int!) {
    post(postId: $postId) {
      title
    }
  }
`);

export const postQuery = (postId: number) =>
  queryOptions({
    queryKey: ["post", postId],
    queryFn: () => client.request(PostQuery, { postId }),
  });
