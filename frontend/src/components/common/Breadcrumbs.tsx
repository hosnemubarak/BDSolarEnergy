import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex items-center text-xs text-gray-500 py-3 overflow-x-auto whitespace-nowrap">
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-purple-700 transition-colors shrink-0"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-gray-400 shrink-0" />
            {isLast || !item.url ? (
              <span className="font-semibold text-purple-900 truncate max-w-xs sm:max-w-md">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.url}
                className="hover:text-purple-700 transition-colors truncate max-w-xs"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
