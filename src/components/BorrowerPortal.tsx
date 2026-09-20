import React, { useState } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  ArrowUpRight, 
  TrendingDown, 
  Download, 
  ShieldCheck,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Plus
} from 'lucide-react';
import { BorrowerActiveLoan } from '../types';
import { formatCurrency, formatPercent } from '../utils/loanCalculations';

interface BorrowerPortalProps {
  loans: BorrowerActiveLoan[];
  onMakePayment: (loanId: string, amount: number, isPrincipalOnly: boolean) => void;
  onToggleAutoPay: (loanId: string) => void;
  onApplyNewLoan: () => void;
}

export const BorrowerPortal: React.FC<BorrowerPortalProps> = ({
  loans,
  onMakePayment,
  onToggleAutoPay,
  onApplyNewLoan,
}) => {
  const [selectedLoanId, setSelectedLoanId] = useState<string>(loans[0]?.id || '');
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(loans[0]?.monthlyPayment || 692.74);
  const [isPrincipalOnly, setIsPrincipalOnly] = useState<boolean>(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);

  const activeLoan = loans.find((l) => l.id === selectedLoanId) || loans[0];

  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLoan) return;

    onMakePayment(activeLoan.id, paymentAmount, isPrincipalOnly);
    setShowPaymentModal(false);
    setPaymentSuccessMsg(
      `Payment of ${formatCurrency(paymentAmount)} processed successfully! Your balance has been updated.`
    );
    setTimeout(() => setPaymentSuccessMsg(null), 5000);
  };

  if (!activeLoan) {
    return (
      <div className="py-16 px-4 max-w-4xl mx-auto text-center space-y-4">
        <h3 className="text-xl font-bold text-slate-900">No Active Loans On Record</h3>
        <p className="text-sm text-slate-500">Apply for financing to manage your loans and view amortization here.</p>
        <button
          onClick={onApplyNewLoan}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
        >
          Submit Loan Application
        </button>
      </div>
    );
  }

  const principalPaidRatio = (activeLoan.totalPrincipalPaid / activeLoan.originalPrincipal) * 100;

  return (
    <section id="borrower-portal-section" className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
              <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
              Borrower Account Portal
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Loan Account Management
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Account ID: <strong>ACC-39401</strong> &bull; Member in Good Standing
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="portal-new-loan-btn"
              onClick={onApplyNewLoan}
              className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-600" />
              <span>Apply for Additional Loan</span>
            </button>
          </div>
        </div>

        {/* Payment Success Alert */}
        {paymentSuccessMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-medium flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{paymentSuccessMsg}</span>
          </div>
        )}

        {/* Loan Selector Tabs if multiple */}
        {loans.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {loans.map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  setSelectedLoanId(l.id);
                  setPaymentAmount(l.monthlyPayment);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
                  selectedLoanId === l.id
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {l.id} &bull; {formatCurrency(l.currentBalance)}
              </button>
            ))}
          </div>
        )}

        {/* Active Loan Hero Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Loan Note</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Current &bull; On Schedule
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900">{activeLoan.id}</h3>
              <p className="text-xs text-slate-500">
                Originated {activeLoan.originationDate} &bull; Fixed {formatPercent(activeLoan.apr)} APR
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                id="portal-pay-now-btn"
                onClick={() => {
                  setPaymentAmount(activeLoan.monthlyPayment);
                  setIsPrincipalOnly(false);
                  setShowPaymentModal(true);
                }}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-md flex items-center gap-2 cursor-pointer"
              >
                <DollarSign className="w-4 h-4" />
                <span>Make a Payment</span>
              </button>

              <button
                id="portal-autopay-toggle"
                onClick={() => onToggleAutoPay(activeLoan.id)}
                className={`px-4 py-3 rounded-xl border text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
                  activeLoan.autoPayEnabled
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {activeLoan.autoPayEnabled ? (
                  <>
                    <ToggleRight className="w-4 h-4 text-emerald-600" />
                    <span>AutoPay Enabled (-0.25% Discount)</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-4 h-4 text-slate-400" />
                    <span>Enable AutoPay</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium block">Current Principal Balance</span>
              <strong className="text-2xl font-black text-slate-900 block mt-1">
                {formatCurrency(activeLoan.currentBalance)}
              </strong>
              <span className="text-[11px] text-slate-400">Orig: {formatCurrency(activeLoan.originalPrincipal)}</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium block">Next Payment Due</span>
              <strong className="text-2xl font-black text-emerald-700 block mt-1">
                {formatCurrency(activeLoan.monthlyPayment)}
              </strong>
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Due {activeLoan.nextPaymentDate}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium block">Remaining Term</span>
              <strong className="text-2xl font-black text-slate-900 block mt-1">
                {activeLoan.paymentsRemaining}
              </strong>
              <span className="text-[11px] text-slate-400">of {activeLoan.termMonths} total months</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium block">Total Principal Paid</span>
              <strong className="text-2xl font-black text-slate-900 block mt-1">
                {formatCurrency(activeLoan.totalPrincipalPaid)}
              </strong>
              <span className="text-[11px] text-emerald-600 font-medium">
                {principalPaidRatio.toFixed(1)}% paid off
              </span>
            </div>
          </div>

          {/* Principal Payoff Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Paid Down: {formatCurrency(activeLoan.totalPrincipalPaid)}</span>
              <span>Remaining: {formatCurrency(activeLoan.currentBalance)}</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${principalPaidRatio}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Payment History Ledger */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-bold text-slate-900">Payment History & Transactions</h4>
              <p className="text-xs text-slate-500">Record of electronic installments and principal contributions.</p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {activeLoan.paymentHistory.length} Recorded Transactions
            </span>
          </div>

          <div className="overflow-x-auto border-t border-slate-100 pt-2">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Transaction ID</th>
                  <th className="py-2.5 px-3">Total Amount</th>
                  <th className="py-2.5 px-3">Principal</th>
                  <th className="py-2.5 px-3">Interest</th>
                  <th className="py-2.5 px-3">Payment Method</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeLoan.paymentHistory.map((pmt) => (
                  <tr key={pmt.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{pmt.date}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">{pmt.id}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{formatCurrency(pmt.amount)}</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-medium">{formatCurrency(pmt.principalPortion)}</td>
                    <td className="py-2.5 px-3 text-slate-500">{formatCurrency(pmt.interestPortion)}</td>
                    <td className="py-2.5 px-3 text-slate-600">{pmt.method}</td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Completed
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => alert(`Receipt downloaded for transaction ${pmt.id} (${formatCurrency(pmt.amount)})`)}
                        className="text-slate-400 hover:text-slate-700 p-1"
                        title="Download Receipt"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Make a Payment */}
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl border border-slate-200 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Make an Electronic Payment</h3>
                  <p className="text-xs text-slate-500">Loan #{activeLoan.id}</p>
                </div>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-slate-400 hover:text-slate-700 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleExecutePayment} className="space-y-4">
                {/* Preset choices */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentAmount(activeLoan.monthlyPayment);
                      setIsPrincipalOnly(false);
                    }}
                    className={`p-3 rounded-xl text-left border text-xs font-semibold ${
                      !isPrincipalOnly && paymentAmount === activeLoan.monthlyPayment
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="block text-[10px] text-slate-400">Regular Installment</span>
                    <strong className="text-sm">{formatCurrency(activeLoan.monthlyPayment)}</strong>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentAmount(500);
                      setIsPrincipalOnly(true);
                    }}
                    className={`p-3 rounded-xl text-left border text-xs font-semibold ${
                      isPrincipalOnly
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="block text-[10px] text-slate-400">Extra Principal Only</span>
                    <strong className="text-sm">Paydown Capital</strong>
                  </button>
                </div>

                {/* Amount input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900 uppercase">Payment Amount ($)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                    <input
                      type="number"
                      min={10}
                      max={activeLoan.currentBalance}
                      step={10}
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(Number(e.target.value))}
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-base font-bold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Funding account selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900 uppercase">Funding Account</label>
                  <select className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 bg-slate-50">
                    <option>Chase Total Checking (Ending in ..4019)</option>
                    <option>Wells Fargo Preferred Checking (Ending in ..8120)</option>
                  </select>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Balance Before:</span>
                    <strong className="text-slate-800">{formatCurrency(activeLoan.currentBalance)}</strong>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Estimated Balance After:</span>
                    <strong>{formatCurrency(Math.max(0, activeLoan.currentBalance - paymentAmount))}</strong>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-md cursor-pointer"
                >
                  Confirm & Process Payment of {formatCurrency(paymentAmount)}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
