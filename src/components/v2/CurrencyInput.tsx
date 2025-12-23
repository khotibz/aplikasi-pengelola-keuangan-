import { Input } from '../ui/input';
import { forwardRef } from 'react';

interface CurrencyInputProps extends Omit<React.ComponentProps<typeof Input>, 'onChange' | 'value'> {
  value: string;
  onChange: (value: string) => void;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, ...props }, ref) => {
    const formatNumber = (num: string) => {
      // Remove all non-digit characters
      const digits = num.replace(/\D/g, '');
      
      // Format with thousand separators
      if (digits === '') return '';
      
      // Add dots as thousand separators
      return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      
      // Remove all non-digit characters to get raw number
      const rawValue = inputValue.replace(/\D/g, '');
      
      // Update with raw value (parent component stores raw number)
      onChange(rawValue);
    };

    return (
      <Input
        ref={ref}
        {...props}
        type="text"
        value={formatNumber(value)}
        onChange={handleChange}
        inputMode="numeric"
      />
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput';
