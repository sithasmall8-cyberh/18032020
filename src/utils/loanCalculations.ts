import { 
  AmortizationScheduleItem, 
  AnnualAmortizationSummary, 
  LoanCalculationResult,
  PreQualFormData,
  PreQualResult,
  PreQualOffer,
  LoanType
} from '../types';
import { LOAN_PRODUCTS, CREDIT_SCORE_TIERS } from '../data/loanProducts';

/**
 * Standard PMT Formula:
 * P = r * PV / (1 - (1 + r)^(-n))
 * where r = monthly interest rate, PV = present value (principal), n = total months
 */
export function calculateMonthlyPayment(principal: number, annualRatePercent: number, termMonths: number): number {
  if (principal <= 0 || termMonths <= 0) return 0;
  if (annualRatePercent === 0) return principal / termMonths;

  const monthlyRate = annualRatePercent / 100 / 12;
  const payment = (monthlyRate * principal) / (1 - Math.pow(1 + monthlyRate, -termMonths));
  return Number.isFinite(payment) ? payment : 0;
}

/**
 * Computes full month-by-month and annual amortization schedule,
 * plus effects of an optional extra monthly principal payment.
 */
export function calculateFullLoan(
  principal: number,
  annualRatePercent: number,
  termMonths: number,
  originationFeePercent: number = 0,
  extraMonthlyPayment: number = 0
): LoanCalculationResult {
  const baseMonthlyPayment = calculateMonthlyPayment(principal, annualRatePercent, termMonths);
  const originationFee = (principal * originationFeePercent) / 100;
  const netDisbursement = principal - originationFee;

  const schedule: AmortizationScheduleItem[] = [];
  const annualSummary: AnnualAmortizationSummary[] = [];

  const monthlyRate = annualRatePercent / 100 / 12;
  let remainingBalance = principal;
  let totalInterestPaid = 0;
  let currentYearPrincipal = 0;
  let currentYearInterest = 0;

  // Regular schedule (with optional extra payment simulation)
  let month = 1;
  const effectiveMonthlyPayment = baseMonthlyPayment + extraMonthlyPayment;

  while (remainingBalance > 0.01 && month <= termMonths * 2) {
    const interestForMonth = remainingBalance * monthlyRate;
    let principalForMonth = effectiveMonthlyPayment - interestForMonth;

    if (principalForMonth > remainingBalance) {
      principalForMonth = remainingBalance;
    }

    const actualPaymentThisMonth = principalForMonth + interestForMonth;
    remainingBalance = Math.max(0, remainingBalance - principalForMonth);
    totalInterestPaid += interestForMonth;

    schedule.push({
      month,
      payment: Number(actualPaymentThisMonth.toFixed(2)),
      principal: Number(principalForMonth.toFixed(2)),
      interest: Number(interestForMonth.toFixed(2)),
      remainingBalance: Number(remainingBalance.toFixed(2)),
      totalInterestPaid: Number(totalInterestPaid.toFixed(2)),
    });

    currentYearPrincipal += principalForMonth;
    currentYearInterest += interestForMonth;

    if (month % 12 === 0 || remainingBalance <= 0.01) {
      annualSummary.push({
        year: Math.ceil(month / 12),
        principalPaid: Number(currentYearPrincipal.toFixed(2)),
        interestPaid: Number(currentYearInterest.toFixed(2)),
        endBalance: Number(remainingBalance.toFixed(2)),
      });
      currentYearPrincipal = 0;
      currentYearInterest = 0;
    }

    if (remainingBalance <= 0.01) break;
    month++;
  }

  // Base case without extra payment to calculate savings
  let baselineTotalInterest = 0;
  if (extraMonthlyPayment > 0) {
    let baseBalance = principal;
    for (let m = 1; m <= termMonths; m++) {
      const i = baseBalance * monthlyRate;
      const p = Math.min(baseBalance, baseMonthlyPayment - i);
      baseBalance = Math.max(0, baseBalance - p);
      baselineTotalInterest += i;
      if (baseBalance <= 0.01) break;
    }
  }

  const interestSaved = extraMonthlyPayment > 0 ? Math.max(0, baselineTotalInterest - totalInterestPaid) : 0;
  const monthsSaved = extraMonthlyPayment > 0 ? Math.max(0, termMonths - schedule.length) : 0;

  const totalPayment = principal + totalInterestPaid;

  return {
    monthlyPayment: Number(baseMonthlyPayment.toFixed(2)),
    totalPayment: Number(totalPayment.toFixed(2)),
    totalInterest: Number(totalInterestPaid.toFixed(2)),
    originationFee: Number(originationFee.toFixed(2)),
    netDisbursement: Number(netDisbursement.toFixed(2)),
    effectiveApr: Number(annualRatePercent.toFixed(2)),
    monthlySavingsWithExtraPayment: extraMonthlyPayment,
    interestSaved: Number(interestSaved.toFixed(2)),
    monthsSaved,
    schedule,
    annualSummary,
  };
}

/**
 * Pre-qualification scoring engine
 */
