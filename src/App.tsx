/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { LoanCalculator } from './components/LoanCalculator';
import { LoanProducts } from './components/LoanProducts';
import { PreQualification } from './components/PreQualification';
import { LoanApplicationFlow } from './components/LoanApplicationFlow';
import { BorrowerPortal } from './components/BorrowerPortal';
import { UnderwriterBackoffice } from './components/UnderwriterBackoffice';
import { TrustAndFaq } from './components/TrustAndFaq';
import { Footer } from './components/Footer';
import { 
  LoanType, 
  LoanApplication, 
  BorrowerActiveLoan, 
  PreQualOffer, 
  PreQualFormData,
  ApplicationStatus
} from './types';
import { 
  INITIAL_DEMO_APPLICATIONS, 
  INITIAL_BORROWER_LOANS 
} from './data/loanProducts';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('calculator');
  
  // Cross-component parameters
  const [selectedProductType, setSelectedProductType] = useState<LoanType>('personal');
  const [targetAmount, setTargetAmount] = useState<number>(25000);
  const [targetTerm, setTargetTerm] = useState<number>(36);

  // Pre-qual transfer state
  const [prefillOffer, setPrefillOffer] = useState<PreQualOffer | null>(null);
  const [prefillData, setPrefillData] = useState<Partial<PreQualFormData>>({});

  // Applications repository
  const [applications, setApplications] = useState<LoanApplication[]>(INITIAL_DEMO_APPLICATIONS);

  // Active Borrower loans repository
  const [borrowerLoans, setBorrowerLoans] = useState<BorrowerActiveLoan[]>(INITIAL_BORROWER_LOANS);

  // Handlers
  const handleStartApplicationFromHero = (type: LoanType = 'personal', amount: number = 25000) => {
    setSelectedProductType(type);
    setTargetAmount(amount);
    setPrefillOffer(null);
    setActiveTab('apply');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyWithTerms = (type: LoanType, amount: number, term: number) => {
    setSelectedProductType(type);
    setTargetAmount(amount);
    setTargetTerm(term);
    setPrefillOffer(null);
    setActiveTab('apply');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProductForCalculator = (type: LoanType) => {
    setSelectedProductType(type);
    setActiveTab('calculator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyForProduct = (type: LoanType) => {
    setSelectedProductType(type);
    setPrefillOffer(null);
    setActiveTab('apply');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectOfferToApply = (offer: PreQualOffer, data: Partial<PreQualFormData>) => {
    setPrefillOffer(offer);
    setPrefillData(data);
    setSelectedProductType(offer.productType);
    setTargetAmount(offer.approvedAmount);
    setTargetTerm(offer.termMonths);
    setActiveTab('apply');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplicationSubmitted = (newApp: LoanApplication) => {
    setApplications((prev) => [newApp, ...prev]);
  };

  const handleMakePayment = (loanId: string, amount: number, isPrincipalOnly: boolean) => {
    setBorrowerLoans((prev) =>
      prev.map((l) => {
        if (l.id !== loanId) return l;

        const newBalance = Math.max(0, l.currentBalance - amount);
        const principalPortion = isPrincipalOnly ? amount : Math.min(amount, amount * 0.8);
        const interestPortion = isPrincipalOnly ? 0 : amount - principalPortion;

        const newPmt = {
          id: `pmt-${Date.now().toString().slice(-4)}`,
          date: new Date().toISOString().split('T')[0],
          amount,
          principalPortion: Number(principalPortion.toFixed(2)),
          interestPortion: Number(interestPortion.toFixed(2)),
          method: 'Chase Direct ACH (..4019)',
          status: 'completed' as const,
        };

        return {
          ...l,
          currentBalance: Number(newBalance.toFixed(2)),
          totalPrincipalPaid: Number((l.totalPrincipalPaid + principalPortion).toFixed(2)),
          totalInterestPaid: Number((l.totalInterestPaid + interestPortion).toFixed(2)),
          paymentsRemaining: Math.max(0, l.paymentsRemaining - (isPrincipalOnly ? 0 : 1)),
          paymentHistory: [newPmt, ...l.paymentHistory],
        };
      })
    );
  };

  const handleToggleAutoPay = (loanId: string) => {
    setBorrowerLoans((prev) =>
      prev.map((l) => {
        if (l.id !== loanId) return l;
        const newStatus = !l.autoPayEnabled;
        const newApr = newStatus ? Number((l.apr - 0.25).toFixed(2)) : Number((l.apr + 0.25).toFixed(2));
        return {
          ...l,
          autoPayEnabled: newStatus,
          apr: newApr,
        };
      })
    );
  };

  const handleUpdateAppStatus = (
    appId: string, 
    newStatus: ApplicationStatus, 
    notes?: string, 
    adjustedApr?: number
  ) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;

        const updated = {
          ...app,
          status: newStatus,
          underwriterNotes: notes || app.underwriterNotes,
          assignedApr: adjustedApr !== undefined ? adjustedApr : app.assignedApr,
        };

        // If newly funded, simulate adding to borrower active loans!
        if (newStatus === 'funded' && !borrowerLoans.some((b) => b.id === `LN-${app.id.replace('APP-', '')}`)) {
          const newLoanNote: BorrowerActiveLoan = {
            id: `LN-${app.id.replace('APP-', '')}`,
            loanType: app.loanType,
            originalPrincipal: app.requestedAmount,
            currentBalance: app.requestedAmount,
            apr: app.assignedApr,
            monthlyPayment: app.approvedMonthlyPayment,
            nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            originationDate: new Date().toISOString().split('T')[0],
            termMonths: app.termMonths,
            paymentsRemaining: app.termMonths,
            autoPayEnabled: true,
            totalPrincipalPaid: 0,
            totalInterestPaid: 0,
            paymentHistory: [],
          };
          setBorrowerLoans((curr) => [newLoanNote, ...curr]);
        }

        return updated;
      })
    );
  };

  const pendingApplicationsCount = applications.filter(
    (a) => a.status === 'underwriting_review' || a.status === 'docs_required'
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Header Navigation */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        applicationsCount={pendingApplicationsCount}
      />

      {/* Hero Banner (Always shown on calculator and products tab for context) */}
      {(activeTab === 'calculator' || activeTab === 'products') && (
        <HeroBanner
          onStartApplication={handleStartApplicationFromHero}
          onExploreCalculator={() => {
            setActiveTab('calculator');
            const el = document.getElementById('loan-calculator-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}

      {/* Main Content Areas */}
      <main className="flex-1">
        {activeTab === 'calculator' && (
          <div className="space-y-12">
            <LoanCalculator
              onApplyWithTerms={handleApplyWithTerms}
              initialType={selectedProductType}
              initialAmount={targetAmount}
            />
            <LoanProducts
              onSelectProductForCalculator={handleSelectProductForCalculator}
              onApplyForProduct={handleApplyForProduct}
            />
            <PreQualification onSelectOfferToApply={handleSelectOfferToApply} />
            <TrustAndFaq />
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-12">
            <LoanProducts
              onSelectProductForCalculator={handleSelectProductForCalculator}
              onApplyForProduct={handleApplyForProduct}
            />
            <LoanCalculator
              onApplyWithTerms={handleApplyWithTerms}
              initialType={selectedProductType}
              initialAmount={targetAmount}
            />
            <TrustAndFaq />
          </div>
        )}

        {activeTab === 'prequal' && (
          <div className="space-y-12">
            <PreQualification onSelectOfferToApply={handleSelectOfferToApply} />
            <LoanProducts
              onSelectProductForCalculator={handleSelectProductForCalculator}
              onApplyForProduct={handleApplyForProduct}
            />
            <TrustAndFaq />
          </div>
        )}

        {activeTab === 'apply' && (
          <div className="space-y-12">
            <LoanApplicationFlow
              initialType={selectedProductType}
              initialAmount={targetAmount}
              initialTerm={targetTerm}
              prefillOffer={prefillOffer}
              prefillData={prefillData}
              onApplicationSubmitted={handleApplicationSubmitted}
              onViewPortal={() => setActiveTab('portal')}
            />
            <TrustAndFaq />
          </div>
        )}

        {activeTab === 'portal' && (
          <div className="space-y-12">
            <BorrowerPortal
              loans={borrowerLoans}
              onMakePayment={handleMakePayment}
              onToggleAutoPay={handleToggleAutoPay}
              onApplyNewLoan={() => setActiveTab('apply')}
            />
            <TrustAndFaq />
          </div>
        )}

        {activeTab === 'underwriter' && (
          <div className="space-y-12">
            <UnderwriterBackoffice
              applications={applications}
              onUpdateAppStatus={handleUpdateAppStatus}
            />
            <TrustAndFaq />
          </div>
        )}
      </main>

      {/* Global Regulatory Footer */}
      <Footer 
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectProduct={(type) => {
          setSelectedProductType(type);
          setActiveTab('products');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
