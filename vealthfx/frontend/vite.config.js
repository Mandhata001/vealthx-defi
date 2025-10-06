import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { writeFileSync } from "fs";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      {
        name: "add-nojekyll",
        closeBundle() {
          writeFileSync("dist/.nojekyll", "");
        },
      },
    ],
    base: "/", // Changed from "/vealthx-defi/" for Vercel deployment

    // Explicitly define environment variables
    define: {
      "import.meta.env.VITE_CONTRACT_ADDRESS": JSON.stringify(
        env.VITE_CONTRACT_ADDRESS || "0x1"
      ),
      "import.meta.env.VITE_NODE_URL": JSON.stringify(
        env.VITE_NODE_URL || "https://fullnode.devnet.aptoslabs.com/v1"
      ),
      "import.meta.env.VITE_NETWORK": JSON.stringify(
        env.VITE_NETWORK || "devnet"
      ),
      "import.meta.env.VITE_COINGECKO_API_KEY": JSON.stringify(
        env.VITE_COINGECKO_API_KEY || ""
      ),
    },

    // Performance optimizations
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
            wallet: ["@aptos-labs/wallet-adapter-react"],
            charts: ["recharts"],
          },
        },
        // Increase memory limit for large bundles
        maxParallelFileOps: 2,
      },
      chunkSizeWarningLimit: 2000, // Increased to avoid warnings
      minify: "terser", // Use terser for better compression
      terserOptions: {
        compress: {
          drop_console: true, // Remove console logs in production
          drop_debugger: true,
        },
      },
      // Increase memory for build
      target: "esnext",
      sourcemap: false, // Disable sourcemaps for faster build
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
  };
});
