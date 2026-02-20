import { GoogleGenAI } from "@google/genai";
import z from "zod";
import { prisma } from "../../../prisma";
import { builder } from "../builder";

builder.prismaObject("Post", {
  name: "Post",
  fields: (t) => ({
    id: t.exposeInt("id"),
    title: t.exposeString("title"),
    author: t.relation("author"),
  }),
});

builder.queryFields((t) => ({
  post: t
    .withAuth({
      loggedIn: true,
    })
    .prismaField({
      type: "Post",
      nullable: true,
      args: {
        postId: t.arg.int({ required: true }),
      },
      resolve: (query, _, { postId }) => {
        return prisma.post.findUnique({
          ...query,
          where: {
            id: postId,
          },
        });
      },
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
}));

const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const CoffeeProductSchema = z
  .object({
    containerType: z
      .enum(["bag", "box", "tin", "other"])
      .optional()
      .describe("The physical format of the coffee packaging"),
    roaster: z
      .string()
      .optional()
      .describe("The name of the coffee roasting company (e.g., Rogue Wave)"),
    name: z
      .string()
      .optional()
      .describe(
        "The specific name of the roast or espresso blend (e.g., Colombia Geisha)",
      ),
    origin: z
      .string()
      .optional()
      .describe(
        "The country and/or specific region where the coffee was grown",
      ),
    producer: z
      .string()
      .optional()
      .describe(
        "The individual producer, family, or cooperative who grew the coffee (e.g., Herrera Family)",
      ),
    farm: z
      .string()
      .optional()
      .describe("The specific estate or farm name (e.g., Las Margaritas)"),
    varietal: z
      .array(z.string())
      .optional()
      .describe(
        "List of coffee plant species/varietals (e.g., Gesha, Bourbon, SL28)",
      ),
    process: z
      .string()
      .optional()
      .describe(
        "The processing method used (e.g., Natural, Washed, Anaerobic, Honey)",
      ),
    altitude: z
      .string()
      .optional()
      .describe(
        "The elevation range, usually noted in m.a.s.l. (meters above sea level)",
      ),
    roastLevel: z
      .enum(["light", "light-medium", "medium", "medium-dark", "dark"])
      .optional()
      .describe(
        "The degree of roast as specified on the label; if not explicitly stated, infer based on descriptions",
      ),
    tastingNotes: z
      .array(z.string())
      .optional()
      .describe(
        "The flavor profile notes listed by the roaster (e.g., Guava, Plum, Jasmine)",
      ),
    roastDate: z
      .string()
      .optional()
      .describe(
        "The date the coffee was roasted, often stamped or handwritten",
      ),
    weight: z
      .string()
      .optional()
      .describe(
        "The net weight of the coffee in the container (e.g., 100g, 250g, 12oz)",
      ),
  })
  .nullable();

builder.mutationFields((t) => ({
  createPostFromImage: t.withAuth({ loggedIn: true }).prismaField({
    type: "Post",
    args: {
      image: t.arg.string({ required: true }),
    },
    resolve: async (query, _, { image }, { user }) => {
      const response = await gemini.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: image,
            },
          },
          {
            text: "prompt here",
          },
        ],
        config: {
          responseMimeType: "application/json",
          responseJsonSchema: CoffeeProductSchema.toJSONSchema(),
        },
      });

      if (!response.text) {
        throw new Error("there was a problem");
      }

      const product = CoffeeProductSchema.parse(JSON.parse(response.text));

      return prisma.post.create({
        ...query,
        data: {
          title: product?.name ?? "",
          published: false,
          author: {
            connect: {
              id: user.id,
            },
          },
        },
      });
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
}));
