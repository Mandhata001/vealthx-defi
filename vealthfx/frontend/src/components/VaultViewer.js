import React, { useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { aptos, CONTRACT_ADDRESS, fromOctas } from "../lib/aptos";

export default function VaultViewer() {
  const { account } = useWallet();
  const [vault, setVault] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVaultData = async () => {
    if (!account || !CONTRACT_ADDRESS) return;

    setLoading(true);
    setError(null);

    try {
      // Try to fetch the vault resource
      const resourceType = `${CONTRACT_ADDRESS}::vault::Vault`;
      console.log(`Fetching vault resource: ${resourceType}`);

      const resource = await aptos.getAccountResource({
        accountAddress: account.address,
        resourceType: resourceType,
      });

      console.log("Vault resource:", resource);
      setVault(resource);
    } catch (err) {
      console.log("No vault found or error:", err);
      // This is expected if user hasn't created a vault yet
      setVault(null);
      if (err.message?.includes("Resource not found")) {
        setError("No vault found. Create one by depositing collateral.");
      } else {
        setError("Error fetching vault data");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVaultData();
  }, [account]);

  const calculateHealthRatio = () => {
    if (!vault?.collateral || !vault?.borrowed) return null;

    const collateralValue = parseInt(vault.collateral);
    const borrowedValue = parseInt(vault.borrowed);

    if (borrowedValue === 0) return "∞";

    const ratio = (collateralValue / borrowedValue) * 100;
    return ratio.toFixed(2) + "%";
  };

  const getHealthColor = () => {
    const ratio = calculateHealthRatio();
    if (!ratio || ratio === "∞") return "text-green-600";

    const numRatio = parseFloat(ratio);
    if (numRatio >= 200) return "text-green-600";
    if (numRatio >= 150) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Your Vault</h3>
        <button
          onClick={fetchVaultData}
          disabled={loading}
          className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {!account ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <p className="text-gray-500">Connect wallet to view your vault</p>
        </div>
      ) : loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading vault data...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="text-amber-500 mb-2">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <p className="text-amber-600">{error}</p>
        </div>
      ) : vault ? (
        <div className="space-y-4">
          {/* Vault Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">Collateral</div>
              <div className="text-xl font-bold text-blue-600">
                {fromOctas(vault.collateral || "0")} APT
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">Borrowed</div>
              <div className="text-xl font-bold text-green-600">
                {fromOctas(vault.borrowed || "0")} APT
              </div>
            </div>
          </div>

          {/* Health Ratio */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Health Ratio</span>
              <span className={`font-bold ${getHealthColor()}`}>
                {calculateHealthRatio() || "N/A"}
              </span>
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    getHealthColor().includes("green")
                      ? "bg-green-500"
                      : getHealthColor().includes("yellow")
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{
                    width:
                      Math.min(
                        ((parseFloat(calculateHealthRatio()) || 0) / 300) * 100,
                        100
                      ) + "%",
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Liquidation (130%)</span>
                <span>Safe (200%+)</span>
              </div>
            </div>
          </div>

          {/* Vault Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
              Add Collateral
            </button>
            <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
              Repay Debt
            </button>
          </div>

          {/* Vault Details */}
          <div className="border-t pt-4">
            <details className="text-sm">
              <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                View Raw Data
              </summary>
              <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
                {JSON.stringify(vault, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <p className="text-gray-500 mb-4">No vault found</p>
          <p className="text-sm text-gray-400">
            Create your first vault by depositing collateral above
          </p>
        </div>
      )}
    </div>
  );
}
