import React, { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { buildBorrowPayload, getExplorerUrl } from "../lib/aptos";

export default function BorrowForm() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastTx, setLastTx] = useState(null);

  const handleBorrow = async () => {
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
      const payload = buildBorrowPayload(amount);
      console.log("Borrow payload:", payload);

      const response = await signAndSubmitTransaction(payload);
      console.log("Transaction response:", response);

      setLastTx(response.hash);
      setAmount("");

      alert(`Borrow successful! Transaction: ${response.hash}`);
    } catch (error) {
      console.error("Borrow error:", error);
      alert(`Borrow failed: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMaxBorrow = () => {
    // Calculate max borrowable amount (typically ~70% of collateral)
    // For demo, set a conservative amount
    setAmount("0.2");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Borrow Assets</h3>
        <span className="text-sm text-gray-500">Step 2</span>
      </div>

      <div className="space-y-4">
        {/* Collateral Info */}
        <div className="bg-gray-50 rounded-md p-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Collateral Ratio:</span>
            <span className="font-medium text-green-600">150%</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-600">Max Borrowable:</span>
            <span className="font-medium">~0.35 APT</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Borrow Amount (APT)
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="0.0"
              step="0.0001"
              min="0"
              disabled={loading}
            />
            <button
              onClick={handleMaxBorrow}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-green-600 hover:text-green-800"
              disabled={loading}
            >
              MAX
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Interest Rate: ~5.2% APY • Liquidation at 130%
          </p>
        </div>

        <button
          onClick={handleBorrow}
          disabled={loading || !account || !amount}
          className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
            loading || !account || !amount
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
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
            "Borrow Assets"
          )}
        </button>

        {!account && (
          <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
            Connect your wallet and deposit collateral first
          </p>
        )}

        {lastTx && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <p className="text-sm text-green-800">
              ✅ Borrow transaction submitted successfully!
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
