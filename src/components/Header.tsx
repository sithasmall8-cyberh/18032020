import React from 'react';
import { 
  ShieldCheck, 
  Calculator, 
  FileText, 
  UserCheck, 
  Building2, 
  CreditCard,
  Briefcase,
  Layers
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  applicationsCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, applicationsCount }) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900 text-white border-b border-slate-800 shadow-lg">
      {/* Top micro-bar with market rates & compliance */}
      <div className="bg-slate-950 text-xs py-1.5 px-4 border-b border-slate-850">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-slate-400">
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block mr-1.5 animate-pulse"></span>
              Live Rates Active
            </span>
            <span className="hidden sm:inline">Prime: <strong>8.00%</strong></span>
            <span className="hidden md:inline">Personal: From <strong className="text-slate-200">5.99% APR</strong></span>
            <span className="hidden lg:inline">Business: From <strong className="text-slate-200">7.25% APR</strong></span>
          </div>

          <div className="flex items-center space-x-3 text-slate-400 text-xs">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Equal Housing Lender &bull; NMLS #194820
            </span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <button 
            id="brand-home-btn"
            onClick={() => setActiveTab('calculator')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-900/30 group-hover:bg-emerald-500 transition-colors">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-lg tracking-tight text-white flex items-center gap-1.5">
                Financial Lending
                <span className="text-xs bg-emerald-950 text-emerald-400 font-medium px-2 py-0.5 rounded border border-emerald-800/60">
                  Direct
                </span>
              </div>
              <p className="text-xs text-slate-400">Institutional & Consumer Credit</p>
            </div>
          </button>

          {/* Nav links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              id="nav-calculator"
              onClick={() => setActiveTab('calculator')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'calculator'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Calculator className="w-4 h-4" />
              Loan Calculator
            </button>

            <button
              id="nav-products"
              onClick={() => setActiveTab('products')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'products'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              Loan Products
            </button>

            <button
              id="nav-prequal"
              onClick={() => setActiveTab('prequal')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'prequal'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              Pre-Qualify
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-semibold border border-emerald-500/30">
                Soft Check
              </span>
            </button>

            <button
              id="nav-portal"
              onClick={() => setActiveTab('portal')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'portal'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Borrower Portal
            </button>

            <button
              id="nav-underwriter"
              onClick={() => setActiveTab('underwriter')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'underwriter'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Underwriting Desk
              {applicationsCount > 0 && (
                <span className="ml-1 bg-amber-500 text-slate-950 text-xs px-1.5 py-0.5 rounded-full font-bold">
                  {applicationsCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right primary action */}
          <div className="flex items-center gap-2">
            <button
              id="nav-apply-btn"
              onClick={() => setActiveTab('apply')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center gap-2 ${
                activeTab === 'apply'
                  ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-400'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Apply Online</span>
            </button>
          </div>
        </div>

        {/* Mobile bottom nav scroll */}
        <div className="lg:hidden flex overflow-x-auto py-2.5 space-x-2 border-t border-slate-800 text-xs scrollbar-none">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'calculator' ? 'bg-slate-800 text-emerald-400' : 'text-slate-300'
            }`}
          >
            Calculator
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'products' ? 'bg-slate-800 text-emerald-400' : 'text-slate-300'
            }`}
          >
            Loan Products
          </button>
          <button
            onClick={() => setActiveTab('prequal')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'prequal' ? 'bg-slate-800 text-emerald-400' : 'text-slate-300'
            }`}
          >
            Pre-Qualify
          </button>
          <button
            onClick={() => setActiveTab('apply')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'apply' ? 'bg-slate-800 text-emerald-400' : 'text-slate-300'
            }`}
          >
            Apply
          </button>
          <button
            onClick={() => setActiveTab('portal')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'portal' ? 'bg-slate-800 text-emerald-400' : 'text-slate-300'
            }`}
          >
            Borrower Portal
          </button>
          <button
            onClick={() => setActiveTab('underwriter')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'underwriter' ? 'bg-slate-800 text-emerald-400' : 'text-slate-300'
            }`}
          >
            Underwriting ({applicationsCount})
          </button>
        </div>
      </div>
    </header>
  );
};
