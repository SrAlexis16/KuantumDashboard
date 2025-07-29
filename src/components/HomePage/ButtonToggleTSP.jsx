"use client"

import React from 'react';

export function ButtonToggleTSP({ viewMode, onModeChange }) {
  return (
    <div className="inline-flex rounded-md shadow-sm" role="group">
      <button
        type="button"
        onClick={() => onModeChange('day')}
        className={`px-4 py-2 text-sm font-medium border border-gray-200 rounded-l-lg
          ${viewMode === 'day' 
            ? 'bg-black text-white' 
            : 'bg-white text-gray-900 hover:bg-gray-100'}
        `}
      >
        <p>Día</p>
      </button>
      <button
        type="button"
        onClick={() => onModeChange('month')}
        className={`px-4 py-2 text-sm font-medium border-t border-b border-gray-200
          ${viewMode === 'month' 
            ? 'bg-black text-white' 
            : 'bg-white text-gray-900 hover:bg-gray-100'}
        `}
      >
        <p>Mes</p>
      </button>
      <button
        type="button"
        onClick={() => onModeChange('year')}
        className={`px-4 py-2 text-sm font-medium border border-gray-200 rounded-r-lg
          ${viewMode === 'year' 
            ? 'bg-black text-white' 
            : 'bg-white text-gray-900 hover:bg-gray-100'}
        `}
      >
        <p>Año</p>
      </button>
    </div>
  );
}