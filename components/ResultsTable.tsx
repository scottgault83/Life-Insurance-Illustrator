'use client';

import React from 'react';
import { CalculationRow, YearlyRate } from '@/lib/types';
import { formatCurrency } from '@/lib/formatting';

interface ResultsTableProps {
  data: CalculationRow[];
  onRateChange?: (year: number, field: 'rateOfReturn' | 'borrowRate', value: number) => void;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ data, onRateChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-3 py-3 text-left font-semibold">Year</th>
              <th className="px-3 py-3 text-left font-semibold bg-blue-500">Age</th>
              <th className="px-3 py-3 text-right font-semibold text-sm">Rate of Return (%)</th>
              <th className="px-3 py-3 text-right font-semibold text-sm">Borrow Rate (%)</th>
              <th className="px-3 py-3 text-right font-semibold">Premium</th>
              <th className="px-3 py-3 text-right font-semibold">Fee</th>
              <th className="px-3 py-3 text-right font-semibold">Withdrawal</th>
              <th className="px-3 py-3 text-right font-semibold">Cash Value</th>
              <th className="px-3 py-3 text-right font-semibold">DB</th>
              <th className="px-3 py-3 text-right font-semibold">BOY BAL</th>
              <th className="px-3 py-3 text-right font-semibold">EOY Interest</th>
              <th className="px-3 py-3 text-right font-semibold bg-yellow-500">O of P</th>
              <th className="px-3 py-3 text-right font-semibold">EOY BAL</th>
              <th className="px-3 py-3 text-right font-semibold">NET DB</th>
              <th className="px-3 py-3 text-right font-semibold">Collateral</th>
              <th className="px-3 py-3 text-right font-semibold bg-green-500">Total Cost</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={row.year} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="px-3 py-2 border-b">{row.year}</td>
                <td className="px-3 py-2 border-b bg-blue-50 font-medium">{row.age}</td>
                <td className="px-3 py-2 border-b text-right">
                  <input
                    type="number"
                    step="0.1"
                    value={row.rateOfReturn.toFixed(2)}
                    onChange={(e) => onRateChange?.(row.year, 'rateOfReturn', Number(e.target.value))}
                    className="w-16 px-2 py-1 border border-gray-300 rounded-md text-right text-sm focus:ring-2 focus:ring-blue-500"
                  />
                  %
                </td>
                <td className="px-3 py-2 border-b text-right">
                  <input
                    type="number"
                    step="0.1"
                    value={row.borrowRate.toFixed(2)}
                    onChange={(e) => onRateChange?.(row.year, 'borrowRate', Number(e.target.value))}
                    className="w-16 px-2 py-1 border border-gray-300 rounded-md text-right text-sm focus:ring-2 focus:ring-blue-500"
                  />
                  %
                </td>
                <td className="px-3 py-2 border-b text-right">{formatCurrency(row.premium)}</td>
                <td className="px-3 py-2 border-b text-right">{formatCurrency(row.fee)}</td>
                <td className="px-3 py-2 border-b text-right">{formatCurrency(row.withdrawal)}</td>
                <td className="px-3 py-2 border-b text-right font-semibold text-blue-700">
                  {formatCurrency(row.cashValue)}
                </td>
                <td className="px-3 py-2 border-b text-right">{formatCurrency(row.db)}</td>
                <td className="px-3 py-2 border-b text-right">{formatCurrency(row.boyBal)}</td>
                <td className="px-3 py-2 border-b text-right">{formatCurrency(row.interestCharge)}</td>
                <td className="px-3 py-2 border-b text-right bg-yellow-50 font-medium">
                  {formatCurrency(row.oop)}
                </td>
                <td className="px-3 py-2 border-b text-right">{formatCurrency(row.eoyBal)}</td>
                <td className="px-3 py-2 border-b text-right font-semibold text-green-700">
                  {formatCurrency(row.netDB)}
                </td>
                <td className="px-3 py-2 border-b text-right">{formatCurrency(row.collateral)}</td>
                <td className="px-3 py-2 border-b text-right bg-green-50 font-semibold">
                  {formatCurrency(row.totalCost)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
