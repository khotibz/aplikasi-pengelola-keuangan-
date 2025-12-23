import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Transaction, Account } from './MainLayout';
import { CurrencyInput } from './CurrencyInput';

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
  accounts: Account[];
}

export function AddTransactionDialog({ open, onOpenChange, onAdd, accounts }: AddTransactionDialogProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [recurring, setRecurring] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !amount || !description || !accountId) {
      return;
    }

    onAdd({
      type,
      category,
      amount: parseFloat(amount),
      description,
      date,
      accountId,
      recurring
    });

    // Reset form
    setCategory('');
    setAmount('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setRecurring(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Tambah Transaksi</DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Masukkan detail transaksi baru Anda
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs value={type} onValueChange={(v) => setType(v as 'income' | 'expense')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="income">Pemasukan</TabsTrigger>
              <TabsTrigger value="expense">Pengeluaran</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-2">
            <Label htmlFor="category" className="dark:text-white">Kategori</Label>
            <Input
              id="category"
              placeholder="Contoh: Makanan, Transport, Gaji"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="dark:bg-gray-900 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="dark:text-white">Jumlah (Rp)</Label>
            <CurrencyInput
              id="amount"
              value={amount}
              onChange={(value) => setAmount(value)}
              required
              className="dark:bg-gray-900 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="dark:text-white">Deskripsi</Label>
            <Input
              id="description"
              placeholder="Contoh: Belanja bulanan"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="dark:bg-gray-900 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="account" className="dark:text-white">Akun</Label>
            <Select value={accountId} onValueChange={setAccountId}>
              <SelectTrigger className="dark:bg-gray-900 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Pilih akun" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                {accounts.map((acc) => (
                  <SelectItem key={acc.id} value={acc.id} className="dark:text-white">
                    {acc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="dark:text-white">Tanggal</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="dark:bg-gray-900 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-600">
            <div>
              <Label htmlFor="recurring" className="dark:text-white">Transaksi Berulang</Label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Otomatis setiap bulan
              </p>
            </div>
            <Switch
              id="recurring"
              checked={recurring}
              onCheckedChange={setRecurring}
            />
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Batal
            </Button>
            <Button type="submit" className="flex-1">
              Simpan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}