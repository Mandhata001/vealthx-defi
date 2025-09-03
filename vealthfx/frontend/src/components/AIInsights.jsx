import { useState, useEffect } from "react";

const AIInsights = () => {
  const [currentInsight, setCurrentInsight] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const insights = [
    {
      type: "optimization",
      icon: "🧠",
      title: "Portfolio Optimization",
      message:
        "Consider increasing Real Estate allocation by 15% for better risk-adjusted returns",
      confidence: 87,
      action: "Rebalance Portfolio",
    },
    {
      type: "risk",
      icon: "⚠️",
      title: "Risk Alert",
      message:
        "High volatility detected in Art & Collectibles sector (-12% in 24h)",
      confidence: 94,
      action: "Review Holdings",
    },
    {
      type: "prediction",
      icon: "📈",
      title: "Market Prediction",
      message: "Gold prices trending upward (+8.5% predicted for next week)",
      confidence: 73,
      action: "Consider Entry",
    },
    {
      type: "fraud",
      icon: "🛡️",
      title: "Security Alert",
      message:
        "Unusual trading pattern detected - verifying transaction authenticity",
      confidence: 99,
      action: "Monitor Activity",
    },
    {
      type: "social",
      icon: "👥",
      title: "Social Signal",
      message:
        "Top traders are accumulating Private Equity positions (+23% this week)",
      confidence: 81,
      action: "Explore Trend",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInsight((prev) => (prev + 1) % insights.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [insights.length]);

  if (!isVisible) return null;

  const insight = insights[currentInsight];

  const getColors = (type) => {
    switch (type) {
      case "optimization":
        return "from-blue-500 to-blue-600 border-blue-200";
      case "risk":
        return "from-red-500 to-red-600 border-red-200";
      case "prediction":
        return "from-green-500 to-green-600 border-green-200";
      case "fraud":
        return "from-orange-500 to-orange-600 border-orange-200";
      case "social":
        return "from-purple-500 to-purple-600 border-purple-200";
      default:
        return "from-gray-500 to-gray-600 border-gray-200";
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm">
      <div
        className={`bg-gradient-to-r ${getColors(
          insight.type
        )} rounded-xl p-4 text-white shadow-2xl border-2 transform transition-all duration-500 hover:scale-105`}
      >
        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 text-white hover:text-gray-200 transition-colors"
        >
          ×
        </button>

        {/* AI Avatar */}
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-lg">{insight.icon}</span>
          </div>

          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium opacity-90">VealthAI</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs opacity-75">Live</span>
              </div>
            </div>

            {/* Content */}
            <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
            <p className="text-sm opacity-90 leading-relaxed mb-3">
              {insight.message}
            </p>

            {/* Confidence & Action */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs opacity-75">Confidence:</span>
                <div className="w-16 bg-white/20 rounded-full h-2">
                  <div
                    className="bg-white h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${insight.confidence}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium">
                  {insight.confidence}%
                </span>
              </div>

              <button className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-xs font-medium transition-colors">
                {insight.action}
              </button>
            </div>
          </div>
        </div>

        {/* Progress indicators */}
        <div className="flex space-x-1 mt-4 justify-center">
          {insights.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentInsight ? "bg-white" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
