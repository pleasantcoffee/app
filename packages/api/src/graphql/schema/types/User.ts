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
    following: t.relation("following"),
    followers: t.relation("followedBy"),
  }),
});

builder.queryField("me", (t) =>
  t.prismaField({
    type: "User",
    nullable: true,
    resolve: (_, __, ___, { user }) => user,
  }),
);
