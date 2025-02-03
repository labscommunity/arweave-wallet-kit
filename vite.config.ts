import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import react from "@vitejs/plugin-react";
import banner from "vite-plugin-banner";
import { defineConfig } from "vite";
import linaria from "@linaria/vite";
import dts from "vite-plugin-dts";
import path from "node:path";

export default defineConfig({
  plugins: [
    react(),
    dts({ insertTypesEntry: true }),
    linaria({
      include: ["**/*.{ts,tsx}"],
      babelOptions: {
        presets: [
          ["@babel/preset-env", { targets: { node: "current" } }],
          "@babel/preset-typescript",
          "@babel/preset-react"
        ]
      }
    }),
    cssInjectedByJsPlugin()
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "arweave-wallet-kit",
      formats: ["es", "umd"],
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ["react", "react-dom", "arweave", "@othent/kms", "@permaweb/aoconnect"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM"
        }
      }
    }
  }
});
