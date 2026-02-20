import { createRemoteJWKSet, jwtVerify, SignJWT } from "jose";
import { prisma } from "../../prisma";
import { builder } from "./builder";
import "./types";

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

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const jwt = new SignJWT()
          .setProtectedHeader({ alg: "HS256" })
          .setIssuedAt()
          .setSubject(user.id.toString())
          .setExpirationTime("2h")
          .sign(secret);

        return jwt;
      },
    }),
  }),
});

export const schema = builder.toSchema();
