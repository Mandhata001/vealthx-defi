import { useState, useEffect } from "react";
import "./App.css";
import DepositForm from "./components/DepositForm.jsx";
import BorrowForm from "./components/BorrowForm.jsx";
import VaultViewer from "./components/VaultViewer.jsx";
import Analytics from "./components/Analytics.jsx";
import TradingDashboard from "./components/TradingDashboard.jsx";
import SocialTradingHub from "./components/SocialTradingHub.jsx";
import PaymentsHub from "./components/PaymentsHub.jsx";
import LandingHero from "./components/LandingHero.jsx";
import AIInsights from "./components/AIInsights.jsx";
import DemoGuide from "./components/DemoGuide.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import LanguageToggle from "./components/LanguageToggle.jsx";
import { testSentryError } from "./sentry.js";
import { coinGeckoAPI } from "./utils/coinGeckoAPI.js";

// Aptos Configuration
const APTOS_CONFIG = {
  apiKey: import.meta.env.VITE_APTOS_API_KEY,
  nodeUrl: import.meta.env.VITE_APTOS_NODE_URL,
  indexerUrl: import.meta.env.VITE_APTOS_INDEXER_URL,
  account: import.meta.env.VITE_APTOS_ACCOUNT,
};

// Test Aptos API Connection
const testAptosConnection = async () => {
  try {
    const response = await fetch(`${APTOS_CONFIG.nodeUrl}`, {
      headers: {
        Authorization: `Bearer ${APTOS_CONFIG.apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      console.log("✅ Aptos API Connected Successfully!");
      return true;
    } else {
      console.warn("⚠️ Aptos API responded with status:", response.status);
      return false;
    }
  } catch (error) {
    console.error("❌ Aptos API Connection Error:", error);
    return false;
  }
};

// TabButton Component
const TabButton = ({ id, label, icon, isActive, onClick, isDarkMode }) => (
  <button
    onClick={() => onClick(id)}
    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
      isActive
        ? "bg-blue-600 text-white shadow-lg transform scale-105"
        : isDarkMode
        ? "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:scale-105"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
    }`}
  >
    <span className="text-lg">{icon}</span>
    <span>{label}</span>
  </button>
);

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [isDemoActive, setIsDemoActive] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [aptosConnected, setAptosConnected] = useState(false);

  // Test Aptos API connection on app load
  useEffect(() => {
    const checkAptosConnection = async () => {
      const connected = await testAptosConnection();
      setAptosConnected(connected);
    };

    checkAptosConnection();
  }, []);

  // Show app features only after wallet connection or demo mode
  const showAppFeatures = isWalletConnected || isDemoActive;

  const handleConnectWallet = () => {
    setIsWalletConnected(true);
    if (activeTab === "home") {
      setActiveTab("vault"); // Switch to vault after connecting
    }
  };

  const handleDemoStart = () => {
    setIsDemoActive(true);
    setActiveTab("home"); // Start demo from home
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 to-gray-800"
          : "bg-gradient-to-br from-slate-50 to-blue-50"
      }`}
    >
      {/* Header */}
      <header
        className={`backdrop-blur-sm border-b sticky top-0 z-50 transition-colors duration-300 ${
          isDarkMode
            ? "bg-gray-800/80 border-gray-700"
            : "bg-white/80 border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  VealthX
                </h1>
                <p
                  className={`text-sm transition-colors duration-300 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Real World Asset DeFi Protocol
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageToggle
                currentLanguage={currentLanguage}
                onLanguageChange={setCurrentLanguage}
                isDarkMode={isDarkMode}
              />
              <ThemeToggle
                isDarkMode={isDarkMode}
                onThemeChange={setIsDarkMode}
              />

              {/* Development API Test Buttons */}
              {import.meta.env.DEV && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => coinGeckoAPI.testConnection()}
                    className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                    title="Test CoinGecko API"
                  >
                    🪙 API
                  </button>
                  <button
                    onClick={testSentryError}
                    className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
                    title="Test Sentry Error Tracking"
                  >
                    🐛 Sentry
                  </button>
                </div>
              )}

              {/* Aptos API Status Indicator */}
              <div
                className={`flex items-center space-x-2 text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    aptosConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
                  }`}
                ></div>
                <span className="hidden sm:inline">
                  {aptosConnected ? "Aptos API Connected" : "Aptos API Offline"}
                </span>
              </div>

              {!isWalletConnected && (
                <>
                  <button
                    onClick={handleDemoStart}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center space-x-2"
                  >
                    <span>🎬</span>
                    <span>
                      {currentLanguage === "en" ? "Demo Tour" : "डेमो टूर"}
                    </span>
                  </button>
                  <button
                    onClick={handleConnectWallet}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    {currentLanguage === "en"
                      ? "Connect Wallet"
                      : "वॉलेट कनेक्ट करें"}
                  </button>
                </>
              )}

              {isWalletConnected && (
                <>
                  <div
                    className={`hidden sm:flex items-center space-x-2 text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Aptos Mainnet</span>
                  </div>
                  <div
                    className={`px-3 py-2 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-green-400"
                        : "bg-green-50 border-green-200 text-green-700"
                    }`}
                  >
                    <span className="text-sm font-medium">
                      {currentLanguage === "en"
                        ? "Wallet Connected"
                        : "वॉलेट कनेक्टेड"}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation - Only show when wallet connected or demo active */}
      {showAppFeatures && (
        <nav
          className={`backdrop-blur-sm border-b transition-colors duration-300 ${
            isDarkMode
              ? "bg-gray-800/50 border-gray-700"
              : "bg-white/50 border-gray-100"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-2 py-4 overflow-x-auto">
              <TabButton
                id="home"
                label={currentLanguage === "en" ? "Home" : "होम"}
                icon="🏠"
                isActive={activeTab === "home"}
                onClick={setActiveTab}
                isDarkMode={isDarkMode}
              />
              <TabButton
                id="vault"
                label={currentLanguage === "en" ? "Vault" : "वॉल्ट"}
                icon="🏦"
                isActive={activeTab === "vault"}
                onClick={setActiveTab}
                isDarkMode={isDarkMode}
              />
              <TabButton
                id="deposit"
                label={currentLanguage === "en" ? "Deposit" : "जमा"}
                icon="💰"
                isActive={activeTab === "deposit"}
                onClick={setActiveTab}
                isDarkMode={isDarkMode}
              />
              <TabButton
                id="borrow"
                label={currentLanguage === "en" ? "Borrow" : "उधार"}
                icon="📈"
                isActive={activeTab === "borrow"}
                onClick={setActiveTab}
                isDarkMode={isDarkMode}
              />
              <TabButton
                id="trading"
                label={currentLanguage === "en" ? "Trading" : "ट्रेडिंग"}
                icon="📊"
                isActive={activeTab === "trading"}
                onClick={setActiveTab}
                isDarkMode={isDarkMode}
              />
              <TabButton
                id="social"
                label={currentLanguage === "en" ? "Social" : "सोशल"}
                icon="👥"
                isActive={activeTab === "social"}
                onClick={setActiveTab}
                isDarkMode={isDarkMode}
              />
              <TabButton
                id="payments"
                label={currentLanguage === "en" ? "Payments" : "पेमेंट"}
                icon="💸"
                isActive={activeTab === "payments"}
                onClick={setActiveTab}
                isDarkMode={isDarkMode}
              />
              <TabButton
                id="analytics"
                label={currentLanguage === "en" ? "Analytics" : "एनालिटिक्स"}
                icon="📊"
                isActive={activeTab === "analytics"}
                onClick={setActiveTab}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "home" && <LandingHero />}
        {activeTab === "vault" && <VaultViewer />}
        {activeTab === "deposit" && <DepositForm />}
        {activeTab === "borrow" && <BorrowForm />}
        {activeTab === "trading" && <TradingDashboard />}
        {activeTab === "social" && <SocialTradingHub />}
        {activeTab === "payments" && <PaymentsHub />}
        {activeTab === "analytics" && <Analytics />}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">VealthX</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Democratizing access to Real World Assets through innovative
                DeFi solutions on Aptos.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Protocol</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Vault System
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    RWA Trading
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Yield Farming
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Community</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Discord
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Medium
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-6 mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p className="text-sm text-gray-600">
                © 2024 VealthX. Built for CTRL+MOVE Hackathon.
              </p>
              <div className="flex space-x-4 mt-4 sm:mt-0">
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Privacy
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Terms
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Security
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* AI Insights Floating Panel */}
      <AIInsights />

      {/* Demo Guide Modal */}
      <DemoGuide
        isActive={isDemoActive}
        onClose={() => setIsDemoActive(false)}
        onTabChange={setActiveTab}
      />
    </div>
  );
}

export default App;
