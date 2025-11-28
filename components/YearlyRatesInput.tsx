'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { YearlyRate } from '@/lib/types';

interface YearlyRatesInputProps {
  rates: YearlyRate[];
  onRatesChange: (rates: YearlyRate[]) => void;
  projectionYears: number;
}

export const YearlyRatesInput: React.FC<YearlyRatesInputProps> = ({
  rates,
  onRatesChange,
  projectionYears,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleRateChange = (year: number, field: 'rateOfReturn' | 'borrowRate', value: number) => {
    const updatedRates = [...rates];
    const index = updatedRates.findIndex(r => r.year === year);

    if (index >= 0) {
      updatedRates[index] = { ...updatedRates[index], [field]: value };
    } else {
      updatedRates.push({ year, rateOfReturn: 6.5, borrowRate: 5.5, [field]: value });
    }

    // Sort by year
    updatedRates.sort((a, b) => a.year - b.year);
    onRatesChange(updatedRates);
  };

  const getRate = (year: number, field: 'rateOfReturn' | 'borrowRate'): number => {
    const rate = rates.find(r => r.year === year);
    return rate ? rate[field] : field === 'rateOfReturn' ? 6.5 : 5.5;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div
        className="flex items-center justify-between cursor-pointer mb-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-xl font-semibold text-gray-700">Year-by-Year Rates</h2>
        <div className="text-gray-500">
          {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </div>
      </div>

      {isExpanded && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                <th className="px-4 py-2 text-left font-semibold">Year</th>
                <th className="px-4 py-2 text-center font-semibold">Rate of Return (%)</th>
                <th className="px-4 py-2 text-center font-semibold">Borrow Rate (%)</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: projectionYears }, (_, i) => i + 1).map((year, idx) => (
                <tr key={year} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-4 py-3 font-medium text-gray-700">{year}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      step="0.1"
                      value={getRate(year, 'rateOfReturn')}
                      onChange={(e) =>
                        handleRateChange(year, 'rateOfReturn', Number(e.target.value))
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-center"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      step="0.1"
                      value={getRate(year, 'borrowRate')}
                      onChange={(e) =>
                        handleRateChange(year, 'borrowRate', Number(e.target.value))
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-center"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-gray-500 mt-3">
            Default: Rate of Return = 6.5%, Borrow Rate = 5.5%. Adjust any year as needed.
          </p>
        </div>
      )}
    </div>
  );
};
