import React from 'react';

const SIZES = {
  sm: { box: 'w-7 h-7', text: 'text-xs', name: 'text-base' },
  md: { box: 'w-8 h-8', text: 'text-sm', name: 'text-lg' },
  lg: { box: 'w-12 h-12', text: 'text-lg', name: 'text-2xl' }
};

const Logo = ({ size = 'md', showName = true, className = '' }) => {
  const s = SIZES[size] || SIZES.md;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div
        className={`${s.box} rounded-lg bg-gradient-to-br from-rose-600 via-violet-600 to-indigo-600 flex items-center justify-center shadow-sm ring-1 ring-black/5`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          className={`${s.box} p-1`}
          fill="none"
          stroke="white"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Stylized "BC" mark — two interlocking arcs */}
          <path d="M6 5h4a3 3 0 0 1 0 6H6z" />
          <path d="M6 11h5a3 3 0 0 1 0 6H6z" />
          <path d="M19 8a4 4 0 0 0-4-4" />
          <path d="M19 16a4 4 0 0 1-4 4" />
        </svg>
      </div>
      {showName && (
        <span className={`${s.name} font-bold tracking-tight text-slate-900 dark:text-slate-100`}>
          Bad Company
        </span>
      )}
    </div>
  );
};

export default Logo;
