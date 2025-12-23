import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Plus, Trash2, Wallet, CreditCard, Smartphone, TrendingUp, TrendingDown } from 'lucide-react';
import { Account, Transaction } from './MainLayout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { CurrencyInput } from './CurrencyInput';

interface AccountsPageProps {
  accounts: Account[];
  setAccounts: (accounts: Account[]) => void;
  transactions: Transaction[];
}

const colorOptions = [
  { name: 'Biru', value: '#3b82f6' },
  { name: 'Hijau', value: '#10b981' },
  { name: 'Kuning', value: '#f59e0b' },
  { name: 'Merah', value: '#ef4444' },
  { name: 'Ungu', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Cyan', value: '#06b6d4' },
];

const accountTypeIcons = {
  cash: Wallet,
  bank: CreditCard,
  ewallet: Smartphone,
};

export function AccountsPage({ accounts, setAccounts, transactions }: AccountsPageProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'cash' | 'bank' | 'ewallet'>('cash');
  const [newBalance, setNewBalance] = useState('');
  const [newColor, setNewColor] = useState('#3b82f6');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const handleAddAccount = () => {
    if (newName && newBalance) {
      const account: Account = {
        id: Date.now().toString(),
        name: newName,
        type: newType,
        balance: parseFloat(newBalance),
        color: newColor
      };
      setAccounts([...accounts, account]);
      setNewName('');
      setNewType('cash');
      setNewBalance('');
      setNewColor('#3b82f6');
      setIsAdding(false);
    }
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts(accounts.filter(a => a.id !== id));
  };

  const getAccountTransactions = (accountId: string) => {
    return transactions.filter(t => t.accountId === accountId);
  };

  const getAccountIncome = (accountId: string) => {
    return transactions
      .filter(t => t.accountId === accountId && t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getAccountExpense = (accountId: string) => {
    return transactions
      .filter(t => t.accountId === accountId && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <div className="p-6 space-y-6 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 dark:text-white">Akun & Dompet</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Kelola semua akun keuangan Anda dalam satu tempat
          </p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Akun
          </Button>
        )}
      </div>

      {/* Total Balance */}
      <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-0">
        <CardContent className="pt-6">
          <p className="text-white/80 mb-2">Total Saldo Semua Akun</p>
          <p className="text-white text-3xl">{formatCurrency(totalBalance)}</p>
          <p className="text-white/60 text-sm mt-2">{accounts.length} akun aktif</p>
        </CardContent>
      </Card>

      {/* Add Account Form */}
      {isAdding && (
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="dark:text-white">Nama Akun</Label>
                  <Input
                    placeholder="Contoh: Dompet Utama"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="dark:text-white">Tipe Akun</Label>
                  <Select value={newType} onValueChange={(v: any) => setNewType(v)}>
                    <SelectTrigger className="dark:bg-gray-900 dark:border-gray-600 dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      <SelectItem value="cash" className="dark:text-white">Tunai</SelectItem>
                      <SelectItem value="bank" className="dark:text-white">Bank</SelectItem>
                      <SelectItem value="ewallet" className="dark:text-white">E-Wallet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="dark:text-white">Saldo Awal (Rp)</Label>
                  <CurrencyInput
                    value={newBalance}
                    onChange={(value) => setNewBalance(value)}
                    placeholder="0"
                    className="dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="dark:text-white">Warna</Label>
                  <div className="flex gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setNewColor(color.value)}
                        className={`w-10 h-10 rounded-lg border-2 transition-all ${
                          newColor === color.value 
                            ? 'border-gray-900 dark:border-white scale-110' 
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddAccount}>Simpan Akun</Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.length === 0 ? (
          <Card className="col-span-3 dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="pt-6">
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                Belum ada akun. Klik "Tambah Akun" untuk memulai.
              </p>
            </CardContent>
          </Card>
        ) : (
          accounts.map((account) => {
            const Icon = accountTypeIcons[account.type];
            const accountTransactions = getAccountTransactions(account.id);
            const income = getAccountIncome(account.id);
            const expense = getAccountExpense(account.id);

            return (
              <Card 
                key={account.id} 
                className="relative overflow-hidden dark:bg-gray-800 dark:border-gray-700"
              >
                <div 
                  className="absolute top-0 left-0 right-0 h-2"
                  style={{ backgroundColor: account.color }}
                />
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: `${account.color}20` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: account.color }} />
                      </div>
                      <div>
                        <h3 className="text-gray-900 dark:text-white">{account.name}</h3>
                        <Badge variant="outline" className="mt-1 text-xs dark:border-gray-600 dark:text-gray-400">
                          {account.type === 'cash' && 'Tunai'}
                          {account.type === 'bank' && 'Bank'}
                          {account.type === 'ewallet' && 'E-Wallet'}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAccount(account.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>

                  <div className="pt-3 border-t dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Saldo</p>
                    <p className="text-gray-900 dark:text-white text-2xl">{formatCurrency(account.balance)}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <p className="text-xs text-gray-600 dark:text-gray-400">Pemasukan</p>
                      </div>
                      <p className="text-green-600 dark:text-green-400 text-sm">{formatCurrency(income)}</p>
                    </div>
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                        <p className="text-xs text-gray-600 dark:text-gray-400">Pengeluaran</p>
                      </div>
                      <p className="text-red-600 dark:text-red-400 text-sm">{formatCurrency(expense)}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t dark:border-gray-700">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {accountTransactions.length} transaksi
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}