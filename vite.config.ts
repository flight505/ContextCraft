import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// List of tree-sitter packages (adjust if you use more/less)
const treeSitterPackages = [
  "tree-sitter",
  "tree-sitter-javascript",
  "tree-sitter-typescript",
  "tree-sitter-python",
  "tree-sitter-css",
  "tree-sitter-html",
  // Add any other tree-sitter-* language packages you install
];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./", // Relative base path for assets
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    // Ensure native modules are treated as external during build
    rollupOptions: {
      external: [
        "electron", // Already implicitly external but good to be explicit
        ...treeSitterPackages,
        // Add any other native node modules here
      ],
    },
  },
  // Add this section to exclude tree-sitter from dependency pre-bundling
  optimizeDeps: {
    exclude: [
      ...treeSitterPackages,
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
