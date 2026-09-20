import React, { useState } from 'react';
import { 
  Briefcase, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  FileText, 
  ShieldCheck, 
  TrendingUp, 
  Search, 
  Filter,
  Eye,
  Sliders
} from 'lucide-react';
import { LoanApplication, ApplicationStatus } from '../types';
import { formatCurrency, formatPercent } from '../utils/loanCalculations';

interface UnderwriterBackofficeProps {
  applications: LoanApplication[];
  onUpdateAppStatus: (appId: string, newStatus: ApplicationStatus, notes?: string, adjustedApr?: number) => void;
}

export const UnderwriterBackoffice: React.FC<UnderwriterBackofficeProps> = ({
  applications,
  onUpdateAppStatus,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedApp, setSelectedApp] = useState<LoanApplication | null>(null);
  const [customApr, setCustomApr] = useState<number>(7.49);
  const [underwriterNoteInput, setUnderwriterNoteInput] = useState<string>('');

  // Metrics
  const totalVolumeRequested = applications.reduce((sum, app) => sum + app.requestedAmount, 0);
  const avgDti = applications.length > 0
    ? (applications.reduce((sum, app) => sum + app.dtiRatio, 0) / applications.length).toFixed(1)
    : '0';
  const pendingCount = applications.filter(
    (app) => app.status === 'underwriting_review' || app.status === 'docs_required'
  ).length;
  const approvedCount = applications.filter((app) => app.status === 'approved' || app.status === 'funded').length;

  // Filtered list
  const filteredApps = applications.filter((app) => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesSearch =
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${app.firstName} ${app.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'underwriting_review':
        return (
          <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full text-xs font-bold inline-flex items-center gap-1">
            <Clock className="w-3 h-3" /> Underwriting
          </span>
        );
      case 'approved':
        return (
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-bold inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Approved
          </span>
        );
      case 'funded':
        return (
          <span className="bg-blue-100 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full text-xs font-bold inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Funded
          </span>
        );
      case 'docs_required':
        return (
          <span className="bg-purple-100 text-purple-800 border border-purple-200 px-2.5 py-0.5 rounded-full text-xs font-bold inline-flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Docs Required
          </span>
        );
      case 'declined':
        return (
          <span className="bg-rose-100 text-rose-800 border border-rose-200 px-2.5 py-0.5 rounded-full text-xs font-bold inline-flex items-center gap-1">
            <XCircle className="w-3 h-3" /> Declined
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-xs font-medium">
            {status}
          </span>
        );
    }
  };

  const handleOpenAppDetail = (app: LoanApplication) => {
    setSelectedApp(app);
    setCustomApr(app.assignedApr);
    setUnderwriterNoteInput(app.underwriterNotes || '');
  };

  const handleApplyDecision = (newStatus: ApplicationStatus) => {
    if (!selectedApp) return;
    onUpdateAppStatus(selectedApp.id, newStatus, underwriterNoteInput, customApr);
    setSelectedApp({
      ...selectedApp,
      status: newStatus,
      underwriterNotes: underwriterNoteInput,
      assignedApr: customApr,
    });
  };

  return (
    <section id="underwriter-backoffice-section" className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-semibold mb-2">
              <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
              Institutional Underwriting Desk
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Credit Decisioning & Portfolio Risk Queue
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Real-time audit queue for loan applications, debt-to-income verification, and funding disbursement.
            </p>
          </div>
        </div>

        {/* Executive KPI Gauge Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-400 block uppercase">Requested Pipeline Volume</span>
            <strong className="text-2xl font-black text-slate-900 block mt-1">
              {formatCurrency(totalVolumeRequested)}
            </strong>
            <span className="text-[11px] text-slate-500">{applications.length} Total Submissions</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-400 block uppercase">Review Queue</span>
            <strong className="text-2xl font-black text-amber-600 block mt-1">
              {pendingCount}
            </strong>
            <span className="text-[11px] text-slate-500">Pending final underwriter signoff</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-400 block uppercase">Portfolio Avg DTI</span>
            <strong className="text-2xl font-black text-slate-900 block mt-1">
              {avgDti}%
            </strong>
            <span className="text-[11px] text-emerald-600 font-medium">&lt; 36% Benchmark Target</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-400 block uppercase">Approved / Funded</span>
            <strong className="text-2xl font-black text-emerald-700 block mt-1">
              {approvedCount}
            </strong>
            <span className="text-[11px] text-slate-500">Capital actively placed</span>
          </div>
        </div>

        {/* Applications List Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Controls bar */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ID, name, email..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {['all', 'underwriting_review', 'docs_required', 'approved', 'declined'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    statusFilter === st
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st === 'all'
                    ? 'All'
                    : st === 'underwriting_review'
                    ? 'In Review'
                    : st === 'docs_required'
                    ? 'Docs Needed'
                    : st.charAt(0).toUpperCase() + st.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-400 uppercase font-semibold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Application ID</th>
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Loan Type</th>
                  <th className="py-3 px-4">Requested</th>
                  <th className="py-3 px-4">Credit / DTI</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No loan applications match the current filter.
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{app.id}</td>
                      <td className="py-3 px-4">
                        <strong className="text-slate-900 block font-semibold">
                          {app.firstName} {app.lastName}
                        </strong>
                        <span className="text-[11px] text-slate-400">{app.email}</span>
                      </td>
                      <td className="py-3 px-4 capitalize font-medium text-slate-700">
                        {app.loanType.replace('_', ' ')}
                      </td>
                      <td className="py-3 px-4">
                        <strong className="text-slate-900 font-bold">{formatCurrency(app.requestedAmount)}</strong>
                        <span className="text-[11px] text-slate-400 block">{app.termMonths} mo</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-900 block">FICO ~{app.estimatedCreditScore}</span>
                        <span className={`text-[11px] font-medium ${app.dtiRatio > 43 ? 'text-amber-600' : 'text-emerald-700'}`}>
                          DTI: {app.dtiRatio}%
                        </span>
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(app.status)}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          id={`review-app-${app.id}`}
                          onClick={() => handleOpenAppDetail(app)}
                          className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Audit</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Drawer / Modal */}
        {selectedApp && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-slate-900">Application Audit: {selectedApp.id}</h3>
                    {getStatusBadge(selectedApp.status)}
                  </div>
                  <p className="text-xs text-slate-500">
                    Applicant: {selectedApp.firstName} {selectedApp.lastName} &bull; SSN (..{selectedApp.ssnLastFour})
                  </p>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="text-slate-400 hover:text-slate-700 font-bold text-lg"
                >
                  ✕
                </button>
              </div>

              {/* Applicant Financial Snapshot */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block">Gross Income</span>
                  <strong className="text-slate-900 font-bold">{formatCurrency(selectedApp.annualIncome)}/yr</strong>
                  <span className="text-[10px] text-slate-400">({formatCurrency(selectedApp.annualIncome / 12)}/mo)</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Housing Payment</span>
                  <strong className="text-slate-900 font-bold">{formatCurrency(selectedApp.monthlyHousingCost)}/mo</strong>
                  <span className="text-[10px] text-slate-400 capitalize">{selectedApp.housingStatus}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Existing Debt</span>
                  <strong className="text-slate-900 font-bold">{formatCurrency(selectedApp.monthlyDebt)}/mo</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Calculated DTI</span>
                  <strong className="text-emerald-700 font-bold text-sm">{selectedApp.dtiRatio}%</strong>
                  <span className="text-[10px] text-slate-500">Risk: {selectedApp.riskScore}</span>
                </div>
              </div>

              {/* Employment Profile */}
              <div className="text-xs space-y-1">
                <span className="font-bold text-slate-900 block uppercase tracking-wider text-[11px]">
                  Employment & Verification
                </span>
                <p className="text-slate-700">
                  <strong>{selectedApp.employerName}</strong> &bull; {selectedApp.jobTitle} ({selectedApp.employmentStatus})
                </p>
                <p className="text-slate-500">
                  Address: {selectedApp.streetAddress}, {selectedApp.city}, {selectedApp.state} {selectedApp.zipCode}
                </p>
              </div>

              {/* Uploaded Documents */}
              <div className="space-y-2">
                <span className="font-bold text-slate-900 block uppercase tracking-wider text-[11px]">
                  Attached Verification Documents ({selectedApp.documents.length})
                </span>
                <div className="space-y-1.5">
                  {selectedApp.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        <span className="font-medium text-slate-800">{doc.name}</span>
                        <span className="text-[10px] text-slate-400">({doc.size})</span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Verified
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Underwriter Pricing & Notes */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-900 block uppercase tracking-wider text-[11px]">
                  Underwriting Terms & Notes
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-slate-500" />
                      Assigned Fixed APR (%)
                    </label>
                    <input
                      type="number"
                      step={0.05}
                      value={customApr}
                      onChange={(e) => setCustomApr(Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-sm font-bold text-slate-900 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Underwriter Memo</label>
                    <input
                      type="text"
                      value={underwriterNoteInput}
                      onChange={(e) => setUnderwriterNoteInput(e.target.value)}
                      placeholder="e.g. Clean DTI, verified paystubs"
                      className="w-full px-3 py-1.5 text-xs text-slate-900 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Decision Actions */}
              <div className="flex flex-wrap items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleApplyDecision('declined')}
                  className="px-4 py-2 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
                >
                  Decline Application
                </button>

                <button
                  onClick={() => handleApplyDecision('docs_required')}
                  className="px-4 py-2 rounded-xl border border-amber-300 text-amber-700 hover:bg-amber-50 text-xs font-bold transition-colors cursor-pointer"
                >
                  Request Additional Docs
                </button>

                <button
                  onClick={() => handleApplyDecision('approved')}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
                >
                  Approve Application at {customApr}%
                </button>

                {selectedApp.status === 'approved' && (
                  <button
                    onClick={() => handleApplyDecision('funded')}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
                  >
                    Authorize ACH Wire Disbursement
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
