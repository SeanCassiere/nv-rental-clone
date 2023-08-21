import path from "path";
import react from "@vitejs/plugin-react";
import eslintPlugin from "vite-plugin-eslint";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [eslintPlugin(), react()],
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
});
