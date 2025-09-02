import React, { useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import DepositForm from "./components/DepositForm.jsx";
import BorrowForm from "./components/BorrowForm.jsx";
import VaultViewer from "./components/VaultViewer.jsx";
import PoolStatsEnhanced from "./components/PoolStatsEnhanced.jsx";
import YieldChart from "./components/YieldChart.jsx";
import { APP_NAME, APP_DESCRIPTION } from "./lib/constants";

function App() {
  const { account, connect, disconnect, connecting, connected } = useWallet();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(false); // Changed from true to false
  const [walletError, setWalletError] = useState("");

  // Remove artificial loading delay for better LCP
  useEffect(() => {
    // Quick wallet detection
    if (window.aptos) {
      console.log("✅ Petra wallet detected");
    } else {
      console.log("❌ Petra wallet not found");
      setWalletError("Please install Petra wallet extension");
    }
  }, []);

  const truncateAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleConnect = async () => {
    try {
      setWalletError("");
      console.log("🔄 Attempting wallet connection...");
      await connect();
      console.log("✅ Wallet connected successfully");
    } catch (error) {
      console.error("❌ Wallet connection failed:", error);
      setWalletError(`Connection failed: ${error.message}`);
    }
  };

  const TabButton = ({ id, label, icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`group relative flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
        isActive
          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105"
          : "text-gray-300 hover:text-white hover:bg-white/10 border border-white/20 hover:border-white/40"
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-semibold">{label}</span>
    </button>
  );

  // Remove loading screen for better LCP
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-300/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Simplified background - remove heavy animations for better performance */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-purple-900/30 to-slate-900/50"></div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-sm bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold text-white">V</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {APP_NAME}
                </h1>
                <p className="text-purple-200 text-sm">
                  Next-Gen DeFi Protocol
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {account ? (
                <div className="flex items-center space-x-4">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-white font-mono text-sm">
                        {truncateAddress(account.address)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={disconnect}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-200 hover:text-white border border-red-500/30 px-4 py-2 rounded-xl font-medium transition-all duration-200"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={handleConnect}
                    disabled={connecting}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {connecting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Connecting...</span>
                      </div>
                    ) : (
                      "Connect Wallet"
                    )}
                  </button>
                  {walletError && (
                    <p className="text-red-400 text-xs text-center max-w-48">
                      {walletError}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!account ? (
          <div className="text-center py-16">
            <div className="space-y-6">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <span className="text-3xl">🔗</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">
                Connect Your Wallet
              </h2>
              <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
                Access instant RWA liquidity and advanced yield strategies on
                Aptos
              </p>
              <button
                onClick={handleConnect}
                disabled={connecting}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-12 py-4 rounded-xl font-bold text-xl transition-all duration-200 disabled:opacity-50"
              >
                {connecting ? "Connecting..." : "Launch DeFi Dashboard"}
              </button>

              {/* Wallet Detection Status */}
              <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-xl max-w-md mx-auto">
                <h3 className="text-white font-semibold mb-2">
                  Wallet Status:
                </h3>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-200">Petra Extension:</span>
                    <span
                      className={
                        window.aptos ? "text-green-400" : "text-red-400"
                      }
                    >
                      {window.aptos ? "✅ Detected" : "❌ Not Found"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-200">Connection:</span>
                    <span
                      className={
                        connected ? "text-green-400" : "text-yellow-400"
                      }
                    >
                      {connected ? "✅ Connected" : "⏳ Pending"}
                    </span>
                  </div>
                </div>
                {!window.aptos && (
                  <div className="mt-3 p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                    <p className="text-orange-200 text-xs">
                      Please install Petra wallet extension and refresh this
                      page
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Navigation Tabs */}
            <div className="flex flex-wrap justify-center gap-4">
              <TabButton
                id="dashboard"
                label="Dashboard"
                icon="📊"
                isActive={activeTab === "dashboard"}
                onClick={setActiveTab}
              />
              <TabButton
                id="deposit"
                label="Deposit"
                icon="💰"
                isActive={activeTab === "deposit"}
                onClick={setActiveTab}
              />
              <TabButton
                id="borrow"
                label="Borrow"
                icon="🏦"
                isActive={activeTab === "borrow"}
                onClick={setActiveTab}
              />
              <TabButton
                id="vault"
                label="Vault"
                icon="🔐"
                isActive={activeTab === "vault"}
                onClick={setActiveTab}
              />
              <TabButton
                id="analytics"
                label="Analytics"
                icon="📈"
                isActive={activeTab === "analytics"}
                onClick={setActiveTab}
              />
            </div>

            {/* Tab Content */}
            <div className="mt-8">
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  <PoolStatsEnhanced />
                  <YieldChart />
                </div>
              )}

              {activeTab === "deposit" && <DepositForm />}
              {activeTab === "borrow" && <BorrowForm />}
              {activeTab === "vault" && <VaultViewer />}

              {activeTab === "analytics" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <PoolStatsEnhanced />
                  <YieldChart />
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Simple Footer */}
      <footer className="relative z-10 mt-16 backdrop-blur-sm bg-white/5 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-purple-300">
              © 2025 VealthX. Built on Aptos blockchain.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
