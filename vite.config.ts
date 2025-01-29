// https://vitejs.dev/config/
import cp from "node:child_process";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

import packageJson from "./package.json";

const commitHash = cp
  .execSync("git rev-parse --short HEAD")
  .toString()
  .replace("\n", "");

const APP_VERSION = `${packageJson.version}-${commitHash}`;

// Add the ts-expect-error comment since the types for vite-tsconfig-paths are not up to date
export default defineConfig(({ command }) => {
  return {
    server: {
      port: 3000,
    },
    build: {
      sourcemap: command === "serve",
    },
    define: {
      "import.meta.env.APP_VERSION": JSON.stringify(APP_VERSION),
    },
    plugins: [
      viteTsConfigPaths(),
      TanStackRouterVite({
        routesDirectory: "./src/routes",
        generatedRouteTree: "./src/route-tree.gen.ts",
        routeFileIgnorePrefix: "-",
        quoteStyle: "double",
        autoCodeSplitting: true,
        indexToken: "_index",
        routeToken: "_route",
        disableManifestGeneration: true,
      }),
      viteReact({
        babel: {
          plugins: [["babel-plugin-react-compiler", {}]],
        },
      }),
    ],
  };
});
