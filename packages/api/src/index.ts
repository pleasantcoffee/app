import { createYoga } from "graphql-yoga";
import { type Context, schema } from "./graphql/schema";

const yoga = createYoga<{}, Context>({
  schema,
  context: async ({ request }) => {
    console.log(request.headers.get("Authorization"));
    return {
      user: null,
    };
  },
});

const server = Bun.serve({
  fetch: yoga,
});

console.info(
  `Server is running on ${new URL(
    yoga.graphqlEndpoint,
    `http://${server.hostname}:${server.port}`,
  )}`,
);
