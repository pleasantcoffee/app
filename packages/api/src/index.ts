import { createYoga } from "graphql-yoga";
import { jwtVerify } from "jose";
import { type Context, schema } from "./graphql/schema";
import { prisma } from "./prisma";

const yoga = createYoga<{}, Context>({
  schema,
  context: async ({ request }) => {
    const token = request.headers
      .get("Authorization")
      ?.match(/^bearer (\S+)$/i)?.[0];

    if (!token) {
      return {
        user: null,
      };
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    const user = await prisma.user.findUnique({
      where: {
        id: Number(payload.sub),
      },
    });

    return {
      user,
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
