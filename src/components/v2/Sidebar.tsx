import { Button } from '../ui/button';
import { 
  LayoutDashboard, 
  Receipt, 
  Target, 
  Wallet, 
  PieChart, 
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onLogout: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transaksi', icon: Receipt },
  { id: 'budgets', label: 'Budget', icon: PieChart },
  { id: 'goals', label: 'Target', icon: Target },
  { id: 'accounts', label: 'Akun', icon: Wallet },
  { id: 'reports', label: 'Laporan', icon: PieChart },
  { id: 'settings', label: 'Pengaturan', icon: Settings },
];

export function Sidebar({ currentPage, setCurrentPage, onLogout, sidebarOpen, setSidebarOpen }: SidebarProps) {
  return (
    <div 
      className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-gray-900 dark:text-white">Finance v2</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Pro Edition</p>
                </div>
              </div>
            )}
            {!sidebarOpen && (
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mx-auto">
                <Wallet className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? 'default' : 'ghost'}
                className={`w-full justify-start ${!sidebarOpen && 'justify-center px-2'}`}
                onClick={() => setCurrentPage(item.id)}
              >
                <Icon className={`w-5 h-5 ${sidebarOpen && 'mr-3'}`} />
                {sidebarOpen && <span>{item.label}</span>}
              </Button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <Button
            variant="ghost"
            className={`w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 ${!sidebarOpen && 'justify-center px-2'}`}
            onClick={onLogout}
          >
            <LogOut className={`w-5 h-5 ${sidebarOpen && 'mr-3'}`} />
            {sidebarOpen && <span>Keluar</span>}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className={`w-full ${!sidebarOpen && 'px-2'}`}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Ciutkan
              </>
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
