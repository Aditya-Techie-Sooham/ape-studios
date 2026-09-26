import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: resolve(process.cwd(), "index.html"),
        about: resolve(process.cwd(), "about/index.html"),
        services: resolve(process.cwd(), "services/index.html"),
        work: resolve(process.cwd(), "work/index.html"),
      },
    },
  },
});