import { defineConfig } from "rollup";

const config = defineConfig({
  input: "./src/index.js",
  output: {
    name: "Vue2",
    file: "./dist/main.js",
    format: "umd",
    sourcemap: true,
  },
});

export default config;
