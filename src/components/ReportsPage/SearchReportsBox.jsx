"use client"

import React, { useState } from 'react';

const IconoFavoritoVacio = (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);

const IconoFavoritoLleno = (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);

function SearchReportsBox({ reports, onToggleFavorite, onReportSelect }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = reports.filter(report => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const reportName = report.name?.toLowerCase() || '';
    const reportSummary = report.summary?.toLowerCase() || '';
    const reportNumber = report.details?.reportNumber;
    const reportNumberString = reportNumber != null ? String(reportNumber).toLowerCase() : '';
    return (
      reportName.includes(lowerCaseSearchTerm) ||
      reportSummary.includes(lowerCaseSearchTerm) ||
      reportNumberString.includes(lowerCaseSearchTerm)
    );
  });

  const minHeightForThreeItems = '385px';

  return (
    <div className="background-boxes p-4 rounded-lg shadow-md text-black flex flex-col h-full">
      <h3 className="text-2xl font-semibold mb-4 text-black flex flex-row gap-2">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            className="self-center size-6"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round">
              <rect width="8" height="4" x="8" y="2" rx="1" />
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5.5" />
              <path d="M4 13.5V6a2 2 0 0 1 2-2h2" />
              <path d="M13.378 15.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/>
        </svg>
        Buscar Reportes
        </h3>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar reporte por nombre o resumen..."
          className="w-full p-2 rounded-md bg-gray-50 border border-gray-600 text-black focus:outline-none focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div
        className="flex-grow overflow-y-auto pr-2 custom-scrollbar"
        style={{
          maxHeight: minHeightForThreeItems,
          minHeight: minHeightForThreeItems
        }}
      >
        {filteredReports.length > 0 ? (
          <ul className="space-y-2">
            {filteredReports.map((report, index) => (
              <li
                key={`search-${report.id || 'no-id'}-${report.type || 'no-type'}-${report.dateKey || 'no-date'}-${index}`}
                className="bg-gray-50 border border-gray-300 hover:bg-[#e0e0e0] p-3 rounded-md flex items-center justify-between gap-4"
              >
                <div
                  className="flex-grow cursor-pointer"
                  onClick={() => {
                    console.log('Clic en reporte de búsqueda (SearchReportsBox):', report.name);
                    onReportSelect && onReportSelect(report);
                  }}
                >
                  <p className="font-semibold text-md">{report.name}</p>
                  <p className="text-gray-900 text-sm line-clamp-1">{report.summary}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(report);
                    }}
                  className={`
                      flex-shrink-0 p-2 rounded-full
                      ${report.isFavorite ? 'text-yellow-500' : 'text-gray-400'}
                      transition duration-200 ease-in-out`}
                      title={report.isFavorite ? 'Quitar de Favoritos' : 'Añadir a Favoritos'}
                >
                  {report.isFavorite ? IconoFavoritoLleno : IconoFavoritoVacio}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 mt-8">No se encontraron reportes.</p>
        )}
      </div>
    </div>
  );
}

export default SearchReportsBox;