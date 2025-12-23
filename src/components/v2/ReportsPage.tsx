import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Download, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  PieChart as PieChartIcon
} from 'lucide-react';
import { Transaction, Account } from './MainLayout';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

interface ReportsPageProps {
  transactions: Transaction[];
  accounts: Account[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export function ReportsPage({ transactions, accounts }: ReportsPageProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netIncome = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((netIncome / totalIncome) * 100) : 0;

  // Monthly data
  const monthlyData = transactions.reduce((acc: any, t) => {
    const month = new Date(t.date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
    if (!acc[month]) {
      acc[month] = { month, Pemasukan: 0, Pengeluaran: 0 };
    }
    if (t.type === 'income') {
      acc[month].Pemasukan += t.amount;
    } else {
      acc[month].Pengeluaran += t.amount;
    }
    return acc;
  }, {});

  const chartData = Object.values(monthlyData);

  // Category breakdown for expenses
  const expenseByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: any, t) => {
      if (!acc[t.category]) {
        acc[t.category] = { name: t.category, value: 0 };
      }
      acc[t.category].value += t.amount;
      return acc;
    }, {});

  const expenseData = Object.values(expenseByCategory);
  const totalExpenseForPie = expenseData.reduce((sum: number, cat: any) => sum + cat.value, 0);

  // Income by category
  const incomeByCategory = transactions
    .filter(t => t.type === 'income')
    .reduce((acc: any, t) => {
      if (!acc[t.category]) {
        acc[t.category] = { name: t.category, value: 0 };
      }
      acc[t.category].value += t.amount;
      return acc;
    }, {});

  const incomeData = Object.values(incomeByCategory);

  // Top categories
  const topExpenseCategories = Object.entries(expenseByCategory)
    .sort(([, a]: any, [, b]: any) => b.value - a.value)
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 dark:text-white">Laporan Keuangan</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Analisis komprehensif keuangan Anda
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Pemasukan</p>
            <p className="text-gray-900 dark:text-white">{formatCurrency(totalIncome)}</p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Pengeluaran</p>
            <p className="text-gray-900 dark:text-white">{formatCurrency(totalExpense)}</p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Saldo Bersih</p>
            <p className={`${netIncome >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {formatCurrency(netIncome)}
            </p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <PieChartIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Rasio Tabungan</p>
            <p className="text-gray-900 dark:text-white">{savingsRate.toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">Tren Bulanan</CardTitle>
          <CardDescription className="dark:text-gray-400">
            Perbandingan pemasukan dan pengeluaran per bulan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ 
                  background: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="Pemasukan" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="Pengeluaran" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Distribution */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Distribusi Pengeluaran</CardTitle>
            <CardDescription className="dark:text-gray-400">
              Pengeluaran berdasarkan kategori
            </CardDescription>
          </CardHeader>
          <CardContent>
            {expenseData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.name} (${((entry.value / totalExpenseForPie) * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ 
                      background: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-12">
                Tidak ada data pengeluaran
              </p>
            )}
          </CardContent>
        </Card>

        {/* Top Categories */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Kategori Pengeluaran Terbesar</CardTitle>
            <CardDescription className="dark:text-gray-400">
              5 kategori dengan pengeluaran tertinggi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topExpenseCategories.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  Tidak ada data
                </p>
              ) : (
                topExpenseCategories.map(([category, data]: any, index) => {
                  const percentage = ((data.value / totalExpense) * 100).toFixed(1);
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-gray-900 dark:text-white">{category}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {percentage}% dari total
                            </p>
                          </div>
                        </div>
                        <p className="text-red-600 dark:text-red-400">
                          {formatCurrency(data.value)}
                        </p>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Statistics */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">Ringkasan Statistik</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Transaksi</p>
              <p className="text-gray-900 dark:text-white mt-1">{transactions.length}</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Transaksi Masuk</p>
              <p className="text-green-600 dark:text-green-400 mt-1">
                {transactions.filter(t => t.type === 'income').length}
              </p>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Transaksi Keluar</p>
              <p className="text-red-600 dark:text-red-400 mt-1">
                {transactions.filter(t => t.type === 'expense').length}
              </p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Rata-rata per Transaksi</p>
              <p className="text-blue-600 dark:text-blue-400 mt-1 text-sm">
                {transactions.length > 0 
                  ? formatCurrency(transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length)
                  : formatCurrency(0)
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
