import { useState, useEffect } from "react";
import { GRAPHQL_ENDPOINT } from "../lib/aptos";

// Hook for real-time data polling from Aptos GraphQL indexer
export const useRealTimeData = (
  accountAddress,
  contractAddress,
  enabled = true
) => {
  const [events, setEvents] = useState([]);
  const [accountResources, setAccountResources] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Query for getting recent events
  const getRecentEvents = async () => {
    const query = `
      query GetRecentEvents($account_address: String!, $limit: Int!) {
        account_transactions(
          where: {
            account_address: { _eq: $account_address }
            transaction: {
              payload: {
                function: { _like: "%vault%" }
              }
            }
          }
          order_by: { transaction_version: desc }
          limit: $limit
        ) {
          transaction_version
          transaction {
            hash
            payload
            timestamp
            success
          }
        }
      }
    `;

    try {
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          variables: {
            account_address: accountAddress,
            limit: 10,
          },
        }),
      });

      const result = await response.json();
      return result.data?.account_transactions || [];
    } catch (err) {
      console.error("Error fetching events:", err);
      throw err;
    }
  };

  // Query for getting account resources (vault state)
  const getAccountResources = async () => {
    const query = `
      query GetAccountResources($account_address: String!) {
        account_objects(
          where: {
            account_address: { _eq: $account_address }
            object: {
              state_key_hash: { _is_null: false }
            }
          }
        ) {
          object {
            state_key_hash
            decoded_value
          }
        }
      }
    `;

    try {
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          variables: {
            account_address: accountAddress,
          },
        }),
      });

      const result = await response.json();
      return result.data?.account_objects || [];
    } catch (err) {
      console.error("Error fetching account resources:", err);
      throw err;
    }
  };

  // Polling function
  const pollData = async () => {
    if (!accountAddress || !enabled) return;

    setLoading(true);
    setError(null);

    try {
      const [recentEvents, resources] = await Promise.all([
        getRecentEvents(),
        getAccountResources(),
      ]);

      setEvents(recentEvents);
      setAccountResources(resources);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Set up polling interval
  useEffect(() => {
    if (!enabled || !accountAddress) return;

    // Initial fetch
    pollData();

    // Set up interval for polling every 10 seconds
    const interval = setInterval(pollData, 10000);

    return () => clearInterval(interval);
  }, [accountAddress, contractAddress, enabled]);

  return {
    events,
    accountResources,
    loading,
    error,
    refresh: pollData,
  };
};

// Hook for global statistics
export const useGlobalStats = (enabled = true) => {
  const [stats, setStats] = useState({
    totalTransactions: 0,
    activeUsers: 0,
    totalValueLocked: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(false);

  const fetchGlobalStats = async () => {
    if (!enabled) return;

    setLoading(true);
    try {
      // Query for global statistics
      const query = `
        query GetGlobalStats {
          processor_status {
            last_success_version
            last_updated
          }
          account_transactions_aggregate {
            aggregate {
              count
            }
          }
        }
      `;

      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const result = await response.json();

      setStats({
        totalTransactions:
          result.data?.account_transactions_aggregate?.aggregate?.count || 0,
        activeUsers: Math.floor(Math.random() * 1000) + 500, // Mock for now
        totalValueLocked: Math.floor(Math.random() * 10000000) + 1000000, // Mock for now
        recentActivity: [],
      });
    } catch (err) {
      console.error("Error fetching global stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!enabled) return;

    fetchGlobalStats();
    const interval = setInterval(fetchGlobalStats, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [enabled]);

  return { stats, loading, refresh: fetchGlobalStats };
};

// Real-time price feed hook (mock implementation)
export const usePriceFeed = (symbols = ["APT/USDC"], enabled = true) => {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchPrices = async () => {
    if (!enabled) return;

    setLoading(true);
    try {
      // Mock price data with realistic variations
      const mockPrices = symbols.reduce((acc, symbol) => {
        const basePrice =
          symbol === "APT/USDC"
            ? 12.45
            : symbol === "APT/ETH"
            ? 0.0032
            : 0.00025;
        const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
        const currentPrice = basePrice * (1 + variation);
        const change24h = (Math.random() - 0.5) * 0.2; // ±10% change

        acc[symbol] = {
          price: currentPrice.toFixed(symbol === "APT/USDC" ? 2 : 6),
          change24h: (change24h * 100).toFixed(2),
          volume24h: Math.floor(Math.random() * 1000000) + 100000,
          lastUpdate: Date.now(),
        };
        return acc;
      }, {});

      setPrices(mockPrices);
    } catch (err) {
      console.error("Error fetching prices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!enabled) return;

    fetchPrices();
    const interval = setInterval(fetchPrices, 5000); // Every 5 seconds

    return () => clearInterval(interval);
  }, [symbols.join(","), enabled]);

  return { prices, loading, refresh: fetchPrices };
};
