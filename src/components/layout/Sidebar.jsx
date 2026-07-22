import { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Home,
  CreditCard,
  Search,
  Plus,
  Trash2,
} from 'lucide-react';
import viteLogo from '../../assets/vite.svg';

const NAV = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'payments', label: 'Payments', icon: CreditCard },
];

/**
 * Persistent navigation sidebar for desktop screens.
 * Supports expanded and collapsed layout states, global transaction search,
 * main page switching, and user-account selection with mini budget indicators.
 *
 * @param {Object} props - Component properties.
 * @param {boolean} props.collapsed - Whether sidebar is currently collapsed.
 * @param {Function} props.onToggle - Sidebar collapse toggle callback.
 * @param {string} props.activePage - Currently active page view ID.
 * @param {Function} props.onNavigate - Page switching callback.
 * @param {Array<Object>} props.accounts - List of user account objects.
 * @param {Object} props.activeAccount - Currently selected account object.
 * @param {Function} props.onSelectAccount - Account selection callback.
 * @param {string} props.searchQuery - Current search query text.
 * @param {Function} props.onSearchChange - Search input change callback.
 * @param {Array<Object>} props.users - User profile list.
 * @param {Function} props.onEditBudget - Budget modal trigger callback.
 */
export default function Sidebar({
  collapsed,
  onToggle,
  activePage,
  onNavigate,
  accounts,
  activeAccount,
  onSelectAccount,
  searchQuery,
  onSearchChange,
  users,
  onEditBudget,
  onAddAccount,
  onDeleteAccount,
  currentUser,
  onOpenLoginPanel,
}) {
  return (
    <aside
      className={`relative hidden lg:flex h-screen shrink-0 flex-col border-r border-void-800 bg-void-950/80 backdrop-blur transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-64'
        }`}
    >
      {/* ── Logo / toggle ─────────────────────────────────────────── */}
      <div className="group/logo relative flex h-[64px] shrink-0 items-center px-4 border-b border-void-800/50">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="flex flex-1 items-center gap-3 text-left outline-none cursor-pointer group/brand"
          title="Go to Home"
        >
          <img
            src={viteLogo}
            alt="Lumen"
            className={`h-8 w-8 shrink-0 transition-transform group-hover/brand:scale-105 ${collapsed ? 'mx-auto' : ''}`}
          />
          {!collapsed && (
            <span className="truncate text-sm font-bold tracking-tight text-void-50 group-hover/brand:text-white transition-colors animate-fade-in">
              Lumen
            </span>
          )}
        </button>

        {/* Hover-revealed toggle button */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute right-[-13px] top-1/2 z-20 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-void-700 bg-void-900 text-void-400 opacity-0 shadow-lg transition-all duration-300 hover:border-violet-500 hover:text-violet-400 group-hover/logo:opacity-100 cursor-pointer"
        >
          {collapsed
            ? <ChevronRight size={12} className="translate-x-px" />
            : <ChevronLeft size={12} className="-translate-x-px" />}
        </button>
      </div>

      {/* ── Search bar ────────────────────────────────────────────── */}
      <div className="shrink-0 px-3 my-2.5">
        {collapsed ? (
          <button
            onClick={onToggle}
            title="Search — click to expand"
            className="flex h-9 w-full items-center justify-center rounded-xl border border-void-800 bg-void-900/60 text-void-500 transition hover:border-void-700 hover:text-void-200"
          >
            <Search size={15} />
          </button>
        ) : (
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-void-500" />
            <input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search transactions..."
              className="w-full rounded-xl border border-void-800 bg-void-900/60 h-9 pl-8 pr-3 text-xs font-semibold text-void-200 placeholder:text-void-500 outline-none transition focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
        )}
      </div>

      {/* ── Navigation ────────────────────────────────────────────── */}
      <nav className="shrink-0 flex flex-col gap-1 px-3">
        {NAV.map((item) => {
          const active = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : undefined}
              className={`group/nav relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${collapsed ? 'justify-center' : ''
                } ${active
                  ? 'bg-void-800/80 text-void-50 border border-void-700/30'
                  : 'text-void-400 hover:bg-void-800/40 hover:text-void-200'
                }`}
            >
              <item.icon
                size={18}
                className={`shrink-0 transition-colors ${active ? 'text-violet-400' : ''}`}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* ── Account section (flex-1 = fills remaining space) ─────── */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0 mt-4">
        {!collapsed ? (
          <div className="flex flex-col min-h-0 border-t border-void-800 px-3 pt-3 pb-2">
            <div className="flex items-center justify-between shrink-0 px-1 mb-2">
              <div className="flex items-center gap-1 min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-widest text-void-600 truncate">
                  Accounts
                </p>
                {currentUser && (
                  <span className="text-[9px] font-bold text-void-500 truncate">
                    ({accounts.filter((a) => a.userId === currentUser.id).length})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={onAddAccount}
                  title="Add new account"
                  className="text-[10px] font-medium text-void-600 hover:text-void-300 transition cursor-pointer"
                >
                  + Add
                </button>
                <button
                  onClick={onDeleteAccount}
                  title="Delete active account"
                  className="text-[10px] font-medium text-void-600 hover:text-rose-400/80 transition cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Scrollable account list */}
            <div className="overflow-y-auto flex-1 space-y-0.5 pr-0.5 -mr-0.5 custom-scrollbar">
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

                return (
                  <div
                    key={acc.id}
                    onClick={() => onSelectAccount(acc.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && onSelectAccount(acc.id)}
                    className={`group/acc cursor-pointer flex items-center gap-2 rounded-lg px-2 py-1.5 transition-all duration-150 ${
                      isActive
                        ? 'bg-void-800/80 text-void-50'
                        : 'text-void-400 hover:bg-void-800/40 hover:text-void-200'
                    }`}
                  >
                    <span
                      className={`h-6 w-6 shrink-0 rounded-md flex items-center justify-center ${acc.accent} text-[9px] font-bold text-white shadow-sm`}
                    >
                      {acc.initials}
                    </span>

                    <div className="min-w-0 flex-1">
                      <span className="block truncate text-[11px] font-semibold leading-tight">
                        {acc.name}
                      </span>
                      {/* Mini budget bar */}
                      {acc.budget && (
                        <div className="mt-0.5 h-[3px] w-full overflow-hidden rounded-full bg-void-700">
                          <div
                            className={`h-full rounded-full ${barColor}`}
                            style={{ width: `${spentPct}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Collapsed: active account badge → click to expand */
          <div className="flex justify-center pt-3 border-t border-void-800">
            <button
              onClick={onToggle}
              title={`${activeAccount.name} — expand to switch accounts`}
              className={`flex h-9 w-9 items-center justify-center rounded-xl ${activeAccount.accent} text-xs font-bold text-white shadow-md transition hover:opacity-90 active:scale-95`}
            >
              {activeAccount.initials}
            </button>
          </div>
        )}
      </div>

      {/* ── User Session Footer ─────── */}
      <div className="shrink-0 border-t border-void-800 p-3">
        <button
          onClick={onOpenLoginPanel}
          title="Account Login & User Profiles"
          className={`flex w-full items-center gap-2.5 rounded-xl border border-void-800 bg-void-900/60 p-2 text-left transition hover:border-violet-500/50 hover:bg-void-900 cursor-pointer active:scale-95 ${collapsed ? 'justify-center' : ''
            }`}
        >
          <span className={`h-7 w-7 shrink-0 rounded-lg ${currentUser?.avatar || 'bg-violet-600'} flex items-center justify-center text-xs font-bold text-white shadow-sm`}>
            {currentUser?.initials || 'U'}
          </span>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-void-50">
                {currentUser?.name || 'User Login'}
              </p>
              <p className="truncate text-[10px] font-medium text-void-500">
                Switch
              </p>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}