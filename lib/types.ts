export interface CalculatorInputs {
  deathBenefit: number;
  outOfPocket: number;
  paymentYears: number;
  premiumYears: number;
  annualPremium: number;
  firstYearFee: number;
  startAge: number;
  initialExposure: number;
  yearlyRates: YearlyRate[];
}

export interface YearlyRate {
  year: number;
  rateOfReturn: number;
  borrowRate: number;
}

export interface CalculationRow {
  year: number;
  age: number;
  premium: number;
  fee: number;
  rateOfReturn: number;
  borrowRate: number;
  withdrawal: number;
  cashValue: number;
  db: number;
  boyBal: number;
  interestCharge: number;
  oop: number;
  eoyBal: number;
  netDB: number;
  collateral: number;
  totalCost: number;
}

export interface Scenario {
  id: string;
  name: string;
  inputs: CalculatorInputs;
  createdAt: Date;
  updatedAt: Date;
}
