import React, { useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import DepositForm from "./components/DepositForm.jsx";
import BorrowForm from "./components/BorrowForm.jsx";
import VaultViewer from "./components/VaultViewer.jsx";
import PoolStatsEnhanced from "./components/PoolStatsEnhanced.jsx";
import YieldChart from "./components/YieldChart.jsx";
import LandingPage from "./components/LandingPage.jsx";
import DemoDashboard from "./components/DemoDashboard.jsx";
import { APP_NAME, APP_DESCRIPTION } from "./lib/constants";

function App() {
  const { account, connect, disconnect, connecting, connected } = useWallet();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(false);
  const [walletError, setWalletError] = useState("");
  const [demoMode, setDemoMode] = useState(false);
  const [currentPage, setCurrentPage] = useState("landing");

  // Enhanced wallet detection and auto-connection
  useEffect(() => {
    const checkWalletStatus = async () => {
      console.log("🔍 Checking wallet status...");

      if (window.aptos) {
        console.log("✅ Petra wallet detected");

        try {
          const account = await window.aptos.account();
          if (account) {
            console.log("✅ Wallet already connected:", account.address);
          }
        } catch (error) {
          console.log("⏳ Wallet detected but not connected");
        }
      } else {
        console.log("❌ Petra wallet not found");
        setWalletError("Please install Petra wallet extension");
      }
    };

    checkWalletStatus();
    const timer = setTimeout(checkWalletStatus, 1000);

    return () => clearTimeout(timer);
  }, []);

  const truncateAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleConnect = async () => {
    try {
      setWalletError("");
      console.log("🔄 Attempting wallet connection...");

      if (!window.aptos) {
        throw new Error(
          "Petra wallet extension not found. Please install Petra wallet."
        );
      }

      await connect("Petra");
      console.log("✅ Wallet connected successfully");
      setCurrentPage("dashboard");
    } catch (error) {
      console.error("❌ Wallet connection failed:", error);
      setWalletError(`Connection failed: ${error.message}`);

      if (error.message.includes("User rejected")) {
        setWalletError(
          "Connection cancelled. Please try again and approve the connection."
        );
      } else if (error.message.includes("not found")) {
        setWalletError(
          "Please install Petra wallet extension and refresh the page."
        );
      } else {
        setWalletError(`Connection failed: ${error.message}`);
      }
    }
  };

  const handleDemoMode = () => {
    setDemoMode(true);
    setCurrentPage("dashboard");
    console.log("🎭 Demo mode activated");
  };

  const handleDisconnect = () => {
    if (demoMode) {
      setDemoMode(false);
      setCurrentPage("landing");
    } else {
      disconnect();
      setCurrentPage("landing");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 w-full">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-purple-900/30 to-slate-900/50"></div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-sm bg-white/5 border-b border-white/10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center p-1 hover:bg-white/20 transition-all duration-300">
                <img
                  src="/vealthx-logo.png"
                  alt="VealthX Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hidden items-center justify-center">
                  <span className="text-xl font-bold text-white">V</span>
                </div>
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
              {account || demoMode ? (
                <div className="flex items-center space-x-4">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-white font-mono text-sm">
                        {demoMode
                          ? "Demo Mode"
                          : truncateAddress(account.address)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleDisconnect}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-200 hover:text-white border border-red-500/30 px-4 py-2 rounded-xl font-medium transition-all duration-200"
                  >
                    {demoMode ? "Exit Demo" : "Disconnect"}
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
      <main className="relative z-10 w-full flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          {currentPage === "landing" ? (
            <LandingPage
              handleConnect={handleConnect}
              handleDemoMode={handleDemoMode}
              connecting={connecting}
              walletError={walletError}
            />
          ) : account || demoMode ? (
            <div className="space-y-8 w-full max-w-6xl mx-auto">
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
                  <DemoDashboard demoMode={demoMode} />
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
          ) : null}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-16 backdrop-blur-sm bg-white/5 border-t border-white/10 w-full">
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
