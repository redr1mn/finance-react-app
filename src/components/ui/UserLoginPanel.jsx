import { useState } from 'react';
import { X, UserCheck, ShieldCheck, Check, Key, Loader2, UserPlus, ArrowLeft } from 'lucide-react';
import { formatCurrency } from '../../data/accounts';

const AVATAR_OPTIONS = [
  { label: 'Violet', value: 'bg-violet-600' },
  { label: 'Emerald', value: 'bg-emerald-600' },
  { label: 'Amber', value: 'bg-amber-500' },
  { label: 'Sky', value: 'bg-sky-600' },
  { label: 'Rose', value: 'bg-rose-600' },
];

/**
 * User Account Login Panel modal component.
 * Facilitates session overview, switching active user accounts, importing account credentials,
 * and inline account registration.
 *
 * @param {Object} props
 * @param {boolean} props.open - Modal visibility state.
 * @param {Object} props.currentUser - Active user profile object.
 * @param {Array<Object>} props.users - List of registered user profiles.
 * @param {Array<Object>} props.accounts - List of all user accounts in application state.
 * @param {Function} props.onClose - Modal dismissal handler.
 * @param {Function} props.onSelectUser - Callback when switching active user.
 * @param {Function} props.onRegisterUser - Callback when adding a new user profile.
 */
