import apiClient from './apiClient';

/** Fetch all accounts via Axios */
export async function getAccounts() {
  const response = await apiClient.get('/accounts');
  return response.data.data;
}

/** Fetch all registered users via Axios */
export async function getUsers() {
  const response = await apiClient.get('/users');
  return response.data.data;
}

/** Post a new transaction via Axios */
export async function createTransaction(accountId, transaction) {
  const response = await apiClient.post('/transactions', { accountId, transaction });
  return response.data.data;
}

/** Update account budget via Axios */
export async function updateAccountBudget(accountId, budget) {
  const response = await apiClient.put('/budget', { accountId, budget });
  return response.data.data;
}
