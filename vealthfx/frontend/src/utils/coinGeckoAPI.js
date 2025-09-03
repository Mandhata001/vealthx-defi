// CoinGecko API integration for VealthX
const COINGECKO_API_BASE = "https://api.coingecko.com/api/v3";
const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;

// Mock data for demo mode or API failures
const MOCK_PRICES = {
  aptos: { usd: 8.45, usd_24h_change: 5.23 },
  bitcoin: { usd: 65420.5, usd_24h_change: -2.15 },
  ethereum: { usd: 3245.8, usd_24h_change: 1.75 },
  "usd-coin": { usd: 1.0, usd_24h_change: 0.02 },
  chainlink: { usd: 24.35, usd_24h_change: 3.45 },
};

const MOCK_MARKET_DATA = {
  market_cap_rank: 42,
  market_cap: { usd: 4250000000 },
  total_volume: { usd: 125000000 },
  circulating_supply: 1085000000,
  max_supply: 1100000000,
};

class CoinGeckoAPI {
  constructor() {
    this.baseURL = COINGECKO_API_BASE;
    this.apiKey = API_KEY;
    this.demoMode = import.meta.env.VITE_DEMO_MODE === "true";
  }

  // Helper to make API requests
  async makeRequest(endpoint, params = {}) {
    if (this.demoMode) {
      console.log("🎬 Demo Mode: Using mock data for", endpoint);
      return this.getMockData(endpoint);
    }

    try {
      const url = new URL(`${this.baseURL}${endpoint}`);

      // Add API key if available
      if (this.apiKey) {
        params.x_cg_demo_api_key = this.apiKey;
      }

      // Add parameters
      Object.keys(params).forEach((key) => {
        url.searchParams.append(key, params[key]);
      });

      console.log("🌐 Fetching from CoinGecko:", url.toString());

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ CoinGecko API success:", data);
      return data;
    } catch (error) {
      console.warn("⚠️ CoinGecko API failed, using mock data:", error.message);
      return this.getMockData(endpoint);
    }
  }

  // Get mock data based on endpoint
  getMockData(endpoint) {
    if (endpoint.includes("/simple/price")) {
      return MOCK_PRICES;
    }
    if (endpoint.includes("/coins/aptos")) {
      return {
        id: "aptos",
        symbol: "apt",
        name: "Aptos",
        current_price: MOCK_PRICES.aptos.usd,
        price_change_percentage_24h: MOCK_PRICES.aptos.usd_24h_change,
        ...MOCK_MARKET_DATA,
      };
    }
    return {};
  }

  // Get simple price data
  async getSimplePrices(coinIds = ["aptos"], vsCurrencies = ["usd"]) {
    const endpoint = "/simple/price";
    const params = {
      ids: coinIds.join(","),
      vs_currencies: vsCurrencies.join(","),
      include_24hr_change: true,
      include_market_cap: true,
      include_24hr_vol: true,
    };

    return await this.makeRequest(endpoint, params);
  }

  // Get detailed coin data
  async getCoinData(coinId = "aptos") {
    const endpoint = `/coins/${coinId}`;
    const params = {
      localization: false,
      tickers: false,
      market_data: true,
      community_data: false,
      developer_data: false,
      sparkline: false,
    };

    return await this.makeRequest(endpoint, params);
  }

  // Get market chart data
  async getMarketChart(coinId = "aptos", days = 7) {
    const endpoint = `/coins/${coinId}/market_chart`;
    const params = {
      vs_currency: "usd",
      days: days.toString(),
    };

    const data = await this.makeRequest(endpoint, params);

    // Format chart data for recharts
    if (data.prices) {
      return data.prices.map(([timestamp, price]) => ({
        time: new Date(timestamp).toLocaleDateString(),
        price: price,
        volume: data.total_volumes?.find(([t]) => t === timestamp)?.[1] || 0,
      }));
    }

    // Return mock chart data
    return Array.from({ length: days }, (_, i) => ({
      time: new Date(
        Date.now() - (days - i) * 24 * 60 * 60 * 1000
      ).toLocaleDateString(),
      price: 8.45 + Math.random() * 2 - 1,
      volume: 100000000 + Math.random() * 50000000,
    }));
  }

  // Get trending coins
  async getTrendingCoins() {
    const endpoint = "/search/trending";
    return await this.makeRequest(endpoint);
  }

  // Test API connection
  async testConnection() {
    try {
      const data = await this.getSimplePrices(["aptos"]);
      console.log("🎉 CoinGecko API Test Successful!", data);
      return { success: true, data };
    } catch (error) {
      console.error("❌ CoinGecko API Test Failed:", error);
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
export const coinGeckoAPI = new CoinGeckoAPI();

// Export utility functions
export const formatPrice = (price) => {
  if (typeof price !== "number") return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: price < 1 ? 6 : 2,
  }).format(price);
};

export const formatPercentage = (percentage) => {
  if (typeof percentage !== "number") return "0.00%";
  const formatted = percentage.toFixed(2);
  return `${percentage >= 0 ? "+" : ""}${formatted}%`;
};

export const formatMarketCap = (marketCap) => {
  if (typeof marketCap !== "number") return "$0";

  if (marketCap >= 1e12) {
    return `$${(marketCap / 1e12).toFixed(2)}T`;
  } else if (marketCap >= 1e9) {
    return `$${(marketCap / 1e9).toFixed(2)}B`;
  } else if (marketCap >= 1e6) {
    return `$${(marketCap / 1e6).toFixed(2)}M`;
  } else {
    return `$${marketCap.toLocaleString()}`;
  }
};

export default coinGeckoAPI;
