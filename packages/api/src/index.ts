import { createYoga } from "graphql-yoga";
import { jwtVerify } from "jose";
import { schema } from "./graphql/schema";
import type { Context } from "./graphql/schema/builder";
import { prisma } from "./prisma";
import { encodeSecret } from "./utils/auth";

const yoga = createYoga<{}, Context>({
  schema,
  context: async ({ request }) => {
    const token = request.headers
      .get("Authorization")
      ?.match(/^bearer (\S+)$/i)?.[1];

    try {
      if (!token) {
        throw new Error("no token provided");
      }

      const secret = encodeSecret(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      const user = await prisma.user.findUniqueOrThrow({
        where: {
          id: Number(payload.sub),
        },
      });

      return {
        user,
      };
    } catch {
      return {
        user: null,
      };
    }
  },
});

const server = Bun.serve({ fetch: yoga });

console.info(
  `Server is running on ${new URL(
    yoga.graphqlEndpoint,
    `http://${server.hostname}:${server.port}`,
  )}`,
);
