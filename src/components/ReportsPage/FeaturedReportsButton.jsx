"use client"

import React, { useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Popover,PopoverContent, PopoverTrigger } from "@/components/ui/popover";

function FeaturedReportsButton({ favoriteReports, onReportSelect }) {

  const uniqueAndSortedFavoriteReports = useMemo(() => {
    if (!favoriteReports || favoriteReports.length === 0) {
      return [];
    }

    const seenIdentifiers = new Set();
    const uniqueList = [];

    // Primero, ordenar por fecha (más reciente primero), luego por nombre si las fechas son iguales
    const sorted = [...favoriteReports].sort((a, b) => {
      // Intenta obtener la fecha del reporte (puede estar en 'date' o 'details.date')
      const getDate = (report) => {
        if (report.type === 'daily') {
          return report.date ? new Date(report.date) : new Date(0);
        } else {
          return (report.year && report.monthNumber) ? new Date(report.year, report.monthNumber - 1, 1) : new Date(0);
        }
      };
      
      const dateA = getDate(a);
      const dateB = getDate(b);

      if (dateB.getTime() !== dateA.getTime()) {
        return dateB.getTime() - dateA.getTime(); // Más reciente primero
      }
      // Si las fechas son iguales, ordenar alfabéticamente por nombre
      return (a.name || '').localeCompare(b.name || '');
    });

    for (const report of sorted) {
      // Usamos id y type para el identificador único, como en useFavoriteReports
      // Asegúrate que los reportes tienen 'id' y 'type'
      const identifier = `${report.id}-${report.type}`; 
      if (!seenIdentifiers.has(identifier)) {
        uniqueList.push(report);
        seenIdentifiers.add(identifier);
      }
    }
    return uniqueList;
  }, [favoriteReports]); // Depende de la prop favoriteReports

  const handleFeaturedReportClick = (report) => {
    console.log('Clic en reporte destacado (FeaturedReportsButton):', report.name);
    if (onReportSelect) {
      onReportSelect(report);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="shadow-lg rounded-lg py-6 px-6 bg-white flex items-center justify-center uiButtonReportPageTitle">
          <div className='flex flex-row justify-center items-center'>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              className="self-center size-5"
              viewBox="0 0 24 24"
              stroke="black"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round">
                <path d="M11 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v1.5" />
                <path d="M13.9 17.45c-1.2-1.2-1.14-2.8-.2-3.73a2.43 2.43 0 0 1 3.44 0l.36.34.34-.34a2.43 2.43 0 0 1 3.45-.01c.95.95 1 2.53-.2 3.74L17.5 21Z" />
            </svg>
            <span className="ml-2 text-black text-base">Reportes Destacados</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 p-4 text-black"
        align="start"
        sideOffset={10}>
        <h3 className="text-lg font-semibold mb-2">Mis destacados:</h3>
        <ul className="text-gray-700 max-h-48 overflow-y-auto custom-scrollbar">
          {uniqueAndSortedFavoriteReports.length > 0 ? (
            uniqueAndSortedFavoriteReports.map(report => (
              <li
                className="p-2 hover:bg-gray-200 cursor-pointer rounded-md"
                onClick={() => handleFeaturedReportClick(report)}
                key={`featured-${report.id}-${report.type}-${report.dateKey || 'no-date'}`}>
                {report.name}
              </li>
            ))
          ) : (
            <li className="text-gray-500 text-sm">No tienes reportes destacados aún.</li>
          )}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

export default FeaturedReportsButton;