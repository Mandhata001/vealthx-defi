import React from "react";

const LandingPage = ({
  handleConnect,
  handleDemoMode,
  connecting,
  walletError,
}) => {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <div className="text-center py-20">
        <div className="space-y-8 max-w-5xl mx-auto">
          <div className="logo-container logo-glow logo-pulse logo-enhanced w-48 h-48 lg:w-56 lg:h-56 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-12 p-8 hover:bg-white/20 transition-all duration-500 group shadow-2xl">
            <img
              src="./VealthX_Logo.png"
              alt="VealthX Logo"
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl filter brightness-125 contrast-110"
              onError={(e) => {
                console.error("Logo failed to load:", e.target.src);
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl hidden items-center justify-center">
              <span className="text-6xl font-bold text-white">V</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Next-Gen DeFi on{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Aptos
            </span>
          </h1>

          {/* Clear Value Proposition */}
          <p className="text-2xl lg:text-3xl text-gray-300 mb-8 font-light leading-relaxed">
            Deposit assets, earn yield, and borrow instantly — powered by smart
            routing
          </p>

          {/* Secondary Description */}
          <p className="text-xl text-purple-200 mb-12 max-w-3xl mx-auto leading-relaxed">
            Access instant RWA liquidity, advanced yield strategies, and
            seamless DeFi operations on the fastest blockchain. Built for
            institutions and power users.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={handleConnect}
              disabled={connecting}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-12 py-4 rounded-xl font-bold text-xl transition-all duration-200 disabled:opacity-50 shadow-2xl hover:shadow-blue-500/25"
            >
              {connecting ? (
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Connecting Wallet...</span>
                </div>
              ) : (
                "Connect Petra Wallet"
              )}
            </button>

            <button
              onClick={handleDemoMode}
              className="bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/50 text-white px-12 py-4 rounded-xl font-bold text-xl transition-all duration-200 backdrop-blur-sm"
            >
              🎭 Try Demo Mode
            </button>
          </div>

          {/* Error Display */}
          {walletError && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl max-w-md mx-auto">
              <p className="text-red-300 text-sm">{walletError}</p>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="glass-card p-8 text-center hover:scale-105 transition-transform duration-300">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-xl font-bold text-white mb-3">
            Instant Liquidity
          </h3>
          <p className="text-gray-300">
            Access real-world asset liquidity pools with zero slippage routing
          </p>
        </div>

        <div className="glass-card p-8 text-center hover:scale-105 transition-transform duration-300">
          <div className="text-4xl mb-4">📈</div>
          <h3 className="text-xl font-bold text-white mb-3">Advanced Yield</h3>
          <p className="text-gray-300">
            Automated strategies maximizing returns across multiple protocols
          </p>
        </div>

        <div className="glass-card p-8 text-center hover:scale-105 transition-transform duration-300">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-xl font-bold text-white mb-3">Secure Vaults</h3>
          <p className="text-gray-300">
            Institutional-grade security with smart contract audits
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
        <div>
          <div className="text-3xl font-bold text-white mb-2">$2.4M+</div>
          <div className="text-purple-200">Total Value Locked</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-white mb-2">15.2%</div>
          <div className="text-purple-200">Average APY</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-white mb-2">1,247</div>
          <div className="text-purple-200">Active Users</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-white mb-2">99.9%</div>
          <div className="text-purple-200">Uptime</div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-white text-center mb-16">
          How VealthX Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <h3 className="text-xl font-bold text-white">Connect & Deposit</h3>
            <p className="text-gray-300">
              Connect your wallet and deposit assets into our yield-optimized
              vaults
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h3 className="text-xl font-bold text-white">Smart Routing</h3>
            <p className="text-gray-300">
              Our algorithms automatically route your funds to highest-yield
              opportunities
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-600 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3 className="text-xl font-bold text-white">Earn & Borrow</h3>
            <p className="text-gray-300">
              Earn passive income and borrow against your positions with
              competitive rates
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
