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
    host: true,
    port: 5173,
  },

  // ✅ Build optimizations for performance
  build: {
    rollupOptions: {
      output: {
        // Split vendor chunks for better caching
        manualChunks: {
          vendor: ["react", "react-dom"],
          animation: ["gsap", "@gsap/react", "@studio-freight/lenis"],
          icons: ["react-icons"],
          router: ["react-router-dom"],
        },
        // Optimize chunk names
        chunkFileNames: "js/[name]-[hash].js",
        entryFileNames: "js/[name]-[hash].js",
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split(".");
          const ext = info[info.length - 1];
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/.test(assetInfo.name)) {
            return `assets/images/[name]-[hash].${ext}`;
          }
          if (/\.(css)$/.test(assetInfo.name)) {
            return `assets/css/[name]-[hash].${ext}`;
          }
          return `assets/[name]-[hash].${ext}`;
        },
      },
    },
    // Minification options
    minify: "esbuild",
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
  },

  // ✅ Preview server config
  preview: {
    port: 4173,
    host: true,
  },
});
