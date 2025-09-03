import { useState } from "react";

const LandingHero = () => {
  const [selectedAsset, setSelectedAsset] = useState(0);

  const featuredAssets = [
    {
      name: "Manhattan Real Estate",
      type: "Real Estate",
      price: "$2,450",
      change: "+12.5%",
      volume: "$2.3M",
      image: "🏢",
      description: "Prime commercial property in NYC",
      minInvestment: "$100",
    },
    {
      name: "Gold Futures",
      type: "Commodities",
      price: "$2,018",
      change: "+8.3%",
      volume: "$1.8M",
      image: "🥇",
      description: "Physical gold backed tokens",
      minInvestment: "$50",
    },
    {
      name: "Contemporary Art",
      type: "Art & Collectibles",
      price: "$15,750",
      change: "+23.7%",
      volume: "$987K",
      image: "🎨",
      description: "Picasso collection fractionalized",
      minInvestment: "$250",
    },
    {
      name: "Private Equity",
      type: "Alternative Investments",
      price: "$5,240",
      change: "+15.2%",
      volume: "$1.2M",
      image: "💼",
      description: "Exclusive startup investments",
      minInvestment: "$500",
    },
  ];

  const stats = [
    { label: "Total Value Locked", value: "$47.2M", change: "+23%" },
    { label: "Active Traders", value: "12,450", change: "+156%" },
    { label: "Assets Tokenized", value: "847", change: "+89%" },
    { label: "Countries Served", value: "23", change: "+12%" },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Hero content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  <span>Live on Aptos Mainnet</span>
                </div>

                <h1 className="text-5xl lg:text-6xl font-bold">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                    Democratizing
                  </span>
                  <br />
                  <span className="text-gray-900">Real World Assets</span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                  Trade fractional real estate, commodities, and art with
                  institutional-grade tools. Starting from just{" "}
                  <span className="font-semibold text-green-600">$10</span>.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-sm border">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm font-medium">
                      0.1% Trading Fees
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-sm border">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm font-medium">
                      AI-Powered Insights
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-sm border">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm font-medium">Social Trading</span>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    Start Trading Now
                  </button>
                  <button className="bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-blue-300 transition-all duration-300">
                    Watch Demo
                  </button>
                </div>
              </div>
            </div>

            {/* Right side - Asset showcase */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-6 backdrop-blur-sm border border-white/20">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Featured RWA Assets
                </h3>

                {/* Asset tabs */}
                <div className="flex space-x-1 mb-4 bg-gray-100 rounded-lg p-1">
                  {featuredAssets.map((asset, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedAsset(index)}
                      className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        selectedAsset === index
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {asset.image}
                    </button>
                  ))}
                </div>

                {/* Selected asset details */}
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {featuredAssets[selectedAsset].name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {featuredAssets[selectedAsset].type}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {featuredAssets[selectedAsset].price}
                      </p>
                      <p className="text-sm text-green-600 font-medium">
                        {featuredAssets[selectedAsset].change}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm">
                    {featuredAssets[selectedAsset].description}
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">24h Volume</p>
                      <p className="font-semibold text-gray-900">
                        {featuredAssets[selectedAsset].volume}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">Min. Investment</p>
                      <p className="font-semibold text-gray-900">
                        {featuredAssets[selectedAsset].minInvestment}
                      </p>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300">
                    Trade {featuredAssets[selectedAsset].name}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats section */}
      <div className="relative bg-white/50 backdrop-blur-sm border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Platform Statistics
            </h2>
            <p className="text-gray-600">
              Real-time metrics from our growing ecosystem
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <p className="text-3xl lg:text-4xl font-bold text-gray-900">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-sm text-green-600 font-medium">
                  {stat.change} this month
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose VealthX?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The only platform combining institutional-grade RWA trading with
            social features and AI insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto">
              <span className="text-2xl text-white">🏦</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Professional Trading
            </h3>
            <p className="text-gray-600">
              Advanced CLOB with real-time order matching and institutional
              liquidity
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
              <span className="text-2xl text-white">👥</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Social Trading
            </h3>
            <p className="text-gray-600">
              Copy successful traders automatically with built-in risk
              management
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto">
              <span className="text-2xl text-white">🤖</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">AI Insights</h3>
            <p className="text-gray-600">
              Real-time portfolio optimization and predictive market analysis
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default LandingHero;
