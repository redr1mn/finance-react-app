import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { accounts as initialAccounts, users as initialUsers } from '../data/accounts.js';

// Central Axios HTTP Client
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// Set to false when your real backend API is online
const USE_MOCK = true;

if (USE_MOCK) {
  let mockAccounts = initialAccounts.map((acc) => ({
    ...acc,
    transactions: acc.transactions.map((tx, tIdx) => ({
      id: `tx-${acc.id}-${tIdx + 1}`,
      ...tx,
      timestamp: `${tx.date}T${String(9 + (tIdx % 10)).padStart(2, '0')}:${String((tIdx * 17) % 60).padStart(2, '0')}:00.000Z`,
    })),
  }));

  const mock = new MockAdapter(apiClient, { delayResponse: 300 });

  // GET /api/accounts
  mock.onGet('/accounts').reply(200, { success: true, data: mockAccounts });

  // GET /api/users
  mock.onGet('/users').reply(200, { success: true, data: initialUsers });

  // POST /api/transactions
  mock.onPost('/transactions').reply((config) => {
    const { accountId, transaction } = JSON.parse(config.data);
    const newTx = {
      id: `tx-${accountId}-${Date.now()}`,
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0],
      ...transaction,
    };

    mockAccounts = mockAccounts.map((acc) => {
      if (acc.id !== accountId) return acc;
      return {
        ...acc,
        balance: acc.balance + newTx.amount,
        monthlySpending: newTx.amount < 0 ? acc.monthlySpending + Math.abs(newTx.amount) : acc.monthlySpending,
        transactions: [newTx, ...acc.transactions],
      };
    });

    return [201, { success: true, data: newTx }];
  });

  // PUT /api/budget
  mock.onPut('/budget').reply((config) => {
    const { accountId, budget } = JSON.parse(config.data);
    mockAccounts = mockAccounts.map((acc) =>
      acc.id === accountId ? { ...acc, budget } : acc
    );
    return [200, { success: true, data: budget }];
  });
}

export default apiClient;
