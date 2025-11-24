'use client';

import React from 'react';
import { CalculatorInputs } from '@/lib/types';

interface InputControlsProps {
  inputs: CalculatorInputs;
  onInputChange: <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => void;
}

const INPUT_FIELDS: Array<{
  key: keyof CalculatorInputs;
  label: string;
  step?: number;
}> = [
  { key: 'deathBenefit', label: 'Death Benefit' },
  { key: 'rateOfReturn', label: 'Rate of Return (%)', step: 0.1 },
  { key: 'borrowRate', label: 'Borrow Rate (%)', step: 0.1 },
  { key: 'outOfPocket', label: 'Out of Pocket' },
  { key: 'paymentYears', label: 'Payment Years' },
  { key: 'annualPremium', label: 'Annual Premium' },
  { key: 'premiumYears', label: 'Premium Years' },
  { key: 'firstYearFee', label: 'First Year Fee' },
  { key: 'startAge', label: 'Start Age' },
  { key: 'initialExposure', label: 'Initial Exposure' },
];

export const InputControls: React.FC<InputControlsProps> = ({ inputs, onInputChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Adjustable Parameters</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {INPUT_FIELDS.map(field => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
            </label>
            <input
              type="number"
              step={field.step || 1}
              value={inputs[field.key]}
              onChange={e => onInputChange(field.key, Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
