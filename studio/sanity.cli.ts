import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: "ko8gzdnf",
    dataset: "production",
  },
  typegen: {
    enabled: true,
    path: "../web/src/**/*.{ts,tsx}",
    schema: "schema.json",
    generates: "../web/sanity.types.ts",
    overloadClientMethods: true,
  },
});
