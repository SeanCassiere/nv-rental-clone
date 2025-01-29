// https://vitejs.dev/config/
import cp from "node:child_process";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite as tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

import packageJson from "./package.json";

const commitHash = cp
  .execSync("git rev-parse --short HEAD")
  .toString()
  .replace("\n", "");

const APP_VERSION = `${packageJson.version}-${commitHash}`;

// Add the ts-expect-error comment since the types for vite-tsconfig-paths are not up to date
export default defineConfig({
  server: {
    port: 3000,
  },
  define: {
    "import.meta.env.APP_VERSION": JSON.stringify(APP_VERSION),
  },
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    tanstackRouter({
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/route-tree.gen.ts",
      routeFileIgnorePrefix: "-",
      quoteStyle: "double",
      autoCodeSplitting: true,
      indexToken: "_index",
      routeToken: "_route",
      disableManifestGeneration: true,
    }),
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", { target: "19" }]],
      },
    }),
  ],
});
