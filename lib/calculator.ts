import { CalculatorInputs, CalculationRow } from './types';

export function calculateInsuranceProjection(
  inputs: CalculatorInputs,
  years: number = 30
): CalculationRow[] {
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

  const data: CalculationRow[] = [];
  let prevCashValue = 0;
  let prevEOYBal = 0;
  let totalCostAccum = firstYearFee;

  for (let year = 1; year <= years; year++) {
    const age = startAge + year - 1;

    // Get year-specific rates
    const yearRate = yearlyRates.find(r => r.year === year);
    const rateOfReturn = yearRate?.rateOfReturn || 6.5;
    const borrowRate = yearRate?.borrowRate || 5.5;

    // Premium calculation
    const premium = year <= premiumYears ? annualPremium : 0;

    // Fee (only first year)
    const fee = year === 1 ? firstYearFee : 0;

    // BOY Balance
    const boyBal = year === 1 ? premium + fee : prevEOYBal + (year <= premiumYears ? premium : 0);

    // Interest charge
    const interestCharge = boyBal * (borrowRate / 100);

    // Out of Pocket
    const oop = year <= paymentYears ? outOfPocket : 0;

    // Capitalized interest
    const capitalizedInterest = Math.max(0, interestCharge - oop);

    // EOY Balance
    const eoyBal = boyBal + capitalizedInterest;

    // Cash Value calculation
    let cashValue;
    if (year <= premiumYears) {
      // Building phase - accumulate premiums with growth
      cashValue = prevCashValue * (1 + rateOfReturn / 100) + premium;
    } else {
      // Growth phase after premiums stop
      cashValue = prevCashValue * (1 + rateOfReturn / 100);
    }

    // Subtract First Year Fee from Year 1 Cash Value
    if (year === 1) {
      cashValue = cashValue - fee;
    }

    // Withdrawal (payback to lender)
    let withdrawal = 0;
    if (year === paymentYears && cashValue >= eoyBal) {
      withdrawal = eoyBal;
    }

    // Adjust cash value for withdrawal
    cashValue = cashValue - withdrawal;

    // Death Benefit calculation - use current year's rate for exposure growth
    const exposureGrowth = initialExposure * Math.pow(1 + rateOfReturn / 100, year - 1);
    const db = deathBenefit + exposureGrowth;

    // Net Death Benefit = Death Benefit - EOY Balance + Cash Value
    // This represents the net benefit after accounting for debt and adding cash value
    const netDB = db - (withdrawal > 0 ? 0 : eoyBal) + cashValue;

    // Collateral = EOY Balance - Cash Value (minimum $0)
    const collateral = Math.max(0, eoyBal - cashValue);

    // Total Cost
    totalCostAccum += oop + fee;

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
}

export function getSummaryStats(data: CalculationRow[]) {
  if (data.length === 0) {
    return {
      finalCashValue: 0,
      totalOutOfPocket: 0,
      finalNetDB: 0,
      averageAnnualCost: 0,
    };
  }

  const lastRow = data[data.length - 1];
  const totalOOP = lastRow.totalCost;

  return {
    finalCashValue: lastRow.cashValue,
    totalOutOfPocket: totalOOP,
    finalNetDB: lastRow.netDB,
    averageAnnualCost: totalOOP / data.length,
  };
}
