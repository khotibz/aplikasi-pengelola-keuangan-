import { Transaction, Account, Goal, Budget } from '../components/v2/MainLayout';

const STORAGE_KEYS = {
  USER: 'finance_app_user',
  ACCOUNTS: 'finance_app_accounts',
  TRANSACTIONS: 'finance_app_transactions',
  GOALS: 'finance_app_goals',
  BUDGETS: 'finance_app_budgets',
  DARK_MODE: 'finance_app_dark_mode',
};

export interface User {
  email: string;
  name: string;
  createdAt: string;
}

// User Management
export const saveUser = (user: User) => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const getUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEYS.USER);
  return data ? JSON.parse(data) : null;
};

export const removeUser = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// Accounts
export const saveAccounts = (accounts: Account[]) => {
  localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
};

export const getAccounts = (): Account[] => {
  const data = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
  return data ? JSON.parse(data) : [];
};

// Transactions
export const saveTransactions = (transactions: Transaction[]) => {
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
};

export const getTransactions = (): Transaction[] => {
  const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  return data ? JSON.parse(data) : [];
};

// Goals
export const saveGoals = (goals: Goal[]) => {
  localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
};

export const getGoals = (): Goal[] => {
  const data = localStorage.getItem(STORAGE_KEYS.GOALS);
  return data ? JSON.parse(data) : [];
};

// Budgets
export const saveBudgets = (budgets: Budget[]) => {
  localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
};

export const getBudgets = (): Budget[] => {
  const data = localStorage.getItem(STORAGE_KEYS.BUDGETS);
  return data ? JSON.parse(data) : [];
};

// Dark Mode
export const saveDarkMode = (darkMode: boolean) => {
  localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(darkMode));
};

export const getDarkMode = (): boolean => {
  const data = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
  return data ? JSON.parse(data) : false;
};

// Clear all data (for logout)
export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

// Initialize default accounts if none exist
export const initializeDefaultAccounts = (): Account[] => {
  const existingAccounts = getAccounts();
  if (existingAccounts.length === 0) {
    const defaultAccounts: Account[] = [
      { id: '1', name: 'Dompet Utama', type: 'cash', balance: 0, color: '#3b82f6' },
      { id: '2', name: 'Bank BCA', type: 'bank', balance: 0, color: '#10b981' },
      { id: '3', name: 'GoPay', type: 'ewallet', balance: 0, color: '#f59e0b' },
    ];
    saveAccounts(defaultAccounts);
    return defaultAccounts;
  }
  return existingAccounts;
};
