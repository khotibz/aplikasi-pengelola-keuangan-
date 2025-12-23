import { Menu, Bell, Search, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';

interface MobileHeaderProps {
  userName: string;
  onMenuClick: () => void;
  darkMode: boolean;
}

export function MobileHeader({ userName, onMenuClick, darkMode }: MobileHeaderProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="md:hidden sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 h-16">
        {/* Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="p-2"
        >
          <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </Button>

        {/* App Title */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">Rp</span>
          </div>
          <h1 className="text-gray-900 dark:text-white text-lg">Keuangan</h1>
        </div>

        {/* User Avatar */}
        <Avatar className="w-9 h-9">
          <AvatarFallback className="bg-blue-600 text-white text-sm">
            {getInitials(userName)}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
