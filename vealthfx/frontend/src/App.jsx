import { useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import CustomWalletSelector from "./components/CustomWalletSelector.jsx";
import { formatAddress } from "./utils/addressUtils.js";
import VealthXLogo from "./assets/VealthX_logo.png";
import DepositForm from "./components/DepositForm.jsx";
import BorrowForm from "./components/BorrowForm.jsx";
import VaultViewer from "./components/VaultViewer.jsx";
import TradingDashboard from "./components/TradingDashboard.jsx";
import SocialTradingHub from "./components/SocialTradingHub.jsx";
import PaymentsHub from "./components/PaymentsHub.jsx";
import LandingHero from "./components/LandingHero.jsx";
import Analytics from "./components/Analytics.jsx";

function App() {
  const { connected, account, network, connect, disconnect } = useWallet();
  const [activeTab, setActiveTab] = useState("home");
  const [aptosConnected, setAptosConnected] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [showRiskAnalysis, setShowRiskAnalysis] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showWalletSelector, setShowWalletSelector] = useState(false);
  const [walletError, setWalletError] = useState(null);

  // Safe wallet connection handler
  const handleWalletConnect = async (walletName) => {
    try {
      setWalletError(null);
      await connect(walletName);
      setShowWalletSelector(false);
    } catch (error) {
      console.log("Wallet connection cancelled or failed:", error.message);
      setWalletError(error.message);
      // Don't show alert for user rejection
      if (
        !error.message.includes("rejected") &&
        !error.message.includes("User denied")
      ) {
        alert("Failed to connect wallet: " + error.message);
      }
    }
  };

  // Safe disconnect handler
  const handleDisconnect = async () => {
    try {
      setWalletError(null);
      await disconnect();
    } catch (error) {
      console.log("Disconnect error:", error.message);
      setWalletError(error.message);
    }
  };

  useEffect(() => {
    setTimeout(() => setAptosConnected(true), 2000);
  }, []);

  const renderContent = () => {
    const componentProps = {
      demoMode,
      walletConnected: connected,
      account,
      network,
      onConnectWallet: () => setShowWalletSelector(true),
    };

    switch (activeTab) {
      case "home":
        return <LandingHero {...componentProps} />;
      case "vault":
        return <VaultViewer {...componentProps} />;
      case "deposit":
        return <DepositForm {...componentProps} />;
      case "borrow":
        return <BorrowForm {...componentProps} />;
      case "trading":
        return <TradingDashboard {...componentProps} />;
      case "social":
        return <SocialTradingHub {...componentProps} />;
      case "payment":
        return <PaymentsHub {...componentProps} />;
      case "analytics":
        return <Analytics {...componentProps} />;
      default:
        return <LandingHero {...componentProps} />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-900 text-white m-0 p-0 overflow-x-hidden">
      {/* Risk Analysis Popup */}
      {showRiskAnalysis && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-orange-500/30 rounded-2xl p-6 max-w-2xl w-full shadow-2xl shadow-orange-500/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">⚠️</span>
                <h2 className="text-2xl font-bold text-orange-400">
                  Risk Analysis & Disclaimer
                </h2>
              </div>
              <button
                onClick={() => setShowRiskAnalysis(false)}
                className="text-gray-400 hover:text-white transition-colors text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-gray-300">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <h3 className="text-red-400 font-semibold mb-2">
                  ⚡ High-Risk Investment
                </h3>
                <p className="text-sm">
                  DeFi protocols involve significant risks including smart
                  contract vulnerabilities, impermanent loss, and market
                  volatility.
                </p>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <h3 className="text-yellow-400 font-semibold mb-2">
                  📊 Market Risks
                </h3>
                <p className="text-sm">
                  Cryptocurrency markets are highly volatile. Past performance
                  does not guarantee future results.
                </p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h3 className="text-blue-400 font-semibold mb-2">
                  🔒 Security Measures
                </h3>
                <p className="text-sm">
                  Always verify contract addresses, use hardware wallets, and
                  never share private keys.
                </p>
              </div>

              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <h3 className="text-purple-400 font-semibold mb-2">
                  💡 Recommendation
                </h3>
                <p className="text-sm">
                  Only invest what you can afford to lose. Consider consulting
                  with financial advisors.
                </p>
              </div>
            </div>

            <div className="mt-6 flex space-x-4">
              <button
                onClick={() => setShowRiskAnalysis(false)}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-300"
              >
                I Understand the Risks
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Popup */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 via-blue-900/50 to-gray-900 border border-cyan-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl shadow-cyan-500/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">👤</span>
                <h2 className="text-2xl font-bold text-cyan-400">
                  Login to VealthX
                </h2>
              </div>
              <button
                onClick={() => setShowLogin(false)}
                className="text-gray-400 hover:text-white transition-colors text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 text-gray-300">
                  <input type="checkbox" className="rounded text-cyan-500" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="text-cyan-400 hover:text-cyan-300">
                  Forgot password?
                </a>
              </div>

              <button className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-600 transition-all duration-300">
                Sign In
              </button>

              <div className="text-center text-sm text-gray-400">
                Don't have an account?{" "}
                <a href="#" className="text-cyan-400 hover:text-cyan-300">
                  Sign up
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Selector Modal */}
      {showWalletSelector && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 w-full max-w-sm shadow-2xl shadow-black/50 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-lg">�</span>
                </div>
                <h2 className="text-xl font-bold text-white">Connect Wallet</h2>
              </div>
              <button
                onClick={() => setShowWalletSelector(false)}
                className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
              >
                <span className="text-xl">×</span>
              </button>
            </div>

            <div className="space-y-2">
              <CustomWalletSelector
                onClose={() => setShowWalletSelector(false)}
              />
            </div>

            <div className="mt-4 text-center text-[10px] text-gray-400">
              Secure connection • Your keys, your crypto
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-40 shadow-lg">
        <div className="w-full px-2 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img
                  src={VealthXLogo}
                  alt="VealthX Logo"
                  className="w-12 h-12 object-contain drop-shadow-lg"
                />
                <div className="logo-container">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                    VealthX
                  </h1>
                  <p className="text-sm text-gray-400 font-medium">
                    Next-Generation DeFi Protocol
                  </p>
                </div>
              </div>

              {/* Demo Mode Toggle */}
              <div className="hidden lg:flex items-center space-x-2 ml-6">
                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gray-800/50 border border-gray-700/50">
                  <span className="text-xs text-gray-400">Demo</span>
                  <button
                    onClick={() => setDemoMode(!demoMode)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      demoMode ? "bg-cyan-500" : "bg-gray-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        demoMode ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
                {demoMode && (
                  <span className="text-xs text-cyan-400 font-medium animate-pulse">
                    DEMO MODE
                  </span>
                )}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Home Button */}
              <button
                onClick={() => setActiveTab("home")}
                className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg hover:from-cyan-500/30 hover:to-blue-500/30 transition-all duration-300 transform hover:scale-105"
              >
                <span className="text-lg">🏠</span>
                <span className="text-sm font-medium text-cyan-400">Home</span>
              </button>

              {/* Real Wallet Connection */}
              {!connected ? (
                <button
                  onClick={() => setShowWalletSelector(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-400 hover:from-purple-500/30 hover:to-pink-500/30 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105"
                >
                  <span className="text-lg">👛</span>
                  <span className="hidden sm:inline">Connect Wallet</span>
                </button>
              ) : (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg">
                    <span className="text-lg">🔗</span>
                    <span className="hidden sm:inline text-xs">
                      {formatAddress(account?.address)}
                    </span>
                  </div>
                  <button
                    onClick={handleDisconnect}
                    className="px-3 py-2 bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 rounded-lg text-xs transition-all"
                  >
                    Disconnect
                  </button>
                </div>
              )}

              {/* Login Button */}
              <button
                onClick={() => setShowLogin(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg hover:from-cyan-500/30 hover:to-blue-500/30 transition-all duration-300 transform hover:scale-105 text-cyan-400"
              >
                <span className="text-lg">👤</span>
                <span className="hidden sm:inline font-medium text-sm">
                  Login
                </span>
              </button>

              {/* Connection Status */}
              <div className="hidden md:flex items-center space-x-2 text-gray-300">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">
                  {aptosConnected ? "Aptos Connected" : "Connecting..."}
                </span>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-label="Toggle mobile menu"
                  className="text-gray-400 hover:text-white focus:outline-none focus:text-white focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 transition-all duration-200 hover:scale-110 p-2 rounded-lg"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-sm border-b border-gray-700/50">
          <div className="w-full px-2 sm:px-4 lg:px-6 py-4">
            <div className="space-y-2">
              {[
                { name: "Home", icon: "🏠", id: "home" },
                { name: "RWA Vaults", icon: "🏦", id: "vault" },
                { name: "Deposit", icon: "💰", id: "deposit" },
                { name: "Borrow", icon: "📊", id: "borrow" },
                { name: "Trading", icon: "📈", id: "trading" },
                { name: "Social Trading", icon: "👥", id: "social" },
                { name: "Payments Hub", icon: "💳", id: "payment" },
                { name: "Analytics", icon: "📊", id: "analytics" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMenuOpen(false);
                  }}
                  aria-label={`Navigate to ${tab.name}`}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  <span className="text-lg" aria-hidden="true">
                    {tab.icon}
                  </span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation - Only visible when demo mode is ON or wallet is connected */}
      {(demoMode || connected) && (
        <nav className="bg-gray-900/90 backdrop-blur-sm border-b border-gray-700/50">
          <div className="w-full px-2 sm:px-4 lg:px-6">
            <div className="flex items-center justify-center space-x-1 py-4 overflow-x-auto">
              {[
                { name: "Home", icon: "🏠", id: "home" },
                { name: "RWA Vaults", icon: "🏦", id: "vault" },
                { name: "Deposit", icon: "💰", id: "deposit" },
                { name: "Borrow", icon: "📊", id: "borrow" },
                { name: "Trading", icon: "📈", id: "trading" },
                { name: "Social Trading", icon: "👥", id: "social" },
                { name: "Payments Hub", icon: "💳", id: "payment" },
                { name: "Analytics", icon: "📊", id: "analytics" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  aria-label={`Navigate to ${tab.name}`}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:scale-105 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 glow-effect"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  <span className="text-lg" aria-hidden="true">
                    {tab.icon}
                  </span>
                  <span className="hidden sm:inline">{tab.name}</span>
                </button>
              ))}

              {/* Aptos Mainnet Indicator */}
              <div className="flex items-center space-x-2 ml-4 px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">
                  Aptos Mainnet
                </span>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* X-shaped moving animations - Full body background (everywhere except header) */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 0 }}
      >
        <div
          className="x-shape-bg x-shape-1"
          style={{ top: "150px", left: "5%" }}
        ></div>
        <div
          className="x-shape-bg x-shape-2"
          style={{ top: "200px", right: "10%" }}
        ></div>
        <div
          className="x-shape-bg x-shape-1"
          style={{
            top: "400px",
            left: "65%",
            animationDelay: "-5s",
          }}
        ></div>
        <div
          className="x-shape-bg x-shape-2"
          style={{
            top: "600px",
            left: "20%",
            animationDelay: "-10s",
          }}
        ></div>
        <div
          className="x-shape-bg x-shape-1"
          style={{
            top: "800px",
            left: "80%",
            animationDelay: "-7s",
          }}
        ></div>
        <div
          className="x-shape-bg x-shape-2"
          style={{
            top: "1000px",
            left: "45%",
            animationDelay: "-12s",
          }}
        ></div>
        <div
          className="x-shape-bg x-shape-1"
          style={{
            top: "300px",
            left: "35%",
            animationDelay: "-3s",
          }}
        ></div>
        <div
          className="x-shape-bg x-shape-2"
          style={{
            top: "500px",
            right: "25%",
            animationDelay: "-8s",
          }}
        ></div>
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full relative" style={{ zIndex: 1 }}>
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-blue-900/80 to-purple-900 border-t border-cyan-500/20 shadow-lg shadow-cyan-500/5">
        <div className="w-full px-2 sm:px-4 lg:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  VealthX
                </h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Instant RWA liquidity on Aptos. Revolutionizing decentralized
                finance with real-world asset tokenization, automated yield
                optimization, and cross-border payments.
              </p>

              {/* Social Media Links - ADD YOUR LINKS HERE */}
              <div className="space-y-3">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  Connect With Us
                </p>
                <div className="flex flex-wrap gap-3">
                  {/* Twitter/X */}
                  <a
                    href="https://x.com/Mandhata001"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-2 bg-white/5 hover:bg-cyan-500/20 rounded-lg transition-all duration-300 border border-white/10 hover:border-cyan-400/50"
                    title="Follow us on X (Twitter)"
                  >
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>

                  {/* GitHub */}
                  <a
                    href="https://github.com/Mandhata001"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-2 bg-white/5 hover:bg-purple-500/20 rounded-lg transition-all duration-300 border border-white/10 hover:border-purple-400/50"
                    title="View source on GitHub"
                  >
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href="https://linkedin.com/in/mandhatapathak"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-2 bg-white/5 hover:bg-blue-500/20 rounded-lg transition-all duration-300 border border-white/10 hover:border-blue-400/50"
                    title="Connect on LinkedIn"
                  >
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>

                  {/* Email */}
                  <a
                    href="mailto:mandhata.dev@gmail.com"
                    className="group p-2 bg-white/5 hover:bg-green-500/20 rounded-lg transition-all duration-300 border border-white/10 hover:border-green-400/50"
                    title="Email us"
                  >
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="text-cyan-400">💎</span> Products
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a
                    href="#vaults"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab("vault");
                    }}
                    className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-xs group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                    RWA Vaults
                  </a>
                </li>
                <li>
                  <a
                    href="#trading"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab("trading");
                    }}
                    className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-xs group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                    Trading Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="#social"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab("social");
                    }}
                    className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-xs group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                    Social Trading
                  </a>
                </li>
                <li>
                  <a
                    href="#payments"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab("payment");
                    }}
                    className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-xs group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                    Cross-Border Payments
                  </a>
                </li>
                <li>
                  <a
                    href="#analytics"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab("analytics");
                    }}
                    className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-xs group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                    Analytics Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-xs group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                    Yield Optimization
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="text-purple-400">📚</span> Resources
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a
                    href="https://github.com/Mandhata001/vealthx-defi/blob/main/DOCUMENTATION.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-xs group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/Mandhata001/vealthx-defi/blob/main/README.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-xs group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                    Getting Started
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/Mandhata001/vealthx-defi/tree/main/vealthfx/sources"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-xs group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                    Smart Contracts
                  </a>
                </li>
                <li>
                  <a
                    href="https://aptoslabs.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-xs group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                    Aptos Network
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-xs group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                    API Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-xs group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                    Community Forum
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact & Support */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="text-green-400">💬</span> Contact & Support
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a
                    href="mailto:your.email@example.com"
                    className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-xs group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                    Email Support
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-xs group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-xs group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                    Bug Report
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-xs group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                    Feature Request
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-xs group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-xs group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-6 pt-6 border-t border-gray-700/50">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
              {/* Copyright */}
              <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <span className="text-cyan-400">©</span> 2025 VealthX
                  Protocol. All rights reserved.
                </span>
              </div>

              {/* Stats & Badges */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 rounded-lg border border-purple-500/20 text-gray-400 hover:text-purple-400 transition-colors">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Audited</span>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20 text-gray-400 hover:text-blue-400 transition-colors">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <span>Aptos Network</span>
                </div>

                <a
                  href="https://github.com/Mandhata001/vealthx-defi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-lg border border-gray-700/50 text-gray-400 hover:text-white hover:border-gray-600 transition-all"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Open Source</span>
                </a>

                <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 rounded-lg border border-cyan-500/20 text-gray-400 hover:text-cyan-400 transition-colors">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <span>TVL: $2.8M+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
