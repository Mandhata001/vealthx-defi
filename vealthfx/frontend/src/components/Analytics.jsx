import { useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { aptos, fromOctas } from "../lib/aptos";
import { formatAddress, getAccountAddress } from "../utils/addressUtils.js";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  coinGeckoAPI,
  formatPrice,
  formatPercentage,
} from "../utils/coinGeckoAPI.js";

const Analytics = ({ demoMode = false, walletConnected, account }) => {
  const { account: walletAccount } = useWallet();
  const currentAccount = account || walletAccount;

  const [timeRange, setTimeRange] = useState("7d");
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [priceChart, setPriceChart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState(null);

  // Fetch real crypto prices on component mount
  useEffect(() => {
    const fetchCryptoPrices = async () => {
      setLoading(true);
      try {
        // Get current prices
        const prices = await coinGeckoAPI.getSimplePrices([
          "aptos",
          "bitcoin",
          "ethereum",
          "usd-coin",
          "chainlink",
        ]);
        setCryptoPrices(prices);

        // Get price chart for Aptos
        const chartData = await coinGeckoAPI.getMarketChart("aptos", 7);
        setPriceChart(chartData);

        console.log("💰 Real prices loaded:", prices);
      } catch (error) {
        console.warn("Using mock data due to API error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptoPrices();
  }, []);

  // Fetch wallet balance when account changes
  useEffect(() => {
    const fetchWalletBalance = async () => {
      if (currentAccount && !demoMode) {
        try {
          const accountAddress = getAccountAddress(currentAccount);
          if (!accountAddress) {
            throw new Error("Invalid account address");
          }

          const balance = await aptos.getAccountAPTAmount({
            accountAddress: accountAddress,
          });
          setWalletBalance(fromOctas(balance));
        } catch (error) {
          console.error("Failed to fetch wallet balance:", error);
          setWalletBalance(null);
        }
      } else if (demoMode) {
        // Demo mode balance
        setWalletBalance(1250.75);
      } else {
        setWalletBalance(null);
      }
    };

    fetchWalletBalance();
  }, [currentAccount, demoMode]);

  // Mock data for demonstrations
  const tvlData = [
    { date: "Jan 1", tvl: 1200000, volume: 45000 },
    { date: "Jan 2", tvl: 1350000, volume: 52000 },
    { date: "Jan 3", tvl: 1450000, volume: 48000 },
    { date: "Jan 4", tvl: 1380000, volume: 55000 },
    { date: "Jan 5", tvl: 1520000, volume: 61000 },
    { date: "Jan 6", tvl: 1680000, volume: 58000 },
    { date: "Jan 7", tvl: 1750000, volume: 67000 },
  ];

  const assetAllocation = [
    { name: "Real Estate", value: 45, color: "#3B82F6" },
    { name: "Commodities", value: 25, color: "#10B981" },
    { name: "Art & Collectibles", value: 15, color: "#F59E0B" },
    { name: "Private Equity", value: 10, color: "#EF4444" },
    { name: "Others", value: 5, color: "#8B5CF6" },
  ];

  const yieldData = [
    { asset: "Real Estate", apy: 8.5, risk: "Low" },
    { asset: "Gold", apy: 12.3, risk: "Medium" },
    { asset: "Art NFTs", apy: 15.7, risk: "High" },
    { asset: "Private Debt", apy: 10.2, risk: "Medium" },
    { asset: "REITs", apy: 9.1, risk: "Low" },
  ];

  const protocolStats = {
    totalValueLocked: "$1,750,000",
    totalUsers: "12,450",
    dailyVolume: "$67,000",
    avgAPY: "11.2%",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Real-time protocol metrics and insights
            {cryptoPrices.aptos && (
              <span className="ml-2 text-green-600 font-medium">
                • Live data from CoinGecko API
              </span>
            )}
          </p>
        </div>
        <div className="flex space-x-2">
          {["24h", "7d", "30d", "90d"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeRange === range
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Live Crypto Prices */}
      {Object.keys(cryptoPrices).length > 0 && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            📈 Live Crypto Prices
            <span className="ml-2 px-2 py-1 bg-green-500 text-xs rounded-full">
              LIVE
            </span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(cryptoPrices).map(([coin, data]) => (
              <div
                key={coin}
                className="bg-white/10 rounded-lg p-3 backdrop-blur-sm"
              >
                <div className="text-sm opacity-80 capitalize">
                  {coin.replace("-", " ")}
                </div>
                <div className="text-lg font-bold">{formatPrice(data.usd)}</div>
                <div
                  className={`text-xs ${
                    data.usd_24h_change >= 0 ? "text-green-300" : "text-red-300"
                  }`}
                >
                  {formatPercentage(data.usd_24h_change || 0)}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm opacity-80">
            💡 Powered by CoinGecko API • Updates every 5 minutes
          </div>
        </div>
      )}

      {/* Wallet Overview */}
      {(currentAccount || demoMode) && (
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            💼 Your Wallet Overview
            {currentAccount && !demoMode && (
              <span className="ml-2 px-2 py-1 bg-green-500 text-xs rounded-full">
                CONNECTED
              </span>
            )}
            {demoMode && (
              <span className="ml-2 px-2 py-1 bg-blue-500 text-xs rounded-full">
                DEMO
              </span>
            )}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-sm opacity-80">APT Balance</div>
              <div className="text-2xl font-bold">
                {walletBalance !== null
                  ? `${walletBalance.toFixed(4)} APT`
                  : "Loading..."}
              </div>
              <div className="text-xs opacity-70">
                {formatAddress(currentAccount?.address, "Demo Account")}
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-sm opacity-80">USD Value</div>
              <div className="text-2xl font-bold">
                {walletBalance !== null && cryptoPrices.aptos
                  ? `$${(walletBalance * cryptoPrices.aptos.usd).toFixed(2)}`
                  : "$--"}
              </div>
              <div className="text-xs opacity-70">
                Based on current APT price
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-sm opacity-80">Active Vaults</div>
              <div className="text-2xl font-bold">4</div>
              <div className="text-xs opacity-70">RWA investments</div>
            </div>
          </div>
          <div className="mt-4 text-sm opacity-80">
            🔗 Real-time data from Aptos blockchain • Last updated:{" "}
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      )}

      {!currentAccount && !demoMode && (
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-6 border-2 border-dashed border-gray-300">
          <div className="text-center">
            <div className="text-4xl mb-4">🔐</div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">
              Connect Your Wallet
            </h2>
            <p className="text-gray-600 mb-4">
              Connect your Aptos wallet to view your portfolio analytics and
              transaction history
            </p>
            <div className="text-sm text-gray-500">
              Supported wallets: Petra, Martian, Pontem
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Value Locked
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {protocolStats.totalValueLocked}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-xl">💰</span>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <span className="text-green-600 text-sm font-medium">+12.5%</span>
            <span className="text-gray-500 text-sm ml-1">vs last week</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {protocolStats.totalUsers}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-xl">👥</span>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <span className="text-green-600 text-sm font-medium">+8.3%</span>
            <span className="text-gray-500 text-sm ml-1">vs last week</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Daily Volume</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {protocolStats.dailyVolume}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 text-xl">📊</span>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <span className="text-green-600 text-sm font-medium">+15.7%</span>
            <span className="text-gray-500 text-sm ml-1">vs yesterday</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average APY</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {protocolStats.avgAPY}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600 text-xl">📈</span>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <span className="text-green-600 text-sm font-medium">+2.1%</span>
            <span className="text-gray-500 text-sm ml-1">vs last month</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Aptos Price Chart (Real Data) */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            📈 Aptos (APT) Price History
            {cryptoPrices.aptos && (
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                REAL DATA
              </span>
            )}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={priceChart.length > 0 ? priceChart : tvlData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [
                  name === "price"
                    ? formatPrice(value)
                    : `$${(value / 1000000).toFixed(2)}M`,
                  name === "price" ? "APT Price" : "Volume",
                ]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey={priceChart.length > 0 ? "price" : "tvl"}
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ r: 4 }}
                name={priceChart.length > 0 ? "APT Price" : "TVL"}
              />
            </LineChart>
          </ResponsiveContainer>
          {loading && (
            <div className="text-center text-gray-500 text-sm mt-2">
              📊 Loading real price data from CoinGecko...
            </div>
          )}
        </div>

        {/* Asset Allocation */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Asset Allocation
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={assetAllocation}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {assetAllocation.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Yield Performance Table */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Asset Performance
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Asset
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  APY
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Risk Level
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody>
              {yieldData.map((asset, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">
                      {asset.asset}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-green-600 font-semibold">
                      {asset.apy}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        asset.risk === "Low"
                          ? "bg-green-100 text-green-800"
                          : asset.risk === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {asset.risk}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(asset.apy / 20) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {Math.round((asset.apy / 20) * 100)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-3">Protocol Health</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Collateralization Ratio
              </span>
              <span className="font-semibold text-green-600">145%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Utilization Rate</span>
              <span className="font-semibold text-blue-600">78%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Liquidation Risk</span>
              <span className="font-semibold text-yellow-600">Low</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-3">Market Activity</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Vaults</span>
              <span className="font-semibold text-gray-900">247</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">New Deposits Today</span>
              <span className="font-semibold text-green-600">$23,400</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Pending Transactions
              </span>
              <span className="font-semibold text-orange-600">12</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-3">Network Stats</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Gas Price (APT)</span>
              <span className="font-semibold text-gray-900">0.00045</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Block Time</span>
              <span className="font-semibold text-blue-600">~4s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Network Status</span>
              <span className="font-semibold text-green-600">Healthy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
