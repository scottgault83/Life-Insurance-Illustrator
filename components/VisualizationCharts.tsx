'use client';

import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CalculationRow } from '@/lib/types';
import { formatCurrency } from '@/lib/formatting';

interface VisualizationChartsProps {
  data: CalculationRow[];
}

export const VisualizationCharts: React.FC<VisualizationChartsProps> = ({ data }) => {
  if (data.length === 0) {
    return null;
  }

  const chartData = data.map(row => ({
    year: row.year,
    cashValue: Math.round(row.cashValue),
    deathBenefit: Math.round(row.db),
    eoyBalance: Math.round(row.eoyBal),
    netDB: Math.round(row.netDB),
  }));

  const costData = data.map(row => ({
    year: row.year,
    oop: Math.round(row.oop),
    totalCost: Math.round(row.totalCost),
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow">
          <p className="text-sm font-medium">{`Year ${payload[0].payload.year}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: Cash Value and Death Benefit Projection */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Cash Value & Death Benefit Projection</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="cashValue"
              stroke="#3b82f6"
              name="Cash Value"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="deathBenefit"
              stroke="#10b981"
              name="Death Benefit"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="netDB"
              stroke="#8b5cf6"
              name="Net DB"
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart 2: Annual vs Total Costs */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Out of Pocket & Cumulative Costs</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={costData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="oop" fill="#fbbf24" name="Annual Out of Pocket" />
            <Bar dataKey="totalCost" fill="#ef4444" name="Cumulative Cost" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Chart 3: EOY Balance Trend */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">End of Year Balance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="eoyBalance"
              stroke="#f59e0b"
              name="EOY Balance"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart 4: Key Metrics Comparison */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Final Year Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={[data[data.length - 1]]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="cashValue" fill="#3b82f6" name="Cash Value" />
            <Bar dataKey="db" fill="#10b981" name="Death Benefit" />
            <Bar dataKey="netDB" fill="#8b5cf6" name="Net DB" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
