import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  DollarSign, 
  Clock, 
  TrendingDown, 
  Sparkles, 
  Check, 
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
  Download,
  Info
} from 'lucide-react';
import { LoanType, CreditScoreTier } from '../types';
import { LOAN_PRODUCTS, CREDIT_SCORE_TIERS } from '../data/loanProducts';
import { calculateFullLoan, formatCurrency, formatPercent } from '../utils/loanCalculations';

interface LoanCalculatorProps {
  onApplyWithTerms: (type: LoanType, amount: number, term: number) => void;
  initialType?: LoanType;
  initialAmount?: number;
}

export const LoanCalculator: React.FC<LoanCalculatorProps> = ({ 
  onApplyWithTerms,
  initialType = 'personal',
  initialAmount = 25000
}) => {
  const [selectedProductType, setSelectedProductType] = useState<LoanType>(initialType);
  const [amount, setAmount] = useState<number>(initialAmount);
  const [termMonths, setTermMonths] = useState<number>(36);
  const [creditTier, setCreditTier] = useState<CreditScoreTier>('good');
  const [extraMonthlyPayment, setExtraMonthlyPayment] = useState<number>(0);
  const [scheduleView, setScheduleView] = useState<'annual' | 'monthly'>('annual');
  const [showFullSchedule, setShowFullSchedule] = useState<boolean>(false);

  const currentProduct = useMemo(() => {
    return LOAN_PRODUCTS.find((p) => p.id === selectedProductType) || LOAN_PRODUCTS[0];
  }, [selectedProductType]);

  // Adjust amount when changing product if out of bounds
  const handleProductChange = (type: LoanType) => {
    setSelectedProductType(type);
    const prod = LOAN_PRODUCTS.find((p) => p.id === type) || LOAN_PRODUCTS[0];
    if (amount < prod.minAmount) setAmount(prod.minAmount);
    if (amount > prod.maxAmount) setAmount(prod.maxAmount);
    if (termMonths < prod.minTermMonths) setTermMonths(prod.minTermMonths);
    if (termMonths > prod.maxTermMonths) setTermMonths(prod.maxTermMonths);
  };

  const selectedTierInfo = useMemo(() => {
    return CREDIT_SCORE_TIERS.find((t) => t.id === creditTier) || CREDIT_SCORE_TIERS[1];
  }, [creditTier]);

  const effectiveApr = useMemo(() => {
    const rate = currentProduct.baseApr + selectedTierInfo.baseAprOffset;
    return Math.min(currentProduct.maxApr, Number(rate.toFixed(2)));
  }, [currentProduct, selectedTierInfo]);

  const calculation = useMemo(() => {
    return calculateFullLoan(
      amount,
      effectiveApr,
      termMonths,
      currentProduct.originationFeePercent,
      extraMonthlyPayment
    );
  }, [amount, effectiveApr, termMonths, currentProduct, extraMonthlyPayment]);

  // Quick terms available for current product
  const availableTerms = useMemo(() => {
    const candidateTerms = [12, 24, 36, 48, 60, 72, 84, 120];
    return candidateTerms.filter(
      (t) => t >= currentProduct.minTermMonths && t <= currentProduct.maxTermMonths
    );
  }, [currentProduct]);

  // Export amortization to CSV
  const exportScheduleCSV = () => {
    const headers = ['Month', 'Payment ($)', 'Principal ($)', 'Interest ($)', 'Remaining Balance ($)', 'Total Interest Paid ($)'];
    const rows = calculation.schedule.map((item) => [
      item.month,
      item.payment.toFixed(2),
      item.principal.toFixed(2),
      item.interest.toFixed(2),
      item.remainingBalance.toFixed(2),
      item.totalInterestPaid.toFixed(2),
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `amortization_schedule_${amount}_${termMonths}m.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const principalPercent = (amount / calculation.totalPayment) * 100;
  const interestPercent = (calculation.totalInterest / calculation.totalPayment) * 100;

  return (
    <div id="loan-calculator-section" className="bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <Calculator className="w-3.5 h-3.5 text-emerald-700" />
            Interactive Loan Calculator
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Calculate Payments & Amortization
          </h2>
          <p className="text-slate-600 text-base">
            Adjust your loan parameters to see precise monthly installments, interest breakdown, and how extra monthly payments can save thousands.
          </p>
        </div>

        {/* Product selector tabs */}
        <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-slate-200/80 rounded-xl max-w-4xl mx-auto">
          {LOAN_PRODUCTS.map((prod) => (
            <button
              key={prod.id}
              id={`calc-product-${prod.id}`}
              onClick={() => handleProductChange(prod.id)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                selectedProductType === prod.id
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {prod.title}
            </button>
          ))}
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            {/* Amount control */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="loan-amount-input" className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  Borrowing Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                  <input
                    id="loan-amount-input"
                    type="number"
                    value={amount}
                    min={currentProduct.minAmount}
                    max={currentProduct.maxAmount}
                    step={500}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-36 pl-7 pr-3 py-1.5 text-right font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <input
                id="loan-amount-slider"
                type="range"
                min={currentProduct.minAmount}
                max={currentProduct.maxAmount}
                step={500}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />

              <div className="flex justify-between text-xs text-slate-500 font-medium">
                <span>Min: {formatCurrency(currentProduct.minAmount)}</span>
                <span>Max: {formatCurrency(currentProduct.maxAmount)}</span>
              </div>
            </div>

            {/* Term Length selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  Loan Duration (Months)
                </label>
                <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {termMonths} Months ({Number((termMonths / 12).toFixed(1))} Years)
                </span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {availableTerms.map((t) => (
                  <button
                    key={t}
                    id={`calc-term-${t}`}
                    onClick={() => setTermMonths(t)}
                    className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                      termMonths === t
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {t} mo
                  </button>
                ))}
              </div>
            </div>

            {/* Credit Score Tier */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Estimated Credit Score Tier
                </label>
                <span className="text-xs text-slate-500">Affects base APR tier</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CREDIT_SCORE_TIERS.map((tier) => (
                  <button
                    key={tier.id}
                    id={`calc-tier-${tier.id}`}
                    onClick={() => setCreditTier(tier.id)}
                    className={`p-2.5 text-left rounded-xl border transition-all ${
                      creditTier === tier.id
                        ? 'bg-emerald-50/80 border-emerald-500 ring-1 ring-emerald-500'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{tier.label}</span>
                      {creditTier === tier.id && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <span className="text-[11px] text-slate-500 block">{tier.range}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Extra Monthly Payment Simulator (Accordion / Toggle) */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                    <TrendingDown className="w-4 h-4 text-emerald-600" />
                    Early Payoff Simulator (Extra Principal)
                  </div>
                  <p className="text-xs text-slate-500">See how extra principal accelerates payoff</p>
                </div>
                <div className="flex items-center gap-2">
                  {[0, 50, 100, 200].map((val) => (
                    <button
                      key={val}
                      onClick={() => setExtraMonthlyPayment(val)}
                      className={`px-2 py-1 text-xs rounded font-medium border ${
                        extraMonthlyPayment === val
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {val === 0 ? 'None' : `+$${val}`}
                    </button>
                  ))}
                </div>
              </div>

              {extraMonthlyPayment > 0 && (
                <div className="bg-emerald-50 rounded-xl p-3.5 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-emerald-800">Accelerated Payoff Active</span>
                    <p className="text-emerald-700">
                      Paying extra <strong>${extraMonthlyPayment}/mo</strong> saves{' '}
                      <strong>{formatCurrency(calculation.interestSaved || 0)}</strong> in interest and shaves off{' '}
                      <strong>{calculation.monthsSaved} months</strong>!
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-600 text-white font-bold shrink-0">
                    -{calculation.monthsSaved} mo
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Results Summary Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-xl space-y-6">
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
                  Estimated Monthly Installment
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                    {formatCurrency(calculation.monthlyPayment + extraMonthlyPayment)}
                  </span>
                  <span className="text-slate-400 text-sm font-medium">/ month</span>
                </div>
                {extraMonthlyPayment > 0 && (
                  <p className="text-xs text-emerald-400 mt-1">
                    Includes {formatCurrency(extraMonthlyPayment)} extra principal payment
                  </p>
                )}
              </div>

              {/* Progress split bar: Principal vs Interest */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                    Principal: {formatCurrency(amount)} ({principalPercent.toFixed(0)}%)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
                    Interest: {formatCurrency(calculation.totalInterest)} ({interestPercent.toFixed(0)}%)
                  </span>
                </div>

                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
                  <div 
                    className="bg-emerald-500 h-full transition-all duration-300"
                    style={{ width: `${principalPercent}%` }}
                  ></div>
                  <div 
                    className="bg-amber-400 h-full transition-all duration-300"
                    style={{ width: `${interestPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Line item breakdown */}
              <div className="divide-y divide-slate-800 text-sm">
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Estimated Fixed APR</span>
                  <span className="font-semibold text-white">{formatPercent(calculation.effectiveApr)}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Total Loan Amount</span>
                  <span className="font-semibold text-white">{formatCurrency(amount)}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Total Interest Paid</span>
                  <span className="font-semibold text-amber-400">{formatCurrency(calculation.totalInterest)}</span>
                </div>
                {calculation.originationFee > 0 && (
                  <div className="py-2.5 flex justify-between">
                    <span className="text-slate-400">
                      Origination Fee ({currentProduct.originationFeePercent}%)
                    </span>
                    <span className="font-medium text-slate-300">{formatCurrency(calculation.originationFee)}</span>
                  </div>
                )}
                <div className="py-2.5 flex justify-between font-bold">
                  <span className="text-slate-200">Total Repayment Cost</span>
                  <span className="text-emerald-400 text-base">{formatCurrency(calculation.totalPayment)}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="space-y-2 pt-2">
                <button
                  id="calc-apply-cta"
                  onClick={() => onApplyWithTerms(selectedProductType, amount, termMonths)}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm text-center transition-colors shadow-lg shadow-emerald-500/20 cursor-pointer block"
                >
                  Apply For {formatCurrency(amount)} at {formatPercent(calculation.effectiveApr)}
                </button>

                <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
                  <Info className="w-3.5 h-3.5" />
                  Rates subject to underwriting review. No prepayment fee.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Amortization Schedule Drawer / Table */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                Amortization & Paydown Schedule
              </h3>
              <p className="text-xs text-slate-500">
                Detailed breakdown of principal reduction vs interest paid over {termMonths} months.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="bg-slate-100 p-1 rounded-lg flex text-xs font-semibold">
                <button
                  onClick={() => setScheduleView('annual')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    scheduleView === 'annual' ? 'bg-white shadow text-slate-900' : 'text-slate-600'
                  }`}
                >
                  Annual Summary
                </button>
                <button
                  onClick={() => setScheduleView('monthly')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    scheduleView === 'monthly' ? 'bg-white shadow text-slate-900' : 'text-slate-600'
                  }`}
                >
                  Monthly Ledger
                </button>
              </div>

              {/* CSV Export */}
              <button
                id="export-csv-btn"
                onClick={exportScheduleCSV}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                Export CSV
              </button>

              <button
                onClick={() => setShowFullSchedule(!showFullSchedule)}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                {showFullSchedule ? (
                  <>
                    <span>Collapse</span>
                    <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Expand Schedule</span>
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Schedule Table */}
          {showFullSchedule && (
            <div className="overflow-x-auto pt-2 max-h-96 overflow-y-auto border-t border-slate-100">
              {scheduleView === 'annual' ? (
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider sticky top-0 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Year</th>
                      <th className="py-2.5 px-3">Principal Paid</th>
                      <th className="py-2.5 px-3">Interest Paid</th>
                      <th className="py-2.5 px-3">Year-End Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {calculation.annualSummary.map((item) => (
                      <tr key={item.year} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-bold text-slate-900">Year {item.year}</td>
                        <td className="py-2.5 px-3 font-medium text-emerald-700">{formatCurrency(item.principalPaid)}</td>
                        <td className="py-2.5 px-3 text-slate-600">{formatCurrency(item.interestPaid)}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{formatCurrency(item.endBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider sticky top-0 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Month</th>
                      <th className="py-2.5 px-3">Monthly Payment</th>
                      <th className="py-2.5 px-3">Principal</th>
                      <th className="py-2.5 px-3">Interest</th>
                      <th className="py-2.5 px-3">Remaining Balance</th>
                      <th className="py-2.5 px-3">Total Interest Paid</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {calculation.schedule.map((item) => (
                      <tr key={item.month} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-medium text-slate-900">Month {item.month}</td>
                        <td className="py-2 px-3 font-semibold text-slate-900">{formatCurrency(item.payment)}</td>
                        <td className="py-2 px-3 text-emerald-700 font-medium">{formatCurrency(item.principal)}</td>
                        <td className="py-2 px-3 text-amber-700">{formatCurrency(item.interest)}</td>
                        <td className="py-2 px-3 font-medium text-slate-900">{formatCurrency(item.remainingBalance)}</td>
                        <td className="py-2 px-3 text-slate-500">{formatCurrency(item.totalInterestPaid)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
