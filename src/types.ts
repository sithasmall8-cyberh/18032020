export type LoanType = 
  | 'personal'
  | 'business'
  | 'debt_consolidation'
  | 'commercial_real_estate'
  | 'equipment';

export type CreditScoreTier = 'excellent' | 'good' | 'fair' | 'building';

export interface CreditTierInfo {
  id: CreditScoreTier;
  label: string;
  range: string;
  baseAprOffset: number; // offset to product base rate
  approvalOdds: 'Very High' | 'High' | 'Moderate' | 'Specialist Review';
}

export interface LoanProduct {
  id: LoanType;
  title: string;
  tagline: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  minTermMonths: number;
  maxTermMonths: number;
  baseApr: number; // minimum starting APR
  maxApr: number;
  originationFeePercent: number; // e.g., 0% - 3%
  fundingSpeed: string; // e.g. "Same Day"
  minCreditScore: number;
  idealFor: string[];
  keyFeatures: string[];
  requirements: string[];
  popular?: boolean;
}

export interface AmortizationScheduleItem {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
  totalInterestPaid: number;
}

export interface AnnualAmortizationSummary {
  year: number;
  principalPaid: number;
  interestPaid: number;
  endBalance: number;
}

export interface LoanCalculationResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  originationFee: number;
  netDisbursement: number;
  effectiveApr: number;
  monthlySavingsWithExtraPayment?: number;
  interestSaved?: number;
  monthsSaved?: number;
  schedule: AmortizationScheduleItem[];
  annualSummary: AnnualAmortizationSummary[];
}

export interface PreQualFormData {
  loanPurpose: LoanType;
  requestedAmount: number;
  desiredTermMonths: number;
  creditBand: CreditScoreTier;
  annualIncome: number;
  monthlyHousingPayment: number;
  employmentStatus: 'employed' | 'self_employed' | 'business_owner' | 'retired' | 'other';
  monthlyDebtObligations: number;
  fullName: string;
  email: string;
}

export interface PreQualOffer {
  id: string;
  productType: LoanType;
  productName: string;
  approvedAmount: number;
  termMonths: number;
  fixedApr: number;
  monthlyPayment: number;
  totalInterest: number;
  originationFee: number;
  estimatedFunding: string;
  badge?: string;
  monthlyDtiImpact: number;
}

export interface PreQualResult {
  dtiRatio: number;
  eligibilityStatus: 'Pre-Approved' | 'Conditionally Approved' | 'Requires Verification';
  offers: PreQualOffer[];
  maxEligibleAmount: number;
  recommendedOfferId: string;
  checkedAt: string;
}

export type ApplicationStatus = 
  | 'draft'
  | 'submitted'
  | 'underwriting_review'
  | 'docs_required'
  | 'approved'
  | 'funded'
  | 'declined';

export interface UploadedDoc {
  id: string;
  name: string;
  type: 'id_verification' | 'proof_of_income' | 'bank_statement' | 'business_license';
  size: string;
  uploadDate: string;
  status: 'verified' | 'pending' | 'rejected';
}

export interface LoanApplication {
  id: string;
  createdAt: string;
  status: ApplicationStatus;
  
  // Loan parameters
  loanType: LoanType;
  requestedAmount: number;
  termMonths: number;
  purposeDescription: string;

  // Applicant info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  ssnLastFour: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  housingStatus: 'own' | 'rent' | 'other';
  monthlyHousingCost: number;

  // Financial Info
  employmentStatus: string;
  employerName: string;
  jobTitle: string;
  annualIncome: number;
  monthlyDebt: number;
  estimatedCreditScore: number;

  // Decision & Underwriting details
  assignedApr: number;
  approvedMonthlyPayment: number;
  dtiRatio: number;
  riskScore: 'Low' | 'Moderate' | 'Elevated';
  underwriterNotes?: string;
  documents: UploadedDoc[];
}

export interface BorrowerActiveLoan {
  id: string;
  loanType: LoanType;
  originalPrincipal: number;
  currentBalance: number;
  apr: number;
  monthlyPayment: number;
  nextPaymentDate: string;
  originationDate: string;
  termMonths: number;
  paymentsRemaining: number;
  autoPayEnabled: boolean;
  totalPrincipalPaid: number;
  totalInterestPaid: number;
  paymentHistory: {
    id: string;
    date: string;
    amount: number;
    principalPortion: number;
    interestPortion: number;
    method: string;
    status: 'completed' | 'scheduled' | 'processing';
  }[];
}
