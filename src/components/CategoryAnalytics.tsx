import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { Transaction } from './Dashboard';
import { 
  ShoppingBag, 
  Car, 
  UtensilsCrossed, 
  Gamepad2, 
  Heart,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface CategoryAnalyticsProps {
  transactions: Transaction[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

const categoryIcons: any = {
  'Makanan': UtensilsCrossed,
  'Transport': Car,
  'Belanja': ShoppingBag,
  'Hiburan': Gamepad2,
  'Kesehatan': Heart,
};

export function CategoryAnalytics({ transactions }: CategoryAnalyticsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Expense by category
  const expenseByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: any, t) => {
      if (!acc[t.category]) {
        acc[t.category] = { name: t.category, value: 0, count: 0 };
      }
      acc[t.category].value += t.amount;
      acc[t.category].count += 1;
      return acc;
    }, {});

  const expenseData = Object.values(expenseByCategory);
  const totalExpense = expenseData.reduce((sum: number, cat: any) => sum + cat.value, 0);

  // Income by category
  const incomeByCategory = transactions
    .filter(t => t.type === 'income')
    .reduce((acc: any, t) => {
      if (!acc[t.category]) {
        acc[t.category] = { name: t.category, value: 0, count: 0 };
      }
      acc[t.category].value += t.amount;
      acc[t.category].count += 1;
      return acc;
    }, {});

  const incomeData = Object.values(incomeByCategory);
  const totalIncome = incomeData.reduce((sum: number, cat: any) => sum + cat.value, 0);

  // Combined data for comparison
  const allCategories = [...new Set([...expenseData.map((e: any) => e.name), ...incomeData.map((i: any) => i.name)])];
  const comparisonData = allCategories.map(cat => {
    const expense = expenseByCategory[cat]?.value || 0;
    const income = incomeByCategory[cat]?.value || 0;
    return {
      category: cat,
      Pengeluaran: expense,
      Pemasukan: income
    };
  });

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <Card>
        <CardHeader>
          <CardTitle>Analitik Kategori</CardTitle>
          <CardDescription>Analisis mendalam per kategori transaksi</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Pengeluaran</CardTitle>
            <CardDescription>Pengeluaran berdasarkan kategori</CardDescription>
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
                    label={(entry: any) => `${entry.name} (${((entry.value / totalExpense) * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ background: 'white', border: '1px solid #e5e7eb' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-12">Tidak ada data pengeluaran</p>
            )}
          </CardContent>
        </Card>

        {/* Income Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Pemasukan</CardTitle>
            <CardDescription>Pemasukan berdasarkan kategori</CardDescription>
          </CardHeader>
          <CardContent>
            {incomeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={incomeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.name} (${((entry.value / totalIncome) * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {incomeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ background: 'white', border: '1px solid #e5e7eb' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-12">Tidak ada data pemasukan</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Category Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Perbandingan Kategori</CardTitle>
          <CardDescription>Pemasukan vs Pengeluaran per kategori</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ background: 'white', border: '1px solid #e5e7eb' }}
              />
              <Legend />
              <Bar dataKey="Pemasukan" fill="#10b981" />
              <Bar dataKey="Pengeluaran" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category Details */}
      <Card>
        <CardHeader>
          <CardTitle>Detail Kategori Pengeluaran</CardTitle>
          <CardDescription>Analisis rinci untuk setiap kategori</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expenseData.map((category: any, index) => {
              const Icon = categoryIcons[category.name] || ShoppingBag;
              const percentage = (category.value / totalExpense * 100).toFixed(1);
              const avgTransaction = category.value / category.count;

              return (
                <Card key={category.name} className="border-l-4" style={{ borderLeftColor: COLORS[index % COLORS.length] }}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="p-3 rounded-full"
                          style={{ backgroundColor: `${COLORS[index % COLORS.length]}20` }}
                        >
                          <Icon className="w-5 h-5" style={{ color: COLORS[index % COLORS.length] }} />
                        </div>
                        <div>
                          <h3 className="text-gray-900">{category.name}</h3>
                          <p className="text-sm text-gray-600">{category.count} transaksi</p>
                        </div>
                      </div>
                      <Badge style={{ backgroundColor: COLORS[index % COLORS.length] }} className="text-white">
                        {percentage}%
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <Progress value={parseFloat(percentage)} className="h-2" />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-600">Total Pengeluaran</p>
                          <p className="text-gray-900 mt-1">{formatCurrency(category.value)}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-600">Rata-rata per Transaksi</p>
                          <p className="text-gray-900 mt-1">{formatCurrency(avgTransaction)}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Wawasan Keuangan</CardTitle>
          <CardDescription>Rekomendasi berdasarkan pola pengeluaran Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {expenseData.length > 0 && (
              <>
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-gray-900">Kategori Pengeluaran Terbesar</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Kategori <span className="font-semibold">{(expenseData[0] as any).name}</span> adalah pengeluaran terbesar Anda dengan total {formatCurrency((expenseData[0] as any).value)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                  <ArrowUpRight className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-gray-900">Peluang Penghematan</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Pertimbangkan untuk mengurangi pengeluaran di kategori dengan persentase tertinggi untuk meningkatkan tabungan
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                  <Heart className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-gray-900">Saran Pengelolaan</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Atur budget untuk setiap kategori agar pengeluaran tetap terkontrol dan sesuai rencana keuangan
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
