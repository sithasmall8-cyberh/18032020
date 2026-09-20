import React, { useState } from 'react';
import { 
  FileText, 
  User, 
  Briefcase, 
  UploadCloud, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  FileCheck,
  Trash2,
  Lock,
  Building,
  DollarSign
} from 'lucide-react';
import { LoanType, LoanApplication, UploadedDoc, PreQualOffer, PreQualFormData } from '../types';
import { LOAN_PRODUCTS } from '../data/loanProducts';
import { calculateMonthlyPayment, formatCurrency, formatPercent } from '../utils/loanCalculations';

interface LoanApplicationFlowProps {
  initialType?: LoanType;
  initialAmount?: number;
  initialTerm?: number;
  prefillData?: Partial<PreQualFormData>;
  prefillOffer?: PreQualOffer | null;
  onApplicationSubmitted: (application: LoanApplication) => void;
  onViewPortal: () => void;
}

export const LoanApplicationFlow: React.FC<LoanApplicationFlowProps> = ({
  initialType = 'personal',
  initialAmount = 25000,
  initialTerm = 36,
  prefillData,
  prefillOffer,
  onApplicationSubmitted,
  onViewPortal
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [submittedApp, setSubmittedApp] = useState<LoanApplication | null>(null);

  // Form State
  const [loanType, setLoanType] = useState<LoanType>(prefillOffer?.productType || initialType);
  const [requestedAmount, setRequestedAmount] = useState<number>(prefillOffer?.approvedAmount || initialAmount);
  const [termMonths, setTermMonths] = useState<number>(prefillOffer?.termMonths || initialTerm);
  const [purposeDescription, setPurposeDescription] = useState<string>('Refinancing and consolidating higher-rate obligations');

  // Personal
  const [firstName, setFirstName] = useState<string>(prefillData?.fullName?.split(' ')[0] || 'Jordan');
  const [lastName, setLastName] = useState<string>(prefillData?.fullName?.split(' ')[1] || 'Mitchell');
  const [email, setEmail] = useState<string>(prefillData?.email || 'jordan.mitchell@example.com');
  const [phone, setPhone] = useState<string>('(555) 612-8841');
  const [dateOfBirth, setDateOfBirth] = useState<string>('1991-08-14');
  const [ssnLastFour, setSsnLastFour] = useState<string>('7721');
  const [streetAddress, setStreetAddress] = useState<string>('1240 Pineview Blvd');
  const [city, setCity] = useState<string>('Portland');
  const [state, setState] = useState<string>('OR');
  const [zipCode, setZipCode] = useState<string>('97201');
  const [housingStatus, setHousingStatus] = useState<'own' | 'rent' | 'other'>('rent');
  const [monthlyHousingCost, setMonthlyHousingCost] = useState<number>(prefillData?.monthlyHousingPayment || 1600);

  // Financial
  const [employmentStatus, setEmploymentStatus] = useState<string>('Full-time Employed');
  const [employerName, setEmployerName] = useState<string>('Pacific Rim Dynamics');
  const [jobTitle, setJobTitle] = useState<string>('Senior Product Specialist');
  const [annualIncome, setAnnualIncome] = useState<number>(prefillData?.annualIncome || 92000);
  const [monthlyDebt, setMonthlyDebt] = useState<number>(prefillData?.monthlyDebtObligations || 520);
  const [estimatedCreditScore, setEstimatedCreditScore] = useState<number>(730);

  // Documents
  const [documents, setDocuments] = useState<UploadedDoc[]>([
    {
      id: 'doc-id-1',
      name: 'State_Drivers_License_Front_Back.pdf',
      type: 'id_verification',
      size: '2.4 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'verified',
    },
    {
      id: 'doc-income-1',
      name: 'Recent_Paystub_Two_Weeks.pdf',
      type: 'proof_of_income',
      size: '1.1 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'verified',
    }
  ]);

  // Terms & Signature
  const [agreementChecked, setAgreementChecked] = useState<boolean>(true);
  const [signatureName, setSignatureName] = useState<string>('Jordan Mitchell');

  // Add mock file upload
  const handleSimulateFileUpload = (type: UploadedDoc['type']) => {
    const docNames: Record<UploadedDoc['type'], string> = {
      id_verification: 'Passport_Scan_Color.pdf',
      proof_of_income: '2025_W2_Statement.pdf',
      bank_statement: 'Chase_Bank_Statement_90Days.pdf',
      business_license: 'State_Business_Filing_Articles.pdf',
    };

    const newDoc: UploadedDoc = {
      id: `doc-${Date.now()}`,
      name: docNames[type] || 'Uploaded_Document.pdf',
      type,
      size: `${(Math.random() * 2 + 1).toFixed(1)} MB`,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'verified',
    };

    setDocuments((prev) => [...prev, newDoc]);
  };

  const removeDoc = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreementChecked) return;

    const monthlyGross = annualIncome / 12;
    const monthlyPaymentEst = calculateMonthlyPayment(requestedAmount, 7.49, termMonths);
    const dti = Number((((monthlyHousingCost + monthlyDebt + monthlyPaymentEst) / monthlyGross) * 100).toFixed(1));

    const newApp: LoanApplication = {
      id: `APP-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      status: 'underwriting_review',
      loanType,
      requestedAmount,
      termMonths,
      purposeDescription,
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      ssnLastFour,
      streetAddress,
      city,
      state,
      zipCode,
      housingStatus,
      monthlyHousingCost,
      employmentStatus,
      employerName,
      jobTitle,
      annualIncome,
      monthlyDebt,
      estimatedCreditScore,
      assignedApr: prefillOffer?.fixedApr || 7.49,
      approvedMonthlyPayment: prefillOffer?.monthlyPayment || Number(monthlyPaymentEst.toFixed(2)),
      dtiRatio: dti,
      riskScore: dti < 35 ? 'Low' : dti < 45 ? 'Moderate' : 'Elevated',
      underwriterNotes: 'Digital application submitted with verified initial ID and income document packages.',
      documents,
    };

    setSubmittedApp(newApp);
    onApplicationSubmitted(newApp);
  };

  const steps = [
    { num: 1, title: 'Loan Terms' },
    { num: 2, title: 'Personal Info' },
    { num: 3, title: 'Employment' },
    { num: 4, title: 'Documents' },
    { num: 5, title: 'Review & Sign' },
  ];

  return (
    <section id="loan-application-section" className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 min-h-[700px]">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Success View */}
        {submittedApp ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Application Successfully Received
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Application #{submittedApp.id} is in Underwriting
              </h2>
              <p className="text-slate-600 text-sm max-w-lg mx-auto">
                Thank you, <strong>{submittedApp.firstName}</strong>. Our automated credit verification engine is reviewing your application package.
              </p>
            </div>

            {/* Status Timeline */}
            <div className="max-w-xl mx-auto bg-slate-50 p-6 rounded-xl border border-slate-200 text-left space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Application Tracking</h4>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Application & Documents Submitted</span>
                    <span className="text-[11px] text-slate-500">Completed just now</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold animate-pulse">
                    ●
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Underwriting & Credit Evaluation</span>
                    <span className="text-[11px] text-amber-700 font-medium">Currently in progress (typically ~1-2 hours)</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 opacity-50">
                  <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-700 block">Final Approval & Closing Agreement</span>
                    <span className="text-[11px] text-slate-400">Electronic loan note generation</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 opacity-50">
                  <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center text-xs font-bold">
                    4
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-700 block">Direct ACH Funds Disbursement</span>
                    <span className="text-[11px] text-slate-400">Deposited straight to your designated checking account</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary card */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto text-left text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 block">Loan Amount</span>
                <strong className="text-slate-900 font-bold text-sm">{formatCurrency(submittedApp.requestedAmount)}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Term Length</span>
                <strong className="text-slate-900 font-bold text-sm">{submittedApp.termMonths} Months</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Approved APR</span>
                <strong className="text-emerald-700 font-bold text-sm">{formatPercent(submittedApp.assignedApr)}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Monthly Est.</span>
                <strong className="text-slate-900 font-bold text-sm">{formatCurrency(submittedApp.approvedMonthlyPayment)}</strong>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <button
                onClick={onViewPortal}
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors cursor-pointer"
              >
                Access Borrower Account Portal
              </button>

              <button
                onClick={() => {
                  setSubmittedApp(null);
                  setCurrentStep(1);
                }}
                className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-sm transition-colors cursor-pointer"
              >
                Submit Another Application
              </button>
            </div>
          </div>
        ) : (
          /* Main Multi-Step Form */
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Step progress bar */}
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
              <div className="flex items-center justify-between">
                {steps.map((s, idx) => (
                  <div key={s.num} className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        currentStep === s.num
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : currentStep > s.num
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {currentStep > s.num ? '✓' : s.num}
                    </div>
                    <span
                      className={`text-xs font-semibold hidden sm:inline ${
                        currentStep === s.num ? 'text-slate-900' : 'text-slate-400'
                      }`}
                    >
                      {s.title}
                    </span>
                    {idx < steps.length - 1 && (
                      <div className="w-6 sm:w-12 h-0.5 bg-slate-200 hidden sm:block"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {/* STEP 1: Loan Terms */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Step 1: Select Your Loan Terms</h3>
                    <p className="text-xs text-slate-500">Specify the capital requested and duration needed.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-900 uppercase">Loan Category</label>
                      <select
                        id="app-loan-type"
                        value={loanType}
                        onChange={(e) => setLoanType(e.target.value as LoanType)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 bg-slate-50 focus:bg-white focus:outline-none"
                      >
                        {LOAN_PRODUCTS.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-900 uppercase">Requested Amount ($)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                        <input
                          id="app-amount"
                          type="number"
                          step={500}
                          value={requestedAmount}
                          onChange={(e) => setRequestedAmount(Number(e.target.value))}
                          className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-900 uppercase">Term Duration (Months)</label>
                      <select
                        id="app-term"
                        value={termMonths}
                        onChange={(e) => setTermMonths(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 bg-slate-50 focus:bg-white focus:outline-none"
                      >
                        {[12, 24, 36, 48, 60, 72, 84, 120].map((m) => (
                          <option key={m} value={m}>
                            {m} Months ({Number((m / 12).toFixed(1))} Years)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-900 uppercase">Intended Use of Capital</label>
                      <input
                        id="app-purpose"
                        type="text"
                        value={purposeDescription}
                        onChange={(e) => setPurposeDescription(e.target.value)}
                        placeholder="e.g., Home renovation, inventory purchase, debt payoff"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 bg-slate-50 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Estimated monthly installment:</span>
                    <strong className="text-base text-slate-900 font-bold">
                      {formatCurrency(calculateMonthlyPayment(requestedAmount, 7.49, termMonths))}/mo
                    </strong>
                  </div>
                </div>
              )}

              {/* STEP 2: Personal Info */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Step 2: Personal Identification & Address</h3>
                    <p className="text-xs text-slate-500">Required by federal KYC and USA PATRIOT Act regulations.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-900">First Legal Name</label>
                      <input
                        id="app-first-name"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-slate-50 focus:bg-white focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-900">Last Legal Name</label>
                      <input
                        id="app-last-name"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-slate-50 focus:bg-white focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-900">Email Address</label>
                      <input
                        id="app-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-slate-50 focus:bg-white focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-900">Mobile Phone</label>
                      <input
                        id="app-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-slate-50 focus:bg-white focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-900">Date of Birth</label>
                      <input
                        id="app-dob"
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-slate-50 focus:bg-white focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-900">SSN / ITIN (Last 4 Digits)</label>
                      <input
                        id="app-ssn"
                        type="password"
                        maxLength={4}
                        value={ssnLastFour}
                        onChange={(e) => setSsnLastFour(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-slate-50 focus:bg-white focus:outline-none"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-bold text-slate-900">Residential Street Address</label>
                      <input
                        id="app-address"
                        type="text"
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-slate-50 focus:bg-white focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-900">City</label>
                      <input
                        id="app-city"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-slate-50 focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-900">State</label>
                        <input
                          id="app-state"
                          type="text"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-slate-50 focus:bg-white focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-900">ZIP Code</label>
                        <input
                          id="app-zip"
                          type="text"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-slate-50 focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-900">Housing Status</label>
                      <select
                        id="app-housing-status"
                        value={housingStatus}
                        onChange={(e) => setHousingStatus(e.target.value as 'own' | 'rent' | 'other')}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-slate-50 focus:bg-white focus:outline-none"
                      >
                        <option value="rent">Rent</option>
                        <option value="own">Own (Mortgage / Free & Clear)</option>
                        <option value="other">Other / Family</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-900">Monthly Housing Cost ($)</label>
                      <input
                        id="app-housing-cost"
                        type="number"
                        value={monthlyHousingCost}
                        onChange={(e) => setMonthlyHousingCost(Number(e.target.value))}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-slate-50 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Financial & Employment */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Step 3: Financial & Employment Profile</h3>
                    <p className="text-xs text-slate-500">Demonstrates repayment capability and verifies debt-to-income limits.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-900">Employment Status</label>
                      <select
                        id="app-emp-status"
                        value={employmentStatus}
                        onChange={(e) => setEmploymentStatus(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-slate-50 focus:bg-white focus:outline-none"
                      >
                        <option value="Full-time Employed">Full-time Employed</option>
                        <option value="Part-time Employed">Part-time Employed</option>
                        <option value="Self-employed">Self-employed / 1099</option>
                        <option value="Business Owner">Business Owner</option>
                        <option value="Retired">Retired</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-900">Employer / Company Name</label>
                      <input
                        id="app-employer"
                        type="text"
                        value={employerName}
                        onChange={(e) => setEmployerName(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-slate-50 focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-900">Job Title / Role</label>
                      <input
                        id="app-job-title"
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-slate-50 focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-900">Gross Annual Income ($)</label>
                      <input
                        id="app-annual-income"
                        type="number"
                        value={annualIncome}
                        onChange={(e) => setAnnualIncome(Number(e.target.value))}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-bold bg-slate-50 focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-900">Total Monthly Debt Payments ($)</label>
                      <input
                        id="app-monthly-debt"
                        type="number"
                        value={monthlyDebt}
                        onChange={(e) => setMonthlyDebt(Number(e.target.value))}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-slate-50 focus:bg-white focus:outline-none"
                      />
                      <span className="text-[11px] text-slate-400">Credit cards, auto loans, student payments</span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-900">Estimated Credit Score (FICO)</label>
                      <input
                        id="app-credit-score"
                        type="number"
                        min={500}
                        max={850}
                        value={estimatedCreditScore}
                        onChange={(e) => setEstimatedCreditScore(Number(e.target.value))}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-slate-50 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Document Upload */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Step 4: Digital Verification Documents</h3>
                    <p className="text-xs text-slate-500">Upload clear digital copies or photos of your verification documents.</p>
                  </div>

                  {/* Dropzone Simulation Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => handleSimulateFileUpload('id_verification')}
                      className="p-4 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/50 text-center transition-all cursor-pointer group"
                    >
                      <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-emerald-600 mx-auto mb-1.5" />
                      <span className="text-xs font-bold text-slate-800 block">+ Add Photo ID</span>
                      <span className="text-[10px] text-slate-400">Driver's License / Passport</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSimulateFileUpload('proof_of_income')}
                      className="p-4 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/50 text-center transition-all cursor-pointer group"
                    >
                      <FileCheck className="w-6 h-6 text-slate-400 group-hover:text-emerald-600 mx-auto mb-1.5" />
                      <span className="text-xs font-bold text-slate-800 block">+ Add Proof of Income</span>
                      <span className="text-[10px] text-slate-400">Paystub, W-2 or 1040</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSimulateFileUpload('bank_statement')}
                      className="p-4 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/50 text-center transition-all cursor-pointer group"
                    >
                      <Building className="w-6 h-6 text-slate-400 group-hover:text-emerald-600 mx-auto mb-1.5" />
                      <span className="text-xs font-bold text-slate-800 block">+ Add Bank Statement</span>
                      <span className="text-[10px] text-slate-400">Last 60-90 days statements</span>
                    </button>
                  </div>

                  {/* Uploaded Files Ledger */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-900 block">Uploaded Files ({documents.length})</span>
                    {documents.length === 0 ? (
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500">
                        No documents attached yet. Click an option above to upload.
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                        {documents.map((doc) => (
                          <div key={doc.id} className="p-3 bg-white flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2.5">
                              <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                              <div>
                                <span className="font-semibold text-slate-900 block">{doc.name}</span>
                                <span className="text-[10px] text-slate-400">
                                  {doc.size} &bull; Uploaded {doc.uploadDate} &bull;{' '}
                                  <span className="text-emerald-600 font-medium">Ready for review</span>
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeDoc(doc.id)}
                              className="text-slate-400 hover:text-red-500 p-1 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 5: Review & Sign */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Step 5: Review & Electronic Signature</h3>
                    <p className="text-xs text-slate-500">Confirm terms and sign in compliance with the Federal E-SIGN Act.</p>
                  </div>

                  {/* Terms Overview Box */}
                  <div className="bg-slate-900 text-white rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-xs text-emerald-400 font-semibold block uppercase">Loan Application Summary</span>
                        <h4 className="text-lg font-bold">{formatCurrency(requestedAmount)} &bull; {termMonths} Months</h4>
                      </div>
                      <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-1 rounded-full border border-emerald-500/30 font-semibold">
                        Fixed APR: {formatPercent(prefillOffer?.fixedApr || 7.49)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block">Monthly Installment</span>
                        <strong className="text-white font-bold text-base">
                          {formatCurrency(calculateMonthlyPayment(requestedAmount, prefillOffer?.fixedApr || 7.49, termMonths))}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Applicant</span>
                        <strong className="text-white font-semibold">{firstName} {lastName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Direct Deposit To</span>
                        <strong className="text-white font-semibold">Checking (..7721)</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Origination Fee</span>
                        <strong className="text-white font-semibold">$0.00 (Waived)</strong>
                      </div>
                    </div>
                  </div>

                  {/* Disclosures & Truth in Lending */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs text-slate-600 space-y-2 max-h-36 overflow-y-auto">
                    <strong className="text-slate-900 block">Truth in Lending Act (TILA) Notice:</strong>
                    <p>
                      You have the right to receive disclosures before finalizing any credit transaction. All interest rates quoted are fixed for the life of the loan. Prepayment of the unpaid principal balance may be made at any time without penalty, fee, or premium.
                    </p>
                    <p>
                      By typing your legal name below and clicking "Submit Loan Application", you acknowledge and certify that all information submitted is true and complete to the best of your knowledge.
                    </p>
                  </div>

                  {/* Signature field */}
                  <div className="space-y-3">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        id="app-agreement-checkbox"
                        type="checkbox"
                        checked={agreementChecked}
                        onChange={(e) => setAgreementChecked(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-xs text-slate-700">
                        I agree to electronic communications, credit inquiries, and the Truth in Lending Act disclosures outlined above.
                      </span>
                    </label>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-900">Type Full Legal Name as Electronic Signature</label>
                      <input
                        id="app-signature"
                        type="text"
                        value={signatureName}
                        onChange={(e) => setSignatureName(e.target.value)}
                        placeholder="e.g. Jordan Mitchell"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-serif italic text-base text-slate-900 bg-slate-50 focus:bg-white focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous Step
                  </button>
                ) : (
                  <div></div>
                )}

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
                  >
                    <span>Continue to Step {currentStep + 1}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={!agreementChecked || !signatureName}
                    className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Submit Loan Application</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
