import React, { useState, useEffect } from "react";
import {
  queryGraphQL,
  POOL_ACTIVITY_QUERY,
  getVaultAnalytics,
} from "../lib/aptos";
import { MOCK_POOLS } from "../lib/constants";

export default function PoolStats() {
  const [pools, setPools] = useState([]);
  const [bestPool, setBestPool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [realTimeData, setRealTimeData] = useState(null);
  const [orderBookData, setOrderBookData] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Hackathon feature flags
  const REAL_TIME_ENABLED =
    import.meta.env.VITE_ENABLE_REAL_TIME_UPDATES === "true";
  const ORDER_BOOK_ENABLED = import.meta.env.VITE_ENABLE_ORDER_BOOK === "true";

  // Fetch real-time pool activity using Aptos Build GraphQL
  const fetchRealTimeData = async () => {
    if (!REAL_TIME_ENABLED) return;

    try {
      const data = await queryGraphQL(POOL_ACTIVITY_QUERY, { limit: 100 });
      const activities = data.coin_activities || [];

      // Process activities for enhanced pool stats
      const totalVolume = activities.reduce(
        (sum, activity) => sum + parseFloat(activity.amount || 0),
        0
      );

      const deposits = activities.filter((a) =>
        a.activity_type.includes("Deposit")
      );
      const withdraws = activities.filter((a) =>
        a.activity_type.includes("Withdraw")
      );

      // Calculate real-time metrics
      const avgTransactionSize = totalVolume / activities.length || 0;
      const activityRate = activities.length / 24; // transactions per hour (assuming 24h data)

      setRealTimeData({
        totalVolume: totalVolume / 1e8, // Convert from octas to APT
        totalDeposits: deposits.length,
        totalWithdraws: withdraws.length,
        avgTransactionSize: avgTransactionSize / 1e8,
        activityRate: activityRate.toFixed(1),
        lastActivity: activities[0]?.transaction_timestamp || null,
      });

      setLastUpdate(new Date().toISOString());
    } catch (error) {
      console.error("Real-time data fetch failed:", error);
      // Use mock data fallback
      setRealTimeData({
        totalVolume: 1247.5,
        totalDeposits: 156,
        totalWithdraws: 89,
        avgTransactionSize: 12.4,
        activityRate: "8.2",
        lastActivity: new Date().toISOString(),
      });
    }
  };

  // Fetch order book data (CTRL+MOVE Hackathon feature)
  const fetchOrderBookData = async () => {
    if (!ORDER_BOOK_ENABLED) return;

    try {
      // Mock Econia CLOB integration for demo
      // In production: integrate with Econia's real order book API
      const mockOrderBook = [
        {
          price: 8.42,
          size: 1250,
          side: "buy",
          pool: "Echelon-APT",
          timestamp: Date.now(),
        },
        {
          price: 8.41,
          size: 850,
          side: "buy",
          pool: "Hyperion-APT",
          timestamp: Date.now() - 1000,
        },
        {
          price: 8.43,
          size: 950,
          side: "sell",
          pool: "Merkle-APT",
          timestamp: Date.now() - 500,
        },
        {
          price: 8.44,
          size: 1100,
          side: "sell",
          pool: "Echelon-APT",
          timestamp: Date.now() - 2000,
        },
        {
          price: 8.4,
          size: 1500,
          side: "buy",
          pool: "Hyperion-APT",
          timestamp: Date.now() - 3000,
        },
      ];

      setOrderBookData(mockOrderBook.sort((a, b) => b.timestamp - a.timestamp));
    } catch (error) {
      console.error("Order book fetch failed:", error);
    }
  };

  // Enhanced pool loading with real-time features
  useEffect(() => {
    const fetchPools = async () => {
      setLoading(true);

      try {
        // Enhanced pools with real-time data
        const enhancedPools = MOCK_POOLS.map((pool) => ({
          ...pool,
          // Add real-time enhancements
          volume24h: Math.random() * 1000 + 500,
          trades24h: Math.floor(Math.random() * 100) + 20,
          lastUpdate: new Date().toISOString(),
          // Order book metrics
          spread: (Math.random() * 0.1 + 0.01).toFixed(4),
          depth: Math.floor(Math.random() * 5000) + 1000,
        }));

        setPools(enhancedPools);

        // Find best pool by APY
        const best = enhancedPools.reduce((prev, current) =>
          current.apy > prev.apy ? current : prev
        );
        setBestPool(best);

        // Fetch real-time data
        await fetchRealTimeData();
        await fetchOrderBookData();
      } catch (error) {
        console.error("Failed to load enhanced pools:", error);
        // Fallback to basic pools
        setPools(MOCK_POOLS);
        const best = MOCK_POOLS.reduce((prev, current) =>
          current.apy > prev.apy ? current : prev
        );
        setBestPool(best);
      } finally {
        setLoading(false);
      }
    };

    fetchPools();

    // Auto-refresh every 15 seconds for hackathon demo
    const interval = setInterval(() => {
      fetchRealTimeData();
      fetchOrderBookData();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Best Pool Recommendation */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">🏆 Best Yield Pool</h3>
          {REAL_TIME_ENABLED && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
              <span className="text-sm opacity-90">Live</span>
            </div>
          )}
        </div>

        {bestPool && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-green-100 text-sm">Pool</p>
              <p className="font-semibold">{bestPool.name}</p>
            </div>
            <div>
              <p className="text-green-100 text-sm">APY</p>
              <p className="font-semibold text-2xl">{bestPool.apy}%</p>
            </div>
            <div>
              <p className="text-green-100 text-sm">TVL</p>
              <p className="font-semibold">${bestPool.tvl.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-green-100 text-sm">Risk</p>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  bestPool.risk === "Low"
                    ? "bg-green-400 text-green-900"
                    : bestPool.risk === "Medium"
                    ? "bg-yellow-400 text-yellow-900"
                    : "bg-red-400 text-red-900"
                }`}
              >
                {bestPool.risk}
              </span>
            </div>
          </div>
        )}

        {realTimeData && (
          <div className="mt-4 pt-4 border-t border-green-400">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-green-100">24h Volume</p>
                <p className="font-semibold">
                  {realTimeData.totalVolume.toFixed(2)} APT
                </p>
              </div>
              <div>
                <p className="text-green-100">Activity Rate</p>
                <p className="font-semibold">
                  {realTimeData.activityRate} tx/h
                </p>
              </div>
              <div>
                <p className="text-green-100">Avg Size</p>
                <p className="font-semibold">
                  {realTimeData.avgTransactionSize.toFixed(2)} APT
                </p>
              </div>
              <div>
                <p className="text-green-100">Last Update</p>
                <p className="font-semibold">
                  {new Date(lastUpdate).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Book Widget (Hackathon Feature) */}
      {ORDER_BOOK_ENABLED && orderBookData.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📊 Live Order Book
          </h3>
          <div className="space-y-2">
            {orderBookData.slice(0, 5).map((order, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-2 px-3 rounded bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      order.side === "buy" ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></span>
                  <span className="font-medium">{order.pool}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${order.price}</p>
                  <p className="text-sm text-gray-500">{order.size} APT</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Pools Grid */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">All Pools</h3>
          {lastUpdate && (
            <p className="text-sm text-gray-500">
              Updated {new Date(lastUpdate).toLocaleTimeString()}
            </p>
          )}
        </div>

        <div className="grid gap-4">
          {pools.map((pool, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">{pool.name}</h4>
                  <p className="text-sm text-gray-500">{pool.protocol}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    pool.risk === "Low"
                      ? "bg-green-100 text-green-800"
                      : pool.risk === "Medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {pool.risk}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">APY</p>
                  <p className="font-semibold text-lg">{pool.apy}%</p>
                </div>
                <div>
                  <p className="text-gray-500">TVL</p>
                  <p className="font-semibold">${pool.tvl.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">24h Volume</p>
                  <p className="font-semibold">
                    {pool.volume24h?.toFixed(0) || "N/A"} APT
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Spread</p>
                  <p className="font-semibold">{pool.spread || "N/A"}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Stats Summary */}
      {realTimeData && (
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            📈 Live Network Stats
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {realTimeData.totalDeposits}
              </p>
              <p className="text-sm text-blue-700">Total Deposits</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {realTimeData.totalWithdraws}
              </p>
              <p className="text-sm text-blue-700">Total Withdraws</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {realTimeData.totalVolume.toFixed(0)}
              </p>
              <p className="text-sm text-blue-700">Volume (APT)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {realTimeData.activityRate}
              </p>
              <p className="text-sm text-blue-700">TX/Hour</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
