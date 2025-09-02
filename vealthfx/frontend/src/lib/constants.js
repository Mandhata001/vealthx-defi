// Application constants
export const APP_NAME = "VealthX DeFi";
export const APP_DESCRIPTION = "Instant RWA Liquidity on Aptos";

// UI Constants
export const COLORS = {
  primary: "#3B82F6", // blue-500
  secondary: "#10B981", // emerald-500
  accent: "#8B5CF6", // violet-500
  danger: "#EF4444", // red-500
  warning: "#F59E0B", // amber-500
  success: "#10B981", // emerald-500
};

// Contract Constants
export const VAULT_STATES = {
  ACTIVE: "active",
  LIQUIDATING: "liquidating",
  CLOSED: "closed",
};

// Transaction Constants
export const TX_STATUS = {
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed",
};

// Mock data for development
export const MOCK_POOLS = [
  { name: "Merkle", apy: 10.5, tvl: "2.4M", risk: "Low" },
  { name: "Hippo", apy: 8.2, tvl: "1.8M", risk: "Medium" },
  { name: "Pancake", apy: 12.1, tvl: "3.1M", risk: "High" },
  { name: "Thala", apy: 7.8, tvl: "1.2M", risk: "Low" },
];

export const MOCK_YIELD_DATA = [
  { date: "2025-08-25", apy: 8.5 },
  { date: "2025-08-26", apy: 9.1 },
  { date: "2025-08-27", apy: 8.8 },
  { date: "2025-08-28", apy: 9.4 },
  { date: "2025-08-29", apy: 10.2 },
  { date: "2025-08-30", apy: 9.8 },
  { date: "2025-08-31", apy: 10.5 },
];
