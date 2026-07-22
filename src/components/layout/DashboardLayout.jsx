import { useMemo, useState } from 'react';
import {
  X, Search, LayoutDashboard, CreditCard,
  ChevronRight, Plus, Trash2,
} from 'lucide-react';
import viteLogo from '../../assets/vite.svg';
import Sidebar from './Sidebar';
import DashboardHome from '../DashboardHome';
import PaymentsList from '../PaymentsList';
import NewTransactionModal from '../ui/NewTransactionModal';
import BudgetPanel from '../ui/BudgetPanel';
import NewAccountModal from '../ui/NewAccountModal';
import DeleteAccountModal from '../ui/DeleteAccountModal';
import UserLoginPanel from '../ui/UserLoginPanel';
import Toast from '../ui/Toast';
import { accounts as initialAccounts, users as initialUsers } from '../../data/accounts';

/**
 * Top-level application layout manager.
 * Manages active page navigation, account selection, sidebar collapse state,
 * mobile drawer toggle, global transaction search, transaction creation modal,
 * budget editing modal state, and global action toast notifications.
 */
export default function DashboardLayout() {
  const [collapsed, setCollapsed]           = useState(false);
  const [activePage, setActivePage]         = useState('home');
  const [accounts, setAccounts]             = useState(initialAccounts);
  const [activeAccountId, setActiveAccountId] = useState(initialAccounts[0].id);
  const [modalOpen, setModalOpen]           = useState(false);
  const [modalSession, setModalSession]     = useState(0);
  const [budgetAccount, setBudgetAccount]   = useState(null);
  const [newAccountModalOpen, setNewAccountModalOpen]     = useState(false);
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);
  const [userList, setUserList]             = useState(initialUsers);
  const [currentUser, setCurrentUser]       = useState(initialUsers[0]);
  const [loginPanelOpen, setLoginPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery]   = useState('');
  const [drawerOpen, setDrawerOpen]     = useState(false);
  const [toast, setToast]               = useState({ message: '', type: 'success' });

  const activeAccount = useMemo(
    () => accounts.find((a) => a.id === activeAccountId) ?? accounts[0],
    [accounts, activeAccountId],
  );

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

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
    setActivePage('payments');
    showToast('Transaction recorded successfully', 'success');
  };

  /**
   * Opens the budget configuration modal for a given account.
   * Ensures mobile drawer is closed prior to displaying modal overlay.
   *
   * @param {Object} acc - Target account object to edit.
   */
  const handleEditBudget = (acc) => {
    setDrawerOpen(false);
    setBudgetAccount(acc);
  };

  /**
   * Persists modified budget parameters back to state for a specific account.
   *
   * @param {string} accountId - Identifier of target account.
   * @param {Object} newBudget - Updated budget metrics object.
   */
  const handleSaveBudget = (accountId, newBudget) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === accountId ? { ...acc, budget: newBudget } : acc,
      ),
    );
    showToast('Budget settings updated', 'success');
  };

  /** Adds a newly created account to application state and selects it */
  const handleAddAccount = (newAcc) => {
    setAccounts((prev) => [...prev, newAcc]);
    setActiveAccountId(newAcc.id);
    showToast(`Account "${newAcc.name}" created`, 'success');
  };

  /** Deletes targeted account from state and switches active selection safely */
  const handleDeleteAccount = (accId) => {
    setAccounts((prev) => {
      const updated = prev.filter((a) => a.id !== accId);
      if (activeAccountId === accId && updated.length > 0) {
        setActiveAccountId(updated[0].id);
      }
      return updated;
    });
    showToast('Account deleted', 'info');
  };

  /** Switches active user session and selects their primary account */
  const handleSelectUser = (user) => {
    setCurrentUser(user);
    const firstUserAcc = accounts.find((a) => a.userId === user.id);
    if (firstUserAcc) {
      setActiveAccountId(firstUserAcc.id);
    }
    showToast(`Switched user session to ${user.name}`, 'info');
  };

  /** Registers a new user profile and activates their session */
  const handleRegisterUser = (newUser) => {
    setUserList((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    showToast(`Welcome, ${newUser.name}! Profile registered`, 'success');
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
        users={userList}
        onEditBudget={handleEditBudget}
        onAddAccount={() => setNewAccountModalOpen(true)}
        onDeleteAccount={() => setDeleteAccountModalOpen(true)}
        currentUser={currentUser}
        onOpenLoginPanel={() => setLoginPanelOpen(true)}
      />

      {/* Main content column */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* ── Mobile top bar ──────────────────────────────────────── */}
        <header className="relative z-30 flex h-14 shrink-0 items-center justify-between border-b border-void-800 bg-void-950/80 px-4 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setActivePage('home')}
            className="flex items-center gap-2 cursor-pointer outline-none group/brand"
            title="Go to Home"
          >
            <img src={viteLogo} alt="Lumen" className="h-7 w-7 shrink-0 transition-transform group-hover/brand:scale-105" />
            <span className="text-sm font-bold tracking-tight text-void-50 group-hover/brand:text-white transition-colors">Lumen</span>
          </button>

          {/* Account chip — opens full mobile drawer */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-void-800 bg-void-900 px-3 py-2 transition hover:bg-void-800 active:scale-95 cursor-pointer"
          >
            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded ${activeAccount.accent} text-[9px] font-bold text-white`}>
              {activeAccount.initials}
            </span>
            <span className="max-w-[90px] truncate text-xs font-semibold text-void-200">
              {activeAccount.name}
            </span>
          </button>
        </header>

        {/* ── Mobile navigation drawer ────────────────────────────── */}
        {drawerOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden animate-fade-in"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
        )}
        <div
          className={`fixed inset-y-0 right-0 z-50 w-full max-w-xs lg:hidden flex flex-col bg-void-950 border-l border-void-800 shadow-2xl transition-all duration-300 ${
            drawerOpen
              ? 'opacity-100 translate-x-0 pointer-events-auto'
              : 'opacity-0 translate-x-full pointer-events-none'
          }`}
        >
          {/* Drawer header */}
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-void-800 px-4">
            <button
              type="button"
              onClick={() => { setActivePage('home'); setDrawerOpen(false); }}
              className="flex items-center gap-2 cursor-pointer outline-none group/brand"
              title="Go to Home"
            >
              <img src={viteLogo} alt="Lumen" className="h-7 w-7 transition-transform group-hover/brand:scale-105" />
              <span className="text-sm font-bold tracking-tight text-void-50 group-hover/brand:text-white transition-colors">Lumen</span>
            </button>
            <button
              onClick={() => setDrawerOpen(false)}
              aria-label="Close drawer"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-void-800 bg-void-900 text-void-400 hover:text-void-200 transition active:scale-95 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Drawer scrollable body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">

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
                    <Icon size={18} className={`shrink-0 transition-colors ${activePage === id ? 'text-violet-400' : ''}`} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Accounts — grouped by user */}
            <div className="px-4 py-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[9px] font-bold uppercase tracking-widest text-void-600">
                  Accounts
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setDrawerOpen(false); setNewAccountModalOpen(true); }}
                    className="text-[10px] font-medium text-void-600 hover:text-void-300 transition cursor-pointer"
                  >
                    + add
                  </button>
                  <button
                    onClick={() => { setDrawerOpen(false); setDeleteAccountModalOpen(true); }}
                    className="text-[10px] font-medium text-void-600 hover:text-rose-400/80 transition cursor-pointer"
                  >
                    delete
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                {(currentUser
                  ? accounts.filter((a) => a.userId === currentUser.id)
                  : accounts
                ).map((acc) => {
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
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Drawer footer: User Profile & Session Manager */}
          {currentUser && (
            <div className="border-t border-void-800 p-3 bg-void-900/60 shrink-0">
              <div
                onClick={() => { setDrawerOpen(false); setLoginPanelOpen(true); }}
                className="flex items-center justify-between rounded-xl border border-void-800/80 bg-void-900 p-2.5 cursor-pointer hover:bg-void-800/60 transition"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`h-8 w-8 shrink-0 rounded-xl ${currentUser.avatar} flex items-center justify-center text-xs font-bold text-white shadow-sm`}>
                    {currentUser.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-void-50 truncate">{currentUser.name}</p>
                    <p className="text-[10px] font-medium text-emerald-400 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active Session
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-violet-400 bg-violet-500/10 border border-violet-500/30 px-2 py-1 rounded-lg">
                  Switch
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── Page content ────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6">
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

      <NewAccountModal
        open={newAccountModalOpen}
        users={userList}
        onClose={() => setNewAccountModalOpen(false)}
        onSubmit={handleAddAccount}
      />

      <DeleteAccountModal
        open={deleteAccountModalOpen}
        account={activeAccount}
        isOnlyAccount={accounts.length <= 1}
        onClose={() => setDeleteAccountModalOpen(false)}
        onConfirm={handleDeleteAccount}
      />

      <UserLoginPanel
        open={loginPanelOpen}
        currentUser={currentUser}
        users={userList}
        accounts={accounts}
        onClose={() => setLoginPanelOpen(false)}
        onSelectUser={handleSelectUser}
        onRegisterUser={handleRegisterUser}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
}
