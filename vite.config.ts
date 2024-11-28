import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/Character-Planner/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: true,
  },
});
