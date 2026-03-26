import { createRemoteJWKSet, jwtVerify } from "jose";
import { prisma } from "~/prisma";
import { builder } from "./builder";
import "./types";
import { createJWT } from "~/utils/auth";

const APPLE_JWKS = createRemoteJWKSet(
  new URL("https://appleid.apple.com/auth/keys"),
);

builder.queryType({});

builder.mutationType({
  fields: (t) => ({
    signInWithApple: t.field({
      type: "String",
      args: {
        idToken: t.arg.string({ required: true }),
      },
      resolve: async (_, { idToken }) => {
        const { payload } = await jwtVerify<{
          email?: string;
        }>(idToken, APPLE_JWKS, {
          issuer: "https://appleid.apple.com",
          audience: ["ca.pleasantcoffe.app", "host.exp.Exponent"],
        });

        let user = await prisma.user.findFirst({
          where: {
            OR: [{ email: payload.email }, { appleId: payload.sub }],
          },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: payload.email,
              appleId: payload.sub,
            },
          });
        } else if (!user.appleId) {
          await prisma.user.update({
            data: {
              appleId: payload.sub,
            },
            where: {
              id: user.id,
            },
          });
        }

        const token = createJWT(user, process.env.JWT_SECRET);

        return token;
      },
    }),
  }),
});

export const schema = builder.toSchema();
