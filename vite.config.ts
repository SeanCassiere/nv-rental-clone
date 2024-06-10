import cp from "node:child_process";
import path from "node:path";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import packageJson from "./package.json";

const commitHash = cp
  .execSync("git rev-parse --short HEAD")
  .toString()
  .replace("\n", "");

const APP_VERSION = `${packageJson.version}-${commitHash}`;

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [
      TanStackRouterVite({
        experimental: {
          enableCodeSplitting: true,
        },
      }),
      react({
        babel: {
          plugins: [
            [
              "babel-plugin-react-compiler",
              { runtimeModule: "react-compiler-runtime" },
            ],
          ],
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
      sourcemap: true,
    },
    define: {
      "import.meta.env.APP_VERSION": JSON.stringify(APP_VERSION),
    },
  };
});
