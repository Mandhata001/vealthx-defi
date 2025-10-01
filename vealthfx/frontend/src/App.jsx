import { useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import CustomWalletSelector from "./components/CustomWalletSelector.jsx";
import { formatAddress } from "./utils/addressUtils.js";
import "./App.css";
import DepositForm from "./components/DepositForm.jsx";
import BorrowForm from "./components/BorrowForm.jsx";
import VaultViewer from "./components/VaultViewer.jsx";
import TradingDashboard from "./components/TradingDashboard.jsx";
import SocialTradingHub from "./components/SocialTradingHub.jsx";
import PaymentsHub from "./components/PaymentsHub.jsx";
import LandingHero from "./components/LandingHero.jsx";

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
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
              >
                <span className="text-lg">×</span>
              </button>
            </div>

            <div className="space-y-4">
              <CustomWalletSelector
                onClose={() => setShowWalletSelector(false)}
              />
            </div>

            <div className="mt-6 text-center text-xs text-gray-400">
              Secure connection • Your keys, your crypto
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900/95 via-blue-900/90 to-purple-900/95 backdrop-blur-sm border-b border-cyan-500/20 shadow-lg shadow-cyan-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="logo-container">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  VealthX
                </h1>
                <p className="text-sm text-gray-400 font-medium">
                  Next-Generation DeFi Protocol
                </p>
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
              {/* Risk Analysis Button */}
              <button
                onClick={() => setShowRiskAnalysis(true)}
                className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-lg hover:from-orange-500/30 hover:to-red-500/30 transition-all duration-300 transform hover:scale-105"
              >
                <span className="text-lg">⚠️</span>
                <span className="text-sm font-medium text-orange-400">
                  Risk Analysis
                </span>
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="space-y-2">
              {[
                { name: "Home", icon: "🏠", id: "home" },
                { name: "Vault", icon: "🏦", id: "vault" },
                { name: "Deposit", icon: "💰", id: "deposit" },
                { name: "Borrow", icon: "📊", id: "borrow" },
                { name: "Trading", icon: "📈", id: "trading" },
                { name: "Social", icon: "👥", id: "social" },
                { name: "Payment", icon: "💳", id: "payment" },
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

      {/* Navigation */}
      <nav className="bg-gray-900/90 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-1 py-4 overflow-x-auto">
            {[
              { name: "Home", icon: "🏠", id: "home" },
              { name: "Vault", icon: "🏦", id: "vault" },
              { name: "Deposit", icon: "💰", id: "deposit" },
              { name: "Borrow", icon: "📊", id: "borrow" },
              { name: "Trading", icon: "📈", id: "trading" },
              { name: "Social", icon: "👥", id: "social" },
              { name: "Payment", icon: "💳", id: "payment" },
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

      {/* Main Content */}
      <main className="flex-1 w-full">{renderContent()}</main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-blue-900/80 to-purple-900 border-t border-cyan-500/20 shadow-lg shadow-cyan-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  VealthX
                </h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Next-generation DeFi protocol revolutionizing wealth management
                through innovative blockchain technology and secure financial
                instruments.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  <span className="text-xl">📧</span>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  <span className="text-xl">🐦</span>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  <span className="text-xl">💬</span>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  <span className="text-xl">📱</span>
                </a>
              </div>
            </div>

            {/* Products */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Products</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    Yield Farming
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    Liquidity Mining
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    Staking Pools
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    Cross-Chain Bridge
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    NFT Marketplace
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    Governance Token
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    API Reference
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    Whitepaper
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    Security Audit
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    Bug Bounty
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    Community Forum
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal & Support */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">
                Legal & Support
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    Risk Disclosure
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    Contact Support
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-gray-700/50">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <span>© 2024 VealthX Protocol. All rights reserved.</span>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span>Mainnet Live</span>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2 text-gray-400">
                  <span>🔒</span>
                  <span>Secured by Audit</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <span>📊</span>
                  <span>TVL: $47M+</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <span>⚡</span>
                  <span>Aptos Network</span>
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
