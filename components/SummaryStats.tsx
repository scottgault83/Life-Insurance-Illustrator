'use client';

import React from 'react';
import { CalculationRow } from '@/lib/types';
import { formatCurrency } from '@/lib/formatting';

interface SummaryStatsProps {
  data: CalculationRow[];
}

export const SummaryStats: React.FC<SummaryStatsProps> = ({ data }) => {
  if (data.length === 0) {
    return null;
  }

  const lastRow = data[data.length - 1];
  const totalOutOfPocket = lastRow.totalCost;

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-blue-100 rounded-lg p-4">
        <h3 className="font-semibold text-gray-700 mb-2">Final Cash Value</h3>
        <p className="text-2xl font-bold text-blue-700">{formatCurrency(lastRow.cashValue)}</p>
      </div>
      <div className="bg-green-100 rounded-lg p-4">
        <h3 className="font-semibold text-gray-700 mb-2">Total Out of Pocket</h3>
        <p className="text-2xl font-bold text-green-700">{formatCurrency(totalOutOfPocket)}</p>
      </div>
      <div className="bg-purple-100 rounded-lg p-4">
        <h3 className="font-semibold text-gray-700 mb-2">Final Net Death Benefit</h3>
        <p className="text-2xl font-bold text-purple-700">{formatCurrency(lastRow.netDB)}</p>
      </div>
    </div>
  );
};
