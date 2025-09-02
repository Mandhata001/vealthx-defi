import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Performance optimizations
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          wallet: [
            "@aptos-labs/wallet-adapter-react",
            "@aptos-labs/wallet-adapter-ant-design",
          ],
          charts: ["recharts"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },

  // Development performance
  server: {
    hmr: {
      overlay: false, // Reduce dev overlay impact
    },
  },

  esbuild: {
    loader: "jsx",
    include: /src\/.*\.[jt]sx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
});
