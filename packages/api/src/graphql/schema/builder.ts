import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import ScopeAuthPlugin from "@pothos/plugin-scope-auth";
import WithInputPlugin from "@pothos/plugin-with-input";
import type PrismaTypes from "../../generated/pothos-prisma-types";
import { getDatamodel } from "../../generated/pothos-prisma-types";
import type { User } from "../../generated/prisma/client";
import { prisma } from "../../prisma";

export type Context = {
  user: User | null;
};

export const builder = new SchemaBuilder<{
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
