/** Mutations */

import { prisma } from "~/prisma";
import { createJWT } from "~/utils/auth";
import { builder } from "../builder";

builder.mutationFields((t) => ({
  createUser: t.fieldWithInput({
    type: "String",
    input: {
      email: t.input.string({ required: true }),
      password: t.input.string({ required: true }),
      name: t.input.string(),
    },
    resolve: async (_, { input }) => {
      // Check if user with email already exists
      const existingUser = await prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      const hashedPassword = await Bun.password.hash(input.password, {
        algorithm: "bcrypt",
      });

      const user = await prisma.user.create({
        data: {
          email: input.email,
          password: hashedPassword,
          name: input.name,
        },
      });

      const token = await createJWT(user, process.env.JWT_SECRET);

      return token;
    },
  }),
  signInWithEmailPassword: t.fieldWithInput({
    type: "String",
    input: {
      email: t.input.string({ required: true }),
      password: t.input.string({ required: true }),
    },
    resolve: async (_, { input }) => {
      const user = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (!user || !user.password) {
        throw new Error("Invalid email or password");
      }

      const isValidPassword = await Bun.password.verify(
        input.password,
        user.password,
      );

      if (!isValidPassword) {
        throw new Error("Invalid email or password");
      }

      return createJWT(user, process.env.JWT_SECRET);
    },
  }),
}));
