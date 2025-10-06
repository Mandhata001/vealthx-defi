import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import initSentry from "./sentry.js";

// Initialize Sentry for error monitoring
initSentry();

// Configure supported wallets
const wallets = [
  new PetraWallet(),
  // Add more wallets here as needed
];

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary showDetails={false}>
      <AptosWalletAdapterProvider
        plugins={wallets}
        autoConnect={false}
        onError={(error) => {
          // Safely handle wallet adapter errors
          if (error && typeof error === "object") {
            console.error("Wallet adapter error:", error);
            // Don't throw for user rejections or undefined errors
            if (
              error.message?.includes("rejected") ||
              error.message?.includes("User denied")
            ) {
              return; // Silent fail for user rejections
            }
          }
        }}
      >
        <App />
      </AptosWalletAdapterProvider>
    </ErrorBoundary>
  </StrictMode>
);
