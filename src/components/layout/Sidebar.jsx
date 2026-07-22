import { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Home,
  CreditCard,
  Search,
} from 'lucide-react';
import viteLogo from '../../assets/vite.svg';

const NAV = [
  { id: 'home',     label: 'Home',     icon: Home },
  { id: 'payments', label: 'Payments', icon: CreditCard },
];

/**
 * Sidebar — persistent, collapsible.
 * Expanded: grouped user → account list with per-account budget gear.
 * Collapsed: active account badge (click to expand).
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
}) {
  return (
    <aside
      className={`relative hidden lg:flex h-screen shrink-0 flex-col border-r border-void-800 bg-void-950/80 backdrop-blur transition-all duration-300 ${
        collapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      {/* ── Logo / toggle ─────────────────────────────────────────── */}
      <div className="group/logo relative flex h-[64px] shrink-0 items-center px-4 border-b border-void-800/50">
        <div className="flex flex-1 items-center gap-3">
          <img
            src={viteLogo}
            alt="Lumen"
            className={`h-8 w-8 shrink-0 ${collapsed ? 'mx-auto' : ''}`}
          />
          {!collapsed && (
            <span className="truncate text-sm font-bold tracking-tight text-void-50 animate-fade-in">
              Lumen
            </span>
          )}
        </div>

        {/* Hover-revealed toggle button */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute right-[-13px] top-1/2 z-20 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-void-700 bg-void-900 text-void-400 opacity-0 shadow-lg transition-all duration-300 hover:border-violet-500 hover:text-violet-400 group-hover/logo:opacity-100 cursor-pointer"
        >
          {collapsed
            ? <ChevronRight size={12} className="translate-x-px" />
            : <ChevronLeft  size={12} className="-translate-x-px" />}
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
              className={`group/nav relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                collapsed ? 'justify-center' : ''
              } ${
                active
                  ? 'bg-void-800/80 text-void-50 border border-void-700/30'
                  : 'text-void-400 hover:bg-void-800/40 hover:text-void-200'
              }`}
            >
              <span
                className={`absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-violet-400 transition-all duration-300 ${
                  active ? 'opacity-100' : 'opacity-0'
                }`}
              />
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
            <p className="shrink-0 px-1 mb-2 text-[9px] font-bold uppercase tracking-widest text-void-600">
              Accounts
            </p>

            {/* Scrollable account list */}
            <div className="overflow-y-auto flex-1 space-y-0.5 pr-0.5 -mr-0.5">
              {users.map((user) => {
                const userAccounts = accounts.filter((a) => a.userId === user.id);
                return (
                  <div key={user.id} className="mb-1.5">
                    {/* User header */}
                    <div className="flex items-center gap-1.5 px-1.5 py-0.5 mb-0.5">
                      <span
                        className={`h-4 w-4 shrink-0 rounded-full ${user.avatar} flex items-center justify-center text-[8px] font-bold text-white`}
                      >
                        {user.initials[0]}
                      </span>
                      <span className="text-[10px] font-semibold text-void-500 truncate">
                        {user.name}
                      </span>
                    </div>

                    {/* Account rows */}
                    {userAccounts.map((acc) => {
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

                          {isActive && (
                            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shrink-0" />
                          )}
                        </div>
                      );
                    })}
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
    </aside>
  );
}
