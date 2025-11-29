'use client';

import React from 'react';
import { CalculationRow, YearlyRate } from '@/lib/types';
import { formatCurrency } from '@/lib/formatting';

interface ResultsTableProps {
  data: CalculationRow[];
  onRateChange?: (year: number, field: 'rateOfReturn' | 'borrowRate', value: number) => void;
}

const columnFormulas: Record<string, string> = {
  'Year': 'Projection year number',
  'Age': 'Start Age + Year - 1',
  'Rate of Return (%)': 'Investment return rate (editable)',
  'Borrow Rate (%)': 'Loan interest rate (editable)',
  'Premium': 'Annual premium if year ≤ Premium Years, else $0',
  'Fee': 'First Year Fee if year = 1, else $0',
  'Withdrawal': 'If year = Payment Years and CV ≥ EOY Bal, withdrawal = EOY Bal, else $0',
  'Cash Value': 'Prev CV × (1 + Rate of Return%) + Premium - Fee (Y1 only) - Withdrawal',
  'DB': 'Death Benefit + (Initial Exposure × (1 + Rate of Return%)^(Year-1))',
  'BOY BAL': 'If year = 1: Premium - O of P, else Prev EOY Bal + Premium (if applicable) - O of P',
  'EOY Interest': 'BOY BAL × (Borrow Rate% / 100)',
  'O of P': 'Annual Out of Pocket if year ≤ Payment Years, else $0',
  'EOY BAL': 'BOY BAL + EOY Interest',
  'NET DB': 'DB - (Withdrawal > 0 ? 0 : EOY BAL) + Cash Value',
  'Collateral': 'max(0, EOY BAL - Cash Value)',
  'Total Cost': 'Cumulative sum of O of P (excludes Fee)',
};

const TooltipHeader = ({ title }: { title: string }) => {
  const formula = columnFormulas[title];
  return (
    <div className="group cursor-help">
      <span className="underline decoration-dotted">{title}</span>
      {formula && (
        <div className="absolute hidden group-hover:block bg-gray-900 text-white text-xs rounded-md p-3 w-56 z-50 whitespace-normal shadow-lg border border-gray-700 mt-1">
          <p className="font-semibold mb-2">Formula:</p>
          <p className="leading-relaxed">{formula}</p>
        </div>
      )}
    </div>
  );
};

export const ResultsTable: React.FC<ResultsTableProps> = ({ data, onRateChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <p className="px-6 pt-4 text-xs text-gray-600">💡 Hover over column headers to see calculation formulas</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-3 py-3 text-left font-semibold relative"><TooltipHeader title="Year" /></th>
              <th className="px-3 py-3 text-left font-semibold bg-blue-500 relative"><TooltipHeader title="Age" /></th>
              <th className="px-3 py-3 text-right font-semibold text-sm relative"><TooltipHeader title="Rate of Return (%)" /></th>
              <th className="px-3 py-3 text-right font-semibold text-sm relative"><TooltipHeader title="Borrow Rate (%)" /></th>
              <th className="px-3 py-3 text-right font-semibold relative"><TooltipHeader title="Premium" /></th>
              <th className="px-3 py-3 text-right font-semibold relative"><TooltipHeader title="Fee" /></th>
              <th className="px-3 py-3 text-right font-semibold relative"><TooltipHeader title="Withdrawal" /></th>
              <th className="px-3 py-3 text-right font-semibold relative"><TooltipHeader title="Cash Value" /></th>
              <th className="px-3 py-3 text-right font-semibold relative"><TooltipHeader title="DB" /></th>
              <th className="px-3 py-3 text-right font-semibold relative"><TooltipHeader title="BOY BAL" /></th>
              <th className="px-3 py-3 text-right font-semibold relative"><TooltipHeader title="EOY Interest" /></th>
              <th className="px-3 py-3 text-right font-semibold bg-yellow-500 relative"><TooltipHeader title="O of P" /></th>
              <th className="px-3 py-3 text-right font-semibold relative"><TooltipHeader title="EOY BAL" /></th>
              <th className="px-3 py-3 text-right font-semibold relative"><TooltipHeader title="NET DB" /></th>
              <th className="px-3 py-3 text-right font-semibold relative"><TooltipHeader title="Collateral" /></th>
              <th className="px-3 py-3 text-right font-semibold bg-green-500 relative"><TooltipHeader title="Total Cost" /></th>
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
