export interface CalculatorInputs {
  deathBenefit: number;
  rateOfReturn: number;
  borrowRate: number;
  outOfPocket: number;
  paymentYears: number;
  premiumYears: number;
  annualPremium: number;
  firstYearFee: number;
  startAge: number;
  initialExposure: number;
}

export interface CalculationRow {
  year: number;
  age: number;
  premium: number;
  fee: number;
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
