import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": "/src/assets",
      "@components": "/src/components",
    },
  },

  // ✅ Enable LAN access
  server: {
    host: true, // allows access from other devices via IP
    port: 5173, // optional: same as default
  },
});
