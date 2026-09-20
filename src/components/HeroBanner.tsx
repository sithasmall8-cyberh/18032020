import React from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Percent, 
  Award,
  Sparkles
} from 'lucide-react';
import { LoanType } from '../types';

interface HeroBannerProps {
  onStartApplication: (type?: LoanType, amount?: number) => void;
  onExploreCalculator: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ 
  onStartApplication, 
  onExploreCalculator 
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-10 pb-16 border-b border-slate-800">
      {/* Subtle grid backdrop */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Main copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Direct Institutional Lending &bull; Fixed Rates from 5.99% APR
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Transparent Capital for Personal & Commercial Growth.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Fast, fixed-rate loans with zero prepayment penalties and direct ACH funding in as little as 24 hours. Check your rate in 2 minutes with zero impact to your credit score.
            </p>

            {/* Value checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm text-slate-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero hidden fees & 0% prepayment penalty</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Soft inquiry pre-qualification (no score drop)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Loans from $2,000 to $1,000,000</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Direct deposit into your checking account</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                id="hero-apply-btn"
                onClick={() => onStartApplication()}
                className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
              >
                <span>Check Your Rate & Apply</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-calc-btn"
                onClick={onExploreCalculator}
                className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-base border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Interactive Payment Calculator</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics & Trust Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-850/90 rounded-2xl border border-slate-750 p-6 sm:p-7 shadow-2xl backdrop-blur-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-750">
                <div>
                  <h3 className="text-sm font-semibold text-slate-300">Platform Performance</h3>
                  <p className="text-xs text-slate-400">Audited lending metrics YTD</p>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full text-xs font-semibold border border-emerald-500/20">
                  <Award className="w-3.5 h-3.5" />
                  <span>A+ BBB Rating</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Speed to Funding
                  </div>
                  <div className="text-2xl font-bold text-white">4 - 24 hrs</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Average direct deposit</p>
                </div>

                <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
                    <Percent className="w-3.5 h-3.5 text-emerald-400" />
                    Starting Fixed APR
                  </div>
                  <div className="text-2xl font-bold text-emerald-400">5.99%</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">With AutoPay enrollment</p>
                </div>

                <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium mb-1">
                    Total Volume Funded
                  </div>
                  <div className="text-2xl font-bold text-white">$1.4B+</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Across 48,000+ borrowers</p>
                </div>

                <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium mb-1">
                    Prepayment Penalties
                  </div>
                  <div className="text-2xl font-bold text-white">$0.00</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Pay off early anytime</p>
                </div>
              </div>

              <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1 shrink-0"></div>
                <div>
                  <strong className="text-white block font-medium">Bank-Grade Compliance</strong>
                  <span>All applications protected with 256-bit TLS encryption, SOC2 Type II compliance, and FDIC-insured partner custodial accounts.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
