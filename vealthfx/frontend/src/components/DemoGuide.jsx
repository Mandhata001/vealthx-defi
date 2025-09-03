import { useState, useEffect } from "react";

const DemoGuide = ({ isActive, onClose, onTabChange }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const demoSteps = [
    {
      tab: "vault",
      title: "Welcome to VealthX",
      description:
        "The first RWA DeFi platform democratizing access to real-world assets through fractional trading.",
      highlight: "Experience institutional-grade trading with just $10",
      duration: 8000,
    },
    {
      tab: "trading",
      title: "Professional RWA Trading",
      description:
        "Trade fractional real estate, commodities, and art through our advanced CLOB (Central Limit Order Book).",
      highlight:
        "Order book matching with 0.1% fees - better than traditional platforms",
      duration: 10000,
    },
    {
      tab: "social",
      title: "Social & Copy Trading",
      description:
        "Follow successful traders and automatically copy their strategies with built-in risk management.",
      highlight: "Top trader achieved 127% returns last quarter",
      duration: 8000,
    },
    {
      tab: "payments",
      title: "Global Payments & Remittance",
      description:
        "Send money across borders instantly with competitive rates using stablecoins and local payment corridors.",
      highlight:
        "80% cheaper than traditional remittance - $1M+ processed daily",
      duration: 8000,
    },
    {
      tab: "analytics",
      title: "AI-Powered Analytics",
      description:
        "Real-time portfolio optimization with AI insights, risk monitoring, and predictive market analysis.",
      highlight: "AI recommendations increased user returns by 34% on average",
      duration: 8000,
    },
  ];

  useEffect(() => {
    if (isAutoPlaying && isActive) {
      const timer = setTimeout(() => {
        if (currentStep < demoSteps.length - 1) {
          const nextStep = currentStep + 1;
          setCurrentStep(nextStep);
          onTabChange(demoSteps[nextStep].tab);
        } else {
          setIsAutoPlaying(false);
        }
      }, demoSteps[currentStep].duration);

      return () => clearTimeout(timer);
    }
  }, [currentStep, isAutoPlaying, isActive, demoSteps, onTabChange]);

  const handleNext = () => {
    if (currentStep < demoSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      onTabChange(demoSteps[nextStep].tab);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      onTabChange(demoSteps[prevStep].tab);
    }
  };

  const handleStepClick = (stepIndex) => {
    setCurrentStep(stepIndex);
    onTabChange(demoSteps[stepIndex].tab);
  };

  const startAutoPlay = () => {
    setIsAutoPlaying(true);
    if (currentStep === 0) {
      onTabChange(demoSteps[0].tab);
    }
  };

  if (!isActive) return null;

  const currentDemo = demoSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">🎬 VealthX Demo Tour</h2>
              <p className="text-blue-100">
                Interactive walkthrough of our platform
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 transition-colors text-2xl"
            >
              ×
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>
                Step {currentStep + 1} of {demoSteps.length}
              </span>
              <span>
                {Math.round(((currentStep + 1) / demoSteps.length) * 100)}%
                Complete
              </span>
            </div>
            <div className="w-full bg-blue-800/30 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${((currentStep + 1) / demoSteps.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {currentDemo.title}
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              {currentDemo.description}
            </p>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-semibold">
                💡 {currentDemo.highlight}
              </p>
            </div>
          </div>

          {/* Step indicators */}
          <div className="flex justify-center space-x-2 mb-6">
            {demoSteps.map((step, index) => (
              <button
                key={index}
                onClick={() => handleStepClick(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? "bg-blue-600 scale-125"
                    : index < currentStep
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
                title={step.title}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                currentStep === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              ← Previous
            </button>

            <div className="flex space-x-3">
              {!isAutoPlaying ? (
                <button
                  onClick={startAutoPlay}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <span>▶️</span>
                  <span>Auto Play</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsAutoPlaying(false)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center space-x-2"
                >
                  <span>⏸️</span>
                  <span>Pause</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Skip Tour
              </button>
            </div>

            <button
              onClick={handleNext}
              disabled={currentStep === demoSteps.length - 1}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                currentStep === demoSteps.length - 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {currentStep === demoSteps.length - 1 ? "Complete" : "Next →"}
            </button>
          </div>

          {/* Auto-play progress */}
          {isAutoPlaying && (
            <div className="mt-4">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <span>⏰ Auto-advancing in...</span>
                <div className="w-32 bg-gray-200 rounded-full h-1">
                  <div
                    className="bg-blue-600 h-1 rounded-full transition-all"
                    style={{
                      width: "100%",
                      animation: `shrink ${currentDemo.duration}ms linear forwards`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default DemoGuide;
