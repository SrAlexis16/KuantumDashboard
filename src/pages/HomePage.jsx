"use client"

import React, { useState, useEffect, useMemo } from 'react';

import { useUnifiedReports } from '@/hooks/useUnifiedReports';
import { useFavoriteReports } from '@/hooks/useFavoriteReports';
import PendingOrdersBox from '../components/HomePage/PendingOrdersBox.jsx';
import QuickReportViewBox from '../components/HomePage/QuickReportViewBox.jsx';
import LatestReportsListBox from '../components/HomePage/LatestReportsListBox.jsx';
import ToolsBox from '../components/HomePage/ToolsBox.jsx'; 
import TopSalesProduct from '../components/HomePage/TopSalesProduct.jsx';
import MonthlyViewToggle from '../components/HomePage/MonthlyViewsToggle.jsx';

function HomePage() {
  const { 
    data: unifiedData,
    loading, 
    error,
  } = useUnifiedReports();

  const { reportsWithFavorites, toggleFavorite } = useFavoriteReports(unifiedData.all);
  const [displayedReport, setDisplayedReport] = useState(null);
  const [isNotepadVisible, setIsNotepadVisible] = useState(false);
  const [notepadContent, setNotepadContent] = useState(() => {
    return localStorage.getItem('notepadContent') || '';
  });

  // Efecto para inicializar o actualizar el 'displayedReport'
  useEffect(() => {
    if (reportsWithFavorites.length > 0) {
      if (!displayedReport) {
        const firstFavorite = reportsWithFavorites.find(r => r.isFavorite);
        setDisplayedReport(firstFavorite || reportsWithFavorites[0]);
      } else {
        const updatedDisplayed = reportsWithFavorites.find(
          r => r.id === displayedReport.id && r.type === displayedReport.type
        );
        if (updatedDisplayed) {
          setDisplayedReport(updatedDisplayed);
        } else {
          setDisplayedReport(reportsWithFavorites.find(r => r.isFavorite) || reportsWithFavorites[0] || null);
        }
      }
    } else if (reportsWithFavorites.length === 0 && displayedReport !== null) {
      setDisplayedReport(null);
    }
  }, [reportsWithFavorites, displayedReport]);

    const dailyReportsForComponents = useMemo(
      () => reportsWithFavorites.filter(r => r.type === "daily"),
      [reportsWithFavorites]
    );

  // Efecto para guardar el contenido del bloc de notas en localStorage
  useEffect(() => {
    localStorage.setItem('notepadContent', notepadContent);
  }, [notepadContent]);

  // Mostrar estado de carga o error
  if (loading) {
    return (
      <div className="relative p-6 h-full flex items-center justify-center page-content">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Cargando reportes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative p-6 h-full flex items-center justify-center text-red-600 page-content">
        <p>Error al cargar los reportes: {error}</p>
      </div>
    );
  }

  // Mostrar datos cargados
  return (
    <>
      {isNotepadVisible && (
        <ToolsBox
          notepadContent={notepadContent}
          setNotepadContent={setNotepadContent}
          onClose={() => setIsNotepadVisible(false)}
        />
      )}

      {!isNotepadVisible && (
        <button
          onClick={() => setIsNotepadVisible(true)}
          className="fixed bottom-4 right-4 background-boxes-interior background-boxes-interior:hover text-white font-bold py-3 px-6 rounded-lg shadow-lg z-30 transition duration-200 ease-in-out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
        </button>
      )}

      <div className="page-content p-6 bg-gray-900 min-h-screen text-white flex flex-col items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-7xl mx-auto mb-8">
          <QuickReportViewBox
              reports={dailyReportsForComponents}
              displayedReport={displayedReport}
              setDisplayedReport={setDisplayedReport}
              toggleFavorite={toggleFavorite}
          />
          {dailyReportsForComponents.length > 0 && (
            <LatestReportsListBox
              reports={dailyReportsForComponents}
              setDisplayedReport={setDisplayedReport}
              toggleFavorite={toggleFavorite}
              showFavoritesOnly={true}
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-7xl mx-auto mb-8 max-h-[560px] min-h-[560px]">
          <MonthlyViewToggle /> 
          <PendingOrdersBox />
        </div>

        <div className="w-full max-w-7xl mx-auto mt-8">
          <TopSalesProduct allDailyReportsData={dailyReportsForComponents}/>
        </div>
      </div>
    </>
  );
}

export default HomePage;