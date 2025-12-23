import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  LogOut,
  Plus,
  ArrowUpCircle,
  ArrowDownCircle,
  Settings
} from 'lucide-react';
import { BalanceCard } from './BalanceCard';
import { TransactionList } from './TransactionList';
import { AddTransactionDialog } from './AddTransactionDialog';
import { ManagementPage } from './ManagementPage';

interface DashboardProps {
  userName: string;
  onLogout: () => void;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
}

export function Dashboard({ userName, onLogout }: DashboardProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'income',
      category: 'Gaji',
      amount: 5000000,
      description: 'Gaji bulan Januari',
      date: '2025-01-01'
    },
    {
      id: '2',
      type: 'expense',
      category: 'Makanan',
      amount: 150000,
      description: 'Belanja groceries',
      date: '2025-01-05'
    },
    {
      id: '3',
      type: 'expense',
      category: 'Transport',
      amount: 200000,
      description: 'Bensin mobil',
      date: '2025-01-10'
    },
    {
      id: '4',
      type: 'income',
      category: 'Freelance',
      amount: 1500000,
      description: 'Proyek web development',
      date: '2025-01-15'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showManagement, setShowManagement] = useState(false);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    };
    setTransactions([newTransaction, ...transactions]);
    setIsDialogOpen(false);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  if (showManagement) {
    return (
      <ManagementPage
        transactions={transactions}
        onBack={() => setShowManagement(false)}
        onLogout={onLogout}
      />
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900">Halo, {userName}!</h1>
            <p className="text-gray-600">Kelola keuangan Anda dengan mudah</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowManagement(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Tata Kelola
            </Button>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <BalanceCard
            title="Saldo Total"
            amount={balance}
            icon={Wallet}
            variant="primary"
          />
          <BalanceCard
            title="Total Pemasukan"
            amount={totalIncome}
            icon={TrendingUp}
            variant="success"
          />
          <BalanceCard
            title="Total Pengeluaran"
            amount={totalExpense}
            icon={TrendingDown}
            variant="danger"
          />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Tindakan Cepat</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button onClick={() => setIsDialogOpen(true)} className="flex-1">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Transaksi
            </Button>
            <Button variant="outline" className="flex-1">
              <ArrowUpCircle className="w-4 h-4 mr-2" />
              Tambah Pemasukan
            </Button>
            <Button variant="outline" className="flex-1">
              <ArrowDownCircle className="w-4 h-4 mr-2" />
              Tambah Pengeluaran
            </Button>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <TransactionList 
          transactions={transactions}
          onDelete={handleDeleteTransaction}
        />

        {/* Add Transaction Dialog */}
        <AddTransactionDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onAdd={handleAddTransaction}
        />
      </div>
    </div>
  );
}