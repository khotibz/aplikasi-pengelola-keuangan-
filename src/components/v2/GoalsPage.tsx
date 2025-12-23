import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Plus, Trash2, Target, TrendingUp, DollarSign } from 'lucide-react';
import { Goal } from './MainLayout';
import { CurrencyInput } from './CurrencyInput';

interface GoalsPageProps {
  goals: Goal[];
  setGoals: (goals: Goal[]) => void;
}

const emojiOptions = ['🎯', '✈️', '🏠', '🚗', '💻', '📱', '🎓', '💍', '🛡️', '🏖️'];

export function GoalsPage({ goals, setGoals }: GoalsPageProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newCurrent, setNewCurrent] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🎯');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const handleAddGoal = () => {
    if (newName && newTarget && newDeadline) {
      const goal: Goal = {
        id: Date.now().toString(),
        name: newName,
        targetAmount: parseFloat(newTarget),
        currentAmount: parseFloat(newCurrent) || 0,
        deadline: newDeadline,
        icon: selectedEmoji
      };
      setGoals([...goals, goal]);
      setNewName('');
      setNewTarget('');
      setNewCurrent('');
      setNewDeadline('');
      setSelectedEmoji('🎯');
      setIsAdding(false);
    }
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const handleAddAmount = (goalId: string, amount: number) => {
    setGoals(goals.map(g => 
      g.id === goalId 
        ? { ...g, currentAmount: Math.min(g.currentAmount + amount, g.targetAmount) }
        : g
    ));
  };

  const totalTargets = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const completedGoals = goals.filter(g => g.currentAmount >= g.targetAmount).length;

  return (
    <div className="p-6 space-y-6 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 dark:text-white">Target Keuangan</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tetapkan dan capai tujuan keuangan Anda
          </p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Target
          </Button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Target</p>
                <p className="text-gray-900 dark:text-white">{goals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tercapai</p>
                <p className="text-gray-900 dark:text-white">{completedGoals}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Tersimpan</p>
                <p className="text-gray-900 dark:text-white text-sm">{formatCurrency(totalSaved)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Target className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Target</p>
                <p className="text-gray-900 dark:text-white text-sm">{formatCurrency(totalTargets)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Goal Form */}
      {isAdding && (
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="dark:text-white">Pilih Icon</Label>
                <div className="flex gap-2">
                  {emojiOptions.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSelectedEmoji(emoji)}
                      className={`text-2xl p-2 rounded-lg border-2 transition-all ${
                        selectedEmoji === emoji 
                          ? 'border-blue-500 bg-blue-100 dark:bg-blue-900/30' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="dark:text-white">Nama Target</Label>
                  <Input
                    placeholder="Contoh: Liburan ke Jepang"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="dark:text-white">Target Amount (Rp)</Label>
                  <CurrencyInput
                    value={newTarget}
                    onChange={(value) => setNewTarget(value)}
                    placeholder="0"
                    className="dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="dark:text-white">Jumlah Saat Ini (Rp)</Label>
                  <CurrencyInput
                    value={newCurrent}
                    onChange={(value) => setNewCurrent(value)}
                    placeholder="0"
                    className="dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="dark:text-white">Deadline</Label>
                  <Input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddGoal}>Simpan Target</Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.length === 0 ? (
          <Card className="col-span-2 dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="pt-6">
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                Belum ada target keuangan. Klik "Tambah Target" untuk memulai.
              </p>
            </CardContent>
          </Card>
        ) : (
          goals.map((goal) => {
            const percentage = (goal.currentAmount / goal.targetAmount) * 100;
            const isCompleted = percentage >= 100;
            const remaining = goal.targetAmount - goal.currentAmount;
            const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

            return (
              <Card 
                key={goal.id} 
                className={`${
                  isCompleted 
                    ? 'border-green-500 dark:border-green-700 bg-green-50 dark:bg-green-900/20' 
                    : 'dark:bg-gray-800 dark:border-gray-700'
                }`}
              >
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{goal.icon}</span>
                      <div>
                        <h3 className="text-gray-900 dark:text-white">{goal.name}</h3>
                        {isCompleted ? (
                          <Badge className="mt-1 bg-green-600 dark:bg-green-700">
                            ✓ Target Tercapai!
                          </Badge>
                        ) : (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {daysLeft > 0 ? `${daysLeft} hari lagi` : 'Deadline terlewat'}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteGoal(goal.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="text-gray-900 dark:text-white">{percentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={Math.min(percentage, 100)} className="h-3" />
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {formatCurrency(goal.currentAmount)}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {formatCurrency(goal.targetAmount)}
                      </span>
                    </div>
                  </div>

                  {!isCompleted && (
                    <div className="pt-2 border-t dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Masih kurang: <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(remaining)}</span>
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddAmount(goal.id, 100000)}
                          className="flex-1"
                        >
                          +100K
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddAmount(goal.id, 500000)}
                          className="flex-1"
                        >
                          +500K
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddAmount(goal.id, 1000000)}
                          className="flex-1"
                        >
                          +1M
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}