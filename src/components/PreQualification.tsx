import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  DollarSign, 
  AlertCircle,
  RefreshCw,
  Lock
} from 'lucide-react';
import { LoanType, CreditScoreTier, PreQualFormData, PreQualResult, PreQualOffer } from '../types';
import { LOAN_PRODUCTS, CREDIT_SCORE_TIERS } from '../data/loanProducts';
import { evaluatePreQualification, formatCurrency, formatPercent } from '../utils/loanCalculations';

interface PreQualificationProps {
  onSelectOfferToApply: (offer: PreQualOffer, prefillData: Partial<PreQualFormData>) => void;
}

export const PreQualification: React.FC<PreQualificationProps> = ({ onSelectOfferToApply }) => {
  const [formData, setFormData] = useState<PreQualFormData>({
    loanPurpose: 'personal',
    requestedAmount: 20000,
    desiredTermMonths: 36,
    creditBand: 'good',
    annualIncome: 85000,
    monthlyHousingPayment: 1500,
    employmentStatus: 'employed',
    monthlyDebtObligations: 450,
    fullName: 'Jordan Mitchell',
    email: 'jordan.mitchell@example.com',
  });

  const [result, setResult] = useState<PreQualResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  const handleRunPreQual = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEvaluating(true);

    // Simulate instant soft credit scoring engine
    setTimeout(() => {
      const evaluation = evaluatePreQualification(formData);
      setResult(evaluation);
      setIsEvaluating(false);
    }, 600);
  };

  return (
    <section id="pre-qualification-section" className="py-14 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <Lock className="w-3.5 h-3.5 text-emerald-700" />
            Soft Credit Check &bull; Zero Credit Score Impact
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Check Your Pre-Approved Rate in 60 Seconds
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            See personalized loan offers with transparent APRs before submitting an application. Checking will not affect your credit score.
          </p>
        </div>

        {/* Evaluation Form */}
        {!result ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <form onSubmit={handleRunPreQual} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Loan Purpose */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-900 uppercase">Primary Loan Purpose</label>
                  <select
                    id="prequal-purpose"
                    value={formData.loanPurpose}
                    onChange={(e) => setFormData({ ...formData, loanPurpose: e.target.value as LoanType })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {LOAN_PRODUCTS.map((prod) => (
                      <option key={prod.id} value={prod.id}>
                        {prod.title} (From {prod.baseApr}%)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Requested Amount */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-900 uppercase">Desired Borrowing Amount ($)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                    <input
                      id="prequal-amount"
                      type="number"
                      min={1000}
                      max={500000}
                      step={500}
                      value={formData.requestedAmount}
                      onChange={(e) => setFormData({ ...formData, requestedAmount: Number(e.target.value) })}
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Annual Gross Income */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-900 uppercase">Estimated Annual Gross Income ($)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                    <input
                      id="prequal-income"
                      type="number"
                      min={10000}
                      step={1000}
                      value={formData.annualIncome}
                      onChange={(e) => setFormData({ ...formData, annualIncome: Number(e.target.value) })}
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      required
                    />
                  </div>
                  <span className="text-[11px] text-slate-400">Before taxes, bonuses & secondary income</span>
                </div>

                {/* Monthly Housing Payment */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-900 uppercase">Monthly Rent / Mortgage ($)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                    <input
                      id="prequal-housing"
                      type="number"
                      min={0}
                      step={50}
                      value={formData.monthlyHousingPayment}
                      onChange={(e) => setFormData({ ...formData, monthlyHousingPayment: Number(e.target.value) })}
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Monthly Debt Obligations */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-900 uppercase">Other Monthly Debt Payments ($)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                    <input
                      id="prequal-debt"
                      type="number"
                      min={0}
                      step={25}
                      value={formData.monthlyDebtObligations}
                      onChange={(e) => setFormData({ ...formData, monthlyDebtObligations: Number(e.target.value) })}
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400">Auto loans, credit card minimums, student debt</span>
                </div>

                {/* Credit Score Band */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-900 uppercase">Estimated Credit Score Tier</label>
                  <select
                    id="prequal-credit"
                    value={formData.creditBand}
                    onChange={(e) => setFormData({ ...formData, creditBand: e.target.value as CreditScoreTier })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {CREDIT_SCORE_TIERS.map((tier) => (
                      <option key={tier.id} value={tier.id}>
                        {tier.label} ({tier.range}) &bull; {tier.approvalOdds} Odds
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Security & Disclaimer */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800">Soft Credit Inquiry Disclosure:</strong> By submitting this inquiry, you authorize an initial soft credit pull. This inquiry allows us to determine pre-qualification rates and will not appear on your credit report to prospective lenders.
                </div>
              </div>

              {/* Submit */}
              <button
                id="prequal-submit-btn"
                type="submit"
                disabled={isEvaluating}
                className="w-full py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isEvaluating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Analyzing Credit Profile & Generating Custom Offers...</span>
                  </>
                ) : (
                  <>
                    <span>View Instant Pre-Approved Offers</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Results View */
          <div className="space-y-6">
            {/* Status Banner */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">
                      Congratulations! You're {result.eligibilityStatus}
                    </h3>
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Evaluated on {result.checkedAt} &bull; Debt-to-Income (DTI):{' '}
                    <strong className="text-slate-800">{result.dtiRatio}%</strong> (Healthy) &bull; Maximum Eligible Line:{' '}
                    <strong className="text-emerald-700">{formatCurrency(result.maxEligibleAmount)}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setResult(null)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Adjust Parameters</span>
              </button>
            </div>

            {/* Offers Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {result.offers.map((offer) => (
                <div
                  key={offer.id}
                  className={`rounded-2xl border bg-white p-6 flex flex-col justify-between transition-all ${
                    offer.badge === 'Best Value'
                      ? 'border-emerald-400 ring-2 ring-emerald-500/20 shadow-md relative'
                      : 'border-slate-200 shadow-sm'
                  }`}
                >
                  {offer.badge && (
                    <div className="inline-block self-start mb-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {offer.badge}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{offer.productName}</h4>
                      <p className="text-xs text-slate-500">{offer.termMonths} Months ({Number((offer.termMonths / 12).toFixed(1))} Years)</p>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                      <span className="text-[11px] text-slate-500 font-semibold block uppercase">Monthly Payment</span>
                      <div className="text-3xl font-extrabold text-slate-900">
                        {formatCurrency(offer.monthlyPayment)}
                        <span className="text-xs font-normal text-slate-500">/mo</span>
                      </div>
                      <span className="text-[11px] text-slate-500 block">
                        DTI Impact: +{offer.monthlyDtiImpact}% of monthly income
                      </span>
                    </div>

                    <div className="space-y-2 text-xs divide-y divide-slate-100">
                      <div className="pt-2 flex justify-between">
                        <span className="text-slate-500">Fixed APR</span>
                        <span className="font-bold text-emerald-700">{formatPercent(offer.fixedApr)}</span>
                      </div>
                      <div className="pt-2 flex justify-between">
                        <span className="text-slate-500">Total Interest</span>
                        <span className="font-medium text-slate-700">{formatCurrency(offer.totalInterest)}</span>
                      </div>
                      <div className="pt-2 flex justify-between">
                        <span className="text-slate-500">Origination Fee</span>
                        <span className="font-medium text-slate-700">
                          {offer.originationFee > 0 ? formatCurrency(offer.originationFee) : '$0 (Waived)'}
                        </span>
                      </div>
                      <div className="pt-2 flex justify-between">
                        <span className="text-slate-500">Disbursement</span>
                        <span className="font-medium text-slate-700">{offer.estimatedFunding}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      id={`accept-offer-${offer.id}`}
                      onClick={() => onSelectOfferToApply(offer, formData)}
                      className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                        offer.badge === 'Best Value'
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      <span>Accept & Continue Application</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
