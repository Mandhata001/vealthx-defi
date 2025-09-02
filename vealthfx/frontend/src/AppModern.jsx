import React, { useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import DepositForm from "./components/DepositForm.jsx";
import BorrowForm from "./components/BorrowForm.jsx";
import VaultViewer from "./components/VaultViewer.jsx";
import PoolStatsEnhanced from "./components/PoolStatsEnhanced.jsx";
import YieldChart from "./components/YieldChart.jsx";
import { APP_NAME, APP_DESCRIPTION } from "./lib/constants";

function App() {
  const { account, connect, disconnect, connecting } = useWallet();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  const truncateAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const TabButton = ({ id, label, icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center space-x-3 px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
        isActive
          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 transform scale-105"
          : "text-gray-400 hover:text-white hover:bg-white/10 backdrop-blur-sm"
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-semibold">{label}</span>
    </button>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-purple-300/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
            <div
              className="absolute inset-0 w-24 h-24 border-4 border-transparent border-r-blue-500 rounded-full animate-spin mx-auto"
              style={{ animationDirection: "reverse", animationDuration: "1s" }}
            ></div>
          </div>
          <h2 className="mt-8 text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            VealthX
          </h2>
          <p className="mt-3 text-purple-200 text-lg">
            Initializing DeFi protocol...
          </p>
          <div className="mt-6 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-sm bg-white/10 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <span className="text-2xl font-bold text-white">V</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {APP_NAME}
                </h1>
                <p className="text-purple-200 font-medium">
                  Next-Gen DeFi Vault Protocol
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {account ? (
                <div className="flex items-center space-x-4">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                      </div>
                      <span className="text-white font-mono font-semibold">
                        {truncateAddress(account.address)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={disconnect}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 px-6 py-3 rounded-2xl transition-all duration-300 border border-red-500/20 hover:border-red-500/40 font-semibold"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={connect}
                  disabled={connecting}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {connecting ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Connecting...</span>
                    </div>
                  ) : (
                    "Connect Wallet"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-wrap gap-4 mb-8">
          <TabButton
            id="dashboard"
            label="Dashboard"
            icon="📊"
            isActive={activeTab === "dashboard"}
            onClick={setActiveTab}
          />
          <TabButton
            id="vault"
            label="My Vault"
            icon="🏦"
            isActive={activeTab === "vault"}
            onClick={setActiveTab}
          />
          <TabButton
            id="pools"
            label="Pools"
            icon="💎"
            isActive={activeTab === "pools"}
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
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {!account ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-blue-500/25">
                <span className="text-4xl">🔐</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Connect Your Wallet
              </h2>
              <p className="text-purple-200 text-lg mb-8">
                Connect your Petra wallet to start earning yield with VealthX
                DeFi vaults
              </p>
              <button
                onClick={connect}
                disabled={connecting}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-10 py-4 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-50"
              >
                {connecting ? "Connecting..." : "Connect Petra Wallet"}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Dashboard Tab */}
            {activeTab === "dashboard" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DepositForm />
                    <BorrowForm />
                  </div>
                </div>
                <div className="space-y-6">
                  <VaultViewer />
                </div>
              </div>
            )}

            {/* Vault Tab */}
            {activeTab === "vault" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <VaultViewer />
                <YieldChart />
              </div>
            )}

            {/* Pools Tab */}
            {activeTab === "pools" && <PoolStatsEnhanced />}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <YieldChart />
                <PoolStatsEnhanced />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 backdrop-blur-sm bg-white/5 border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="text-white font-bold text-lg">VealthX</div>
              <span className="text-purple-300">•</span>
              <div className="text-purple-300">
                Built for CTRL+MOVE Hackathon
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <a
                href="#"
                className="text-purple-300 hover:text-white transition-colors"
              >
                📚 Docs
              </a>
              <a
                href="#"
                className="text-purple-300 hover:text-white transition-colors"
              >
                🐦 Twitter
              </a>
              <a
                href="#"
                className="text-purple-300 hover:text-white transition-colors"
              >
                💬 Discord
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
