import React, { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

const CustomWalletSelector = ({ onClose }) => {
  const { wallets, connect } = useWallet();
  const [connectingWallet, setConnectingWallet] = useState(null);

  const handleWalletConnect = async (walletName) => {
    try {
      setConnectingWallet(walletName);
      await connect(walletName);
      if (onClose) onClose();
    } catch (error) {
      console.log("Wallet connection error:", error.message);
      // Don't show alert for user rejection
      if (
        !error.message.includes("rejected") &&
        !error.message.includes("User denied")
      ) {
        alert("Failed to connect wallet: " + error.message);
      }
    } finally {
      setConnectingWallet(null);
    }
  };

  return (
    <div className="space-y-3">
      {wallets.map((wallet) => {
        const isConnecting = connectingWallet === wallet.name;
        return (
          <button
            key={wallet.name}
            onClick={() => handleWalletConnect(wallet.name)}
            disabled={connectingWallet !== null}
            className={`w-full flex items-center space-x-3 p-3 border rounded-2xl transition-all duration-200 group ${
              isConnecting
                ? "bg-blue-500/20 border-blue-500/40 cursor-wait"
                : connectingWallet
                ? "bg-white/5 border-white/10 opacity-50 cursor-not-allowed"
                : "bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20"
            }`}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
              {isConnecting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : wallet.icon ? (
                <img
                  src={wallet.icon}
                  alt={wallet.name}
                  className="w-6 h-6 rounded"
                />
              ) : (
                <span className="text-lg">💳</span>
              )}
            </div>
            <div className="flex-1 text-left min-w-0">
              <div
                className={`font-medium truncate transition-colors ${
                  isConnecting
                    ? "text-blue-400"
                    : "text-white group-hover:text-cyan-400"
                }`}
              >
                {isConnecting ? "Connecting..." : wallet.name}
              </div>
              <div className="text-xs text-gray-400 truncate">
                {isConnecting
                  ? "Check your wallet"
                  : wallet.name === "Petra"
                  ? "Most popular • Recommended"
                  : wallet.name === "Martian"
                  ? "Multi-chain support"
                  : wallet.name === "Pontem"
                  ? "Built for Aptos"
                  : "Secure wallet"}
              </div>
            </div>
            <div
              className={`transition-colors ${
                isConnecting
                  ? "text-blue-400"
                  : "text-gray-400 group-hover:text-cyan-400"
              }`}
            >
              {isConnecting ? (
                <div className="w-4 h-4 border border-current border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </div>
          </button>
        );
      })}

      {wallets.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📱</span>
          </div>
          <p className="text-white font-medium mb-2">No wallets found</p>
          <p className="text-sm text-gray-400 mb-4">
            Install a wallet to get started
          </p>
          <a
            href="https://petra.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <span>Install Petra</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
};

export default CustomWalletSelector;
