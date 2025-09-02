import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { MOCK_YIELD_DATA } from "../lib/constants";

export default function YieldChart() {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm text-gray-600">{formatDate(label)}</p>
          <p className="text-lg font-bold text-blue-600">
            {payload[0].value.toFixed(2)}% APY
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Yield Performance
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-gray-600">7-Day APY</span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={MOCK_YIELD_DATA}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis
              domain={["dataMin - 0.5", "dataMax + 0.5"]}
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="apy"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Stats */}
      <div className="mt-4 grid grid-cols-4 gap-4 text-center">
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-gray-900">10.5%</div>
          <div className="text-xs text-gray-600">Current APY</div>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="text-lg font-bold text-green-600">+1.7%</div>
          <div className="text-xs text-gray-600">7D Change</div>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="text-lg font-bold text-blue-600">9.2%</div>
          <div className="text-xs text-gray-600">7D Average</div>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg">
          <div className="text-lg font-bold text-purple-600">12.1%</div>
          <div className="text-xs text-gray-600">7D High</div>
        </div>
      </div>

      {/* Performance Indicator */}
      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="text-green-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-green-800">
              Performance Trending Up
            </p>
            <p className="text-xs text-green-600">
              Yield has increased 18% over the past week
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
