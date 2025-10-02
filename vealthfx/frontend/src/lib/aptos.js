import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

// Debug: Log all environment variables
console.log("🔍 DEBUG - All VITE env vars:", {
  VITE_CONTRACT_ADDRESS: import.meta.env.VITE_CONTRACT_ADDRESS,
  VITE_NETWORK: import.meta.env.VITE_NETWORK,
  VITE_NODE_URL: import.meta.env.VITE_NODE_URL,
  allKeys: Object.keys(import.meta.env).filter((k) => k.startsWith("VITE_")),
});

// Network configuration
export const NETWORK =
  import.meta.env.VITE_NETWORK === "mainnet" ? Network.MAINNET : Network.DEVNET;
export const NODE_URL =
  import.meta.env.VITE_NODE_URL || "https://fullnode.devnet.aptoslabs.com/v1";
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

// Validate critical configuration
if (
  !CONTRACT_ADDRESS ||
  CONTRACT_ADDRESS === "undefined" ||
  CONTRACT_ADDRESS === ""
) {
  console.error(
    "❌ CONTRACT_ADDRESS is not configured!\n" +
      "Please create a .env.local file with:\n" +
      "VITE_CONTRACT_ADDRESS=0x...your_deployed_contract_address"
  );
} else {
  console.log("✅ Configuration loaded successfully:");
  console.log("   - Contract Address:", CONTRACT_ADDRESS);
  console.log("   - Network:", NETWORK);
  console.log("   - Node URL:", NODE_URL);
}

// Aptos Build Integration (CTRL+MOVE Hackathon)
export const APTOS_BUILD_API_KEY = import.meta.env.VITE_APTOS_BUILD_API_KEY;
export const GAS_STATION_ENABLED =
  import.meta.env.VITE_GAS_STATION_ENABLED === "true";
export const GRAPHQL_ENDPOINT =
  import.meta.env.VITE_GRAPHQL_ENDPOINT ||
  "https://api.devnet.aptoslabs.com/v1/graphql";

// Enhanced Aptos configuration with Build integration
const config = new AptosConfig({
  network: NETWORK,
  fullnode: NODE_URL,
  // Add API key for enhanced limits if available
  ...(APTOS_BUILD_API_KEY && {
    clientConfig: {
      headers: {
        Authorization: `Bearer ${APTOS_BUILD_API_KEY}`,
      },
    },
  }),
});

export const aptos = new Aptos(config);

// Utility functions
export function toOctas(amountFloat) {
  // Convert APT to octas (1 APT = 10^8 octas)
  const octas = BigInt(Math.round(parseFloat(amountFloat) * 1e8));
  return octas.toString();
}

export function fromOctas(octas) {
  // Convert octas to APT for display
  return (parseInt(octas) / 1e8).toFixed(4);
}

export function getExplorerUrl(hash) {
  const networkParam = NETWORK === Network.MAINNET ? "mainnet" : "devnet";
  return `https://explorer.aptoslabs.com/txn/${hash}?network=${networkParam}`;
}

// Contract function builders
export function buildDepositPayload(amount) {
  if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === "undefined") {
    throw new Error(
      "Contract address not configured. Please set VITE_CONTRACT_ADDRESS in your .env.local file."
    );
  }
  return {
    type: "entry_function_payload",
    function: `${CONTRACT_ADDRESS}::vault::deposit_collateral`,
    type_arguments: ["0x1::aptos_coin::AptosCoin"],
    arguments: [toOctas(amount)],
  };
}

export function buildBorrowPayload(amount) {
  if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === "undefined") {
    throw new Error(
      "Contract address not configured. Please set VITE_CONTRACT_ADDRESS in your .env.local file."
    );
  }
  return {
    type: "entry_function_payload",
    function: `${CONTRACT_ADDRESS}::vault::borrow_asset`,
    type_arguments: [],
    arguments: [toOctas(amount)],
  };
}

