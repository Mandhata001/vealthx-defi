import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const DemoDashboard = ({ demoMode }) => {
  // Mock data for demo mode
  const mockBalanceData = [
    { name: 'Jan', balance: 1000 },
    { name: 'Feb', balance: 1250 },
    { name: 'Mar', balance: 1450 },
    { name: 'Apr', balance: 1680 },
    { name: 'May', balance: 1920 },
    { name: 'Jun', balance: 2150 },
    { name: 'Jul', balance: 2400 },
  ];

  const mockPoolData = [
    { name: 'USDC Pool', apy: 12.5, tvl: '850K' },
    { name: 'APT Pool', apy: 18.2, tvl: '1.2M' },
    { name: 'USDT Pool', apy: 10.8, tvl: '650K' },
    { name: 'BTC Pool', apy: 15.4, tvl: '2.1M' },
  ];

  const mockTransactions = [
    { type: 'Deposit', amount: '+$500', asset: 'USDC', time: '2 hours ago', hash: '0xabc123...' },
    { type: 'Yield', amount: '+$24.50', asset: 'USDC', time: '1 day ago', hash: '0xdef456...' },
    { type: 'Borrow', amount: '-$200', asset: 'APT', time: '3 days ago', hash: '0xghi789...' },
    { type: 'Repay', amount: '+$205', asset: 'APT', time: '5 days ago', hash: '0xjkl012...' },
  ];

  return (
    <div className="space-y-8">
      {/* Demo Mode Notice */}
      {demoMode && (
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-2xl">🎭</span>
            <div>
              <p className="text-white font-semibold">Demo Mode Active</p>
              <p className="text-purple-200 text-sm">All data shown below is simulated for demonstration purposes</p>
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-purple-200 text-sm font-medium mb-2">Total Balance</h3>
          <p className="text-3xl font-bold text-white mb-1">$2,400.00</p>
          <p className="text-green-400 text-sm">+12.5% this month</p>
        </div>
        
        <div className="glass-card p-6">
          <h3 className="text-purple-200 text-sm font-medium mb-2">Total Earned</h3>
          <p className="text-3xl font-bold text-white mb-1">$186.50</p>
          <p className="text-green-400 text-sm">+8.2% APY</p>
        </div>
        
        <div className="glass-card p-6">
          <h3 className="text-purple-200 text-sm font-medium mb-2">Borrowed</h3>
          <p className="text-3xl font-bold text-white mb-1">$650.00</p>
          <p className="text-blue-400 text-sm">65% utilization</p>
        </div>
        
        <div className="glass-card p-6">
          <h3 className="text-purple-200 text-sm font-medium mb-2">Health Ratio</h3>
          <p className="text-3xl font-bold text-white mb-1">2.8</p>
          <p className="text-green-400 text-sm">Healthy</p>
        </div>
      </div>

      {/* Balance Chart */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Portfolio Growth</h3>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-purple-500/20 text-purple-200 rounded-lg text-sm">7D</button>
            <button className="px-3 py-1 bg-purple-500 text-white rounded-lg text-sm">1M</button>
            <button className="px-3 py-1 bg-purple-500/20 text-purple-200 rounded-lg text-sm">3M</button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockBalanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(17, 24, 39, 0.8)', 
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="balance" 
              stroke="#8B5CF6" 
              strokeWidth={3}
              dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pools and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Pools */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-6">Your Active Pools</h3>
          <div className="space-y-4">
            {mockPoolData.map((pool, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <p className="text-white font-semibold">{pool.name}</p>
                  <p className="text-purple-200 text-sm">TVL: {pool.tvl}</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold">{pool.apy}% APY</p>
                  <button className="text-blue-400 text-sm hover:text-blue-300">Manage</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {mockTransactions.map((tx, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    tx.type === 'Deposit' ? 'bg-green-400' :
                    tx.type === 'Yield' ? 'bg-blue-400' :
                    tx.type === 'Borrow' ? 'bg-yellow-400' : 'bg-purple-400'
                  }`}></div>
                  <div>
                    <p className="text-white font-medium">{tx.type} {tx.asset}</p>
                    <p className="text-gray-400 text-sm">{tx.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${tx.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {tx.amount}
                  </p>
                  <p className="text-gray-400 text-xs">{tx.hash}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-4 rounded-xl font-semibold transition-all duration-200 flex flex-col items-center space-y-2">
            <span className="text-2xl">💰</span>
            <span>Deposit</span>
          </button>
          
          <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-xl font-semibold transition-all duration-200 flex flex-col items-center space-y-2">
            <span className="text-2xl">🏦</span>
            <span>Borrow</span>
          </button>
          
          <button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-4 rounded-xl font-semibold transition-all duration-200 flex flex-col items-center space-y-2">
            <span className="text-2xl">🔐</span>
            <span>Stake</span>
          </button>
          
          <button className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white p-4 rounded-xl font-semibold transition-all duration-200 flex flex-col items-center space-y-2">
            <span className="text-2xl">📊</span>
            <span>Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoDashboard;
