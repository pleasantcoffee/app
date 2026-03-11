import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { printSchema } from "graphql";
import { schema } from "~/graphql";

const sdl = printSchema(schema);
const outputPath = resolve(import.meta.dir, "../../schema.graphql");

writeFileSync(outputPath, sdl);
console.log(`✓ Schema generated at ${outputPath}`);
