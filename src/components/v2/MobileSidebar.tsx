import { X, Home, Receipt, PieChart, Target, Wallet, FileText, Settings, LogOut, Moon, Sun } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Switch } from '../ui/switch';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export function MobileSidebar({
  isOpen,
  onClose,
  userName,
  currentPage,
  onNavigate,
  onLogout,
  darkMode,
  toggleDarkMode,
}: MobileSidebarProps) {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'transactions', icon: Receipt, label: 'Transaksi' },
    { id: 'budget', icon: PieChart, label: 'Budget' },
    { id: 'goals', icon: Target, label: 'Target Tabungan' },
    { id: 'accounts', icon: Wallet, label: 'Akun & Dompet' },
    { id: 'reports', icon: FileText, label: 'Laporan' },
    { id: 'settings', icon: Settings, label: 'Pengaturan' },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleNavigate = (page: string) => {
    onNavigate(page);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 md:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed top-0 left-0 bottom-0 w-80 bg-white dark:bg-gray-800 z-50 md:hidden shadow-xl animate-in slide-in-from-left">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl text-gray-900 dark:text-white">Menu</h2>
              <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </Button>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-blue-600 text-white">
                  {getInitials(userName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-gray-900 dark:text-white">{userName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pengguna Premium</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-2">
                {darkMode ? (
                  <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-600" />
                )}
                <span className="text-sm text-gray-700 dark:text-gray-300">Mode Gelap</span>
              </div>
              <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
            </div>

            {/* Logout Button */}
            <Button
              onClick={onLogout}
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
