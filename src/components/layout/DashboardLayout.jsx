import { useMemo, useState } from 'react';
import {
  X, Search, LayoutDashboard, CreditCard,
  ChevronRight,
} from 'lucide-react';
import viteLogo from '../../assets/vite.svg';
import Sidebar from './Sidebar';
import DashboardHome from '../DashboardHome';
import PaymentsList from '../PaymentsList';
import NewTransactionModal from '../ui/NewTransactionModal';
import BudgetPanel from '../ui/BudgetPanel';
import { accounts as initialAccounts, users } from '../../data/accounts';

export default function DashboardLayout() {
  const [collapsed, setCollapsed]           = useState(false);
  const [activePage, setActivePage]         = useState('home');
  const [accounts, setAccounts]             = useState(initialAccounts);
  const [activeAccountId, setActiveAccountId] = useState(initialAccounts[0].id);
  const [modalOpen, setModalOpen]           = useState(false);
  const [modalSession, setModalSession]     = useState(0);
  const [budgetAccount, setBudgetAccount]   = useState(null); // null = panel closed

  // Responsive / drawer state
  const [searchQuery, setSearchQuery]   = useState('');
  const [drawerOpen, setDrawerOpen]     = useState(false);

  const activeAccount = useMemo(
    () => accounts.find((a) => a.id === activeAccountId) ?? accounts[0],
    [accounts, activeAccountId],
  );

  // ── Handlers ────────────────────────────────────────────────────────────

  const openNewTransaction = () => {
    setModalSession((n) => n + 1);
    setModalOpen(true);
  };

  const handleAddTransaction = (tx) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id !== activeAccountId) return acc;
        return {
          ...acc,
          balance: acc.balance + tx.amount,
          transactions: [tx, ...acc.transactions],
        };
      }),
    );
  };

  /** Open budget panel (closes mobile drawer first if open) */
  const handleEditBudget = (acc) => {
    setDrawerOpen(false);
    setBudgetAccount(acc);
  };

  /** Persist updated budget back into the accounts array */
  const handleSaveBudget = (accountId, newBudget) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === accountId ? { ...acc, budget: newBudget } : acc,
      ),
    );
  };

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen w-full overflow-hidden bg-void-950 font-sans text-void-200">

      {/* Desktop Sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        activePage={activePage}
        onNavigate={(page) => { setActivePage(page); setDrawerOpen(false); }}
        accounts={accounts}
        activeAccount={activeAccount}
        onSelectAccount={setActiveAccountId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        users={users}
        onEditBudget={handleEditBudget}
      />

      {/* Main content column */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* ── Mobile top bar ──────────────────────────────────────── */}
        <header className="relative z-30 flex h-14 shrink-0 items-center justify-between border-b border-void-800 bg-void-950/80 px-4 backdrop-blur lg:hidden">
          <div className="flex items-center gap-2">
            <img src={viteLogo} alt="Lumen" className="h-7 w-7 shrink-0" />
            <span className="text-sm font-bold tracking-tight text-void-50">Lumen</span>
          </div>

          {/* Account chip — opens full mobile drawer */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-void-800 bg-void-900 px-3 py-2 transition hover:bg-void-800 active:scale-95"
          >
            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded ${activeAccount.accent} text-[9px] font-bold text-white`}>
              {activeAccount.initials}
            </span>
            <span className="max-w-[90px] truncate text-xs font-semibold text-void-200">
              {activeAccount.name}
            </span>
            <ChevronRight size={12} className="text-void-500 -rotate-90" />
          </button>
        </header>

        {/* ── Mobile navigation drawer ────────────────────────────── */}
        <div
          className={`fixed inset-0 z-50 lg:hidden flex flex-col bg-void-950 transition-all duration-300 ${
            drawerOpen
              ? 'opacity-100 translate-x-0 pointer-events-auto'
              : 'opacity-0 translate-x-full pointer-events-none'
          }`}
        >
          {/* Drawer header */}
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-void-800 px-4">
            <div className="flex items-center gap-2">
              <img src={viteLogo} alt="Lumen" className="h-7 w-7" />
              <span className="text-sm font-bold tracking-tight text-void-50">Lumen</span>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-void-800 bg-void-900 text-void-400 hover:text-void-200 transition"
            >
              <X size={16} />
            </button>
          </div>

          {/* Drawer scrollable body */}
          <div className="flex-1 overflow-y-auto">

            {/* Search */}
            <div className="px-4 py-4 border-b border-void-800/60">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-void-500" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search transactions..."
                  className="w-full rounded-xl border border-void-800 bg-void-900/60 py-2.5 pl-9 pr-3 text-sm font-medium text-void-200 placeholder:text-void-500 outline-none transition focus:border-violet-500/60"
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="px-4 py-4 border-b border-void-800/60">
              <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-void-600">
                Navigation
              </p>
              <div className="space-y-1">
                {[
                  { id: 'home',     label: 'Home',     Icon: LayoutDashboard },
                  { id: 'payments', label: 'Payments', Icon: CreditCard },
                ].map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    onClick={() => { setActivePage(id); setDrawerOpen(false); }}
                    className={`group/nav relative w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      activePage === id
                        ? 'bg-void-800/80 text-void-50 border border-void-700/30'
                        : 'text-void-400 hover:bg-void-800/40 hover:text-void-200'
                    }`}
                  >
                    <span
                      className={`absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-violet-400 transition-all duration-300 ${
                        activePage === id ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                    <Icon size={18} className={`shrink-0 transition-colors ${activePage === id ? 'text-violet-400' : ''}`} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Accounts — grouped by user */}
            <div className="px-4 py-4">
              <p className="mb-3 text-[9px] font-bold uppercase tracking-widest text-void-600">
                Accounts
              </p>

              <div className="space-y-4">
                {users.map((user) => {
                  const userAccounts = accounts.filter((a) => a.userId === user.id);
                  return (
                    <div key={user.id}>
                      {/* User header */}
                      <div className="flex items-center gap-2 px-1 mb-2">
                        <span
                          className={`h-5 w-5 shrink-0 rounded-full ${user.avatar} flex items-center justify-center text-[9px] font-bold text-white`}
                        >
                          {user.initials[0]}
                        </span>
                        <span className="text-xs font-semibold text-void-500">{user.name}</span>
                      </div>

                      {/* Account cards */}
                      <div className="space-y-1.5">
                        {userAccounts.map((acc) => {
                          const isActive = acc.id === activeAccount.id;
                          const spentPct = acc.budget
                            ? Math.min((acc.monthlySpending / acc.budget.monthlyLimit) * 100, 100)
                            : 0;
                          const barColor =
                            spentPct >= 90 ? 'bg-rose-500' : spentPct >= 70 ? 'bg-amber-400' : 'bg-emerald-500';
                          const textStatus =
                            spentPct >= 90 ? 'text-rose-400' : spentPct >= 70 ? 'text-amber-400' : 'text-emerald-400';

                          return (
                            <div
                              key={acc.id}
                              onClick={() => { setActiveAccountId(acc.id); setDrawerOpen(false); }}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => e.key === 'Enter' && setActiveAccountId(acc.id)}
                              className={`group/dracc flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-all ${
                                isActive
                                  ? 'bg-void-800/80 border border-void-700/40'
                                  : 'border border-transparent hover:bg-void-800/40'
                              }`}
                            >
                              {/* Account badge */}
                              <span
                                className={`h-9 w-9 shrink-0 rounded-xl flex items-center justify-center ${acc.accent} text-xs font-bold text-white shadow-sm`}
                              >
                                {acc.initials}
                              </span>

                              {/* Account info + mini budget bar */}
                              <div className="min-w-0 flex-1">
                                <p className={`text-sm font-semibold truncate ${isActive ? 'text-void-50' : 'text-void-300'}`}>
                                  {acc.name}
                                </p>
                                {acc.budget && (
                                  <div className="mt-1.5 flex items-center gap-2">
                                    <div className="flex-1 h-1 overflow-hidden rounded-full bg-void-700">
                                      <div
                                        className={`h-full rounded-full transition-all ${barColor}`}
                                        style={{ width: `${spentPct}%` }}
                                      />
                                    </div>
                                    <span className={`text-[10px] font-bold ${textStatus}`}>
                                      {spentPct.toFixed(0)}%
                                    </span>
                                  </div>
                                )}
                              </div>

                              {isActive && (
                                <span className="h-2 w-2 rounded-full bg-violet-400 shrink-0" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Page content ────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
            {activePage === 'home' ? (
              <DashboardHome
                account={activeAccount}
                accounts={accounts}
                onNavigate={setActivePage}
                onNewTransaction={openNewTransaction}
                onEditBudget={handleEditBudget}
                searchQuery={searchQuery}
              />
            ) : (
              <PaymentsList
                account={activeAccount}
                onNewTransaction={openNewTransaction}
                onEditBudget={handleEditBudget}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            )}
          </div>
        </main>
      </div>

      {/* ── Modals ──────────────────────────────────────────────────── */}
      <NewTransactionModal
        key={modalSession}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddTransaction}
      />

      {budgetAccount && (
        <BudgetPanel
          account={budgetAccount}
          onSave={handleSaveBudget}
          onClose={() => setBudgetAccount(null)}
        />
      )}
    </div>
  );
}
