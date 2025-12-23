import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  Plus, 
  Search, 
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  Calendar
} from 'lucide-react';
import { Transaction, Account } from './MainLayout';
import { AddTransactionDialog } from './AddTransactionDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface TransactionsPageProps {
  transactions: Transaction[];
  accounts: Account[];
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  onDeleteTransaction: (id: string) => void;
}

export function TransactionsPage({ 
  transactions, 
  accounts, 
  onAddTransaction, 
  onDeleteTransaction 
}: TransactionsPageProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const categories = [...new Set(transactions.map(t => t.category))];

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  const totalFiltered = filteredTransactions.reduce((sum, t) => {
    return sum + (t.type === 'income' ? t.amount : -t.amount);
  }, 0);

  return (
    <div className="p-6 space-y-6 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 dark:text-white">Semua Transaksi</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Kelola dan pantau semua transaksi Anda
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Transaksi
        </Button>
      </div>

      {/* Filters */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Cari transaksi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 dark:bg-gray-900 dark:border-gray-600 dark:text-white"
              />
            </div>

            <Select value={filterType} onValueChange={(v: any) => setFilterType(v)}>
              <SelectTrigger className="dark:bg-gray-900 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Tipe transaksi" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="all" className="dark:text-white">Semua Tipe</SelectItem>
                <SelectItem value="income" className="dark:text-white">Pemasukan</SelectItem>
                <SelectItem value="expense" className="dark:text-white">Pengeluaran</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="dark:bg-gray-900 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="all" className="dark:text-white">Semua Kategori</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat} className="dark:text-white">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" className="dark:border-gray-600 dark:text-white">
              <Calendar className="w-4 h-4 mr-2" />
              Filter Tanggal
            </Button>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Menampilkan {filteredTransactions.length} dari {transactions.length} transaksi
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total:</span>
              <span className={`${totalFiltered >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(Math.abs(totalFiltered))}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="pt-6">
          <div className="space-y-3">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">Tidak ada transaksi ditemukan</p>
              </div>
            ) : (
              filteredTransactions.map((transaction) => {
                const account = accounts.find(a => a.id === transaction.accountId);
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-900/50 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${
                        transaction.type === 'income' 
                          ? 'bg-green-100 dark:bg-green-900/30' 
                          : 'bg-red-100 dark:bg-red-900/30'
                      }`}>
                        {transaction.type === 'income' ? (
                          <ArrowUpRight className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <ArrowDownRight className="w-5 h-5 text-red-600 dark:text-red-400" />
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
                          {transaction.recurring && (
                            <Badge variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-300">
                              Berulang
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
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
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteTransaction(transaction.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      <AddTransactionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAdd={onAddTransaction}
        accounts={accounts}
      />
    </div>
  );
}
