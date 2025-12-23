import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  CreditCard
} from 'lucide-react';
import { Transaction, Account, Goal, Budget } from './MainLayout';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { useState } from 'react';
import { AddTransactionDialog } from './AddTransactionDialog';
import { FloatingActionButton } from './FloatingActionButton';

interface DashboardV2Props {
  userName: string;
  transactions: Transaction[];
  accounts: Account[];
  goals: Goal[];
  budgets: Budget[];
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export function DashboardV2({ 
  userName, 
  transactions, 
  accounts, 
  goals, 
  budgets,
  onAddTransaction 
}: DashboardV2Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const thisMonthIncome = transactions
    .filter(t => {
      const date = new Date(t.date);
      const now = new Date();
      return t.type === 'income' && 
        date.getMonth() === now.getMonth() && 
        date.getFullYear() === now.getFullYear();
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const thisMonthExpense = transactions
    .filter(t => {
      const date = new Date(t.date);
      const now = new Date();
      return t.type === 'expense' && 
        date.getMonth() === now.getMonth() && 
        date.getFullYear() === now.getFullYear();
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const recentTransactions = transactions.slice(0, 5);

  const calculateSpent = (category: string) => {
    return transactions
      .filter(t => t.type === 'expense' && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 dark:bg-gray-900">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 dark:text-white text-xl md:text-2xl">Selamat Datang, {userName}!</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
          Berikut ringkasan keuangan Anda hari ini
        </p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-0">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <Wallet className="w-5 h-5" />
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                Total
              </Badge>
            </div>
            <p className="text-white/80 text-sm mb-1">Saldo Total</p>
            <p className="text-white">{formatCurrency(totalBalance)}</p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pemasukan Bulan Ini</p>
            <p className="text-gray-900 dark:text-white">{formatCurrency(thisMonthIncome)}</p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              Total: {formatCurrency(totalIncome)}
            </p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pengeluaran Bulan Ini</p>
            <p className="text-gray-900 dark:text-white">{formatCurrency(thisMonthExpense)}</p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-2 flex items-center">
              <ArrowDownRight className="w-3 h-3 mr-1" />
              Total: {formatCurrency(totalExpense)}
            </p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Target Aktif</p>
            <p className="text-gray-900 dark:text-white">{goals.length} Target</p>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
              {goals.filter(g => (g.currentAmount / g.targetAmount) * 100 >= 100).length} tercapai
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <Card className="lg:col-span-2 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="dark:text-white">Transaksi Terbaru</CardTitle>
              <Button variant="ghost" size="sm">Lihat Semua</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  Belum ada transaksi
                </p>
              ) : (
                recentTransactions.map((transaction) => {
                  const account = accounts.find(a => a.id === transaction.accountId);
                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-900/50 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          transaction.type === 'income' 
                            ? 'bg-green-100 dark:bg-green-900/30' 
                            : 'bg-red-100 dark:bg-red-900/30'
                        }`}>
                          {transaction.type === 'income' ? (
                            <ArrowUpRight className="w-4 h-4 text-green-600 dark:text-green-400" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-red-600 dark:text-red-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-gray-900 dark:text-white">{transaction.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-400">
                              {transaction.category}
                            </Badge>
                            {account && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                • {account.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`${
                          transaction.type === 'income' 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(transaction.date).toLocaleDateString('id-ID', { 
                            day: 'numeric', 
                            month: 'short' 
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Accounts & Goals */}
        <div className="space-y-6">
          {/* Accounts */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Akun</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {accounts.slice(0, 3).map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ backgroundColor: `${account.color}10` }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: account.color }}
                    >
                      <CreditCard className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">{account.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {account.type}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-900 dark:text-white">
                    {formatCurrency(account.balance)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top Goal */}
          {goals.length > 0 && (
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Target Prioritas</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const topGoal = goals[0];
                  const percentage = (topGoal.currentAmount / topGoal.targetAmount) * 100;
                  return (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{topGoal.icon}</span>
                        <div className="flex-1">
                          <p className="text-gray-900 dark:text-white">{topGoal.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatCurrency(topGoal.currentAmount)} / {formatCurrency(topGoal.targetAmount)}
                          </p>
                        </div>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {percentage.toFixed(0)}% tercapai
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          Deadline: {new Date(topGoal.deadline).toLocaleDateString('id-ID', { 
                            day: 'numeric', 
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Budget Progress */}
      {budgets.length > 0 && (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Progress Budget Bulan Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {budgets.map((budget) => {
                const spent = calculateSpent(budget.category);
                const percentage = Math.min((spent / budget.limit) * 100, 100);
                const isOverBudget = spent > budget.limit;

                return (
                  <div key={budget.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-900 dark:text-white">{budget.category}</p>
                      {isOverBudget && (
                        <Badge variant="destructive" className="text-xs">
                          Over
                        </Badge>
                      )}
                    </div>
                    <Progress 
                      value={percentage} 
                      className={`h-2 ${isOverBudget ? 'bg-red-100 dark:bg-red-900/30' : ''}`}
                    />
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">
                        {formatCurrency(spent)}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {formatCurrency(budget.limit)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <AddTransactionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAdd={onAddTransaction}
        accounts={accounts}
      />

      <FloatingActionButton
        onClick={() => setIsDialogOpen(true)}
      />
    </div>
  );
}