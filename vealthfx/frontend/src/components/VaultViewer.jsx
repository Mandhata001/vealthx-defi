import React, { useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { aptos, CONTRACT_ADDRESS, fromOctas } from "../lib/aptos";

export default function VaultViewer({
  demoMode = false,
  walletConnected,
  account,
}) {
  const { account: walletAccount } = useWallet();
  const currentAccount = account || walletAccount;
  const [vault, setVault] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [selectedVault, setSelectedVault] = useState("real-estate");

  // RWA Vault Types
  const rwaVaults = [
    {
      id: "real-estate",
      name: "Manhattan Real Estate",
      icon: "🏢",
      description: "Commercial property in prime NYC location",
      apy: "12.5%",
      tvl: "$2.4M",
      minDeposit: "$100",
      riskLevel: "Medium",
      color: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/30",
      textColor: "text-blue-400",
    },
    {
      id: "gold",
      name: "Physical Gold Vault",
      icon: "🥇",
      description: "Tokenized physical gold reserves",
      apy: "8.3%",
      tvl: "$1.8M",
      minDeposit: "$50",
      riskLevel: "Low",
      color: "from-yellow-500/20 to-orange-500/20",
      borderColor: "border-yellow-500/30",
      textColor: "text-yellow-400",
    },
    {
      id: "art",
      name: "Contemporary Art",
      icon: "🎨",
      description: "Fractionalized Picasso collection",
      apy: "23.7%",
      tvl: "$987K",
      minDeposit: "$250",
      riskLevel: "High",
      color: "from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-500/30",
      textColor: "text-purple-400",
    },
    {
      id: "copy-trading",
      name: "Copy Trading Vault",
      icon: "👥",
      description: "Follow top performing traders",
      apy: "15.2%",
      tvl: "$1.2M",
      minDeposit: "$500",
      riskLevel: "Medium",
      color: "from-emerald-500/20 to-green-500/20",
      borderColor: "border-emerald-500/30",
      textColor: "text-emerald-400",
    },
  ];

  const fetchVaultData = async () => {
    if (!currentAccount || !CONTRACT_ADDRESS) {
      if (demoMode) {
        // Mock vault data for demo mode
        setVault({
          data: {
            collateral: "150000000000", // 1500 APT in octas
            borrowed: "50000000000", // 500 APT in octas
            lastUpdate: Date.now(),
          },
        });
        setLastUpdate(new Date().toLocaleTimeString());
        return;
      }
      return;
    }

    setLoading(true);
    try {
      const accountAddress = getAccountAddress(currentAccount);
      if (!accountAddress) {
        throw new Error("Invalid account address");
      }

      const vaultResource = await aptos.getAccountResource({
        accountAddress: accountAddress,
        resourceType: `${CONTRACT_ADDRESS}::vault::Vault`,
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
  }, [currentAccount, demoMode]);

  if (!walletConnected && !demoMode) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-gradient-to-br from-gray-900/50 via-blue-900/30 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔐</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Wallet Required
            </h3>
            <p className="text-gray-400">
              Connect your wallet to view vault details
            </p>
          </div>
        </div>
      </div>
    );
  }

  const selectedVaultData = rwaVaults.find((v) => v.id === selectedVault);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* RWA Vault Selection */}
      <div className="bg-gradient-to-br from-gray-900/50 via-blue-900/30 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="mr-3">🏦</span>
          Real World Asset Vaults
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {rwaVaults.map((vault) => (
            <button
              key={vault.id}
              onClick={() => setSelectedVault(vault.id)}
              className={`p-4 rounded-2xl border transition-all duration-300 transform hover:scale-105 ${
                selectedVault === vault.id
                  ? `bg-gradient-to-br ${vault.color} ${vault.borderColor} shadow-lg`
                  : "bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/50"
              }`}
            >
              <div className="text-3xl mb-2">{vault.icon}</div>
              <div className="text-sm font-bold text-white">{vault.name}</div>
              <div
                className={`text-xs ${
                  selectedVault === vault.id ? vault.textColor : "text-gray-400"
                }`}
              >
                APY: {vault.apy}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Vault Details */}
      <div
        className={`bg-gradient-to-br ${selectedVaultData.color} backdrop-blur-xl border ${selectedVaultData.borderColor} rounded-3xl p-8 shadow-2xl`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">{selectedVaultData.icon}</div>
            <div>
              <h3 className="text-2xl font-bold text-white">
                {selectedVaultData.name}
              </h3>
              <p className="text-gray-300">{selectedVaultData.description}</p>
            </div>
          </div>
          <div className="text-right">
            <div
              className={`text-2xl font-bold ${selectedVaultData.textColor}`}
            >
              {selectedVaultData.apy}
            </div>
            <div className="text-sm text-gray-400">Current APY</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-black/20 rounded-2xl p-4 border border-white/10">
            <div className="text-sm text-gray-400">Total Value Locked</div>
            <div className="text-xl font-bold text-white">
              {selectedVaultData.tvl}
            </div>
          </div>
          <div className="bg-black/20 rounded-2xl p-4 border border-white/10">
            <div className="text-sm text-gray-400">Minimum Deposit</div>
            <div className="text-xl font-bold text-white">
              {selectedVaultData.minDeposit}
            </div>
          </div>
          <div className="bg-black/20 rounded-2xl p-4 border border-white/10">
            <div className="text-sm text-gray-400">Risk Level</div>
            <div
              className={`text-xl font-bold ${
                selectedVaultData.riskLevel === "Low"
                  ? "text-green-400"
                  : selectedVaultData.riskLevel === "Medium"
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              {selectedVaultData.riskLevel}
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105">
            🏦 Deposit
          </button>
          <button className="flex-1 bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
            📤 Withdraw
          </button>
        </div>
      </div>
    </div>
  );
}
