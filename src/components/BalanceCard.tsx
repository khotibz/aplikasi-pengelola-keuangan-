import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LucideIcon } from 'lucide-react';

interface BalanceCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  variant: 'primary' | 'success' | 'danger';
}

export function BalanceCard({ title, amount, icon: Icon, variant }: BalanceCardProps) {
  const variantStyles = {
    primary: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    success: 'bg-gradient-to-br from-green-500 to-emerald-600',
    danger: 'bg-gradient-to-br from-red-500 to-rose-600'
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <Card className={`${variantStyles[variant]} text-white border-0`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-white opacity-90">{title}</CardTitle>
        <Icon className="w-5 h-5 opacity-80" />
      </CardHeader>
      <CardContent>
        <div className="text-white">{formatCurrency(amount)}</div>
      </CardContent>
    </Card>
  );
}
