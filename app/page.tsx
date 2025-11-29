'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { InputControls } from '@/components/InputControls';
import { ResultsTable } from '@/components/ResultsTable';
import { SummaryStats } from '@/components/SummaryStats';
import { VisualizationCharts } from '@/components/VisualizationCharts';
import { ScenarioManager } from '@/components/ScenarioManager';
import { ComparisonScenarios } from '@/components/ComparisonScenarios';
import { PDFExport } from '@/components/PDFExport';
import { SessionSaver } from '@/components/SessionSaver';
import { CalculatorInputs, YearlyRate } from '@/lib/types';
import { calculateInsuranceProjection } from '@/lib/calculator';

// Initialize default yearly rates for 30 years
const initializeYearlyRates = (): YearlyRate[] => {
  const rates: YearlyRate[] = [];
  for (let year = 1; year <= 30; year++) {
    rates.push({
      year,
      rateOfReturn: 6.5,
      borrowRate: 5.5,
    });
  }
  return rates;
};

const ANNUAL_PREMIUM_DEFAULT = 2400000;
const FIRST_YEAR_FEE_DEFAULT = ANNUAL_PREMIUM_DEFAULT * 0.8; // 80% of Annual Premium

const DEFAULT_INPUTS: CalculatorInputs = {
  deathBenefit: 50000000,
  outOfPocket: 700000,
  paymentYears: 15,
  premiumYears: 10,
  annualPremium: ANNUAL_PREMIUM_DEFAULT,
  firstYearFee: FIRST_YEAR_FEE_DEFAULT,
  startAge: 45,
  initialExposure: 3044886,
  yearlyRates: initializeYearlyRates(),
};

const PremiumFinanceCalculator = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);
  const [activeTab, setActiveTab] = useState<'calculator' | 'comparison'>('calculator');
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  // Load session from session storage on mount
  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      router.push('/login');
      return;
    }

    const savedInputs = sessionStorage.getItem('calculatorInputs');
    if (savedInputs) {
      try {
        const parsedInputs = JSON.parse(savedInputs);
        setInputs(parsedInputs);
      } catch (err) {
        console.error('Failed to parse saved inputs:', err);
      }
    }
    setIsInitialized(true);
  }, [router]);

  const handleInputChange = <K extends keyof CalculatorInputs>(
    key: K,
    value: CalculatorInputs[K]
  ) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const handleLoadScenario = (loadedInputs: CalculatorInputs) => {
    setInputs(loadedInputs);
  };

  const handleYearlyRatesChange = (rates: YearlyRate[]) => {
    setInputs(prev => ({ ...prev, yearlyRates: rates }));
  };

  const handleTableRateChange = (year: number, field: 'rateOfReturn' | 'borrowRate', value: number) => {
    setInputs(prev => {
      const updatedRates = [...prev.yearlyRates];
      const index = updatedRates.findIndex(r => r.year === year);
      if (index >= 0) {
        updatedRates[index] = { ...updatedRates[index], [field]: value };
      } else {
        updatedRates.push({ year, rateOfReturn: 6.5, borrowRate: 5.5, [field]: value });
      }
      return { ...prev, yearlyRates: updatedRates };
    });
  };

  const calculationData = useMemo(() => {
    return calculateInsuranceProjection(inputs);
  }, [inputs]);

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Premium Finance Illustration Calculator
          </h1>
          <p className="text-gray-600">
            Model your life insurance premium finance strategy with interactive scenarios and detailed projections
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-gray-300">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-4 py-3 font-medium ${
              activeTab === 'calculator'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Calculator
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-4 py-3 font-medium ${
              activeTab === 'comparison'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Compare Scenarios
          </button>
        </div>

        {/* Main Content */}
        {activeTab === 'calculator' ? (
          <>
            {/* Session Saver */}
            {isInitialized && <SessionSaver inputs={inputs} />}

            {/* Input Controls */}
            <InputControls inputs={inputs} onInputChange={handleInputChange} />

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex gap-2 flex-wrap">
              <PDFExport data={calculationData} inputs={inputs} />
            </div>

            {/* Scenario Manager */}
            <ScenarioManager currentInputs={inputs} onLoadScenario={handleLoadScenario} />

            {/* Charts */}
            <VisualizationCharts data={calculationData} />

            {/* Summary Stats */}
            <SummaryStats data={calculationData} />

            {/* Results Table */}
            <div className="mt-6">
              <ResultsTable data={calculationData} onRateChange={handleTableRateChange} />
            </div>
          </>
        ) : (
          <>
            {/* Comparison View */}
            <ComparisonScenarios currentInputs={inputs} />
          </>
        )}
      </div>
    </div>
  );
};

export default PremiumFinanceCalculator;