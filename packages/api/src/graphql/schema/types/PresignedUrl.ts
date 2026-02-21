import { extname } from "node:path";
import { builder } from "../builder";

type PresignedUrl = {
  url: string;
  key: string;
};

const PresignedUrlRef = builder
  .objectRef<PresignedUrl>("PresignedUrl")
  .implement({
    fields: (t) => ({
      url: t.exposeString("url"),
      key: t.exposeString("key"),
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
        fileName: t.arg.string({ required: true }),
      },
      resolve: (_, { fileName }) => {
        const ext = extname(fileName);
        const key = `${Bun.randomUUIDv7()}.${ext}`;
        return {
          key,
          url: Bun.s3.presign(key, {
            acl: "public-read",
          }),
        };
      },
    }),
);