export default function UserLoginPanel({
  open,
  currentUser,
  users,
  accounts,
  onClose,
  onSelectUser,
  onRegisterUser,
}) {
  const [tab, setTab] = useState('switch'); // 'switch' | 'import'
  const [importMode, setImportMode] = useState('login'); // 'login' | 'register'

  // Import / Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Profile details state
  const [fullName, setFullName] = useState('');
  const [initials, setInitials] = useState('');
  const [avatar, setAvatar] = useState('bg-violet-600');

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  const currentAccounts = accounts.filter((a) => a.userId === currentUser.id);
  const totalBalance = currentAccounts.reduce((sum, a) => sum + (a.balance || 0), 0);

  const handleImportSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setFormError('Please enter both username and password.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      // Search matching profile or create imported session
      const foundUser = users.find(
        (u) => u.name.toLowerCase() === username.trim().toLowerCase(),
      );

      if (foundUser) {
        onSelectUser(foundUser);
      } else {
        const cleanName = username.trim();
        const computedInitials = cleanName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);

        const importedUser = {
          id: `imported-${Date.now().toString(36)}`,
          name: cleanName,
          initials: computedInitials || 'IMP',
          avatar: 'bg-emerald-600',
        };
        onRegisterUser(importedUser);
      }

      resetForm();
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim() || !fullName.trim()) {
      setFormError('Please fill in username, password, and full name.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match. Please verify password.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const computedInitials = initials.trim()
        ? initials.trim().toUpperCase()
        : fullName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);

      const newUser = {
        id: `user-${Date.now().toString(36)}`,
        name: fullName.trim(),
        initials: computedInitials || 'US',
        avatar,
      };

      onRegisterUser(newUser);
      resetForm();
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setInitials('');
    setFormError('');
    setImportMode('login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar rounded-2xl border border-void-700 bg-void-900 shadow-2xl shadow-black/80">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-void-800 px-4 sm:px-5 py-3.5 sm:py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30">
              <ShieldCheck size={18} />
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-void-50">User Account Login</h2>
              <p className="text-xs font-medium text-void-500">Manage user profile sessions</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-void-400 transition hover:bg-void-800 hover:text-void-200 active:scale-95 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Active Session Overview Card */}
        <div className="border-b border-void-800 bg-void-950/60 px-4 sm:px-5 py-3.5 sm:py-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-void-500 mb-2">
            Current Active Session
          </p>
          <div className="flex items-center justify-between rounded-xl border border-void-800 bg-void-900 p-3">
            <div className="flex items-center gap-3">
              <span className={`h-10 w-10 shrink-0 rounded-xl ${currentUser.avatar} flex items-center justify-center text-sm font-bold text-white shadow-md`}>
                {currentUser.initials}
              </span>
              <div>
                <p className="text-sm font-bold text-void-50">{currentUser.name}</p>
                <p className="text-xs font-medium text-void-400">
                  {currentAccounts.length} accounts · Net Balance: {formatCurrency(totalBalance)}
                </p>
              </div>
            </div>
            <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
              <Check size={11} />
              Active
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-2 border-b border-void-800 bg-void-950/40 p-1.5 gap-1 px-3 sm:px-4">
          <button
            type="button"
            onClick={() => setTab('switch')}
            className={`flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold transition cursor-pointer ${tab === 'switch'
              ? 'bg-void-800 text-void-50 border border-void-700/50 shadow-sm'
              : 'text-void-400 hover:text-void-200'
              }`}
          >
            <UserCheck size={14} />
            Switch Session
          </button>
          <button
            type="button"
            onClick={() => { setTab('import'); setImportMode('login'); setFormError(''); }}
            className={`flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold transition cursor-pointer ${tab === 'import'
              ? 'bg-void-800 text-void-50 border border-void-700/50 shadow-sm'
              : 'text-void-400 hover:text-void-200'
              }`}
          >
            <Key size={14} />
            Import Account
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-4 sm:p-5">
          {tab === 'switch' && (
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
              {users.map((user) => {
                const isActive = user.id === currentUser.id;
                const userAccs = accounts.filter((a) => a.userId === user.id);
                const userNet = userAccs.reduce((sum, a) => sum + (a.balance || 0), 0);

                return (
                  <div
                    key={user.id}
                    onClick={() => {
                      onSelectUser(user);
                      onClose();
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && (onSelectUser(user), onClose())}
                    className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-all duration-150 ${isActive
                      ? 'border-violet-500/50 bg-violet-500/10 text-void-50 ring-1 ring-violet-500/30'
                      : 'border-void-800 bg-void-950/50 text-void-300 hover:border-void-700 hover:bg-void-800/50'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`h-9 w-9 shrink-0 rounded-xl ${user.avatar} flex items-center justify-center text-xs font-bold text-white shadow-sm`}>
                        {user.initials}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-void-50">{user.name}</p>
                        <p className="text-[11px] text-void-400">
                          {userAccs.length} accounts · {formatCurrency(userNet)}
                        </p>
                      </div>
                    </div>
                    {isActive ? (
                      <span className="text-[11px] font-bold text-violet-400">Logged In</span>
                    ) : (
                      <span className="text-[11px] font-semibold text-void-500 hover:text-void-200">Switch →</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {tab === 'import' && importMode === 'login' && (
            <form onSubmit={handleImportSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-void-500">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. alex_rivera"
                  className="w-full rounded-xl border border-void-800 bg-void-950/60 px-3.5 py-2.5 text-xs font-semibold text-void-200 placeholder:text-void-500 outline-none transition focus:border-violet-500/60"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-void-500">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-void-800 bg-void-950/60 px-3.5 py-2.5 text-xs font-semibold text-void-200 placeholder:text-void-500 outline-none transition focus:border-violet-500/60"
                />

                {/* Register an account link directly under password field */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] font-medium text-void-500">Don't have an account?</span>
                  <button
                    type="button"
                    onClick={() => { setImportMode('register'); setFormError(''); }}
                    className="text-[11px] font-semibold text-violet-400 hover:text-violet-300 cursor-pointer flex items-center gap-1"
                  >
                    <UserPlus size={12} />
                    Register
                  </button>
                </div>
              </div>

              {formError && (
                <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-400">
                  {formError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-2.5 text-xs font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:bg-violet-700 active:scale-95 cursor-pointer disabled:opacity-50 min-h-[38px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Importing Account...</span>
                  </>
                ) : (
                  <span>Import Account</span>
                )}
              </button>
            </form>
          )}

          {tab === 'import' && importMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="flex items-center justify-between pb-1">
                <h3 className="text-xs font-bold text-void-100 flex items-center gap-1.5">
                  <UserPlus size={14} className="text-violet-400" />
                  Register an Account
                </h3>
                <button
                  type="button"
                  onClick={() => { setImportMode('login'); setFormError(''); }}
                  className="text-[11px] font-semibold text-void-400 hover:text-void-200 cursor-pointer flex items-center gap-1"
                >
                  <ArrowLeft size={12} />
                  Already have one?
                </button>
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-void-500">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. sam_rivera"
                  className="w-full rounded-xl border border-void-800 bg-void-950/60 px-3 py-2 text-xs font-semibold text-void-200 placeholder:text-void-500 outline-none transition focus:border-violet-500/60"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-void-500">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-void-800 bg-void-950/60 px-3 py-2 text-xs font-semibold text-void-200 placeholder:text-void-500 outline-none transition focus:border-violet-500/60"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-void-500">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-void-800 bg-void-950/60 px-3 py-2 text-xs font-semibold text-void-200 placeholder:text-void-500 outline-none transition focus:border-violet-500/60"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-void-500">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sam Rivera"
                  className="w-full rounded-xl border border-void-800 bg-void-950/60 px-3 py-2 text-xs font-semibold text-void-200 placeholder:text-void-500 outline-none transition focus:border-violet-500/60"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-void-500">
                    Initials (Optional)
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={initials}
                    onChange={(e) => setInitials(e.target.value)}
                    placeholder="SR"
                    className="w-full rounded-xl border border-void-800 bg-void-950/60 px-3 py-2 text-xs font-semibold text-void-200 placeholder:text-void-500 outline-none transition focus:border-violet-500/60"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-void-500">
                    Avatar Theme
                  </label>
                  <div className="flex items-center gap-1.5 pt-1">
                    {AVATAR_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setAvatar(opt.value)}
                        className={`h-5 w-5 rounded-md ${opt.value} transition cursor-pointer ${avatar === opt.value ? 'ring-2 ring-white ring-offset-1 ring-offset-void-900' : 'opacity-60'
                          }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {formError && (
                <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-400">
                  {formError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-2.5 text-xs font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:bg-violet-700 active:scale-95 cursor-pointer disabled:opacity-50 min-h-[38px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Registering Account...</span>
                  </>
                ) : (
                  <span>Register & Log In</span>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-void-800 px-4 sm:px-5 py-3.5 bg-void-950/40">
          <span className="text-[11px] font-medium text-void-500">
            Session Secured
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-void-800 bg-void-900 px-4 py-2 text-xs font-semibold text-void-300 transition hover:bg-void-800 active:scale-95 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
