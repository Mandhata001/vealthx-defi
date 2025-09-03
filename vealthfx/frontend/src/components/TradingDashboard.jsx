import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const TradingDashboard = ({ demoMode = false }) => {
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
  const [recentTrades, setRecentTrades] = useState([]);
  const [marketData, setMarketData] = useState({
    bestBid: 0,
    bestAsk: 0,
    lastPrice: 0,
    volume24h: 0,
    priceChange24h: 0,
  });
  const [selectedAsset, setSelectedAsset] = useState("RWA_REAL_ESTATE");

  // Mock data for demo mode
  useEffect(() => {
    if (demoMode) {
      // Simulate real-time order book data
      const mockBids = [
        { price: 1.245, quantity: 1500, total: 1867.5 },
        { price: 1.244, quantity: 2300, total: 2861.2 },
        { price: 1.243, quantity: 1800, total: 2237.4 },
        { price: 1.242, quantity: 3200, total: 3974.4 },
        { price: 1.241, quantity: 1900, total: 2357.9 },
      ];

      const mockAsks = [
        { price: 1.246, quantity: 1200, total: 1495.2 },
        { price: 1.247, quantity: 1850, total: 2306.95 },
        { price: 1.248, quantity: 2100, total: 2620.8 },
        { price: 1.249, quantity: 1650, total: 2060.85 },
        { price: 1.25, quantity: 2800, total: 3500.0 },
      ];

      const mockTrades = [
        { time: "14:23:45", price: 1.245, quantity: 150, side: "buy" },
        { time: "14:23:42", price: 1.244, quantity: 200, side: "sell" },
        { time: "14:23:38", price: 1.246, quantity: 300, side: "buy" },
        { time: "14:23:35", price: 1.243, quantity: 180, side: "sell" },
        { time: "14:23:30", price: 1.245, quantity: 250, side: "buy" },
      ];

      setOrderBook({ bids: mockBids, asks: mockAsks });
      setRecentTrades(mockTrades);
      setMarketData({
        bestBid: 1.245,
        bestAsk: 1.246,
        lastPrice: 1.245,
        volume24h: 2847500,
        priceChange24h: +2.34,
      });
    }
  }, [demoMode]);

  const priceChartData = [
    { time: "09:00", price: 1.22 },
    { time: "10:00", price: 1.235 },
    { time: "11:00", price: 1.228 },
    { time: "12:00", price: 1.242 },
    { time: "13:00", price: 1.238 },
    { time: "14:00", price: 1.245 },
    { time: "15:00", price: 1.245 },
  ];

  const assets = [
    { id: "RWA_REAL_ESTATE", name: "Real Estate Token", symbol: "RET" },
    { id: "RWA_COMMODITIES", name: "Commodity Token", symbol: "CMT" },
    { id: "RWA_TREASURY", name: "Treasury Bond Token", symbol: "TBT" },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Asset Selector */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            🏛️ RWA Trading Floor
          </h2>
          <p className="text-gray-400">
            Fractional Real World Asset trading with instant liquidity
          </p>
        </div>

        <div className="flex items-center gap-4">
          <select
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
          >
            {assets.map((asset) => (
              <option key={asset.id} value={asset.id} className="bg-gray-800">
                {asset.symbol} - {asset.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Market Data Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <div className="text-gray-400 text-sm">Last Price</div>
          <div className="text-2xl font-bold text-white">
            ${marketData.lastPrice.toFixed(3)}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <div className="text-gray-400 text-sm">24h Change</div>
          <div
            className={`text-2xl font-bold ${
              marketData.priceChange24h >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {marketData.priceChange24h >= 0 ? "+" : ""}
            {marketData.priceChange24h}%
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <div className="text-gray-400 text-sm">Best Bid</div>
          <div className="text-2xl font-bold text-green-400">
            ${marketData.bestBid.toFixed(3)}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <div className="text-gray-400 text-sm">Best Ask</div>
          <div className="text-2xl font-bold text-red-400">
            ${marketData.bestAsk.toFixed(3)}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <div className="text-gray-400 text-sm">24h Volume</div>
          <div className="text-2xl font-bold text-white">
            ${(marketData.volume24h / 1000000).toFixed(2)}M
          </div>
        </div>
      </div>

      {/* Main Trading Interface */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Price Chart */}
        <div className="xl:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">📈 Price Chart</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={priceChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis
                stroke="#9CA3AF"
                domain={["dataMin - 0.01", "dataMax + 0.01"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(17, 24, 39, 0.9)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#3B82F6"
                fill="url(#priceGradient)"
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Order Book */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">📋 Order Book</h3>

          {/* Asks (Sell Orders) */}
          <div className="mb-4">
            <div className="text-sm text-gray-400 mb-2">Asks (Sell)</div>
            <div className="space-y-1">
              {orderBook.asks
                .slice()
                .reverse()
                .map((ask, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-sm bg-red-500/10 p-2 rounded"
                  >
                    <span className="text-red-400">
                      ${ask.price.toFixed(3)}
                    </span>
                    <span className="text-gray-300">{ask.quantity}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Spread */}
          <div className="text-center py-2 border-y border-white/20 mb-4">
            <span className="text-gray-400 text-sm">
              Spread: ${(marketData.bestAsk - marketData.bestBid).toFixed(3)}
            </span>
          </div>

          {/* Bids (Buy Orders) */}
          <div>
            <div className="text-sm text-gray-400 mb-2">Bids (Buy)</div>
            <div className="space-y-1">
              {orderBook.bids.map((bid, index) => (
                <div
                  key={index}
                  className="flex justify-between text-sm bg-green-500/10 p-2 rounded"
                >
                  <span className="text-green-400">
                    ${bid.price.toFixed(3)}
                  </span>
                  <span className="text-gray-300">{bid.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Trades and Trading Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Trades */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            🔄 Recent Trades
          </h3>
          <div className="space-y-2">
            <div className="grid grid-cols-4 text-sm text-gray-400 border-b border-white/20 pb-2">
              <span>Time</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Side</span>
            </div>
            {recentTrades.map((trade, index) => (
              <div key={index} className="grid grid-cols-4 text-sm">
                <span className="text-gray-300">{trade.time}</span>
                <span className="text-white">${trade.price.toFixed(3)}</span>
                <span className="text-gray-300">{trade.quantity}</span>
                <span
                  className={`font-semibold ${
                    trade.side === "buy" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {trade.side.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Trading Form */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">⚡ Quick Trade</h3>

          <div className="space-y-4">
            <div className="flex gap-2">
              <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold transition-colors">
                BUY
              </button>
              <button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold transition-colors">
                SELL
              </button>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Price (USDC)
              </label>
              <input
                type="number"
                placeholder="1.245"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Quantity
              </label>
              <input
                type="number"
                placeholder="100"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
              />
            </div>

            <div className="flex gap-2">
              <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition-colors">
                Market Order
              </button>
              <button className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg font-semibold transition-colors">
                Limit Order
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trading Features Showcase */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">
          🚀 Advanced Trading Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl mb-2">⚡</div>
            <div className="font-semibold text-white">Instant Settlement</div>
            <div className="text-sm text-gray-400">
              Sub-second trade execution on Aptos
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🔄</div>
            <div className="font-semibold text-white">Auto-Routing</div>
            <div className="text-sm text-gray-400">
              Best price discovery across pools
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-semibold text-white">Real-Time Analytics</div>
            <div className="text-sm text-gray-400">
              Live market data and insights
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingDashboard;
