import { useMemo, useState } from 'react';
import { Bell, Search } from 'lucide-react';
import Sidebar from './components/Sidebar';
import DashboardHome from './components/DashboardHome';
import PaymentsList from './components/PaymentsList';
import NewTransactionModal from './components/NewTransactionModal';
import { accounts as initialAccounts } from './data/mockData';
import './App.css';

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const [accounts, setAccounts] = useState(initialAccounts);
  const [activeAccountId, setActiveAccountId] = useState(initialAccounts[0].id);
  const [modalOpen, setModalOpen] = useState(false);
  // Incremented each open so the modal remounts with fresh form state.
  const [modalSession, setModalSession] = useState(0);

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
    <div className="flex h-screen w-full overflow-hidden bg-zinc-950 font-sans text-zinc-200">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        activePage={activePage}
        onNavigate={setActivePage}
        accounts={accounts}
        activeAccount={activeAccount}
        onSelectAccount={setActiveAccountId}
      />

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-zinc-800 bg-zinc-950/60 px-6 backdrop-blur">
          <div className="relative hidden md:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              placeholder="Search transactions, accounts..."
              className="w-72 rounded-lg border border-zinc-800 bg-zinc-900/60 py-2 pl-9 pr-3 text-sm font-medium text-zinc-200 placeholder:text-zinc-600 outline-none transition focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 transition hover:border-zinc-700 hover:text-zinc-200 active:scale-95">
              <Bell size={16} />
            </button>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500 text-xs font-bold text-white shadow-md">
              AM
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl">
            {activePage === 'home' ? (
              <DashboardHome
                account={activeAccount}
                onNavigate={setActivePage}
                onNewTransaction={openNewTransaction}
              />
            ) : (
              <PaymentsList account={activeAccount} onNewTransaction={openNewTransaction} />
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
