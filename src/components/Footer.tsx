import React from 'react';
import { Building2, ShieldCheck, Lock, Award, Heart } from 'lucide-react';
import { LoanType } from '../types';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onSelectProduct: (type: LoanType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSelectProduct }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-white text-base">Financial Lending</span>
                <span className="text-[11px] text-slate-400 block">Direct Institutional & Consumer Credit</span>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Empowering consumers and enterprises with transparent, fixed-rate capital, zero prepayment fees, and modern digital loan management.
            </p>
            <div className="flex items-center gap-3 text-slate-300 text-[11px]">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                NMLS ID #194820
              </span>
              <span>&bull;</span>
              <span>Equal Housing Opportunity Lender</span>
            </div>
          </div>

          {/* Column: Lending Products */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-white tracking-wider">Loan Products</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    onSelectProduct('personal');
                    onNavigate('products');
                  }}
                  className="hover:text-white transition-colors text-left"
                >
                  Personal Loans (From 5.99%)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectProduct('debt_consolidation');
                    onNavigate('products');
                  }}
                  className="hover:text-white transition-colors text-left"
                >
                  Debt Consolidation Loans
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectProduct('business');
                    onNavigate('products');
                  }}
                  className="hover:text-white transition-colors text-left"
                >
                  Small Business Term Loans
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectProduct('equipment');
                    onNavigate('products');
                  }}
                  className="hover:text-white transition-colors text-left"
                >
                  Equipment & Fleet Financing
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectProduct('commercial_real_estate');
                    onNavigate('products');
                  }}
                  className="hover:text-white transition-colors text-left"
                >
                  Commercial Real Estate Bridge
                </button>
              </li>
            </ul>
          </div>

          {/* Column: Platform Utilities */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-white tracking-wider">Borrower Tools</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('calculator')} className="hover:text-white transition-colors">
                  Interactive Loan Calculator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('prequal')} className="hover:text-white transition-colors">
                  Check Soft-Pull Pre-Approval
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('apply')} className="hover:text-white transition-colors">
                  Digital Loan Application
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('portal')} className="hover:text-white transition-colors">
                  Borrower Account Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('underwriter')} className="hover:text-white transition-colors">
                  Underwriter Review Backoffice
                </button>
              </li>
            </ul>
          </div>

          {/* Column: Compliance & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-white tracking-wider">Compliance & Trust</h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-emerald-400" />
                256-Bit SSL Encrypted
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                SOC-2 Type II Certified
              </li>
              <li className="flex items-center gap-1.5">
                <Award className="w-3 h-3 text-emerald-400" />
                TILA Transparent APRs
              </li>
              <li>FDIC Partner Depository Insured</li>
            </ul>
          </div>
        </div>

        {/* Regulatory Disclosures & Truth in Lending Disclaimer */}
        <div className="pt-8 border-t border-slate-900 text-[11px] text-slate-400 space-y-3 leading-relaxed">
          <p>
            <strong>Representative Loan Example:</strong> A $25,000 personal loan with a 36-month term at an Annual Percentage Rate (APR) of 7.49% requires a monthly payment of $777.58. Total repayment amount would be $27,992.88, comprising $25,000.00 principal and $2,992.88 total finance charge (interest). Fixed APRs range from 5.99% to 24.50% depending on creditworthiness, loan amount, term length, and loan purpose. All rates include an optional 0.25% AutoPay deduction.
          </p>
          <p>
            <strong>Disclosures:</strong> Pre-qualification inquiries do not affect your credit score and constitute a soft inquiry. Final loan offers, terms, and approval are subject to identity verification, underwriting criteria, debt-to-income (DTI) checks, and verification of income and employment. Funds are typically disbursed within 1 to 2 business days following receipt and electronic execution of final loan agreements.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-900 text-slate-400 text-xs">
            <span>&copy; {new Date().getFullYear()} Financial Lending Direct. All rights reserved.</span>
            <div className="flex items-center space-x-4">
              <span>Privacy Notice</span>
              <span>&bull;</span>
              <span>Terms of Borrowing</span>
              <span>&bull;</span>
              <span>State Licensing</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
