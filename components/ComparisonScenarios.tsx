'use client';

import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { CalculatorInputs, CalculationRow } from '@/lib/types';
import { calculateInsuranceProjection } from '@/lib/calculator';
import { formatCurrency } from '@/lib/formatting';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

interface ScenarioComparison {
  id: string;
  name: string;
  inputs: CalculatorInputs;
  results: CalculationRow[];
  color: string;
}

interface ComparisonScenariosProps {
  currentInputs: CalculatorInputs;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export const ComparisonScenarios: React.FC<ComparisonScenariosProps> = ({ currentInputs }) => {
  const [comparisons, setComparisons] = useState<ScenarioComparison[]>([]);
  const [scenarioNames, setScenarioNames] = useState<{ [key: string]: string }>({});

  const handleAddComparison = () => {
    const id = Date.now().toString();
    const newName = `Scenario ${comparisons.length + 1}`;
    const results = calculateInsuranceProjection(currentInputs);

    setComparisons([
      ...comparisons,
      {
        id,
        name: newName,
        inputs: currentInputs,
        results,
        color: COLORS[comparisons.length % COLORS.length],
      },
    ]);

    setScenarioNames({ ...scenarioNames, [id]: newName });
  };

  const handleRemoveComparison = (id: string) => {
    setComparisons(comparisons.filter(c => c.id !== id));
    const newNames = { ...scenarioNames };
    delete newNames[id];
    setScenarioNames(newNames);
  };

  const handleRenameScenario = (id: string, newName: string) => {
    setScenarioNames({ ...scenarioNames, [id]: newName });
    setComparisons(
      comparisons.map(c => (c.id === id ? { ...c, name: newName } : c))
    );
  };

  if (comparisons.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Compare Scenarios</h2>
        <p className="text-gray-600 mb-4">
          Add multiple scenarios to compare their outcomes side by side.
        </p>
        <button
          onClick={handleAddComparison}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={18} />
          Add Current as Comparison
        </button>
      </div>
    );
  }

  const finalYearData = comparisons.map(scenario => ({
    name: scenario.name,
    cashValue: Math.round(scenario.results[scenario.results.length - 1].cashValue),
    deathBenefit: Math.round(scenario.results[scenario.results.length - 1].db),
    netDB: Math.round(scenario.results[scenario.results.length - 1].netDB),
    totalCost: Math.round(scenario.results[scenario.results.length - 1].totalCost),
  }));

  const projectionData = comparisons[0].results.map((row, idx) => {
    const point: any = { year: row.year };
    comparisons.forEach(scenario => {
      point[scenario.name] = Math.round(scenario.results[idx].cashValue);
    });
    return point;
  });

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
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Compare Scenarios</h2>
          <button
            onClick={handleAddComparison}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={18} />
            Add Comparison
          </button>
        </div>

        {/* Scenario List */}
        <div className="space-y-2 mb-6">
          {comparisons.map(scenario => (
            <div key={scenario.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: scenario.color }}
              ></div>
              <input
                type="text"
                value={scenarioNames[scenario.id] || scenario.name}
                onChange={e => handleRenameScenario(scenario.id, e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded-md"
              />
              <button
                onClick={() => handleRemoveComparison(scenario.id)}
                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm flex items-center gap-1"
              >
                <Trash2 size={14} />
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Summary Comparison Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-3 py-2 text-left">Scenario</th>
                <th className="px-3 py-2 text-right">Final Cash Value</th>
                <th className="px-3 py-2 text-right">Death Benefit</th>
                <th className="px-3 py-2 text-right">Net DB</th>
                <th className="px-3 py-2 text-right">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {finalYearData.map((scenario, idx) => (
                <tr
                  key={scenario.name}
                  className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                  style={{ borderLeft: `4px solid ${comparisons[idx].color}` }}
                >
                  <td className="px-3 py-2 font-medium">{scenario.name}</td>
                  <td className="px-3 py-2 text-right">{formatCurrency(scenario.cashValue)}</td>
                  <td className="px-3 py-2 text-right">{formatCurrency(scenario.deathBenefit)}</td>
                  <td className="px-3 py-2 text-right">{formatCurrency(scenario.netDB)}</td>
                  <td className="px-3 py-2 text-right">{formatCurrency(scenario.totalCost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Comparison Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Final Year Metrics */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Final Year Metrics</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={finalYearData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="cashValue" fill="#3b82f6" name="Cash Value" />
                <Bar dataKey="netDB" fill="#8b5cf6" name="Net DB" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Cash Value Projection */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Cash Value Projection</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {comparisons.map(scenario => (
                  <Line
                    key={scenario.id}
                    type="monotone"
                    dataKey={scenario.name}
                    stroke={scenario.color}
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
