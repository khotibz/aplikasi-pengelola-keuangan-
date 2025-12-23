import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import { Transaction } from './Dashboard';

interface BudgetManagerProps {
  transactions: Transaction[];
}

interface Budget {
  id: string;
  category: string;
  limit: number;
  month: string;
}

export function BudgetManager({ transactions }: BudgetManagerProps) {
  const [budgets, setBudgets] = useState<Budget[]>([
    { id: '1', category: 'Makanan', limit: 2000000, month: '2025-01' },
    { id: '2', category: 'Transport', limit: 1000000, month: '2025-01' },
    { id: '3', category: 'Hiburan', limit: 500000, month: '2025-01' },
  ]);

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

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Budget Bulanan</CardTitle>
              <CardDescription>Atur dan pantau budget untuk setiap kategori</CardDescription>
            </div>
            {!isAdding && (
              <Button onClick={() => setIsAdding(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Budget
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAdding && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Kategori</Label>
                    <Input
                      placeholder="Contoh: Makanan"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Limit Budget (Rp)</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newLimit}
                      onChange={(e) => setNewLimit(e.target.value)}
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

          {budgets.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Belum ada budget yang diatur
            </p>
          ) : (
            <div className="space-y-4">
              {budgets.map((budget) => {
                const spent = calculateSpent(budget.category);
                const percentage = Math.min((spent / budget.limit) * 100, 100);
                const isOverBudget = spent > budget.limit;
                const isNearLimit = percentage >= 80 && !isOverBudget;

                return (
                  <Card key={budget.id} className={isOverBudget ? 'border-red-300' : ''}>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-gray-900">{budget.category}</h3>
                              {isOverBudget && (
                                <Badge variant="destructive" className="text-xs">
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Melebihi Budget
                                </Badge>
                              )}
                              {isNearLimit && (
                                <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-600">
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Mendekati Limit
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
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
                          className={isOverBudget ? 'bg-red-100' : isNearLimit ? 'bg-yellow-100' : ''}
                        />
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {percentage.toFixed(0)}% terpakai
                          </span>
                          <span className={spent > budget.limit ? 'text-red-600' : 'text-green-600'}>
                            Sisa: {formatCurrency(budget.limit - spent)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Budget Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Budget</p>
              <p className="text-gray-900 mt-1">
                {formatCurrency(budgets.reduce((sum, b) => sum + b.limit, 0))}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Terpakai</p>
              <p className="text-gray-900 mt-1">
                {formatCurrency(budgets.reduce((sum, b) => sum + calculateSpent(b.category), 0))}
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Sisa Budget</p>
              <p className="text-gray-900 mt-1">
                {formatCurrency(
                  budgets.reduce((sum, b) => sum + b.limit, 0) -
                  budgets.reduce((sum, b) => sum + calculateSpent(b.category), 0)
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
