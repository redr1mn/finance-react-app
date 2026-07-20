// Centralized mock data for the Personal Finance Dashboard.
// Each account/fund carries its own balance, summary stats, spend series,
// and transaction history so switching accounts instantly repopulates views.

export const accounts = [
  {
    id: 'main',
    name: 'Main Checking',
    owner: 'Alex Morgan',
    initials: 'AM',
    accent: 'bg-indigo-500',
    balance: 48250.75,
    monthlySpending: 3840.2,
    income: 6200.0,
    trend: { balance: 8.4, spending: -12.3 },
    series: [
      { month: 'Jan', spending: 2840, income: 5800 },
      { month: 'Feb', spending: 3120, income: 5800 },
      { month: 'Mar', spending: 2680, income: 6100 },
      { month: 'Apr', spending: 3420, income: 6100 },
      { month: 'May', spending: 3980, income: 6200 },
      { month: 'Jun', spending: 3560, income: 6200 },
      { month: 'Jul', spending: 3840, income: 6200 },
    ],
    transactions: [
      { date: '2026-07-15', description: 'Whole Foods Market', category: 'Groceries', amount: -142.30, status: 'Completed' },
      { date: '2026-07-14', description: 'Salary Deposit — Acme Corp', category: 'Income', amount: 6200.00, status: 'Completed' },
      { date: '2026-07-12', description: 'Shell Gas Station', category: 'Transport', amount: -58.40, status: 'Completed' },
      { date: '2026-07-10', description: 'Netflix Subscription', category: 'Entertainment', amount: -15.99, status: 'Completed' },
      { date: '2026-07-09', description: 'Uber Ride', category: 'Transport', amount: -22.75, status: 'Pending' },
      { date: '2026-07-07', description: 'Rent — Maple Apartments', category: 'Housing', amount: -1850.00, status: 'Completed' },
      { date: '2026-07-05', description: 'Spotify Premium', category: 'Entertainment', amount: -11.99, status: 'Completed' },
      { date: '2026-07-03', description: 'Transfer to Savings', category: 'Transfer', amount: -800.00, status: 'Pending' },
      { date: '2026-06-30', description: 'Costco Wholesale', category: 'Groceries', amount: -234.50, status: 'Completed' },
      { date: '2026-06-28', description: 'Electric Bill — ConEd', category: 'Utilities', amount: -128.40, status: 'Completed' },
    ],
  },
  {
    id: 'savings',
    name: 'High-Yield Savings',
    owner: 'Alex Morgan',
    initials: 'AM',
    accent: 'bg-emerald-500',
    balance: 126800.0,
    monthlySpending: 1200.0,
    income: 540.0,
    trend: { balance: 4.2, spending: 6.8 },
    series: [
      { month: 'Jan', spending: 900, income: 480 },
      { month: 'Feb', spending: 1050, income: 490 },
      { month: 'Mar', spending: 880, income: 500 },
      { month: 'Apr', spending: 1120, income: 510 },
      { month: 'May', spending: 980, income: 520 },
      { month: 'Jun', spending: 1140, income: 535 },
      { month: 'Jul', spending: 1200, income: 540 },
    ],
    transactions: [
      { date: '2026-07-14', description: 'Interest Payment', category: 'Income', amount: 540.00, status: 'Completed' },
      { date: '2026-07-11', description: 'Auto-Save Round-Up', category: 'Transfer', amount: 12.40, status: 'Completed' },
      { date: '2026-07-08', description: 'Emergency Fund Boost', category: 'Transfer', amount: 500.00, status: 'Completed' },
      { date: '2026-07-04', description: 'Vacation Fund Withdrawal', category: 'Travel', amount: -1200.00, status: 'Pending' },
      { date: '2026-06-30', description: 'Interest Payment', category: 'Income', amount: 535.00, status: 'Completed' },
      { date: '2026-06-22', description: 'Brokerage Deposit', category: 'Investment', amount: -1000.00, status: 'Completed' },
      { date: '2026-06-15', description: 'Auto-Save Round-Up', category: 'Transfer', amount: 8.75, status: 'Completed' },
    ],
  },
  {
    id: 'invest',
    name: 'Brokerage Portfolio',
    owner: 'Alex Morgan',
    initials: 'AM',
    accent: 'bg-amber-500',
    balance: 89320.4,
    monthlySpending: 2100.0,
    income: 1820.5,
    trend: { balance: 14.6, spending: -3.1 },
    series: [
      { month: 'Jan', spending: 1800, income: 980 },
      { month: 'Feb', spending: 1950, income: 1100 },
      { month: 'Mar', spending: 1700, income: 1240 },
      { month: 'Apr', spending: 2050, income: 1380 },
      { month: 'May', spending: 2200, income: 1520 },
      { month: 'Jun', spending: 2080, income: 1680 },
      { month: 'Jul', spending: 2100, income: 1820 },
    ],
    transactions: [
      { date: '2026-07-15', description: 'Dividend — VTI', category: 'Income', amount: 312.40, status: 'Completed' },
      { date: '2026-07-13', description: 'Buy — NVDA x2', category: 'Investment', amount: -1240.00, status: 'Completed' },
      { date: '2026-07-11', description: 'Dividend — AAPL', category: 'Income', amount: 86.50, status: 'Completed' },
      { date: '2026-07-09', description: 'Sell — TSLA x1', category: 'Investment', amount: 245.60, status: 'Pending' },
      { date: '2026-07-06', description: 'Buy — VOO x3', category: 'Investment', amount: -980.10, status: 'Completed' },
      { date: '2026-07-02', description: 'Dividend — SCHD', category: 'Income', amount: 148.20, status: 'Completed' },
      { date: '2026-06-29', description: 'Management Fee', category: 'Fees', amount: -45.00, status: 'Completed' },
      { date: '2026-06-26', description: 'Buy — MSFT x1', category: 'Investment', amount: -440.00, status: 'Completed' },
    ],
  },
];

export const formatCurrency = (value, opts = {}) => {
  const { signed = false } = opts;
  const abs = Math.abs(value).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  if (signed) {
    return `${value < 0 ? '−' : '+'}${abs}`;
  }
  return value < 0 ? `−${abs}` : abs;
};
