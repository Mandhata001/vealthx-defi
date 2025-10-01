import { useState } from "react";

const LandingHero = ({ onConnectWallet }) => {
  const [selectedAsset, setSelectedAsset] = useState(0);

  const featuredAssets = [
    {
      name: "Manhattan Real Estate",
      type: "Real Estate",
      price: "$2,450",
      change: "+12.5%",
      volume: "$2.3M",
      image: "",
      description: "Prime commercial property in NYC",
      minInvestment: "$100",
    },
    {
      name: "Gold Futures",
      type: "Commodities",
      price: "$2,018",
      change: "+8.3%",
      volume: "$1.8M",
      image: "",
      description: "Physical gold backed tokens",
      minInvestment: "$50",
    },
    {
      name: "Contemporary Art",
      type: "Art & Collectibles",
      price: "$15,750",
      change: "+23.7%",
      volume: "$987K",
      image: "",
      description: "Picasso collection fractionalized",
      minInvestment: "$250",
    },
    {
      name: "Private Equity",
      type: "Alternative Investments",
      price: "$5,240",
      change: "+15.2%",
      volume: "$1.2M",
      image: "",
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
    <div className="w-full min-h-screen overflow-hidden">
      {/* Full-width Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 w-full min-h-screen">
        {/* Modern DeFi Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-violet-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-4000"></div>

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='%2300f5ff' stroke-width='1' opacity='0.3'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)' /%3E%3C/svg%3E")`,
              }}
            ></div>
          </div>
        </div>

        {/* Content with centered container */}
        <div className="relative w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16 items-center min-h-screen">
              {/* Left side - Hero content */}
              <div className="space-y-10">
                <div className="space-y-8">
                  <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 backdrop-blur-sm border border-cyan-400/30 text-cyan-300 px-6 py-3 rounded-full text-sm font-bold shadow-lg shadow-cyan-500/25">
                    <span className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></span>
                    <span>🚀 Live on Aptos Mainnet • $47M+ TVL</span>
                  </div>

                  <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black leading-tight relative">
                    {/* X-shaped moving animation behind text */}
                    <div className="absolute inset-0 overflow-hidden">
                      <div
                        className="x-shape-bg x-shape-1"
                        style={{ top: "10%", left: "5%" }}
                      ></div>
                      <div
                        className="x-shape-bg x-shape-2"
                        style={{ top: "70%", right: "10%" }}
                      ></div>
                      <div
                        className="x-shape-bg x-shape-1"
                        style={{
                          top: "35%",
                          left: "65%",
                          animationDelay: "-5s",
                        }}
                      ></div>
                      <div
                        className="x-shape-bg x-shape-2"
                        style={{
                          top: "50%",
                          left: "20%",
                          animationDelay: "-10s",
                        }}
                      ></div>
                      <div
                        className="x-shape-bg x-shape-1"
                        style={{
                          top: "80%",
                          left: "80%",
                          animationDelay: "-7s",
                        }}
                      ></div>
                    </div>

                    <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-2xl relative z-10">
                      VealthX
                    </span>
                    <br />
                    <span className="text-white drop-shadow-2xl relative z-10">
                      DeFi
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-emerald-400 via-violet-400 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl relative z-10">
                      Revolution
                    </span>
                  </h1>

                  <p className="text-xl lg:text-2xl text-gray-200 leading-relaxed max-w-2xl">
                    <span className="text-cyan-300 font-bold">
                      Democratize finance
                    </span>{" "}
                    with fractional real-world assets.
                    <br />
                    Trade{" "}
                    <span className="text-emerald-400 font-bold">
                      real estate
                    </span>
                    ,{" "}
                    <span className="text-violet-400 font-bold">
                      commodities
                    </span>
                    , and <span className="text-pink-400 font-bold">art</span>{" "}
                    starting from just{" "}
                    <span className="font-black text-2xl text-emerald-400 drop-shadow-lg">
                      $10
                    </span>
                    .
                  </p>
                </div>

                <div className="space-y-8">
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-3 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 backdrop-blur-sm border border-cyan-400/30 rounded-2xl px-6 py-4 shadow-lg hover:shadow-cyan-500/25 transition-all group">
                      <span className="text-2xl">💎</span>
                      <div>
                        <div className="font-bold text-white text-sm">
                          0.1% Fees
                        </div>
                        <div className="text-cyan-400 text-xs">Ultra Low</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 bg-gradient-to-r from-emerald-500/10 to-violet-500/10 backdrop-blur-sm border border-emerald-400/30 rounded-2xl px-6 py-4 shadow-lg hover:shadow-emerald-500/25 transition-all group">
                      <span className="text-2xl">🤖</span>
                      <div>
                        <div className="font-bold text-white text-sm">
                          AI Trading
                        </div>
                        <div className="text-emerald-400 text-xs">
                          Smart Routes
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 bg-gradient-to-r from-violet-500/10 to-pink-500/10 backdrop-blur-sm border border-violet-400/30 rounded-2xl px-6 py-4 shadow-lg hover:shadow-violet-500/25 transition-all group">
                      <span className="text-2xl">👥</span>
                      <div>
                        <div className="font-bold text-white text-sm">
                          Social Copy
                        </div>
                        <div className="text-violet-400 text-xs">
                          Follow Pros
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                    <button
                      onClick={onConnectWallet}
                      className="bg-gradient-to-r from-cyan-500 via-emerald-500 to-cyan-400 text-black px-10 py-5 rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-cyan-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 focus-visible:scale-105 focus-visible:-translate-y-1 relative overflow-hidden group"
                    >
                      <span className="relative z-10">🔗 Connect Wallet</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                    <button className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/20 hover:border-cyan-400/50 hover:shadow-xl hover:shadow-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:bg-white/20 focus-visible:border-cyan-400/50 transition-all duration-300 transform hover:scale-105 focus-visible:scale-105">
                      📺 Watch Demo
                    </button>
                  </div>
                </div>
              </div>

              {/* Right side - Asset showcase */}
              <div className="space-y-8">
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl shadow-cyan-500/10 p-8 border border-cyan-400/20">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    🔥 Featured RWA Assets
                  </h3>

                  {/* Asset tabs */}
                  <div className="flex space-x-2 mb-6 bg-black/20 rounded-xl p-2">
                    {featuredAssets.map((asset, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedAsset(index)}
                        aria-label={`Select ${asset.type}`}
                        className={`flex-1 px-4 py-3 rounded-lg text-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                          selectedAsset === index
                            ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-black shadow-lg shadow-cyan-500/25"
                            : "text-gray-300 hover:text-white hover:bg-white/10 focus-visible:text-white focus-visible:bg-white/10"
                        }`}
                      >
                        <span aria-hidden="true">
                          {asset.type.split(" ")[0] === "Real"
                            ? "🏢"
                            : asset.type === "Commodities"
                            ? "🥇"
                            : asset.type.includes("Art")
                            ? "🎨"
                            : "💼"}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Selected asset details */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xl font-bold text-white">
                          {featuredAssets[selectedAsset].name}
                        </h4>
                        <p className="text-cyan-300">
                          {featuredAssets[selectedAsset].type}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white">
                          {featuredAssets[selectedAsset].price}
                        </p>
                        <p className="text-emerald-400 font-bold">
                          {featuredAssets[selectedAsset].change}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-300">
                      {featuredAssets[selectedAsset].description}
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/20 rounded-xl p-4 border border-cyan-500/20">
                        <p className="text-cyan-300 font-medium">24h Volume</p>
                        <p className="text-xl font-bold text-white">
                          {featuredAssets[selectedAsset].volume}
                        </p>
                      </div>
                      <div className="bg-black/20 rounded-xl p-4 border border-emerald-500/20">
                        <p className="text-emerald-300 font-medium">
                          Min. Investment
                        </p>
                        <p className="text-xl font-bold text-white">
                          {featuredAssets[selectedAsset].minInvestment}
                        </p>
                      </div>
                    </div>

                    <button className="w-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-400 text-black py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-emerald-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 transition-all duration-300 transform hover:scale-105 focus-visible:scale-105">
                      Trade {featuredAssets[selectedAsset].name} →
                    </button>
                  </div>
                </div>

                {/* Live stats */}
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl shadow-violet-500/10 p-8 border border-violet-400/20">
                  <h3 className="text-xl font-bold text-white mb-6">
                    📊 Live Platform Stats
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    {stats.map((stat, index) => (
                      <div key={index} className="text-center">
                        <p className="text-2xl font-bold text-white">
                          {stat.value}
                        </p>
                        <p className="text-sm text-gray-300">{stat.label}</p>
                        <p className="text-sm text-emerald-400 font-bold">
                          {stat.change} ↗
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Neon Ticker with proper marquee animation */}
        <div className="relative bg-black/50 backdrop-blur-sm border-y border-cyan-500/30 w-full overflow-hidden">
          <div className="relative flex overflow-x-hidden py-6">
            <div className="flex space-x-12 whitespace-nowrap animate-marquee">
              <span className="text-cyan-300 font-bold text-lg">
                🏢 Manhattan RE:{" "}
                <span className="text-emerald-400">$2,450 (+12.5%)</span>
              </span>
              <span className="text-cyan-300 font-bold text-lg">
                🥇 Gold Futures:{" "}
                <span className="text-emerald-400">$2,018 (+8.3%)</span>
              </span>
              <span className="text-cyan-300 font-bold text-lg">
                🎨 Art Collection:{" "}
                <span className="text-emerald-400">$15,750 (+23.7%)</span>
              </span>
              <span className="text-cyan-300 font-bold text-lg">
                💼 Private Equity:{" "}
                <span className="text-emerald-400">$5,240 (+15.2%)</span>
              </span>
              <span className="text-violet-300 font-bold text-lg">
                💰 TVL: <span className="text-emerald-400">$47.2M</span>
              </span>
              <span className="text-violet-300 font-bold text-lg">
                👥 Traders: <span className="text-cyan-400">12,450</span>
              </span>
            </div>
            {/* Duplicate for seamless loop */}
            <div className="absolute top-0 flex space-x-12 whitespace-nowrap animate-marquee py-6">
              <span className="text-cyan-300 font-bold text-lg">
                🏢 Manhattan RE:{" "}
                <span className="text-emerald-400">$2,450 (+12.5%)</span>
              </span>
              <span className="text-cyan-300 font-bold text-lg">
                🥇 Gold Futures:{" "}
                <span className="text-emerald-400">$2,018 (+8.3%)</span>
              </span>
              <span className="text-cyan-300 font-bold text-lg">
                🎨 Art Collection:{" "}
                <span className="text-emerald-400">$15,750 (+23.7%)</span>
              </span>
              <span className="text-cyan-300 font-bold text-lg">
                💼 Private Equity:{" "}
                <span className="text-emerald-400">$5,240 (+15.2%)</span>
              </span>
              <span className="text-violet-300 font-bold text-lg">
                💰 TVL: <span className="text-emerald-400">$47.2M</span>
              </span>
              <span className="text-violet-300 font-bold text-lg">
                👥 Traders: <span className="text-cyan-400">12,450</span>
              </span>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="w-full bg-gradient-to-b from-slate-900 to-black py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-5xl lg:text-6xl font-black text-white mb-8">
                Why Choose{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-violet-400 bg-clip-text text-transparent">
                  VealthX
                </span>
                ?
              </h2>
              <p className="text-2xl text-gray-300 max-w-4xl mx-auto">
                The most{" "}
                <span className="text-cyan-400 font-bold">
                  advanced DeFi platform
                </span>{" "}
                for real-world asset trading
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-8 bg-gradient-to-b from-cyan-500/10 to-cyan-500/5 backdrop-blur-xl border border-cyan-400/20 rounded-3xl hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
                <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/50">
                  <span className="text-4xl">🔒</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">
                  Bank-Grade Security
                </h3>
                <p className="text-gray-300">
                  Military-grade encryption and multi-signature wallets protect
                  your assets
                </p>
              </div>

              <div className="text-center p-8 bg-gradient-to-b from-emerald-500/10 to-emerald-500/5 backdrop-blur-xl border border-emerald-400/20 rounded-3xl hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/50">
                  <span className="text-4xl">⚡</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">
                  Lightning Fast
                </h3>
                <p className="text-gray-300">
                  Instant transactions with 0.1% fees on high-performance Aptos
                  blockchain
                </p>
              </div>

              <div className="text-center p-8 bg-gradient-to-b from-violet-500/10 to-violet-500/5 backdrop-blur-xl border border-violet-400/20 rounded-3xl hover:shadow-2xl hover:shadow-violet-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
                <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-500/50">
                  <span className="text-4xl">🤖</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">
                  AI-Powered
                </h3>
                <p className="text-gray-300">
                  Smart routing and automated strategies powered by machine
                  learning
                </p>
              </div>

              <div className="text-center p-8 bg-gradient-to-b from-pink-500/10 to-pink-500/5 backdrop-blur-xl border border-pink-400/20 rounded-3xl hover:shadow-2xl hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
                <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-pink-500/50">
                  <span className="text-4xl">🌍</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">
                  Global Access
                </h3>
                <p className="text-gray-300">
                  Trade real-world assets from anywhere in the world, 24/7
                  market access
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="w-full bg-gradient-to-r from-black via-slate-900 to-black py-24 border-t border-cyan-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-5xl lg:text-6xl font-black text-white mb-8">
              Ready to{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-violet-400 bg-clip-text text-transparent">
                Revolutionize
              </span>{" "}
              Finance?
            </h2>
            <p className="text-2xl text-gray-300 mb-12 max-w-4xl mx-auto">
              Join{" "}
              <span className="text-emerald-400 font-bold">
                12,450+ traders
              </span>{" "}
              already earning with VealthX • No minimum deposit
            </p>
            <div className="flex flex-col sm:flex-row gap-8 justify-center">
              <button className="bg-gradient-to-r from-cyan-500 via-emerald-500 to-cyan-400 text-black px-16 py-6 rounded-2xl font-black text-xl hover:shadow-2xl hover:shadow-emerald-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 focus-visible:scale-110 focus-visible:-translate-y-2 relative overflow-hidden group">
                <span className="relative z-10">🚀 Start Trading Now</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button className="bg-white/5 backdrop-blur-sm border-2 border-cyan-400/50 text-white px-16 py-6 rounded-2xl font-bold text-xl hover:bg-cyan-500/10 hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:bg-cyan-500/10 focus-visible:border-cyan-400 transition-all duration-300 transform hover:scale-105 focus-visible:scale-105">
                📚 Learn DeFi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingHero;
