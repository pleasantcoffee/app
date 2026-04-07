import { builder } from "../builder";

builder.prismaObject("Follows", {
  fields: (t) => ({
    createdAt: t.int({
      resolve: (follow) => follow.createdAt.getTime(),
    }),
    follower: t.relation("follower"),
    following: t.relation("following"),
  }),
});
