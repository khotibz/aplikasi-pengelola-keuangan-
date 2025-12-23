import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, LogOut } from 'lucide-react';
import { Transaction } from './Dashboard';
import { BudgetManager } from './BudgetManager';
import { FinancialReport } from './FinancialReport';
import { CategoryAnalytics } from './CategoryAnalytics';

interface ManagementPageProps {
  transactions: Transaction[];
  onBack: () => void;
  onLogout: () => void;
}

export function ManagementPage({ transactions, onBack, onLogout }: ManagementPageProps) {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-gray-900">Tata Kelola Keuangan</h1>
              <p className="text-gray-600">Kelola budget, laporan, dan analitik</p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Keluar
          </Button>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="budget" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="report">Laporan</TabsTrigger>
            <TabsTrigger value="analytics">Analitik</TabsTrigger>
          </TabsList>

          <TabsContent value="budget" className="space-y-4">
            <BudgetManager transactions={transactions} />
          </TabsContent>

          <TabsContent value="report" className="space-y-4">
            <FinancialReport transactions={transactions} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <CategoryAnalytics transactions={transactions} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
