'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { InputControls } from '@/components/InputControls';
import { ResultsTable } from '@/components/ResultsTable';
import { SummaryStats } from '@/components/SummaryStats';
import { VisualizationCharts } from '@/components/VisualizationCharts';
import { ScenarioManager } from '@/components/ScenarioManager';
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
  const [isInitialized, setIsInitialized] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [customOopValues, setCustomOopValues] = useState<Record<number, number>>({});
  const router = useRouter();

  // Load session from session storage on mount
  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    const email = sessionStorage.getItem('userEmail');
    if (!userId) {
      router.push('/login');
      return;
    }

    if (email) {
      setUserEmail(email);
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
    setInputs(prev => {
      const updated = { ...prev, [key]: value };
      // Automatically set firstYearFee to 80% of annualPremium
      if (key === 'annualPremium') {
        updated.firstYearFee = (value as number) * 0.8;
      }
      return updated;
    });
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

  const handleOopChange = (year: number, value: number) => {
    setCustomOopValues(prev => {
      const updated = { ...prev };
      if (value === inputs.outOfPocket) {
        // If value matches default, remove from custom values
        delete updated[year];
      } else {
        // Otherwise store custom value
        updated[year] = value;
      }
      return updated;
    });
  };

  const hasCustomOop = Object.keys(customOopValues).length > 0;

  const calculationData = useMemo(() => {
    // If no custom O of P values, just use base calculation
    if (Object.keys(customOopValues).length === 0) {
      return calculateInsuranceProjection(inputs);
    }

    // Calculate with custom O of P values - need to recalculate to cascade changes
    const {
      deathBenefit,
      outOfPocket,
      paymentYears,
      premiumYears,
      annualPremium,
      firstYearFee,
      startAge,
      initialExposure,
      yearlyRates,
    } = inputs;

    const data: any[] = [];
    let prevCashValue = 0;
    let prevEOYBal = 0;
    let totalCostAccum = 0;

    for (let year = 1; year <= 30; year++) {
      const age = startAge + year - 1;

      const yearRate = yearlyRates.find(r => r.year === year);
      const rateOfReturn = yearRate?.rateOfReturn || 6.5;
      const borrowRate = yearRate?.borrowRate || 5.5;

      const premium = year <= premiumYears ? annualPremium : 0;
      const fee = year === 1 ? firstYearFee : 0;

      // Use custom O of P if set, otherwise use default
      const oop = customOopValues[year] !== undefined
        ? customOopValues[year]
        : (year <= paymentYears ? outOfPocket : 0);

      // BOY Balance with custom O of P
      const boyBal = year === 1
        ? premium - oop
        : prevEOYBal + (year <= premiumYears ? premium : 0) - oop;

      const interestCharge = boyBal * (borrowRate / 100);
      const eoyBal = boyBal + interestCharge;

      let cashValue;
      if (year <= premiumYears) {
        cashValue = prevCashValue * (1 + rateOfReturn / 100) + premium;
      } else {
        cashValue = prevCashValue * (1 + rateOfReturn / 100);
      }

      if (year === 1) {
        cashValue = cashValue - fee;
      }

      let withdrawal = 0;
      if (year === paymentYears && cashValue >= eoyBal) {
        withdrawal = eoyBal;
      }

      cashValue = cashValue - withdrawal;

      const exposureGrowth = initialExposure * Math.pow(1 + rateOfReturn / 100, year - 1);
      const db = deathBenefit + exposureGrowth;
      const netDB = db - (withdrawal > 0 ? 0 : eoyBal) + cashValue;
      const collateral = withdrawal > 0 ? 0 : Math.max(0, eoyBal - cashValue);

      totalCostAccum += oop;

      data.push({
        year,
        age,
        premium,
        fee,
        rateOfReturn,
        borrowRate,
        withdrawal,
        cashValue,
        db,
        boyBal,
        interestCharge,
        oop,
        eoyBal: withdrawal > 0 ? 0 : eoyBal,
        netDB,
        collateral,
        totalCost: totalCostAccum,
      });

      prevCashValue = cashValue;
      prevEOYBal = withdrawal > 0 ? 0 : eoyBal;
    }

    return data;
  }, [inputs, customOopValues]);

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Premium Finance Illustration Calculator
          </h1>
          <p className="text-gray-600 mb-4">
            Welcome <span className="font-semibold">{userEmail}</span> to your session of <span className="font-bold">Premium Finance Illustration Calculator</span>
          </p>
          <p className="text-gray-600">
            Model your life insurance premium finance strategy with interactive scenarios and detailed projections
          </p>
        </div>


        {/* Main Content */}
        {/* Scenario Manager */}
        <ScenarioManager currentInputs={inputs} onLoadScenario={handleLoadScenario} />

        {/* Session Saver */}
        {isInitialized && <SessionSaver inputs={inputs} />}

        {/* Input Controls */}
        <InputControls inputs={inputs} onInputChange={handleInputChange} hasCustomOop={hasCustomOop} />

        {/* Charts */}
        <VisualizationCharts data={calculationData} />

        {/* Summary Stats */}
        <SummaryStats data={calculationData} />

        {/* Results Table */}
        <div className="mt-6">
          <ResultsTable data={calculationData} onRateChange={handleTableRateChange} onOopChange={handleOopChange} />
        </div>
      </div>
    </div>
  );
};

export default PremiumFinanceCalculator;