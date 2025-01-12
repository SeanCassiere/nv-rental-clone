import cp from "node:child_process";
import path from "node:path";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import packageJson from "./package.json";

const commitHash = cp
  .execSync("git rev-parse --short HEAD")
  .toString()
  .replace("\n", "");

const APP_VERSION = `${packageJson.version}-${commitHash}`;

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [
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
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 3000,
    },
    build: {
      sourcemap: command === "serve",
    },
    define: {
      "import.meta.env.APP_VERSION": JSON.stringify(APP_VERSION),
    },
  };
});
