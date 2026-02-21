import { builder } from "../builder";

const PresignedUrlRef = builder.objectRef<{ url: string; path: string }>(
  "PresignedUrl",
);

builder.objectType(PresignedUrlRef, {
  fields: (t) => ({
    url: t.exposeString("url"),
    path: t.exposeString("path"),
  }),
});

builder.mutationField("getPresignedUrl", (t) =>
  t
    .withAuth({
      loggedIn: true,
    })
    .field({
      type: PresignedUrlRef,
      args: {
        ext: t.arg.string({ required: true }),
      },
      resolve: (_, { ext }) => {
        const path = `${Bun.randomUUIDv7()}.${ext}`;
        return {
          path,
          url: Bun.s3.presign(path, {
            acl: "public-read",
          }),
        };
      },
    }),
);
