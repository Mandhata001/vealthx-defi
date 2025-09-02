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
      className={`flex items-center space-x-3 px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
        isActive
          ? 'btn-primary text-white shadow-lg transform scale-105'
          : 'text-gray-400 hover:text-white hover:bg-white/10 backdrop-blur-sm'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-semibold">{label}</span>
    </button>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-purple-300/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-24 h-24 border-4 border-transparent border-r-blue-500 rounded-full animate-spin mx-auto" style={{animationDirection: 'reverse', animationDuration: '1s'}}></div>
          </div>
          <h2 className="mt-8 text-3xl font-bold text-blue-400">
            VealthX
          </h2>
          <p className="mt-3 text-purple-200 text-lg">Initializing DeFi protocol...</p>
          <div className="mt-6 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
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
              <div className="w-14 h-14 btn-primary rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">V</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-blue-400">
                  {APP_NAME}
                </h1>
                <p className="text-purple-200 font-medium">Next-Gen DeFi Vault Protocol</p>
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
                    className="btn-secondary"
                    disabled={connecting}
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => connect("Petra")}
                  className="btn-primary"
                  disabled={connecting}
                >
                  {connecting ? "Connecting..." : "Connect Wallet"}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!account ? (
          /* Welcome Section */
          <div className="text-center py-20">
            <div className="max-w-4xl mx-auto">
              <div className="w-24 h-24 btn-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <span className="text-4xl font-bold text-white">V</span>
              </div>
              <h1 className="text-6xl font-bold text-white mb-6">
                Welcome to <span className="text-blue-400">VealthX</span>
              </h1>
              <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                The next-generation DeFi vault protocol on Aptos. Deposit collateral, borrow stablecoins, 
                and earn yield with institutional-grade security and transparency.
              </p>
              <button
                onClick={() => connect("Petra")}
                className="btn-primary text-xl px-10 py-4"
                disabled={connecting}
              >
                {connecting ? "Connecting..." : "Get Started"}
              </button>
            </div>
          </div>
        ) : (
          /* Dashboard */
          <div className="space-y-8">
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-4 justify-center">
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
                icon="💳"
                isActive={activeTab === 'borrow'}
                onClick={setActiveTab}
              />
              <TabButton
                id="vault"
                label="My Vault"
                icon="🏦"
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
            <div className="animate-fade-in">
              {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <PoolStatsEnhanced />
                  <YieldChart />
                </div>
              )}
              
              {activeTab === 'deposit' && <DepositForm />}
              {activeTab === 'borrow' && <BorrowForm />}
              {activeTab === 'vault' && <VaultViewer />}
              {activeTab === 'analytics' && (
                <div className="grid grid-cols-1 gap-8">
                  <PoolStatsEnhanced />
                  <YieldChart />
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-white/5 backdrop-blur-sm border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 btn-primary rounded-2xl flex items-center justify-center">
                  <span className="text-xl font-bold text-white">V</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">VealthX</h3>
                  <p className="text-gray-400">DeFi Made Simple</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                Secure, transparent, and efficient DeFi lending protocol built on Aptos blockchain.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Protocol</h4>
              <div className="space-y-2">
                <a href="#" className="text-purple-300 hover:text-white transition-colors block">Documentation</a>
                <a href="#" className="text-purple-300 hover:text-white transition-colors block">Security</a>
                <a href="#" className="text-purple-300 hover:text-white transition-colors block">Governance</a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Community</h4>
              <div className="space-y-2">
                <a href="#" className="text-purple-300 hover:text-white transition-colors">
                  💬 Discord
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
