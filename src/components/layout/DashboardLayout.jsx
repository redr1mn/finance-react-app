import { useMemo, useState } from 'react';
import { Menu, X, ChevronDown, Check, Search, LayoutDashboard, CreditCard } from 'lucide-react';
import viteLogo from '../../assets/vite.svg';
import Sidebar from './Sidebar';
import DashboardHome from '../DashboardHome';
import PaymentsList from '../PaymentsList';
import NewTransactionModal from '../ui/NewTransactionModal';
import { accounts as initialAccounts } from '../../data/accounts';

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const [accounts, setAccounts] = useState(initialAccounts);
  const [activeAccountId, setActiveAccountId] = useState(initialAccounts[0].id);
  const [modalOpen, setModalOpen] = useState(false);
  // Incremented each open so the modal remounts with fresh form state.
  const [modalSession, setModalSession] = useState(0);

  // Responsive state
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileAccountOpen, setMobileAccountOpen] = useState(false);

  const activeAccount = useMemo(
    () => accounts.find((a) => a.id === activeAccountId) ?? accounts[0],
    [accounts, activeAccountId],
  );

  const openNewTransaction = () => {
    setModalSession((n) => n + 1);
    setModalOpen(true);
  };

  // Prepend the new transaction to the active account, and adjust its balance.
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

  return (
    <div className="flex h-screen w-full overflow-hidden bg-void-950 font-sans text-void-200">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        activePage={activePage}
        onNavigate={(page) => {
          setActivePage(page);
          setDrawerOpen(false);
        }}
        accounts={accounts}
        activeAccount={activeAccount}
        onSelectAccount={setActiveAccountId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Container */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile Top Bar */}
        <header className="relative z-30 flex h-16 shrink-0 items-center justify-between border-b border-void-800 bg-void-950/80 px-4 backdrop-blur lg:hidden">
          <div className="flex items-center gap-2">
            <img src={viteLogo} alt="Lumen" className="h-8 w-8 shrink-0" />
            <span className="text-sm font-bold tracking-tight text-void-50">Lumen</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Account Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMobileAccountOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg bg-void-900 border border-void-800 p-1.5 text-left text-xs font-bold text-void-50 hover:bg-void-800 active:scale-95 transition"
              >
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded ${activeAccount.accent} text-[10px] font-bold text-white`}>
                  {activeAccount.initials}
                </span>
                <span className="max-w-[70px] truncate">{activeAccount.name}</span>
                <ChevronDown size={14} className="text-void-500" />
              </button>

              {mobileAccountOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMobileAccountOpen(false)} />
                  <div className="absolute right-0 mt-2 z-50 w-52 overflow-hidden rounded-xl border border-void-800 bg-void-950 shadow-2xl shadow-black/80">
                    <p className="border-b border-void-800 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-void-500">
                      Switch Account
                    </p>
                    <div className="max-h-60 overflow-y-auto p-1">
                      {accounts.map((acc) => {
                        const active = acc.id === activeAccount.id;
                        return (
                          <button
                            key={acc.id}
                            onClick={() => {
                              setActiveAccountId(acc.id);
                              setMobileAccountOpen(false);
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors duration-150 hover:bg-void-800/70"
                          >
                            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded ${acc.accent} text-[10px] font-bold text-white`}>
                              {acc.initials}
                            </span>
                            <span className="flex-1 truncate text-xs font-bold text-void-50">{acc.name}</span>
                            {active && <Check size={13} className="text-violet-400" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Hamburger Button */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-void-800 bg-void-900 text-void-400 hover:text-void-200 active:scale-95 transition"
            >
              <Menu size={18} />
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        <div
          className={`fixed inset-0 z-50 lg:hidden flex flex-col bg-void-950/95 transition-all duration-300 ${drawerOpen ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-full pointer-events-none'
            }`}
        >
          {/* Drawer Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-void-900">
            <div className="flex items-center gap-2">
              <img src={viteLogo} alt="Lumen" className="h-8 w-8 shrink-0" />
              <span className="text-sm font-bold tracking-tight text-void-50">Lumen</span>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-void-800 bg-void-900 text-void-400 hover:text-void-200"
            >
              <X size={18} />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
            {/* Global Search Bar */}
            <div>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-void-500" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search transactions..."
                  className="w-full rounded-xl border border-void-800 bg-void-900/60 py-2.5 pl-9 pr-3 text-sm font-medium text-void-200 placeholder:text-void-500 outline-none transition focus:border-violet-500/60"
                />
              </div>
            </div>

            {/* Navigation Links */}
            <div>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => {
                    setActivePage('home');
                    setDrawerOpen(false);
                  }}
                  className={`group/nav relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${activePage === 'home'
                    ? 'bg-void-800/80 text-void-50 border border-void-700/30'
                    : 'text-void-400 hover:bg-void-900 hover:text-void-200'
                    }`}
                >
                  <span
                    className={`absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full bg-violet-400 transition-all duration-300 ${activePage === 'home' ? 'opacity-100' : 'opacity-0'
                      }`}
                  />
                  <LayoutDashboard
                    size={19}
                    className={`shrink-0 transition-colors ${activePage === 'home' ? 'text-violet-400' : ''}`}
                  />
                  <span>Home</span>
                </button>
                <button
                  onClick={() => {
                    setActivePage('payments');
                    setDrawerOpen(false);
                  }}
                  className={`group/nav relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${activePage === 'payments'
                    ? 'bg-void-800/80 text-void-50 border border-void-700/30'
                    : 'text-void-400 hover:bg-void-900 hover:text-void-200'
                    }`}
                >
                  <span
                    className={`absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full bg-violet-400 transition-all duration-300 ${activePage === 'payments' ? 'opacity-100' : 'opacity-0'
                      }`}
                  />
                  <CreditCard
                    size={19}
                    className={`shrink-0 transition-colors ${activePage === 'payments' ? 'text-violet-400' : ''}`}
                  />
                  <span>Payments</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
            {activePage === 'home' ? (
              <DashboardHome
                account={activeAccount}
                accounts={accounts}
                onNavigate={setActivePage}
                onNewTransaction={openNewTransaction}
                searchQuery={searchQuery}
              />
            ) : (
              <PaymentsList
                account={activeAccount}
                onNewTransaction={openNewTransaction}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            )}
          </div>
        </main>
      </div>

      <NewTransactionModal
        key={modalSession}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddTransaction}
      />
    </div>
  );
}
