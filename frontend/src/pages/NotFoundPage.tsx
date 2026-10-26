import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, ArrowLeft, Search } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-green-100 text-[#15803D] flex items-center justify-center mx-auto">
        <Sun className="w-10 h-10 animate-spin" />
      </div>

      <div className="space-y-2">
        <span className="text-sm font-bold text-[#15803D] bg-green-50 px-3 py-1 rounded-full uppercase">
          Error 404
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900">Page Not Found</h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
          The solar or electrical page you requested does not exist or may have been relocated.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          to="/"
          className="px-6 py-3 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
        <Link
          to="/shop"
          className="px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl transition-colors"
        >
          Browse All Products
        </Link>
      </div>
    </div>
  );
};
