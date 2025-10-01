import React, { useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { aptos, toOctas, fromOctas, getExplorerUrl } from "../lib/aptos";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const PaymentsHub = ({ demoMode = false, walletConnected, account }) => {
  const { account: walletAccount, signAndSubmitTransaction } = useWallet();
  const currentAccount = account || walletAccount;
  const [activePaymentTab, setActivePaymentTab] = useState("send");
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [globalStats, setGlobalStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [sendForm, setSendForm] = useState({
    recipient: "",
    amount: "",
    currency: "APT",
    memo: "",
    country: "US",
  });

  // Mock data for demo mode
  useEffect(() => {
    if (demoMode) {
      const mockHistory = [
        {
          id: 1,
          type: "sent",
          recipient: "0x1234...5678",
          amount: 500,
          currency: "USDC",
          status: "completed",
          memo: "Monthly salary",
          timestamp: "2024-09-03 14:30",
          fee: 1.5,
          country: "PH",
        },
        {
          id: 2,
          type: "received",
          sender: "0x9876...5432",
          amount: 1200,
          currency: "USDT",
          status: "completed",
          memo: "Freelance payment",
          timestamp: "2024-09-02 09:15",
          fee: 0,
          country: "US",
        },
        {
          id: 3,
          type: "sent",
          recipient: "0x5555...7777",
          amount: 250,
          currency: "USDC",
          status: "pending",
          memo: "Emergency funds",
          timestamp: "2024-09-01 16:45",
          fee: 0.75,
          country: "IN",
        },
      ];

      const mockStats = {
        totalPayments: 1247,
        totalVolume: 4850000,
        totalFees: 12450,
        averageAmount: 3890,
        topCountries: ["US", "PH", "IN", "MX", "NG"],
      };

      setPaymentHistory(mockHistory);
      setGlobalStats(mockStats);
    }
  }, [demoMode]);

  const volumeData = [
    { month: "Jan", volume: 1200000, fees: 3200 },
    { month: "Feb", volume: 1450000, fees: 3800 },
    { month: "Mar", volume: 1680000, fees: 4300 },
    { month: "Apr", volume: 1890000, fees: 4850 },
    { month: "May", volume: 2100000, fees: 5400 },
    { month: "Jun", volume: 2350000, fees: 6100 },
  ];

  const countries = [
    { code: "US", name: "United States", flag: "🇺🇸", rate: 1.0 },
    { code: "PH", name: "Philippines", flag: "🇵🇭", rate: 56.5 },
    { code: "IN", name: "India", flag: "🇮🇳", rate: 83.2 },
    { code: "MX", name: "Mexico", flag: "🇲🇽", rate: 17.8 },
    { code: "NG", name: "Nigeria", flag: "🇳🇬", rate: 765.0 },
    { code: "BR", name: "Brazil", flag: "🇧🇷", rate: 5.1 },
  ];

  const handleSendPayment = async () => {
    if (!walletConnected || !currentAccount) {
      alert("Please connect your wallet first");
      return;
    }

    if (!sendForm.recipient || !sendForm.amount) {
      alert("Please fill in recipient and amount");
      return;
    }

    try {
      setLoading(true);
      const transaction = {
        type: "entry_function_payload",
        function: "0x1::aptos_account::transfer",
        arguments: [sendForm.recipient, toOctas(sendForm.amount)],
        type_arguments: [],
      };

      const pendingTransaction = await signAndSubmitTransaction(transaction);
      setTxHash(pendingTransaction.hash);

      // Add to history
      const newPayment = {
        id: Date.now(),
        type: "sent",
        recipient: sendForm.recipient,
        amount: parseFloat(sendForm.amount),
        currency: sendForm.currency,
        status: "completed",
        memo: sendForm.memo,
        timestamp: new Date().toLocaleString(),
        fee: 0.001,
        country: sendForm.country,
        txHash: pendingTransaction.hash,
      };

      setPaymentHistory((prev) => [newPayment, ...prev]);

      // Reset form
      setSendForm({
        recipient: "",
        amount: "",
        currency: "APT",
        memo: "",
        country: "US",
      });

      alert("Payment sent successfully!");
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field, value) => {
    setSendForm((prev) => ({ ...prev, [field]: value }));
  };

  const calculateFee = (amount) => {
    const baseRate = 0.001; // 0.1%
    const baseFee = 0.01; // 0.01 APT
    return (parseFloat(amount) * baseRate + baseFee).toFixed(4);
  };

  // Show wallet connection prompt if not connected and not in demo mode
  if (!walletConnected && !demoMode) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gradient-to-br from-gray-900/50 via-blue-900/30 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">💳</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">
            Connect Wallet for Payments
          </h3>
          <p className="text-gray-400 mb-6">
            Connect your Aptos wallet to send instant, low-cost payments
            worldwide
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-2xl mb-2">⚡</div>
              <div className="text-sm text-white font-semibold">
                Instant Transfer
              </div>
              <div className="text-xs text-gray-400">Under 5 seconds</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-2xl mb-2">💰</div>
              <div className="text-sm text-white font-semibold">Low Fees</div>
              <div className="text-xs text-gray-400">
                ~$0.01 per transaction
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-2xl mb-2">🌍</div>
              <div className="text-sm text-white font-semibold">
                Global Reach
              </div>
              <div className="text-xs text-gray-400">200+ countries</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            🌍 Global Payments
          </h2>
          <p className="text-gray-400">
            Send instant, low-cost remittances worldwide using stablecoins
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2">
            <span className="text-gray-400 text-sm">24h Volume: </span>
            <span className="text-green-400 font-bold">
              ${globalStats.totalVolume?.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <div className="text-gray-400 text-sm">Total Payments</div>
          <div className="text-2xl font-bold text-white">
            {globalStats.totalPayments?.toLocaleString()}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <div className="text-gray-400 text-sm">Total Volume</div>
          <div className="text-2xl font-bold text-blue-400">
            ${globalStats.totalVolume?.toLocaleString()}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <div className="text-gray-400 text-sm">Average Amount</div>
          <div className="text-2xl font-bold text-green-400">
            ${globalStats.averageAmount?.toLocaleString()}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <div className="text-gray-400 text-sm">Total Fees Saved</div>
          <div className="text-2xl font-bold text-purple-400">
            ${globalStats.totalFees?.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Main Payment Interface */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Payment Form */}
        <div className="xl:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActivePaymentTab("send")}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activePaymentTab === "send"
                  ? "bg-blue-500 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              💸 Send Money
            </button>
            <button
              onClick={() => setActivePaymentTab("bulk")}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activePaymentTab === "bulk"
                  ? "bg-blue-500 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              👥 Bulk Payroll
            </button>
            <button
              onClick={() => setActivePaymentTab("request")}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activePaymentTab === "request"
                  ? "bg-blue-500 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              📥 Request Payment
            </button>
          </div>

          {activePaymentTab === "send" && (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Recipient Address
                </label>
                <input
                  type="text"
                  placeholder="0x1234...5678 or recipient@aptosname.apt"
                  value={sendForm.recipient}
                  onChange={(e) =>
                    handleFormChange("recipient", e.target.value)
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    placeholder="100"
                    value={sendForm.amount}
                    onChange={(e) => handleFormChange("amount", e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Currency
                  </label>
                  <select
                    value={sendForm.currency}
                    onChange={(e) =>
                      handleFormChange("currency", e.target.value)
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                  >
                    <option value="USDC">USDC</option>
                    <option value="USDT">USDT</option>
                    <option value="APT">APT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Recipient Country
                </label>
                <select
                  value={sendForm.country}
                  onChange={(e) => handleFormChange("country", e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Message (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Payment for services..."
                  value={sendForm.memo}
                  onChange={(e) => handleFormChange("memo", e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500"
                />
              </div>

              {/* Fee Calculation */}
              {sendForm.amount && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Amount:</span>
                    <span className="text-white">
                      {sendForm.amount} {sendForm.currency}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Network Fee:</span>
                    <span className="text-orange-400">
                      {calculateFee(sendForm.amount)} {sendForm.currency}
                    </span>
                  </div>
                  <div className="border-t border-white/20 pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-white">Total:</span>
                      <span className="text-green-400">
                        {(
                          parseFloat(sendForm.amount) +
                          parseFloat(calculateFee(sendForm.amount))
                        ).toFixed(4)}{" "}
                        {sendForm.currency}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleSendPayment}
                disabled={!sendForm.recipient || !sendForm.amount}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Payment
              </button>
            </div>
          )}

          {activePaymentTab === "bulk" && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-white mb-2">
                Bulk Payroll Coming Soon
              </h3>
              <p className="text-gray-400 mb-4">
                Send payments to multiple recipients at once with CSV upload
              </p>
              <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Join Waitlist
              </button>
            </div>
          )}

          {activePaymentTab === "request" && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📥</div>
              <h3 className="text-xl font-bold text-white mb-2">
                Payment Requests
              </h3>
              <p className="text-gray-400 mb-4">
                Generate payment links and QR codes for easy collection
              </p>
              <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Create Request
              </button>
            </div>
          )}
        </div>

        {/* Exchange Rates */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            💱 Exchange Rates
          </h3>

          <div className="space-y-3">
            {countries.map((country) => (
              <div
                key={country.code}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{country.flag}</span>
                  <div>
                    <div className="font-semibold text-white">
                      {country.code}
                    </div>
                    <div className="text-xs text-gray-400">{country.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-white">{country.rate}</div>
                  <div className="text-xs text-green-400">+0.2%</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="text-center">
              <div className="text-sm text-blue-400 mb-1">Real-time rates</div>
              <div className="text-xs text-gray-400">
                Updated every 30 seconds
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            📋 Recent Payments
          </h3>

          <div className="space-y-3">
            {paymentHistory.map((payment) => (
              <div
                key={payment.id}
                className="bg-white/5 border border-white/10 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-2xl ${
                        payment.type === "sent" ? "📤" : "📥"
                      }`}
                    ></span>
                    <div>
                      <div className="font-semibold text-white">
                        {payment.type === "sent" ? "Sent to" : "Received from"}
                      </div>
                      <div className="text-sm text-gray-400">
                        {payment.type === "sent"
                          ? payment.recipient
                          : payment.sender}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`font-bold ${
                        payment.type === "sent"
                          ? "text-red-400"
                          : "text-green-400"
                      }`}
                    >
                      {payment.type === "sent" ? "-" : "+"}${payment.amount}
                    </div>
                    <div className="text-sm text-gray-400">
                      {payment.currency}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between text-sm text-gray-400">
                  <span>{payment.memo}</span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      payment.status === "completed"
                        ? "bg-green-500/20 text-green-400"
                        : payment.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Volume Chart */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            📊 Payment Volume
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={volumeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(17, 24, 39, 0.9)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="volume" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Features Showcase */}
      <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">
          🌟 Why Choose VealthX Payments?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-3">⚡</div>
            <div className="font-semibold text-white mb-2">
              Instant Settlement
            </div>
            <div className="text-sm text-gray-400">
              Payments arrive in seconds, not days
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">💰</div>
            <div className="font-semibold text-white mb-2">Ultra-Low Fees</div>
            <div className="text-sm text-gray-400">
              Save 90% compared to traditional remittance
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">🔒</div>
            <div className="font-semibold text-white mb-2">
              Secure & Transparent
            </div>
            <div className="text-sm text-gray-400">
              Blockchain-secured with full transparency
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsHub;
