import { Plus } from 'lucide-react';
import { Button } from '../ui/button';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="md:hidden fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white z-40 flex items-center justify-center"
      size="icon"
    >
      <Plus className="w-6 h-6" />
    </Button>
  );
}
