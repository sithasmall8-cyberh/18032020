import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Building2, 
  Award, 
  ChevronDown, 
  ChevronUp, 
  Info,
  CheckCircle2
} from 'lucide-react';

export const TrustAndFaq: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Will checking my loan rate impact my credit score?',
      a: 'No. When you pre-qualify or check available rates on our platform, we perform a soft credit inquiry. A soft inquiry allows us to determine pre-approved rates and eligible amounts without affecting your FICO credit score in any way. A hard credit inquiry is only generated when you formally accept an offer and authorize final document signing.',
    },
    {
      q: 'Are there any prepayment penalties if I pay off my loan early?',
      a: 'Never. All loans originated through our platform come with a strict 0% prepayment penalty policy. You are free to make extra principal payments at any time or pay off the balance in full without paying any additional fees or unearned interest.',
    },
    {
      q: 'How fast will my loan funds be disbursed?',
      a: 'Personal and debt consolidation loans are typically disbursed via direct ACH deposit into your checking account within 4 to 24 hours after final underwriting approval. Small business loans and equipment financing typically fund within 24 to 48 hours.',
    },
    {
      q: 'What are the minimum credit and income eligibility requirements?',
      a: 'General qualification requirements include: minimum 18 years of age, valid US Social Security Number or ITIN, active US checking account, minimum $30,000 in verifiable annual gross income (or $120,000 for business entities), and a minimum FICO credit score of 620 for personal loans or 650 for commercial lines.',
    },
    {
      q: 'What is Debt-to-Income (DTI) ratio and why does it matter?',
      a: 'Your Debt-to-Income (DTI) ratio compares your total recurring monthly debt payments (rent/mortgage, credit cards, auto loans) to your gross monthly income. We generally look for a DTI below 45% (including the prospective new loan payment) to ensure you have comfortable financial breathing room.',
    },
    {
      q: 'How does AutoPay work and do I get a discount?',
      a: 'Enrolling in electronic AutoPay qualifies you for an automatic 0.25% fixed APR interest rate deduction on your loan. Monthly installments are automatically drafted on your selected payment date with zero manual effort.',
    },
  ];

  return (
    <section id="trust-and-faq-section" className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Security & Regulatory Standards */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-xl space-y-8">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Institutional Security & Standards
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Institutional Safety & Truth in Lending Transparency
            </h3>
            <p className="text-sm text-slate-300">
              We uphold the highest federal compliance standards, encrypted data privacy, and partner banking networks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">256-Bit TLS Encryption</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Bank-level end-to-end cryptographic encryption across all application inputs and document payloads.
              </p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">FDIC-Insured Custodians</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Disbursement escrow and borrower depository accounts held through partner chartered commercial banks.
              </p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">SOC-2 Type II Certified</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Independently audited operational security controls, data confidentiality, and risk governance.
              </p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">Truth in Lending (TILA)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Clear disclosure of APR, finance charges, amortization milestones, and total payment obligations upfront.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Clear Answers
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Frequently Asked Borrowing Questions
            </h3>
            <p className="text-slate-600 text-sm">
              Everything you need to know about our rates, application process, and credit scoring.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-slate-900 text-sm sm:text-base">{faq.q}</span>
                    <span className="text-slate-400 shrink-0">
                      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 bg-white leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