export function evaluatePreQualification(data: PreQualFormData): PreQualResult {
  const monthlyGrossIncome = data.annualIncome / 12;
  const currentTotalMonthlyDebt = data.monthlyHousingPayment + data.monthlyDebtObligations;
  
  // Baseline DTI
  const dtiRatio = monthlyGrossIncome > 0 
    ? Number(((currentTotalMonthlyDebt / monthlyGrossIncome) * 100).toFixed(1))
    : 100;

  const creditInfo = CREDIT_SCORE_TIERS.find((t) => t.id === data.creditBand) || CREDIT_SCORE_TIERS[1];
  
  // Max loan amount based on income safety (max back-end DTI of 45%)
  const maxAllowablePayment = Math.max(0, (monthlyGrossIncome * 0.45) - currentTotalMonthlyDebt);
  const estimatedMaxPrincipal = Math.min(
    100000, 
    Math.max(5000, Math.round((maxAllowablePayment * 40) / 1000) * 1000)
  );

  const product = LOAN_PRODUCTS.find((p) => p.id === data.loanPurpose) || LOAN_PRODUCTS[0];
  const baseRate = product.baseApr + creditInfo.baseAprOffset;

  // Generate 3 competitive pre-approved offers
  const offers: PreQualOffer[] = [
    {
      id: 'offer-recommended',
      productType: product.id,
      productName: `${product.title} - Standard Term`,
      approvedAmount: data.requestedAmount,
      termMonths: data.desiredTermMonths,
      fixedApr: Number(baseRate.toFixed(2)),
      monthlyPayment: Number(calculateMonthlyPayment(data.requestedAmount, baseRate, data.desiredTermMonths).toFixed(2)),
      totalInterest: Number(((calculateMonthlyPayment(data.requestedAmount, baseRate, data.desiredTermMonths) * data.desiredTermMonths) - data.requestedAmount).toFixed(2)),
      originationFee: Number(((data.requestedAmount * product.originationFeePercent) / 100).toFixed(2)),
      estimatedFunding: product.fundingSpeed,
      badge: 'Best Value',
      monthlyDtiImpact: Number(((calculateMonthlyPayment(data.requestedAmount, baseRate, data.desiredTermMonths) / monthlyGrossIncome) * 100).toFixed(1)),
    },
    {
      id: 'offer-lower-payment',
      productType: product.id,
      productName: `${product.title} - Extended Term`,
      approvedAmount: data.requestedAmount,
      termMonths: Math.min(product.maxTermMonths, data.desiredTermMonths + 24),
      fixedApr: Number((baseRate + 0.75).toFixed(2)),
      monthlyPayment: Number(calculateMonthlyPayment(data.requestedAmount, baseRate + 0.75, Math.min(product.maxTermMonths, data.desiredTermMonths + 24)).toFixed(2)),
      totalInterest: Number(((calculateMonthlyPayment(data.requestedAmount, baseRate + 0.75, Math.min(product.maxTermMonths, data.desiredTermMonths + 24)) * Math.min(product.maxTermMonths, data.desiredTermMonths + 24)) - data.requestedAmount).toFixed(2)),
      originationFee: Number(((data.requestedAmount * product.originationFeePercent) / 100).toFixed(2)),
      estimatedFunding: product.fundingSpeed,
      badge: 'Lowest Monthly Payment',
      monthlyDtiImpact: Number(((calculateMonthlyPayment(data.requestedAmount, baseRate + 0.75, Math.min(product.maxTermMonths, data.desiredTermMonths + 24)) / monthlyGrossIncome) * 100).toFixed(1)),
    },
    {
      id: 'offer-fast-payoff',
      productType: product.id,
      productName: `${product.title} - Accelerated Payoff`,
      approvedAmount: data.requestedAmount,
      termMonths: Math.max(product.minTermMonths, data.desiredTermMonths - 12),
      fixedApr: Number(Math.max(product.baseApr, baseRate - 0.5).toFixed(2)),
      monthlyPayment: Number(calculateMonthlyPayment(data.requestedAmount, Math.max(product.baseApr, baseRate - 0.5), Math.max(product.minTermMonths, data.desiredTermMonths - 12)).toFixed(2)),
      totalInterest: Number(((calculateMonthlyPayment(data.requestedAmount, Math.max(product.baseApr, baseRate - 0.5), Math.max(product.minTermMonths, data.desiredTermMonths - 12)) * Math.max(product.minTermMonths, data.desiredTermMonths - 12)) - data.requestedAmount).toFixed(2)),
      originationFee: 0,
      estimatedFunding: product.fundingSpeed,
      badge: 'Lowest Total Interest',
      monthlyDtiImpact: Number(((calculateMonthlyPayment(data.requestedAmount, Math.max(product.baseApr, baseRate - 0.5), Math.max(product.minTermMonths, data.desiredTermMonths - 12)) / monthlyGrossIncome) * 100).toFixed(1)),
    },
  ];

  let eligibilityStatus: PreQualResult['eligibilityStatus'] = 'Pre-Approved';
  if (dtiRatio > 45 || data.creditBand === 'building') {
    eligibilityStatus = 'Conditionally Approved';
  }
  if (dtiRatio > 52) {
    eligibilityStatus = 'Requires Verification';
  }

  return {
    dtiRatio,
    eligibilityStatus,
    offers,
    maxEligibleAmount: estimatedMaxPrincipal,
    recommendedOfferId: 'offer-recommended',
    checkedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function formatPercent(rate: number): string {
  return `${rate.toFixed(2)}%`;
}
