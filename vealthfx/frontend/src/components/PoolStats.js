import React, { useState, useEffect } from "react";
import { MOCK_POOLS } from "../lib/constants";

export default function PoolStats() {
  const [pools, setPools] = useState([]);
  const [bestPool, setBestPool] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading pools data
    const fetchPools = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use mock data for now
      setPools(MOCK_POOLS);
      
      // Find best pool by APY
      const best = MOCK_POOLS.reduce((prev, current) => 
        prev.apy > current.apy ? prev : current
      );
      setBestPool(best);
      
      setLoading(false);
    };

    fetchPools();
  }, []);

  const getRiskColor = (risk) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pool Analytics</h3>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Pool Analytics</h3>
        <span className="text-xs text-gray-500">Live Data</span>
      </div>

      {/* Best Pool Highlight */}
      {bestPool && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-blue-900">🏆 Best Pool</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(bestPool.risk)}`}>
                  {bestPool.risk} Risk
                </span>
              </div>
              <p className="text-2xl font-bold text-blue-700">{bestPool.name}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-700">{bestPool.apy}%</div>
              <div className="text-sm text-blue-600">APY</div>
            </div>
          </div>
          <div className="mt-2 text-sm text-blue-600">
            TVL: ${bestPool.tvl} • Auto-routing active
          </div>
        </div>
      )}

      {/* All Pools Table */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-700">Available Pools</h4>
        
        {pools.map((pool, index) => (
          <div 
            key={index} 
            className={`flex items-center justify-between p-4 rounded-lg border-2 transition-colors ${
              pool.name === bestPool?.name 
                ? 'border-blue-200 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                pool.name === bestPool?.name ? 'bg-blue-500' : 'bg-gray-300'
              }`}></div>
              <div>
                <div className="font-medium text-gray-900">{pool.name}</div>
                <div className="text-sm text-gray-500">TVL: ${pool.tvl}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(pool.risk)}`}>
                {pool.risk}
              </span>
              <div className="text-right">
                <div className="font-bold text-lg text-gray-900">{pool.apy}%</div>
                <div className="text-xs text-gray-500">APY</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Router Status */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">Auto-Router</span>
          </div>
          <span className="text-sm text-green-600 font-medium">Active</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Automatically routes your funds to the highest-yield pool
        </p>
      </div>

      {/* Pool Performance Indicator */}
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="text-lg font-bold text-green-600">+2.3%</div>
          <div className="text-xs text-gray-600">24h Change</div>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="text-lg font-bold text-blue-600">$8.2M</div>
          <div className="text-xs text-gray-600">Total TVL</div>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg">
          <div className="text-lg font-bold text-purple-600">4</div>
          <div className="text-xs text-gray-600">Active Pools</div>
        </div>
      </div>
    </div>
  );
}
