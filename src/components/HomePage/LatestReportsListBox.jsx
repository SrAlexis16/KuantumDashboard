"use client"

import React from 'react';
import { Link } from 'react-router-dom';

function LatestReportsListBox({ reports, setDisplayedReport, toggleFavorite }) {

  const favoriteReports = React.useMemo(() => {
    const uniqueFavorites = [];
    const seenIdentifiers = new Set();

    // Filtra primero los favoritos y luego desduplica
    const filteredAndSorted = reports
      .filter(report => report.isFavorite)
      .sort((a, b) => {
        // Ordenar por fecha (más reciente primero) si tienen una propiedad de fecha
        const dateA = new Date(a.date || a.details?.date);
        const dateB = new Date(b.date || b.details?.date);
        return dateB.getTime() - dateA.getTime();
      });

    for (const report of filteredAndSorted) {
      const identifier = `${report.id}-${report.type}`; 
      if (!seenIdentifiers.has(identifier)) {
        uniqueFavorites.push(report);
        seenIdentifiers.add(identifier);
      }
    }
    return uniqueFavorites;
  }, [reports]); // Recalcula cuando la prop 'reports' cambia

  return (
    <div className="background-boxes p-6 rounded-lg shadow-lg flex flex-col h-full max-h-[560px]">
      <h3 className="text-2xl font-semibold text-black mb-4 flex flex-row gap-2 ">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            className="self-center size-6"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round">
          <path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v2" />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
          <path
            d="M10.29 10.7a2.43 2.43 0 0 0-2.66-.52c-.29.12-.56.3-.78.53l-.35.34-.35-.34a2.43 2.43 0 0 0-2.65-.53c-.3.12-.56.3-.79.53-.95.94-1 2.53.2 3.74L6.5 18l3.6-3.55c1.2-1.21 1.14-2.8.19-3.74Z"
        />
      </svg>
        Reportes Diarios Favoritos
      </h3>

      {favoriteReports.length > 0 ? (
        <div className="overflow-y-auto flex-grow mb-4 custom-scrollbar">
          {favoriteReports.map(report => (
            <div
              // Usar la combinación de id y type para la key única
              key={`${report.id}-${report.type}`} 
              className="bg-gray-50 border border-gray-200 p-3 rounded-md mb-3 flex items-center justify-between transition duration-200 ease-in-out hover:bg-[#e0e0e0] cursor-pointer"
              onClick={() => setDisplayedReport(report)}
            >
              <div>
                <h3 className="text-lg font-semibold text-black">{report.name || report.title}</h3> 
                <p className="text-black text-sm">{report.summary}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); toggleFavorite(report); }} 
                className={`ml-4 p-2 rounded-full transition-colors duration-200 ${report.isFavorite ? 'text-yellow-400 hover:text-yellow-300' : 'text-gray-500 hover:text-gray-400'}`}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 1.944L12.927 6.463l4.636.674c.969.141 1.371 1.371.69 2.07l-3.356 3.267.793 4.618c.168.974-.842 1.704-1.716 1.258L10 16.495l-4.174 2.193c-.874.454-1.884-.284-1.716-1.258l.793-4.618-3.356-3.267c-.681-.7-.279-1.929.69-2.07l4.636-.674L10 1.944z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center text-center text-gray-400">
          <p>No hay reportes favoritos seleccionados. Ve a Gestión de Reportes para marcarlos.</p>
        </div>
      )}

      <Link
        to="/reports"
        className="background-boxes-interior background-boxes-interior:hover text-white font-bold py-3 px-3 rounded-lg shadow-md transition duration-200 ease-in-out text-center w-full mt-1"
      >
        <p>Ir a la Gestión de Reportes</p>
      </Link>
    </div>
  );
}

export default LatestReportsListBox;