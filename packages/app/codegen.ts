import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "../api/schema.graphql",
  generates: {
    "./schema.graphql": {
      plugins: ["schema-ast"],
    },
  },
};

export default config;
