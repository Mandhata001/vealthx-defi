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
  const [activeTab, setActiveTab] = useState('dashboard');
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
      className={`group relative flex items-center space-x-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-500 transform ${
        isActive
          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-2xl shadow-blue-500/25 scale-105'
          : 'text-gray-300 hover:text-white hover:bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20'
      }`}
    >
      <span className={`text-2xl transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
        {icon}
      </span>
      <span className="font-bold tracking-wide">{label}</span>
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-2xl blur-xl"></div>
      )}
    </button>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl animate-blob"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative z-10 text-center animate-fade-in">
          <div className="relative mb-8">
            <div className="w-32 h-32 border-4 border-purple-300/30 border-t-purple-500 border-r-blue-500 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-32 h-32 border-4 border-transparent border-l-pink-500 border-b-cyan-500 rounded-full animate-spin mx-auto" style={{animationDirection: 'reverse', animationDuration: '2s'}}></div>
          </div>
          <div className="space-y-4">
            <h2 className="text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse-glow">
              VealthX
            </h2>
            <p className="text-purple-200 text-xl font-medium">Next-Gen DeFi Protocol</p>
            <div className="flex justify-center space-x-2 mt-8">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-96 h-96 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-xl bg-white/5 border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/25 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <span className="text-3xl font-black text-white">V</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/40 to-purple-600/40 rounded-3xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {APP_NAME}
                </h1>
                <p className="text-purple-200 font-semibold text-lg">Next-Gen DeFi Vault Protocol</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {account ? (
                <div className="flex items-center space-x-6">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl px-8 py-4 shadow-2xl">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                      </div>
                      <span className="text-white font-mono font-bold text-lg">
                        {truncateAddress(account.address)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={disconnect}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-200 hover:text-white border border-red-500/30 hover:border-red-500/50 px-8 py-4 rounded-3xl font-bold text-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-xl"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={connect}
                  disabled={connecting}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-10 py-4 rounded-3xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {connecting ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
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

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {!account ? (
          <div className="text-center py-24 animate-fade-in">
            <div className="space-y-8">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-12 shadow-2xl shadow-blue-500/25 animate-float">
                <span className="text-5xl">🔗</span>
              </div>
              <h2 className="text-6xl font-black text-white mb-6">Connect Your Wallet</h2>
              <p className="text-2xl text-purple-200 mb-12 max-w-2xl mx-auto leading-relaxed">
                Access the future of DeFi with instant RWA liquidity, advanced yield strategies, and seamless cross-chain integration.
              </p>
              <button
                onClick={connect}
                disabled={connecting}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-16 py-6 rounded-3xl font-black text-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-50"
              >
                {connecting ? "Connecting..." : "Launch DeFi Dashboard"}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-12 animate-fade-in">
            {/* Navigation Tabs */}
            <div className="flex flex-wrap justify-center gap-6">
              <TabButton
                id="dashboard"
                label="Dashboard"
                icon="📊"
                isActive={activeTab === 'dashboard'}
                onClick={setActiveTab}
              />
              <TabButton
                id="deposit"
                label="Deposit"
                icon="💰"
                isActive={activeTab === 'deposit'}
                onClick={setActiveTab}
              />
              <TabButton
                id="borrow"
                label="Borrow"
                icon="🏦"
                isActive={activeTab === 'borrow'}
                onClick={setActiveTab}
              />
              <TabButton
                id="vault"
                label="Vault"
                icon="🔐"
                isActive={activeTab === 'vault'}
                onClick={setActiveTab}
              />
              <TabButton
                id="analytics"
                label="Analytics"
                icon="📈"
                isActive={activeTab === 'analytics'}
                onClick={setActiveTab}
              />
            </div>

            {/* Tab Content */}
            <div className="mt-12">
              {activeTab === 'dashboard' && (
                <div className="space-y-8 animate-slide-in-up">
                  <PoolStatsEnhanced />
                  <YieldChart />
                </div>
              )}
              
              {activeTab === 'deposit' && (
                <div className="animate-slide-in-up">
                  <DepositForm />
                </div>
              )}
              
              {activeTab === 'borrow' && (
                <div className="animate-slide-in-up">
                  <BorrowForm />
                </div>
              )}
              
              {activeTab === 'vault' && (
                <div className="animate-slide-in-up">
                  <VaultViewer />
                </div>
              )}
              
              {activeTab === 'analytics' && (
                <div className="animate-slide-in-up">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <PoolStatsEnhanced />
                    <YieldChart />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-24 backdrop-blur-xl bg-white/5 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">VealthX</h3>
              <p className="text-purple-200">Revolutionary DeFi protocol for the next generation of decentralized finance.</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white">Protocol</h4>
              <div className="space-y-2">
                <a href="#" className="block text-purple-300 hover:text-white transition-colors">Documentation</a>
                <a href="#" className="block text-purple-300 hover:text-white transition-colors">Whitepaper</a>
                <a href="#" className="block text-purple-300 hover:text-white transition-colors">Security Audit</a>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white">Developers</h4>
              <div className="space-y-2">
                <a href="#" className="block text-purple-300 hover:text-white transition-colors">API Reference</a>
                <a href="#" className="block text-purple-300 hover:text-white transition-colors">SDK</a>
                <a href="#" className="block text-purple-300 hover:text-white transition-colors">GitHub</a>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white">Community</h4>
              <div className="space-y-2">
                <a href="#" className="block text-purple-300 hover:text-white transition-colors">Twitter</a>
                <a href="#" className="block text-purple-300 hover:text-white transition-colors">Discord</a>
                <a href="#" className="block text-purple-300 hover:text-white transition-colors">Telegram</a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <p className="text-purple-300">© 2025 VealthX. All rights reserved. Built on Aptos.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
