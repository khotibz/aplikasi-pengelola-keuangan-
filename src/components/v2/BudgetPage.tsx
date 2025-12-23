import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Plus, Trash2, AlertCircle, TrendingUp } from 'lucide-react';
import { Transaction, Budget } from './MainLayout';
import { CurrencyInput } from './CurrencyInput';

interface BudgetPageProps {
  transactions: Transaction[];
  budgets: Budget[];
  setBudgets: (budgets: Budget[]) => void;
}

export function BudgetPage({ transactions, budgets, setBudgets }: BudgetPageProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newLimit, setNewLimit] = useState('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const calculateSpent = (category: string) => {
    return transactions
      .filter(t => t.type === 'expense' && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const handleAddBudget = () => {
    if (newCategory && newLimit) {
      const budget: Budget = {
        id: Date.now().toString(),
        category: newCategory,
        limit: parseFloat(newLimit),
        month: new Date().toISOString().slice(0, 7)
      };
      setBudgets([...budgets, budget]);
      setNewCategory('');
      setNewLimit('');
      setIsAdding(false);
    }
  };

  const handleDeleteBudget = (id: string) => {
    setBudgets(budgets.filter(b => b.id !== id));
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + calculateSpent(b.category), 0);
  const totalRemaining = totalBudget - totalSpent;

  return (
    <div className="p-6 space-y-6 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 dark:text-white">Budget Keuangan</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Atur dan pantau budget untuk setiap kategori
          </p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Budget
          </Button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Budget</p>
            <p className="text-gray-900 dark:text-white">{formatCurrency(totalBudget)}</p>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Terpakai</p>
            <p className="text-red-600 dark:text-red-400">{formatCurrency(totalSpent)}</p>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Sisa Budget</p>
            <p className="text-green-600 dark:text-green-400">{formatCurrency(totalRemaining)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Budget Form */}
      {isAdding && (
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="dark:text-white">Kategori</Label>
                <Input
                  placeholder="Contoh: Makanan"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="dark:text-white">Limit Budget (Rp)</Label>
                <CurrencyInput
                  value={newLimit}
                  onChange={(value) => setNewLimit(value)}
                  placeholder="0"
                  className="dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddBudget}>Simpan</Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Budget List */}
      <div className="space-y-4">
        {budgets.length === 0 ? (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="pt-6">
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                Belum ada budget yang diatur. Klik "Tambah Budget" untuk memulai.
              </p>
            </CardContent>
          </Card>
        ) : (
          budgets.map((budget) => {
            const spent = calculateSpent(budget.category);
            const percentage = Math.min((spent / budget.limit) * 100, 100);
            const isOverBudget = spent > budget.limit;
            const isNearLimit = percentage >= 80 && !isOverBudget;

            return (
              <Card 
                key={budget.id} 
                className={`${
                  isOverBudget 
                    ? 'border-red-300 dark:border-red-800' 
                    : 'dark:bg-gray-800 dark:border-gray-700'
                }`}
              >
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-gray-900 dark:text-white">{budget.category}</h3>
                          {isOverBudget && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Melebihi Budget
                            </Badge>
                          )}
                          {isNearLimit && (
                            <Badge variant="outline" className="text-xs text-yellow-600 dark:text-yellow-400 border-yellow-600">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Mendekati Limit
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatCurrency(spent)} / {formatCurrency(budget.limit)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteBudget(budget.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>

                    <Progress 
                      value={percentage} 
                      className={`h-3 ${
                        isOverBudget 
                          ? 'bg-red-100 dark:bg-red-900/30' 
                          : isNearLimit 
                          ? 'bg-yellow-100 dark:bg-yellow-900/30' 
                          : ''
                      }`}
                    />

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {percentage.toFixed(0)}% terpakai
                      </span>
                      <span className={spent > budget.limit ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>
                        Sisa: {formatCurrency(Math.max(budget.limit - spent, 0))}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Tips */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-0">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-gray-900 dark:text-white mb-2">Tips Mengelola Budget</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Atur budget realistis berdasarkan pengeluaran bulan lalu</li>
                <li>• Review budget setiap minggu untuk memastikan tetap on-track</li>
                <li>• Sisihkan 10-20% pendapatan untuk tabungan dan investasi</li>
                <li>• Gunakan metode 50/30/20: 50% kebutuhan, 30% keinginan, 20% tabungan</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}