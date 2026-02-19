import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import ScopeAuthPlugin from "@pothos/plugin-scope-auth";
import WithInputPlugin from "@pothos/plugin-with-input";
import { createRemoteJWKSet, jwtVerify, SignJWT } from "jose";
import type PrismaTypes from "../generated/pothos-prisma-types";
import { getDatamodel } from "../generated/pothos-prisma-types";
import type { User } from "../generated/prisma/client";
import { prisma } from "../prisma";

export type Context = {
  user: User | null;
};

const builder = new SchemaBuilder<{
  DefaultFieldNullability: false;
  Context: Context;
  PrismaTypes: PrismaTypes;
  AuthScopes: {
    loggedIn: boolean;
  };
  AuthContexts: {
    loggedIn: Context & { user: User };
  };
}>({
  defaultFieldNullability: false,
  plugins: [ScopeAuthPlugin, PrismaPlugin, WithInputPlugin],
  prisma: {
    client: prisma,
    dmmf: getDatamodel(),
  },
  scopeAuth: {
    authScopes: async (context) => ({
      loggedIn: !!context.user,
    }),
  },
});

builder.prismaObject("Post", {
  name: "Post",
  fields: (t) => ({
    id: t.exposeInt("id"),
    title: t.exposeString("title"),
    author: t.relation("author"),
  }),
});

builder.prismaObject("User", {
  name: "User",
  fields: (t) => ({
    name: t.exposeString("name", { nullable: true }),
    posts: t.relation("posts", {
      query: {
        orderBy: {
          createdAt: "desc",
        },
      },
    }),
  }),
});

builder.queryType({
  fields: (t) => ({
    me: t.prismaField({
      type: "User",
      nullable: true,
      resolve: (_, __, ___, { user }) => user,
    }),
    posts: t
      .withAuth({
        loggedIn: true,
      })
      .prismaField({
        type: ["Post"],
        resolve: (query) =>
          prisma.post.findMany({
            ...query,
            orderBy: {
              createdAt: "desc",
            },
          }),
      }),
  }),
});

const APPLE_JWKS = createRemoteJWKSet(
  new URL("https://appleid.apple.com/auth/keys"),
);

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
    createPost: t.withAuth({ loggedIn: true }).prismaFieldWithInput({
      type: "Post",
      input: {
        title: t.input.string({ required: true }),
      },
      resolve: async (_, __, { input }, { user }) => {
        return prisma.post.create({
          data: {
            title: input.title,
            author: {
              connect: {
                id: user.id,
              },
            },
          },
        });
      },
    }),
  }),
});

export const schema = builder.toSchema();
