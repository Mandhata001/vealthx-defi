import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const SocialTradingHub = ({ demoMode = false }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [followedTraders, setFollowedTraders] = useState([]);
  const [socialSignals, setSocialSignals] = useState([]);
  const [copyTradingStats, setCopyTradingStats] = useState({});

  // Mock data for demo mode
  useEffect(() => {
    if (demoMode) {
      const mockLeaderboard = [
        {
          id: 1,
          name: "DefiMaster",
          avatar: "🚀",
          address: "0x1234...5678",
          totalReturn: 157.8,
          monthlyReturn: 23.4,
          winRate: 78.5,
          followers: 1247,
          aum: 2850000,
          trades: 156,
          strategy: "Yield Farming + Arbitrage",
          verified: true,
        },
        {
          id: 2,
          name: "RWAWhale",
          avatar: "🐋",
          address: "0x9876...5432",
          totalReturn: 142.3,
          monthlyReturn: 19.7,
          winRate: 82.1,
          followers: 893,
          aum: 1920000,
          trades: 89,
          strategy: "RWA Focus + Long Term",
          verified: true,
        },
        {
          id: 3,
          name: "AptosPro",
          avatar: "⚡",
          address: "0x5555...7777",
          totalReturn: 134.6,
          monthlyReturn: 18.2,
          winRate: 75.3,
          followers: 721,
          aum: 1450000,
          trades: 203,
          strategy: "High Frequency + Scalping",
          verified: false,
        },
        {
          id: 4,
          name: "YieldHunter",
          avatar: "🎯",
          address: "0x3333...9999",
          totalReturn: 128.9,
          monthlyReturn: 16.8,
          winRate: 71.2,
          followers: 456,
          aum: 980000,
          trades: 134,
          strategy: "Yield Optimization",
          verified: true,
        },
      ];

      const mockSocialSignals = [
        {
          trader: "DefiMaster",
          action: "Bought",
          asset: "RWA_REAL_ESTATE",
          amount: 50000,
          price: 1.245,
          time: "2 min ago",
          confidence: 95,
        },
        {
          trader: "RWAWhale",
          action: "Sold",
          asset: "RWA_TREASURY",
          amount: 25000,
          price: 0.987,
          time: "5 min ago",
          confidence: 88,
        },
        {
          trader: "AptosPro",
          action: "Bought",
          asset: "RWA_COMMODITIES",
          amount: 75000,
          price: 2.156,
          time: "8 min ago",
          confidence: 92,
        },
      ];

      const mockCopyStats = {
        totalCopied: 150000,
        activeCopiers: 234,
        monthlyProfit: 18750,
        successRate: 76.3,
      };

      setLeaderboard(mockLeaderboard);
      setSocialSignals(mockSocialSignals);
      setCopyTradingStats(mockCopyStats);
      setFollowedTraders(mockLeaderboard.slice(0, 2));
    }
  }, [demoMode]);

  const performanceData = [
    { month: "Jan", DefiMaster: 12, RWAWhale: 15, AptosPro: 8 },
    { month: "Feb", DefiMaster: 18, RWAWhale: 12, AptosPro: 14 },
    { month: "Mar", DefiMaster: 25, RWAWhale: 20, AptosPro: 18 },
    { month: "Apr", DefiMaster: 22, RWAWhale: 17, AptosPro: 16 },
    { month: "May", DefiMaster: 28, RWAWhale: 23, AptosPro: 21 },
    { month: "Jun", DefiMaster: 23, RWAWhale: 19, AptosPro: 18 },
  ];

  const strategyDistribution = [
    { name: "Yield Farming", value: 35, color: "#3B82F6" },
    { name: "RWA Focus", value: 28, color: "#10B981" },
    { name: "Arbitrage", value: 20, color: "#8B5CF6" },
    { name: "Scalping", value: 17, color: "#F59E0B" },
  ];

  const handleFollowTrader = (traderId) => {
    const trader = leaderboard.find((t) => t.id === traderId);
    if (trader && !followedTraders.find((t) => t.id === traderId)) {
      setFollowedTraders([...followedTraders, trader]);
    }
  };

  const handleUnfollowTrader = (traderId) => {
    setFollowedTraders(followedTraders.filter((t) => t.id !== traderId));
  };

  const handleCopyTrade = (signal) => {
    // In real implementation, this would create a copy trade
    console.log("Copying trade:", signal);
  };

  return (
    <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            👥 Social Trading Hub
          </h2>
          <p className="text-gray-400">
            Follow top performers and copy winning strategies
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2">
            <span className="text-gray-400 text-sm">
              Your Copy Trading Profit:{" "}
            </span>
            <span className="text-green-400 font-bold">
              +${copyTradingStats.monthlyProfit?.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Copy Trading Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <div className="text-gray-400 text-sm">Total Copied</div>
          <div className="text-2xl font-bold text-white">
            ${copyTradingStats.totalCopied?.toLocaleString()}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <div className="text-gray-400 text-sm">Active Copiers</div>
          <div className="text-2xl font-bold text-blue-400">
            {copyTradingStats.activeCopiers}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <div className="text-gray-400 text-sm">Success Rate</div>
          <div className="text-2xl font-bold text-green-400">
            {copyTradingStats.successRate}%
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <div className="text-gray-400 text-sm">Monthly Profit</div>
          <div className="text-2xl font-bold text-green-400">
            +${copyTradingStats.monthlyProfit?.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Trader Leaderboard */}
        <div className="xl:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">🏆 Top Traders</h3>
            <select className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm">
              <option value="30d">30 Days</option>
              <option value="7d">7 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>

          <div className="space-y-4">
            {leaderboard.map((trader, index) => (
              <div
                key={trader.id}
                className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-400">
                        #{index + 1}
                      </span>
                      <span className="text-2xl">{trader.avatar}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">
                          {trader.name}
                        </span>
                        {trader.verified && (
                          <span className="text-blue-400">✓</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-400">
                        {trader.address}
                      </div>
                      <div className="text-sm text-purple-400">
                        {trader.strategy}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-sm text-gray-400">Total Return</div>
                      <div className="font-bold text-green-400">
                        +{trader.totalReturn}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Monthly</div>
                      <div className="font-bold text-green-400">
                        +{trader.monthlyReturn}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Win Rate</div>
                      <div className="font-bold text-white">
                        {trader.winRate}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">AUM</div>
                      <div className="font-bold text-white">
                        ${(trader.aum / 1000000).toFixed(1)}M
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {followedTraders.find((t) => t.id === trader.id) ? (
                      <button
                        onClick={() => handleUnfollowTrader(trader.id)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        Following
                      </button>
                    ) : (
                      <button
                        onClick={() => handleFollowTrader(trader.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        Follow
                      </button>
                    )}
                    <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Trading Signals */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">📡 Live Signals</h3>

          <div className="space-y-4">
            {socialSignals.map((signal, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">
                    {signal.trader}
                  </span>
                  <span className="text-xs text-gray-400">{signal.time}</span>
                </div>

                <div className="mb-2">
                  <span
                    className={`font-bold ${
                      signal.action === "Bought"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {signal.action}
                  </span>
                  <span className="text-white ml-2">{signal.asset}</span>
                </div>

                <div className="flex justify-between text-sm mb-3">
                  <span className="text-gray-400">
                    Amount: ${signal.amount.toLocaleString()}
                  </span>
                  <span className="text-gray-400">Price: ${signal.price}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Confidence:</span>
                    <div className="w-12 h-2 bg-gray-700 rounded-full">
                      <div
                        className="h-full bg-green-400 rounded-full"
                        style={{ width: `${signal.confidence}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-green-400">
                      {signal.confidence}%
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopyTrade(signal)}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-xs transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Traders Performance */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            📈 Performance Comparison
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(17, 24, 39, 0.9)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="DefiMaster"
                stroke="#3B82F6"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="RWAWhale"
                stroke="#10B981"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="AptosPro"
                stroke="#8B5CF6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Strategy Distribution */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            🎯 Strategy Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={strategyDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {strategyDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(17, 24, 39, 0.9)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-4 mt-4">
            {strategyDistribution.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-300">
                  {item.name} ({item.value}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-white/20 rounded-xl p-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-2">
            🚀 Start Copy Trading Today
          </h3>
          <p className="text-gray-400 mb-4">
            Follow top performers and automatically copy their winning
            strategies
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Enable Auto-Copy
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Browse Strategies
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialTradingHub;
