import { hash } from "bcryptjs";
import { prisma } from "~/prisma";
import { builder } from "../builder";

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

/** Queries */

builder.queryField("me", (t) =>
  t.prismaField({
    type: "User",
    nullable: true,
    resolve: (_, __, ___, { user }) => user,
  }),
);

/** Mutations */

builder.mutationFields((t) => ({
  createUser: t.prismaFieldWithInput({
    type: "User",
    input: {
      email: t.input.string({ required: true }),
      password: t.input.string({ required: true }),
      name: t.input.string(),
    },
    resolve: async (_, __, { input }) => {
      const hashedPassword = await hash(input.password, 10);

      return prisma.user.create({
        data: {
          email: input.email,
          password: hashedPassword,
          name: input.name,
        },
      });
    },
  }),
}));
