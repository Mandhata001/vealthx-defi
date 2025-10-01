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
  const [success, setSuccess] = useState(false);

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
    setSuccess(false);

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
      setSuccess(true);
      setAmount("");

      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error("Transaction failed:", error);
      alert(`Transaction failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMaxBalance = () => {
    // For demo purposes, set a reasonable max (0.5 APT)
    // In production, you'd fetch the actual wallet balance
    setAmount("0.5");
  };

  const predefinedAmounts = ["0.1", "0.25", "0.5", "1.0"];

  return (
    <div className="glass-card p-8 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center">
            <span className="text-2xl">💰</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Deposit Collateral</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Step 1 • Secure your position
            </p>
          </div>
        </div>
        {GAS_STATION_ENABLED && (
          <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">
            <span>⛽</span>
            <span>Gas Free</span>
          </div>
        )}
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-2xl">
          <div className="flex items-center space-x-2">
            <span className="text-green-600 dark:text-green-400 text-xl">
              ✅
            </span>
            <div>
              <p className="text-green-700 dark:text-green-300 font-semibold">
                Deposit Successful!
              </p>
              <p className="text-green-600 dark:text-green-400 text-sm">
                Transaction confirmed on blockchain
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Amount Input */}
        <div>
          <label className="block text-white font-semibold mb-3">
            Amount (APT)
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full bg-gray-800 border border-gray-600 rounded-2xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
            />
            <button
              onClick={handleMaxBalance}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
            >
              MAX
            </button>
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div>
          <p className="text-purple-200 text-sm mb-3">Quick amounts:</p>
          <div className="grid grid-cols-4 gap-2">
            {predefinedAmounts.map((preset) => (
              <button
                key={preset}
                onClick={() => setAmount(preset)}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 py-2 rounded-xl transition-all duration-200 font-medium"
              >
                {preset} APT
              </button>
            ))}
          </div>
        </div>

        {/* Deposit Info */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-blue-400">ℹ️</span>
            <span className="text-blue-300 font-semibold">Deposit Info</span>
          </div>
          <div className="text-blue-200 text-sm space-y-1">
            <p>• Collateral ratio: 150% minimum</p>
            <p>• Interest earned on deposited APT</p>
            <p>• Withdraw anytime (subject to health ratio)</p>
          </div>
        </div>

        {/* Deposit Button */}
        <button
          onClick={handleDeposit}
          disabled={loading || !amount}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          ) : (
            `Deposit ${amount || "0"} APT`
          )}
        </button>

        {/* Transaction Link */}
        {lastTx && (
          <div className="text-center">
            <a
              href={getExplorerUrl(lastTx)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span>View transaction</span>
              <span>↗️</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
