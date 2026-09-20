import React, { useState } from 'react';
import { 
  Check, 
  ArrowRight, 
  Calculator, 
  Zap, 
  ShieldCheck, 
  HelpCircle,
  Building,
  User,
  RefreshCw,
  Truck,
  Building2
} from 'lucide-react';
import { LoanProduct, LoanType } from '../types';
import { LOAN_PRODUCTS } from '../data/loanProducts';
import { formatCurrency } from '../utils/loanCalculations';

interface LoanProductsProps {
  onSelectProductForCalculator: (type: LoanType) => void;
  onApplyForProduct: (type: LoanType) => void;
}

export const LoanProducts: React.FC<LoanProductsProps> = ({
  onSelectProductForCalculator,
  onApplyForProduct,
}) => {
  const [filter, setFilter] = useState<'all' | 'consumer' | 'commercial'>('all');

  const filteredProducts = LOAN_PRODUCTS.filter((prod) => {
    if (filter === 'consumer') {
      return prod.id === 'personal' || prod.id === 'debt_consolidation';
    }
    if (filter === 'commercial') {
      return prod.id === 'business' || prod.id === 'equipment' || prod.id === 'commercial_real_estate';
    }
    return true;
  });

  const getProductIcon = (id: LoanType) => {
    switch (id) {
      case 'personal':
        return <User className="w-5 h-5 text-emerald-600" />;
      case 'debt_consolidation':
        return <RefreshCw className="w-5 h-5 text-indigo-600" />;
      case 'business':
        return <Building className="w-5 h-5 text-blue-600" />;
      case 'equipment':
        return <Truck className="w-5 h-5 text-amber-600" />;
      case 'commercial_real_estate':
        return <Building2 className="w-5 h-5 text-violet-600" />;
      default:
        return <Building className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <section id="loan-products-section" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Institutional & Consumer Portfolio
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Competitive Loan Products Built for Every Need
            </h2>
            <p className="text-slate-600 text-base">
              Transparent fixed rates, straightforward qualification criteria, and no surprise charges.
            </p>
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start md:self-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Loans ({LOAN_PRODUCTS.length})
            </button>
            <button
              onClick={() => setFilter('consumer')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'consumer' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Personal & Consolidation
            </button>
            <button
              onClick={() => setFilter('commercial')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'commercial' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Business & Equipment
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`rounded-2xl border flex flex-col justify-between transition-all hover:shadow-md ${
                product.popular
                  ? 'border-emerald-300 ring-1 ring-emerald-300/60 bg-white relative'
                  : 'border-slate-200 bg-white'
              }`}
            >
              {product.popular && (
                <div className="absolute -top-3 right-6 bg-emerald-600 text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-sm">
                  Most Popular
                </div>
              )}

              <div className="p-6 sm:p-7 space-y-6">
                {/* Title and icon */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
                      {getProductIcon(product.id)}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{product.title}</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{product.tagline}</p>
                  </div>
                </div>

                {/* Key Numbers Grid */}
                <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[11px] text-slate-500 uppercase font-semibold block">Fixed APR From</span>
                    <span className="text-xl font-extrabold text-emerald-700">{product.baseApr}%</span>
                    <span className="text-[10px] text-slate-400 block">Up to {product.maxApr}%</span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-500 uppercase font-semibold block">Borrow Limit</span>
                    <span className="text-xl font-extrabold text-slate-900">{formatCurrency(product.maxAmount)}</span>
                    <span className="text-[10px] text-slate-400 block">From {formatCurrency(product.minAmount)}</span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-500 uppercase font-semibold block">Terms</span>
                    <span className="text-sm font-bold text-slate-800">
                      {product.minTermMonths} - {product.maxTermMonths} mo
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-500 uppercase font-semibold block">Funding Speed</span>
                    <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-500" />
                      {product.fundingSpeed}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-slate-900 block">Key Advantages</span>
                  <ul className="space-y-2 text-xs text-slate-600">
                    {product.keyFeatures.slice(0, 3).map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Requirements */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                    Eligibility Summary
                  </span>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Minimum credit score: <strong>{product.minCreditScore}+</strong>. {product.requirements[0]}
                  </p>
                </div>
              </div>

              {/* Action Buttons footer */}
              <div className="p-6 pt-0 space-y-2">
                <button
                  id={`apply-btn-${product.id}`}
                  onClick={() => onApplyForProduct(product.id)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Apply For {product.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  id={`calc-btn-${product.id}`}
                  onClick={() => onSelectProductForCalculator(product.id)}
                  className="w-full py-2 px-4 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Calculator className="w-3.5 h-3.5 text-slate-500" />
                  <span>Calculate Monthly Payment</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
