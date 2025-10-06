import { useState, useEffect } from "react";

const DemoPopup = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const demoSteps = [
    {
      title: "🎉 Welcome to VealthX Protocol",
      description: "Next-generation DeFi ecosystem on Aptos blockchain",
      features: [
        "🏦 Tokenize Real-World Assets",
        "💎 Fractional Ownership",
        "⚡ Lightning-fast Aptos blockchain",
        "🔒 Secure Smart Contracts",
      ],
      gradient: "from-cyan-500 via-blue-500 to-purple-500",
    },
    {
      title: "🏦 RWA Vaults",
      description: "Create and manage tokenized real-world assets",
      features: [
        "📊 Real Estate tokenization",
        "🎨 Art & Collectibles",
        "💰 Commodities & Gold",
        "🚀 Private Equity access",
      ],
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      demo: "Navigate to 'RWA Vaults' tab to explore tokenized assets",
    },
    {
      title: "💵 Deposit & Earn",
      description: "Deposit crypto assets and earn competitive yields",
      features: [
        "💎 Deposit APT tokens",
        "📈 Earn up to 8% APY",
        "🔄 Flexible withdrawals",
        "⚡ Instant transactions",
      ],
      gradient: "from-pink-500 via-rose-500 to-red-500",
      demo: "Try Demo Mode - no wallet required!",
    },
    {
      title: "📊 Borrow & Leverage",
      description: "Borrow against your collateral with competitive rates",
      features: [
        "🏦 Up to 75% LTV ratio",
        "💰 Low interest rates (5%)",
        "🔒 Secure collateralization",
        "📉 Transparent liquidation",
      ],
      gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
      demo: "Borrow crypto using your deposited assets as collateral",
    },
    {
      title: "📈 Advanced Trading",
      description: "Professional trading with real-time order book",
      features: [
        "⚡ Limit & Market orders",
        "📊 Real-time charts",
        "💹 Deep liquidity pools",
        "🎯 Advanced analytics",
      ],
      gradient: "from-orange-500 via-amber-500 to-yellow-500",
      demo: "Access professional trading dashboard with live data",
    },
    {
      title: "👥 Social Trading",
      description: "Follow expert traders and copy their strategies",
      features: [
        "🌟 Top trader leaderboard",
        "📋 Copy trading strategies",
        "💬 Community insights",
        "🏆 Reputation system",
      ],
      gradient: "from-blue-500 via-indigo-500 to-purple-500",
      demo: "Connect with successful traders and learn from the best",
    },
    {
      title: "💳 Payments Hub",
      description: "Crypto payments made simple and fast",
      features: [
        "⚡ Instant transfers",
        "🔗 QR code payments",
        "📱 Mobile-friendly",
        "🌍 Global reach",
      ],
      gradient: "from-green-500 via-emerald-500 to-teal-500",
      demo: "Send and receive crypto payments effortlessly",
    },
    {
      title: "🎯 Ready to Start?",
      description: "Choose your path to explore VealthX",
      features: [
        "🎮 Demo Mode - Try features without wallet",
        "👛 Connect Wallet - Full access to DeFi",
        "📚 Read Documentation",
        "🚀 Start earning yields today!",
      ],
      gradient: "from-cyan-500 via-purple-500 to-pink-500",
      cta: true,
    },
  ];

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setIsAnimating(true);
    }
  }, [isOpen]);

  const nextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setIsAnimating(false);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(true);
      }, 300);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setIsAnimating(false);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsAnimating(true);
      }, 300);
    }
  };

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  const step = demoSteps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-6 right-6 text-white/60 hover:text-white text-3xl font-bold transition-all hover:rotate-90 duration-300 z-10"
        aria-label="Close"
      >
        ×
      </button>

      {/* Main popup */}
      <div
        className={`relative w-full max-w-3xl bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden transition-all duration-500 ${
          isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Gradient header */}
        <div
          className={`h-2 bg-gradient-to-r ${step.gradient} transition-all duration-500`}
        ></div>

        {/* Content */}
        <div className="p-8 sm:p-12">
          {/* Step counter */}
          <div className="flex justify-center mb-6">
            <div className="flex space-x-2">
              {demoSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? "w-12 bg-gradient-to-r " + step.gradient
                      : index < currentStep
                      ? "w-2 bg-emerald-500"
                      : "w-2 bg-white/20"
                  }`}
                ></div>
              ))}
            </div>
          </div>

          {/* Title */}
          <h2
            className={`text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r ${step.gradient} mb-4 text-center animate-slideInUp`}
          >
            {step.title}
          </h2>

          {/* Description */}
          <p className="text-lg text-white/80 text-center mb-8 animate-slideInUp animation-delay-100">
            {step.description}
          </p>

          {/* Features list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {step.features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 animate-slideInUp"
                style={{ animationDelay: `${index * 100 + 200}ms` }}
              >
                <span className="text-2xl">{feature.split(" ")[0]}</span>
                <span className="text-white/90 font-medium">
                  {feature.split(" ").slice(1).join(" ")}
                </span>
              </div>
            ))}
          </div>

          {/* Demo hint */}
          {step.demo && (
            <div className="mb-8 p-4 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border border-cyan-500/30 rounded-xl animate-pulse-slow">
              <p className="text-cyan-300 text-center font-semibold">
                💡 {step.demo}
              </p>
            </div>
          )}

          {/* CTA section for last step */}
          {step.cta && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <button
                onClick={handleClose}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-black rounded-xl hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105"
              >
                🎮 Try Demo Mode
              </button>
              <button
                onClick={handleClose}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              >
                📚 Explore Features
              </button>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                currentStep === 0
                  ? "opacity-30 cursor-not-allowed bg-white/5"
                  : "bg-white/10 hover:bg-white/20 text-white hover:scale-105"
              }`}
            >
              ← Previous
            </button>

            <span className="text-white/50 font-medium">
              {currentStep + 1} / {demoSteps.length}
            </span>

            {currentStep < demoSteps.length - 1 ? (
              <button
                onClick={nextStep}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleClose}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105"
              >
                Get Started 🚀
              </button>
            )}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-emerald-500/20 to-transparent rounded-full blur-3xl -z-10"></div>
      </div>
    </div>
  );
};

export default DemoPopup;
