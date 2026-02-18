import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import type PrismaTypes from "@pothos/plugin-prisma/generated";
import { getDatamodel } from "@pothos/plugin-prisma/generated";
import WithInputPlugin from "@pothos/plugin-with-input";
import { createRemoteJWKSet, jwtVerify } from "jose";
import type { User } from "../../generated/prisma/client";
import { prisma } from "../prisma";

export type Context = {
  user: User | null;
};

const builder = new SchemaBuilder<{
  DefaultFieldNullability: false;
  Context: Context;
  PrismaTypes: PrismaTypes;
}>({
  defaultFieldNullability: false,
  plugins: [PrismaPlugin, WithInputPlugin],
  prisma: {
    client: prisma,
    dmmf: getDatamodel(),
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
  }),
});

builder.queryType({
  fields: (t) => ({
    me: t.prismaField({
      type: "User",
      nullable: true,
      resolve: (_, __, ___, { user }) => user,
    }),
    posts: t.prismaField({
      type: ["Post"],
      resolve: (query) =>
        prisma.post.findMany({
          ...query,
          orderBy: {
            id: "desc",
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
        const { payload } = await jwtVerify(idToken, APPLE_JWKS, {
          issuer: "https://appleid.apple.com",
          audience: "ca.pleasantcoffee.app",
          algorithms: ["RS256"],
        });

        if (!payload.sub) {
          throw new Error("invalid token");
        }

        let user = await prisma.user.findFirst({
          where: {
            appleId: payload.sub,
          },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: "test@test.com",
              appleId: payload.sub,
            },
          });
        }

        return user.email;
      },
    }),
    createPost: t.prismaFieldWithInput({
      type: "Post",
      input: {
        title: t.input.string({ required: true }),
      },
      resolve: async (_, __, { input }, { user }) => {
        if (!user) {
          throw new Error("oh no");
        }

        return prisma.post.create({
          data: {
            title: input.title,
            author: {
              connect: user,
            },
          },
        });
      },
    }),
  }),
});

export const schema = builder.toSchema();
