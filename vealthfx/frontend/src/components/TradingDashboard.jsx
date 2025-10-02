import React, { useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { aptos, toOctas, fromOctas } from "../lib/aptos";
import { getAccountAddress } from "../utils/addressUtils.js";
import { useRealTimeData, usePriceFeed } from "../hooks/useRealTimeData.js";
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

const TradingDashboard = ({ demoMode = false, walletConnected, account }) => {
  const { account: walletAccount, signAndSubmitTransaction } = useWallet();
  const currentAccount = account || walletAccount;

  // Real-time data hooks
  const { events, loading: eventsLoading } = useRealTimeData(
    currentAccount?.address,
    null,
    walletConnected && !demoMode
  );
  const { prices, loading: pricesLoading } = usePriceFeed(
    ["APT/USDC", "APT/ETH", "APT/BTC"],
    true
  );
  const [orderBook, setOrderBook] = useState({
    bids: [
      { price: 1.2345, amount: 1000, total: 1234.5 },
      { price: 1.234, amount: 1500, total: 1851.0 },
      { price: 1.2335, amount: 2000, total: 2467.0 },
      { price: 1.233, amount: 800, total: 986.4 },
    ],
    asks: [
      { price: 1.235, amount: 1200, total: 1482.0 },
      { price: 1.2355, amount: 900, total: 1111.95 },
      { price: 1.236, amount: 1600, total: 1977.6 },
      { price: 1.2365, amount: 750, total: 927.375 },
    ],
  });

  const [selectedPair, setSelectedPair] = useState("APT/USDC");
  const [orderType, setOrderType] = useState("buy");
  const [orderAmount, setOrderAmount] = useState("");
  const [orderPrice, setOrderPrice] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [recentTrades, setRecentTrades] = useState([
    {
      id: 1,
      pair: "APT/USDC",
      side: "buy",
      amount: 150.0,
      price: 12.45,
      time: "14:23:12",
      status: "completed",
    },
    {
      id: 2,
      pair: "APT/USDC",
      side: "sell",
      amount: 75.5,
      price: 12.4,
      time: "14:21:45",
      status: "completed",
    },
    {
      id: 3,
      pair: "APT/USDC",
      side: "buy",
      amount: "200.00",
      price: "12.42",
      time: "14:18:33",
      status: "completed",
    },
  ]);

  // Use real-time prices or fallback to static data
  const tradingPairs = [
    {
      symbol: "APT/USDC",
      price: prices["APT/USDC"]?.price || "12.45",
      change: prices["APT/USDC"]?.change24h
        ? `${prices["APT/USDC"].change24h}%`
        : "+2.34%",
      volume: prices["APT/USDC"]?.volume24h
        ? `${(prices["APT/USDC"].volume24h / 1000000).toFixed(1)}M`
        : "1.2M",
    },
    {
      symbol: "APT/ETH",
      price: prices["APT/ETH"]?.price || "0.0032",
      change: prices["APT/ETH"]?.change24h
        ? `${prices["APT/ETH"].change24h}%`
        : "-1.12%",
      volume: prices["APT/ETH"]?.volume24h
        ? `${(prices["APT/ETH"].volume24h / 1000).toFixed(0)}K`
        : "850K",
    },
    {
      symbol: "APT/BTC",
      price: prices["APT/BTC"]?.price || "0.00025",
      change: prices["APT/BTC"]?.change24h
        ? `${prices["APT/BTC"].change24h}%`
        : "+0.89%",
      volume: prices["APT/BTC"]?.volume24h
        ? `${(prices["APT/BTC"].volume24h / 1000).toFixed(0)}K`
        : "650K",
    },
  ];

  const handlePlaceOrder = async () => {
    if (!currentAccount) {
      alert("Please connect your wallet first");
      return;
    }

    if (!orderAmount || !orderPrice) {
      alert("Please enter both amount and price");
      return;
    }

    // Validate signAndSubmitTransaction is available
    if (!demoMode && !signAndSubmitTransaction) {
      alert("Wallet not properly connected. Please reconnect your wallet.");
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate order placement with actual transaction structure
      const orderValue = parseFloat(orderAmount) * parseFloat(orderPrice);

      if (demoMode) {
        // Demo mode - just update local state
        const newOrder = {
          price: parseFloat(orderPrice),
          amount: parseFloat(orderAmount),
          total: orderValue,
        };

        if (orderType === "buy") {
          setOrderBook((prev) => ({
            ...prev,
            bids: [...(prev.bids || []), newOrder].sort(
              (a, b) => b.price - a.price
            ),
          }));
        } else {
          setOrderBook((prev) => ({
            ...prev,
            asks: [...(prev.asks || []), newOrder].sort(
              (a, b) => a.price - b.price
            ),
          }));
        }

        // Add to recent trades
        const newTrade = {
          id: Date.now(),
          pair: selectedPair,
          side: orderType,
          amount: parseFloat(orderAmount),
          price: parseFloat(orderPrice),
          time: new Date().toLocaleTimeString(),
          status: "completed",
        };
        setRecentTrades((prev) => [newTrade, ...prev.slice(0, 9)]);
      } else {
        // Real mode - create actual transaction (simplified trading)
        const accountAddress = getAccountAddress(currentAccount);
        if (!accountAddress) {
          throw new Error("Invalid account address");
        }

        // Validate account address format
        if (!accountAddress.startsWith("0x")) {
          throw new Error("Invalid account address format");
        }

        // For demo purposes, we'll simulate a trade by transferring tokens
        // In a real CLOB, this would interact with an order book contract
        const transaction = {
          type: "entry_function_payload",
          function: "0x1::aptos_account::transfer",
          type_arguments: [],
          arguments: [accountAddress, toOctas(0.001)], // Small fee for demo
        };

        console.log("Trading transaction payload:", transaction);
        const result = await signAndSubmitTransaction(transaction);
        console.log("Trade transaction:", result);

        // Add to order book (local state for UI)
        const newOrder = {
          price: parseFloat(orderPrice),
          amount: parseFloat(orderAmount),
          total: orderValue,
          txHash: result.hash,
        };

        if (orderType === "buy") {
          setOrderBook((prev) => ({
            ...prev,
            bids: [...(prev.bids || []), newOrder].sort(
              (a, b) => b.price - a.price
            ),
          }));
        } else {
          setOrderBook((prev) => ({
            ...prev,
            asks: [...(prev.asks || []), newOrder].sort(
              (a, b) => a.price - b.price
            ),
          }));
        }

        // Add to recent trades with transaction hash
        const newTrade = {
          id: Date.now(),
          pair: selectedPair,
          side: orderType,
          amount: parseFloat(orderAmount),
          price: parseFloat(orderPrice),
          time: new Date().toLocaleTimeString(),
          status: "completed",
          txHash: result.hash,
        };
        setRecentTrades((prev) => [newTrade, ...prev.slice(0, 9)]);
      }

      // Clear form
      setOrderAmount("");
      setOrderPrice("");
      alert(`${orderType.toUpperCase()} order placed successfully!`);
    } catch (error) {
      console.error("Order placement failed:", error);
      alert("Order placement failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

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
        { time: "14:23:45", price: 1.245, amount: 150, side: "buy" },
        { time: "14:23:42", price: 1.244, amount: 200, side: "sell" },
        { time: "14:23:38", price: 1.246, amount: 300, side: "buy" },
        { time: "14:23:35", price: 1.243, amount: 180, side: "sell" },
        { time: "14:23:30", price: 1.245, amount: 250, side: "buy" },
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
    <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8 py-6 space-y-6">
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
            className="glass-card border border-cyan-500/20 rounded-lg px-4 py-2 text-white bg-gray-800/60"
          >
            {assets.map((asset) => (
              <option
                key={asset.id}
                value={asset.id}
                className="bg-gray-800 text-white"
              >
                {asset.symbol} - {asset.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Market Data Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass-card p-4">
          <div className="text-gray-400 text-sm">Last Price</div>
          <div className="text-2xl font-bold text-white">
            ${marketData.lastPrice.toFixed(3)}
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="text-gray-600 dark:text-gray-400 text-sm">
            24h Change
          </div>
          <div
            className={`text-2xl font-bold ${
              marketData.priceChange24h >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {marketData.priceChange24h >= 0 ? "+" : ""}
            {marketData.priceChange24h}%
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="text-gray-600 dark:text-gray-400 text-sm">
            Best Bid
          </div>
          <div className="text-2xl font-bold text-green-400">
            ${marketData.bestBid.toFixed(3)}
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="text-gray-600 dark:text-gray-400 text-sm">
            Best Ask
          </div>
          <div className="text-2xl font-bold text-red-400">
            ${marketData.bestAsk.toFixed(3)}
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="text-gray-600 dark:text-gray-400 text-sm">
            24h Volume
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
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
              {(orderBook.asks || [])
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
              {(orderBook.bids || []).map((bid, index) => (
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
                <span className="text-white">
                  ${parseFloat(trade.price || 0).toFixed(3)}
                </span>
                <span className="text-gray-300">
                  {trade.quantity || trade.amount}
                </span>
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

          {!currentAccount && !demoMode && (
            <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
              <p className="text-sm text-yellow-300">
                Connect your wallet to start trading
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex gap-2">
              <button
                className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                  orderType === "buy"
                    ? "bg-green-500 text-white"
                    : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                }`}
                onClick={() => setOrderType("buy")}
              >
                BUY
              </button>
              <button
                className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                  orderType === "sell"
                    ? "bg-red-500 text-white"
                    : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                }`}
                onClick={() => setOrderType("sell")}
              >
                SELL
              </button>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Trading Pair
              </label>
              <select
                value={selectedPair}
                onChange={(e) => setSelectedPair(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
              >
                {tradingPairs.map((pair) => (
                  <option
                    key={pair.symbol}
                    value={pair.symbol}
                    className="bg-gray-800"
                  >
                    {pair.symbol} - ${pair.price}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Price (USDC)
              </label>
              <input
                type="number"
                value={orderPrice}
                onChange={(e) => setOrderPrice(e.target.value)}
                placeholder="12.45"
                step="0.01"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Amount (APT)
              </label>
              <input
                type="number"
                value={orderAmount}
                onChange={(e) => setOrderAmount(e.target.value)}
                placeholder="100"
                step="0.01"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500"
              />
            </div>

            {orderPrice && orderAmount && (
              <div className="p-3 bg-white/10 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total:</span>
                  <span className="font-medium text-white">
                    $
                    {(parseFloat(orderPrice) * parseFloat(orderAmount)).toFixed(
                      2
                    )}{" "}
                    USDC
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={
                isProcessing ||
                (!currentAccount && !demoMode) ||
                !orderPrice ||
                !orderAmount
              }
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                orderType === "buy"
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-red-500 hover:bg-red-600 text-white"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isProcessing
                ? "Processing..."
                : `${orderType === "buy" ? "Buy" : "Sell"} ${
                    selectedPair.split("/")[0]
                  }`}
            </button>

            <div className="text-xs text-gray-400 text-center">
              {currentAccount || demoMode
                ? "Real-time order execution on Aptos blockchain"
                : "Connect wallet to enable trading"}
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
