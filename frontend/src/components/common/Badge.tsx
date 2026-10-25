import React from 'react';
import { ProductBadge } from '../../types';

interface BadgeProps {
  type?: ProductBadge | 'OUT_OF_STOCK' | 'IN_STOCK' | 'DISCOUNT' | 'CATEGORY';
  text?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ type, text, className = '' }) => {
  let badgeStyle = 'bg-gray-100 text-gray-700 border-gray-200';
  let defaultText = text || '';

  switch (type) {
    case 'SALE':
      badgeStyle = 'bg-rose-50 text-rose-700 border-rose-200 font-semibold';
      defaultText = defaultText || 'SALE';
      break;
    case 'HOT':
      badgeStyle = 'bg-amber-50 text-amber-800 border-amber-200 font-semibold';
      defaultText = defaultText || 'HOT';
      break;
    case 'BESTSELLER':
      badgeStyle = 'bg-purple-50 text-purple-800 border-purple-200 font-semibold';
      defaultText = defaultText || 'BESTSELLER';
      break;
    case 'NEW':
      badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold';
      defaultText = defaultText || 'NEW';
      break;
    case 'FEATURED':
      badgeStyle = 'bg-blue-50 text-blue-700 border-blue-200 font-semibold';
      defaultText = defaultText || 'FEATURED';
      break;
    case 'IN_STOCK':
      badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      defaultText = defaultText || 'In Stock';
      break;
    case 'OUT_OF_STOCK':
      badgeStyle = 'bg-gray-100 text-gray-500 border-gray-200';
      defaultText = defaultText || 'Out of Stock';
      break;
    case 'DISCOUNT':
      badgeStyle = 'bg-rose-600 text-white font-bold border-rose-600 shadow-sm';
      break;
    case 'CATEGORY':
      badgeStyle = 'bg-purple-50 text-purple-700 border-purple-100';
      break;
  }

  return (
    <span
      className={`inline-flex items-center text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-md border ${badgeStyle} ${className}`}
    >
      {defaultText}
    </span>
  );
};
