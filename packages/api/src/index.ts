import { createYoga } from "graphql-yoga";
import { jwtVerify } from "jose";
import { until } from "until-async";
import { type Context, schema } from "./graphql/schema";
import { prisma } from "./prisma";

const yoga = createYoga<{}, Context>({
  schema,
  context: async ({ request }) => {
    const token = request.headers
      .get("Authorization")
      ?.match(/^bearer (\S+)$/i)?.[1];

    if (!token) {
      return {
        user: null,
      };
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const [error, data] = await until(() => jwtVerify(token, secret));

    if (error) {
      return {
        user: null,
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        id: Number(data.payload.sub),
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
