import React, { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import {
  buildDepositPayload,
  getExplorerUrl,
  submitSponsoredTransaction,
  GAS_STATION_ENABLED,
} from "../lib/aptos";

export default function DepositForm() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastTx, setLastTx] = useState(null);

  const handleDeposit = async () => {
    if (!account) {
      alert("Please connect your wallet first");
      return;
    }

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount greater than 0");
      return;
    }

    setLoading(true);
    setLastTx(null);

    try {
      const payload = buildDepositPayload(amount);
      console.log("Deposit payload:", payload);

      // Use Gas Station for sponsored transactions (CTRL+MOVE Hackathon)
      let response;
      if (GAS_STATION_ENABLED) {
        console.log("🚀 Using Gas Station for sponsored transaction");
        response = await submitSponsoredTransaction(
          { account, signAndSubmitTransaction },
          payload
        );
      } else {
        response = await signAndSubmitTransaction(payload);
      }

      console.log("Transaction response:", response);

      setLastTx(response.hash);
      setAmount("");

      // Show success message
      alert(`Deposit successful! Transaction: ${response.hash}`);
    } catch (error) {
      console.error("Deposit error:", error);
      alert(`Deposit failed: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMaxBalance = () => {
    // For demo purposes, set a reasonable max (0.5 APT)
    // In production, you'd fetch the actual wallet balance
    setAmount("0.5");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Deposit Collateral
          </h3>
          {GAS_STATION_ENABLED && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              ⛽ Gas Free
            </span>
          )}
        </div>
        <span className="text-sm text-gray-500">Step 1</span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (APT)
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.0"
              step="0.0001"
              min="0"
              disabled={loading}
            />
            <button
              onClick={handleMaxBalance}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-blue-600 hover:text-blue-800"
              disabled={loading}
            >
              MAX
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Minimum: 0.001 APT • Available: ~ APT
          </p>
        </div>

        <button
          onClick={handleDeposit}
          disabled={loading || !account || !amount}
          className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
            loading || !account || !amount
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Deposit Collateral"
          )}
        </button>

        {!account && (
          <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
            Connect your wallet to deposit collateral
          </p>
        )}

        {lastTx && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <p className="text-sm text-green-800">
              ✅ Transaction submitted successfully!
            </p>
            <a
              href={getExplorerUrl(lastTx)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              View on Explorer →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
