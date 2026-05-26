import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/core": {
        target: "http://localhost:4100",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/core/, "")
      },
      "/en3": {
        target: "http://localhost:4101",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/en3/, "")
      }
    }
  }
});
