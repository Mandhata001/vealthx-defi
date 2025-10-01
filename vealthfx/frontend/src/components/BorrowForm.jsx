import React, { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import {
  buildBorrowPayload,
  getExplorerUrl,
  submitSponsoredTransaction,
  GAS_STATION_ENABLED,
} from "../lib/aptos";

export default function BorrowForm() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastTx, setLastTx] = useState(null);
  const [success, setSuccess] = useState(false);

  // Mock collateral data - in production, fetch from contract
  const collateralAmount = 0.5; // APT
  const maxBorrowAmount = (collateralAmount * 0.67).toFixed(3); // 67% of collateral value
  const currentBorrowedAmount = 0.1;
  const healthRatio = (
    (collateralAmount / (currentBorrowedAmount + parseFloat(amount || 0))) *
    100
  ).toFixed(1);

  const handleBorrow = async () => {
    if (!account) {
      alert("Please connect your wallet first");
      return;
    }

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount greater than 0");
      return;
    }

    if (parseFloat(amount) > parseFloat(maxBorrowAmount)) {
      alert(`Cannot borrow more than ${maxBorrowAmount} APT`);
      return;
    }

    setLoading(true);
    setLastTx(null);
    setSuccess(false);

    try {
      const payload = buildBorrowPayload(amount);
      console.log("Borrow payload:", payload);

      // Use Gas Station for sponsored transactions
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

      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error("Transaction failed:", error);
      alert(`Transaction failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getHealthRatioColor = () => {
    if (parseFloat(healthRatio) > 200) return "text-green-400";
    if (parseFloat(healthRatio) > 150) return "text-yellow-400";
    return "text-red-400";
  };

  const getHealthRatioBg = () => {
    if (parseFloat(healthRatio) > 200)
      return "bg-green-500/20 border-green-500/30";
    if (parseFloat(healthRatio) > 150)
      return "bg-yellow-500/20 border-yellow-500/30";
    return "bg-red-500/20 border-red-500/30";
  };

  return (
    <div className="glass-card p-8 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center">
            <span className="text-2xl">🏦</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Borrow Assets</h3>
            <p className="text-purple-200">Step 2 • Leverage your collateral</p>
          </div>
        </div>
        {GAS_STATION_ENABLED && (
          <div className="flex items-center space-x-2 bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-medium">
            <span>⛽</span>
            <span>Gas Free</span>
          </div>
        )}
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-purple-500/20 border border-purple-500/30 rounded-2xl">
          <div className="flex items-center space-x-2">
            <span className="text-purple-400 text-xl">✅</span>
            <div>
              <p className="text-purple-300 font-semibold">
                Borrow Successful!
              </p>
              <p className="text-purple-200 text-sm">
                Assets transferred to your wallet
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Collateral Overview */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
          <h4 className="text-blue-300 font-semibold mb-3">Your Collateral</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-blue-200 text-sm">Deposited</p>
              <p className="text-white font-bold text-lg">
                {collateralAmount} APT
              </p>
            </div>
            <div>
              <p className="text-blue-200 text-sm">Max Borrow</p>
              <p className="text-white font-bold text-lg">
                {maxBorrowAmount} APT
              </p>
            </div>
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-white font-semibold mb-3">
            Borrow Amount (APT)
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              max={maxBorrowAmount}
              className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-semibold"
            />
            <button
              onClick={() => setAmount(maxBorrowAmount)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
            >
              MAX
            </button>
          </div>
        </div>

        {/* Health Ratio */}
        <div className={`border rounded-2xl p-4 ${getHealthRatioBg()}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-semibold">Health Ratio</span>
            <span className={`font-bold text-lg ${getHealthRatioColor()}`}>
              {healthRatio}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                parseFloat(healthRatio) > 200
                  ? "bg-green-400"
                  : parseFloat(healthRatio) > 150
                  ? "bg-yellow-400"
                  : "bg-red-400"
              }`}
              style={{
                width: `${Math.min(parseFloat(healthRatio) / 3, 100)}%`,
              }}
            ></div>
          </div>
          <p className="text-gray-300 text-xs mt-2">
            {parseFloat(healthRatio) > 150
              ? "Safe to borrow"
              : "⚠️ Low health ratio"}
          </p>
        </div>

        {/* Borrow Info */}
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-purple-400">ℹ️</span>
            <span className="text-purple-300 font-semibold">Borrow Terms</span>
          </div>
          <div className="text-purple-200 text-sm space-y-1">
            <p>• Interest rate: 8.5% APY</p>
            <p>• No fixed repayment term</p>
            <p>• Maintain health ratio above 150%</p>
          </div>
        </div>

        {/* Borrow Button */}
        <button
          onClick={handleBorrow}
          disabled={loading || !amount || parseFloat(healthRatio) < 150}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          ) : parseFloat(healthRatio) < 150 ? (
            "Health Ratio Too Low"
          ) : (
            `Borrow ${amount || "0"} APT`
          )}
        </button>

        {/* Transaction Link */}
        {lastTx && (
          <div className="text-center">
            <a
              href={getExplorerUrl(lastTx)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
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
