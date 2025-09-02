import React, { useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { aptos, CONTRACT_ADDRESS, fromOctas } from "../lib/aptos";

export default function VaultViewer() {
  const { account } = useWallet();
  const [vault, setVault] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchVaultData = async () => {
    if (!account || !CONTRACT_ADDRESS) return;
    
    setLoading(true);
    try {
      const vaultResource = await aptos.getAccountResource({
        accountAddress: account.address,
        resourceType: `${CONTRACT_ADDRESS}::vault::Vault`
      });
      
      setVault(vaultResource);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Failed to fetch vault:", error);
      // Vault might not exist yet
      setVault(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVaultData();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchVaultData, 10000);
    return () => clearInterval(interval);
  }, [account]);

  if (!account) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔐</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Wallet Required</h3>
          <p className="text-gray-300">Connect your wallet to view vault details</p>
        </div>
      </div>
    );
  }

  const collateral = vault ? fromOctas(vault.collateral) : "0";
  const borrowed = vault ? fromOctas(vault.borrowed) : "0";
  const healthRatio = vault && parseFloat(borrowed) > 0 
    ? ((parseFloat(collateral) / parseFloat(borrowed)) * 100).toFixed(1)
    : "∞";

  const getHealthStatus = () => {
    if (healthRatio === "∞") return { color: "text-green-400", bg: "bg-green-500/20 border-green-500/30", status: "Excellent" };
    const ratio = parseFloat(healthRatio);
    if (ratio > 300) return { color: "text-green-400", bg: "bg-green-500/20 border-green-500/30", status: "Excellent" };
    if (ratio > 200) return { color: "text-blue-400", bg: "bg-blue-500/20 border-blue-500/30", status: "Good" };
    if (ratio > 150) return { color: "text-yellow-400", bg: "bg-yellow-500/20 border-yellow-500/30", status: "Caution" };
    return { color: "text-red-400", bg: "bg-red-500/20 border-red-500/30", status: "Risk" };
  };

  const healthStatus = getHealthStatus();

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
            <span className="text-2xl">🏛️</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Your Vault</h3>
            <p className="text-purple-200">Real-time position overview</p>
          </div>
        </div>
        
        <button
          onClick={fetchVaultData}
          disabled={loading}
          className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl transition-colors border border-white/20 hover:border-white/40"
          title="Refresh vault data"
        >
          <span className={`text-lg ${loading ? 'animate-spin' : ''}`}>🔄</span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-white/20 rounded w-3/4"></div>
            <div className="h-4 bg-white/20 rounded w-1/2"></div>
            <div className="h-4 bg-white/20 rounded w-2/3"></div>
          </div>
        </div>
      ) : !vault ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h4 className="text-lg font-semibold text-white mb-2">No Vault Found</h4>
          <p className="text-gray-300 mb-4">Initialize your vault by making your first deposit</p>
          <button 
            onClick={fetchVaultData}
            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-2 rounded-xl transition-colors"
          >
            Check Again
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-green-400">💰</span>
                <span className="text-green-300 font-semibold">Collateral</span>
              </div>
              <p className="text-white text-2xl font-bold">{collateral} APT</p>
              <p className="text-green-200 text-sm">≈ ${(parseFloat(collateral) * 8.5).toFixed(2)}</p>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-purple-400">🏦</span>
                <span className="text-purple-300 font-semibold">Borrowed</span>
              </div>
              <p className="text-white text-2xl font-bold">{borrowed} APT</p>
              <p className="text-purple-200 text-sm">≈ ${(parseFloat(borrowed) * 8.5).toFixed(2)}</p>
            </div>
          </div>

          {/* Health Ratio */}
          <div className={`border rounded-2xl p-4 ${healthStatus.bg}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-white font-semibold">Health Ratio</span>
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${healthStatus.bg}`}>
                  {healthStatus.status}
                </span>
              </div>
              <span className={`font-bold text-2xl ${healthStatus.color}`}>
                {healthRatio}%
              </span>
            </div>
            
            {healthRatio !== "∞" && (
              <div className="space-y-2">
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      parseFloat(healthRatio) > 300 ? 'bg-green-400' :
                      parseFloat(healthRatio) > 200 ? 'bg-blue-400' :
                      parseFloat(healthRatio) > 150 ? 'bg-yellow-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${Math.min(parseFloat(healthRatio) / 5, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Liquidation: 150%</span>
                  <span>Safe: 300%+</span>
                </div>
              </div>
            )}
          </div>

          {/* Vault Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-gray-300 text-sm">Available to Borrow</p>
              <p className="text-white text-lg font-bold">
                {((parseFloat(collateral) * 0.67) - parseFloat(borrowed)).toFixed(3)} APT
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-300 text-sm">Utilization</p>
              <p className="text-white text-lg font-bold">
                {parseFloat(collateral) > 0 
                  ? ((parseFloat(borrowed) / parseFloat(collateral)) * 100).toFixed(1)
                  : "0"
                }%
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-green-500/20 hover:bg-green-500/30 text-green-300 py-3 rounded-xl transition-colors font-semibold">
              + Deposit More
            </button>
            <button className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 py-3 rounded-xl transition-colors font-semibold">
              ⤴️ Withdraw
            </button>
          </div>

          {/* Last Update */}
          {lastUpdate && (
            <div className="text-center text-gray-400 text-xs">
              Last updated: {lastUpdate}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
