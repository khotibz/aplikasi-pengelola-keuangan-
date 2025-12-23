import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Download,
  DollarSign,
  PieChart
} from 'lucide-react';
import { Transaction } from './Dashboard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useState } from 'react';

interface FinancialReportProps {
  transactions: Transaction[];
}

export function FinancialReport({ transactions }: FinancialReportProps) {
  const [selectedMonth, setSelectedMonth] = useState('all');

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

  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100) : 0;

  // Prepare monthly data
  const monthlyData = transactions.reduce((acc: any, t) => {
    const month = new Date(t.date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
    if (!acc[month]) {
      acc[month] = { month, income: 0, expense: 0 };
    }
    if (t.type === 'income') {
      acc[month].income += t.amount;
    } else {
      acc[month].expense += t.amount;
    }
    return acc;
  }, {});

  const chartData = Object.values(monthlyData);

  // Category breakdown
  const categoryBreakdown = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: any, t) => {
      if (!acc[t.category]) {
        acc[t.category] = 0;
      }
      acc[t.category] += t.amount;
      return acc;
    }, {});

  const topExpenseCategories = Object.entries(categoryBreakdown)
    .sort(([, a]: any, [, b]: any) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Laporan Keuangan</CardTitle>
              <CardDescription>Analisis keuangan periode berjalan</CardDescription>
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pemasukan</p>
                <p className="text-gray-900 mt-1">{formatCurrency(totalIncome)}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pengeluaran</p>
                <p className="text-gray-900 mt-1">{formatCurrency(totalExpense)}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-full">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">Saldo Bersih</p>
                <p className="text-gray-900 mt-1">{formatCurrency(totalIncome - totalExpense)}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">Rasio Tabungan</p>
                <p className="text-gray-900 mt-1">{savingsRate.toFixed(1)}%</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <PieChart className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Tren Bulanan</CardTitle>
          <CardDescription>Perbandingan pemasukan dan pengeluaran per bulan</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ background: 'white', border: '1px solid #e5e7eb' }}
              />
              <Legend />
              <Bar dataKey="income" fill="#10b981" name="Pemasukan" />
              <Bar dataKey="expense" fill="#ef4444" name="Pengeluaran" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Expense Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Kategori Pengeluaran Terbesar</CardTitle>
          <CardDescription>5 kategori dengan pengeluaran tertinggi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topExpenseCategories.map(([category, amount]: any, index) => {
              const percentage = (amount / totalExpense * 100).toFixed(1);
              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-gray-900">{category}</p>
                        <p className="text-sm text-gray-600">{percentage}% dari total pengeluaran</p>
                      </div>
                    </div>
                    <p className="text-red-600">{formatCurrency(amount)}</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Transaksi</p>
              <p className="text-gray-900 mt-1">{transactions.length}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Transaksi Masuk</p>
              <p className="text-green-600 mt-1">
                {transactions.filter(t => t.type === 'income').length}
              </p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600">Transaksi Keluar</p>
              <p className="text-red-600 mt-1">
                {transactions.filter(t => t.type === 'expense').length}
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Rata-rata Transaksi</p>
              <p className="text-blue-600 mt-1">
                {formatCurrency(
                  transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
