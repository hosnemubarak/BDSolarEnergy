import React from 'react';
import { formatBDT } from '../../utils/currency';

export interface PriceProps {
  amount: number | string | null | undefined;
  className?: string;
  symbolClassName?: string;
  showFreeForZero?: boolean;
}

/**
 * Standardized Price component for BD Solar Energy.
 * Renders the genuine Bangladeshi Taka symbol (৳ U+09F3) with consistent
 * bold weight, proportional scale to match adjacent numerals, and precise baseline alignment.
 */
export const Price: React.FC<PriceProps> = ({
  amount,
  className = '',
  symbolClassName = '',
  showFreeForZero = false,
}) => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (num === 0 && showFreeForZero) {
    return <span className={className}>Free</span>;
  }

  const isNegative = typeof num === 'number' && num < 0;
  const formattedNumber = formatBDT(amount, { includeSymbol: false });

  return (
    <span className={`inline-flex items-baseline font-inherit ${className}`}>
      {isNegative && <span>-</span>}
      <span
        className={`font-black text-[1.12em] leading-none select-none mr-0.5 tracking-tight ${symbolClassName}`}
        aria-hidden="true"
      >
        ৳
      </span>
      <span>{formattedNumber}</span>
    </span>
  );
};

