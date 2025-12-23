import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { MobileHeader } from './MobileHeader';
import { MobileBottomNav } from './MobileBottomNav';
import { MobileSidebar } from './MobileSidebar';
import { DashboardV2 } from './DashboardV2';
import { TransactionsPage } from './TransactionsPage';
import { BudgetPage } from './BudgetPage';
import { GoalsPage } from './GoalsPage';
import { AccountsPage } from './AccountsPage';
import { ReportsPage } from './ReportsPage';
import { SettingsPage } from './SettingsPage';
import {
  getAccounts,
  saveAccounts,
  getTransactions,
  saveTransactions,
  getGoals,
  saveGoals,
  getBudgets,
  saveBudgets,
  initializeDefaultAccounts,
} from '../../utils/localStorage';

interface MainLayoutProps {
  userName: string;
  onLogout: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  accountId: string;
  recurring?: boolean;
}

export interface Account {
  id: string;
  name: string;
  type: 'cash' | 'bank' | 'ewallet';
  balance: number;
  color: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  month: string;
}

export function MainLayout({ userName, onLogout, darkMode, toggleDarkMode }: MainLayoutProps) {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Load data from localStorage on mount
  const [accounts, setAccounts] = useState<Account[]>(() => initializeDefaultAccounts());
  const [transactions, setTransactions] = useState<Transaction[]>(() => getTransactions());
  const [goals, setGoals] = useState<Goal[]>(() => getGoals());
  const [budgets, setBudgets] = useState<Budget[]>(() => getBudgets());

  // Save to localStorage whenever data changes
  useEffect(() => {
    saveAccounts(accounts);
  }, [accounts]);

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    saveGoals(goals);
  }, [goals]);

  useEffect(() => {
    saveBudgets(budgets);
  }, [budgets]);

  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    };
    setTransactions([newTransaction, ...transactions]);
    
    // Update account balance
    const account = accounts.find(a => a.id === transaction.accountId);
    if (account) {
      const updatedAccounts = accounts.map(a => {
        if (a.id === transaction.accountId) {
          return {
            ...a,
            balance: transaction.type === 'income' 
              ? a.balance + transaction.amount 
              : a.balance - transaction.amount
          };
        }
        return a;
      });
      setAccounts(updatedAccounts);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
      // Restore account balance
      const updatedAccounts = accounts.map(a => {
        if (a.id === transaction.accountId) {
          return {
            ...a,
            balance: transaction.type === 'income' 
              ? a.balance - transaction.amount 
              : a.balance + transaction.amount
          };
        }
        return a;
      });
      setAccounts(updatedAccounts);
    }
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <DashboardV2 
            userName={userName}
            transactions={transactions}
            accounts={accounts}
            goals={goals}
            budgets={budgets}
            onAddTransaction={handleAddTransaction}
          />
        );
      case 'transactions':
        return (
          <TransactionsPage
            transactions={transactions}
            accounts={accounts}
            onAddTransaction={handleAddTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        );
      case 'budgets':
        return (
          <BudgetPage
            transactions={transactions}
            budgets={budgets}
            setBudgets={setBudgets}
          />
        );
      case 'goals':
        return (
          <GoalsPage
            goals={goals}
            setGoals={setGoals}
          />
        );
      case 'accounts':
        return (
          <AccountsPage
            accounts={accounts}
            setAccounts={setAccounts}
            transactions={transactions}
          />
        );
      case 'reports':
        return (
          <ReportsPage
            transactions={transactions}
            accounts={accounts}
          />
        );
      case 'settings':
        return (
          <SettingsPage
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
          />
        );
      default:
        return (
          <DashboardV2 
            userName={userName}
            transactions={transactions}
            accounts={accounts}
            goals={goals}
            budgets={budgets}
            onAddTransaction={handleAddTransaction}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onLogout={onLogout}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        userName={userName}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={onLogout}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        {/* Mobile Header */}
        <MobileHeader
          userName={userName}
          onMenuClick={() => setMobileSidebarOpen(true)}
          darkMode={darkMode}
        />

        {/* Page Content */}
        <div className="flex-1 overflow-auto pb-20 md:pb-0">
          {renderPage()}
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav
          currentPage={currentPage}
          onNavigate={setCurrentPage}
        />
      </div>
    </div>
  );
}