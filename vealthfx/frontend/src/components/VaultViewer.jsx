import React, { useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { aptos, CONTRACT_ADDRESS, fromOctas, toOctas } from "../lib/aptos";

export default function VaultViewer({
  demoMode = false,
  walletConnected,
  account,
}) {
  const { account: walletAccount, signAndSubmitTransaction } = useWallet();
  const currentAccount = account || walletAccount;
  const [vault, setVault] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [selectedVault, setSelectedVault] = useState("real-estate");
  const [depositAmount, setDepositAmount] = useState("");
  const [borrowAmount, setBorrowAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleDeposit = async () => {
    if (!currentAccount || !depositAmount) {
      alert("Please enter deposit amount");
      return;
    }

    setIsProcessing(true);
    try {
      // Initialize vault if it doesn't exist
      if (!vault) {
        const initTx = {
          type: "entry_function_payload",
          function: `${CONTRACT_ADDRESS}::vault::init_vault`,
          arguments: [],
          type_arguments: [],
        };
        await signAndSubmitTransaction(initTx);
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for transaction
      }

      // Deposit collateral
      const depositTx = {
        type: "entry_function_payload",
        function: `${CONTRACT_ADDRESS}::vault::deposit_collateral`,
        arguments: [toOctas(depositAmount)],
        type_arguments: ["0x1::aptos_coin::AptosCoin"],
      };

      const result = await signAndSubmitTransaction(depositTx);
      console.log("Deposit transaction:", result);

      // Refresh vault data
      setTimeout(() => {
        fetchVaultData();
        setDepositAmount("");
      }, 2000);

      alert("Deposit successful!");
    } catch (error) {
      console.error("Deposit failed:", error);
      alert("Deposit failed: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBorrow = async () => {
    if (!currentAccount || !borrowAmount) {
      alert("Please enter borrow amount");
      return;
    }

    if (!vault) {
      alert("Please deposit collateral first");
      return;
    }

    setIsProcessing(true);
    try {
      const borrowTx = {
        type: "entry_function_payload",
        function: `${CONTRACT_ADDRESS}::vault::borrow_asset`,
        arguments: [toOctas(borrowAmount)],
        type_arguments: ["0x1::aptos_coin::AptosCoin"],
      };

      const result = await signAndSubmitTransaction(borrowTx);
      console.log("Borrow transaction:", result);

      // Refresh vault data
      setTimeout(() => {
        fetchVaultData();
        setBorrowAmount("");
      }, 2000);

      alert("Borrow successful!");
    } catch (error) {
      console.error("Borrow failed:", error);
      alert("Borrow failed: " + error.message);
    } finally {
      setIsProcessing(false);
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
      <div className="w-full px-2 sm:px-4 lg:px-6 py-6">
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
    <div className="w-full px-2 sm:px-4 lg:px-6 py-6 space-y-6">
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

        {/* Vault Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Deposit Form */}
          <div className="bg-black/20 rounded-2xl p-6 border border-white/10">
            <h4 className="text-lg font-bold text-white mb-4 flex items-center">
              🏦 Deposit Collateral
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount (APT)
                </label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none transition-colors"
                />
              </div>
              <button
                onClick={handleDeposit}
                disabled={isProcessing || !depositAmount}
                className={`w-full px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                  isProcessing || !depositAmount
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-emerald-500 to-cyan-500 text-black hover:shadow-lg hover:shadow-emerald-500/25"
                }`}
              >
                {isProcessing ? "Processing..." : "Deposit"}
              </button>
            </div>
          </div>

          {/* Borrow Form */}
          <div className="bg-black/20 rounded-2xl p-6 border border-white/10">
            <h4 className="text-lg font-bold text-white mb-4 flex items-center">
              💰 Borrow Assets
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount (APT)
                </label>
                <input
                  type="number"
                  value={borrowAmount}
                  onChange={(e) => setBorrowAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none transition-colors"
                />
              </div>
              <button
                onClick={handleBorrow}
                disabled={isProcessing || !borrowAmount || !vault}
                className={`w-full px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                  isProcessing || !borrowAmount || !vault
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/25"
                }`}
              >
                {isProcessing ? "Processing..." : "Borrow"}
              </button>
            </div>
          </div>
        </div>

        {/* Vault Status */}
        {vault && (
          <div className="mt-6 bg-black/20 rounded-2xl p-6 border border-white/10">
            <h4 className="text-lg font-bold text-white mb-4">
              Your Vault Status
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-400">
                  Deposited Collateral
                </div>
                <div className="text-xl font-bold text-emerald-400">
                  {vault.data ? fromOctas(vault.data.collateral) : "0"} APT
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Borrowed Amount</div>
                <div className="text-xl font-bold text-purple-400">
                  {vault.data ? fromOctas(vault.data.borrowed) : "0"} APT
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Collateral Ratio</div>
                <div className="text-xl font-bold text-cyan-400">
                  {vault.data && vault.data.borrowed > 0
                    ? (
                        (parseFloat(fromOctas(vault.data.collateral)) /
                          parseFloat(fromOctas(vault.data.borrowed))) *
                        100
                      ).toFixed(0) + "%"
                    : "∞"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
