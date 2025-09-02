import React from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

const WalletDebugPanel = () => {
  const { 
    account, 
    connected, 
    connecting, 
    disconnect, 
    wallet,
    wallets 
  } = useWallet();

  const handleDirectConnect = async () => {
    try {
      console.log("🔄 Direct Petra connection attempt...");
      
      if (window.aptos) {
        const result = await window.aptos.connect();
        console.log("✅ Direct connection successful:", result);
      } else {
        console.log("❌ window.aptos not available");
      }
    } catch (error) {
      console.error("❌ Direct connection failed:", error);
    }
  };

  const handleCheckAccount = async () => {
    try {
      if (window.aptos) {
        const account = await window.aptos.account();
        console.log("📋 Current account:", account);
      }
    } catch (error) {
      console.error("❌ Account check failed:", error);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg max-w-sm text-xs">
      <h3 className="font-bold mb-2">🔧 Wallet Debug Panel</h3>
      
      <div className="space-y-1">
        <div>Window.aptos: {window.aptos ? "✅" : "❌"}</div>
        <div>Connected: {connected ? "✅" : "❌"}</div>
        <div>Connecting: {connecting ? "⏳" : "❌"}</div>
        <div>Account: {account?.address || "None"}</div>
        <div>Wallet: {wallet?.name || "None"}</div>
        <div>Available Wallets: {wallets.length}</div>
      </div>
      
      <div className="mt-3 space-y-1">
        <button 
          onClick={handleDirectConnect}
          className="block w-full bg-blue-600 px-2 py-1 rounded text-xs"
        >
          Direct Connect
        </button>
        <button 
          onClick={handleCheckAccount}
          className="block w-full bg-green-600 px-2 py-1 rounded text-xs"
        >
          Check Account
        </button>
        {connected && (
          <button 
            onClick={disconnect}
            className="block w-full bg-red-600 px-2 py-1 rounded text-xs"
          >
            Disconnect
          </button>
        )}
      </div>
    </div>
  );
};

export default WalletDebugPanel;