export function buildWithdrawPayload(amount) {
  if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === "undefined") {
    throw new Error(
      "Contract address not configured. Please set VITE_CONTRACT_ADDRESS in your .env.local file."
    );
  }
  return {
    type: "entry_function_payload",
    function: `${CONTRACT_ADDRESS}::vault::withdraw_collateral`,
    type_arguments: ["0x1::aptos_coin::AptosCoin"],
    arguments: [toOctas(amount)],
  };
}

export function buildRepayPayload(amount) {
  if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === "undefined") {
    throw new Error(
      "Contract address not configured. Please set VITE_CONTRACT_ADDRESS in your .env.local file."
    );
  }
  return {
    type: "entry_function_payload",
    function: `${CONTRACT_ADDRESS}::vault::repay_debt`,
    type_arguments: ["0x1::aptos_coin::AptosCoin"],
    arguments: [toOctas(amount)],
  };
}

// Aptos Build GraphQL Integration (CTRL+MOVE Hackathon)
export async function queryGraphQL(query, variables = {}) {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(APTOS_BUILD_API_KEY && {
          Authorization: `Bearer ${APTOS_BUILD_API_KEY}`,
        }),
      },
      body: JSON.stringify({ query, variables }),
    });

    const result = await response.json();
    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      throw new Error("GraphQL query failed");
    }

    return result.data;
  } catch (error) {
    console.error("GraphQL query error:", error);
    throw error;
  }
}

// Real-time vault events query
export const VAULT_EVENTS_QUERY = `
  query VaultEvents($contract_address: String!, $limit: Int = 10) {
    events(
      where: {
        account_address: {_eq: $contract_address}
        type: {_like: "%vault%"}
      }
      order_by: {sequence_number: desc}
      limit: $limit
    ) {
      sequence_number
      type
      data
      transaction_version
      creation_number
    }
  }
`;

// Pool activity query for analytics
export const POOL_ACTIVITY_QUERY = `
  query PoolActivity($limit: Int = 100) {
    coin_activities(
      where: {
        coin_type: {_eq: "0x1::aptos_coin::AptosCoin"}
        activity_type: {_in: ["0x1::coin::DepositEvent", "0x1::coin::WithdrawEvent"]}
      }
      order_by: {transaction_timestamp: desc}
      limit: $limit
    ) {
      activity_type
      amount
      transaction_timestamp
      transaction_version
    }
  }
`;

// Gas Station integration for sponsored transactions
export async function submitSponsoredTransaction(walletData, payload) {
  // Destructure the wallet data properly
  const { account, signAndSubmitTransaction } = walletData;

  if (!account || !signAndSubmitTransaction) {
    throw new Error("Wallet not properly connected");
  }

  if (!GAS_STATION_ENABLED) {
    // Fallback to regular transaction
    return await signAndSubmitTransaction(payload);
  }

  try {
    // Build transaction with gas sponsorship
    const transaction = await aptos.transaction.build.simple({
      sender: account.address,
      data: payload,
      options: {
        // Gas sponsorship options
        maxGasAmount: 10000,
        gasUnitPrice: 0, // Sponsored transactions can have 0 gas price
      },
    });

    // Sign and submit with sponsorship
    const response = await signAndSubmitTransaction(transaction);
    console.log("Sponsored transaction submitted:", response.hash);
    return response;
  } catch (error) {
    console.error(
      "Sponsored transaction failed, falling back to regular:",
      error
    );
    // Fallback to regular transaction
    return await signAndSubmitTransaction(payload);
  }
}

// Enhanced vault data fetching with GraphQL
export async function getVaultAnalytics(vaultAddress) {
  try {
    const data = await queryGraphQL(VAULT_EVENTS_QUERY, {
      contract_address: vaultAddress,
      limit: 50,
    });

    // Process events for analytics
    const events = data.events || [];
    const deposits = events.filter((e) => e.type.includes("deposit"));
    const borrows = events.filter((e) => e.type.includes("borrow"));

    return {
      totalDeposits: deposits.length,
      totalBorrows: borrows.length,
      recentActivity: events.slice(0, 10),
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Failed to fetch vault analytics:", error);
    return {
      totalDeposits: 0,
      totalBorrows: 0,
      recentActivity: [],
      lastUpdated: null,
    };
  }
}
