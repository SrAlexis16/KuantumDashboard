"use client"

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

import { useUnifiedReports } from '../hooks/useUnifiedReports.jsx';
import { useFavoriteReports } from '../hooks/useFavoriteReports.js';

import ExportReportBox from '../components/ReportsPage/ExportReportBox.jsx';
import SearchReportsBox from '../components/ReportsPage/SearchReportsBox.jsx';
import GraphicsDisplayBox from '../components/ReportsPage/GraphicsDisplayBox.jsx';
import FeaturedReportsButton from '../components/ReportsPage/FeaturedReportsButton.jsx';
import { Button } from '@/components/ui/button.jsx';

function ReportsPage() {
  //  Usa useUnifiedReports para obtener todos los datos unificados
  const { data: unifiedReportsData, loading, error } = useUnifiedReports();

  // Usa useFavoriteReports para manejar los favoritos sobre los reportes unificados
  const { reportsWithFavorites, toggleFavorite } = useFavoriteReports(unifiedReportsData.all);

  // Estados locales para la UI de esta página
  const [currentReportType, setCurrentReportType] = useState(() => localStorage.getItem('currentReportTypeReportsPage') || 'daily');
  const [selectedReport, setSelectedReport] = useState(null);

  // Usar useRef para evitar re-cálculos innecesarios
  const transitionTimeoutRef = useRef(null);

  // Memoizar con dependencias más específicas
  const reportsByType = useMemo(() => {
    if (!reportsWithFavorites.length) return { daily: [], monthly: [], rawMaterial: [] };

    const categorized = {
      daily: [],
      monthly: [],
      rawMaterial: []
    };

    // Usar for loop para mejor rendimiento que filter
    for (const report of reportsWithFavorites) {
      switch (report.type) {
        case 'daily':
          categorized.daily.push(report);
          break;
        case 'monthly':
          categorized.monthly.push(report);
          break;
        case 'material':
          categorized.rawMaterial.push(report);
          break;
      }
    }

    return categorized;
  }, [reportsWithFavorites]);

  // Memoizar los reportes actuales con dependencias mínimas
  const currentReports = useMemo(() =>
    reportsByType[currentReportType] || [],
    [reportsByType, currentReportType]
  );

  // Mejorar la inicialización del selectedReport
  useEffect(() => {
    if (loading || !reportsWithFavorites.length) return;

    // Solo actualizar si no hay reporte seleccionado o si el actual no pertenece al tipo actual
    const needsUpdate = !selectedReport ||
      (selectedReport.type !== currentReportType &&
        selectedReport.type !== (currentReportType === 'rawMaterial' ? 'material' : currentReportType));

    if (needsUpdate) {
      const savedId = localStorage.getItem('selectedReportIdReportsPage');
      let initialReport = null;

      // Buscar el reporte guardado solo si es del tipo actual
      if (savedId) {
        initialReport = currentReports.find(r => r.id === savedId);
      }

      // Si no hay guardado válido, tomar el primero del tipo actual
      if (!initialReport && currentReports.length > 0) {
        initialReport = currentReports[0];
      }

      if (initialReport !== selectedReport) {
        setSelectedReport(initialReport);
      }
    }
  }, [loading, reportsWithFavorites.length, currentReportType, currentReports, selectedReport]);

  // Debounce del localStorage para evitar writes excesivos
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('currentReportTypeReportsPage', currentReportType);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [currentReportType]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (selectedReport) {
        localStorage.setItem('selectedReportIdReportsPage', selectedReport.id);
      } else {
        localStorage.removeItem('selectedReportIdReportsPage');
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [selectedReport]);

  // OPTIMIZACIÓN 7: Handler optimizado sin setTimeout artificial
  const handleReportTypeChange = useCallback((newType) => {
    // Limpiar timeout previo si existe
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    setCurrentReportType(newType);

    // Actualizar el reporte seleccionado al primero del nuevo tipo
    const newTypeReports = reportsByType[newType] || [];
    const newSelectedReport = newTypeReports.length > 0 ? newTypeReports[0] : null;

    if (newSelectedReport !== selectedReport) {
      setSelectedReport(newSelectedReport);
    }
  }, [reportsByType, selectedReport]);

  // Handler de selección más eficiente
  const handleSelectReport = useCallback((report) => {
    if (report === selectedReport) return; // Evitar actualizaciones innecesarias
    setSelectedReport(report);

    // Solo cambiar tipo si es diferente y el reporte existe
    if (report && report.type) {
      const newType = report.type === 'material' ? 'rawMaterial' : report.type;
      if (newType !== currentReportType) {
        setCurrentReportType(newType);
      }
    }
  }, [currentReportType, selectedReport]);

  // Memoizar datos para componentes pesados
  const exportReportData = useMemo(() => ({
    reports: currentReports,
    selectedReport,
    normalizedData: unifiedReportsData,
    reportType: currentReportType
  }), [currentReports, selectedReport, unifiedReportsData, currentReportType]);

  const searchReportData = useMemo(() => ({
    reports: currentReports,
    reportType: currentReportType
  }), [currentReports, currentReportType]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

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
      <div className="relative p-6 h-full flex items-center justify-center text-red-600">
        <p>Error al cargar los reportes: {error}</p>
      </div>
    );
  }

  // Mostrar datos cargados 
  return (
    <div className="relative p-6 h-full flex flex-col page-content">
      <div className="flex justify-between items-center z-10 min-h-[60px] mb-4">
        <FeaturedReportsButton
          favoriteReports={reportsWithFavorites.filter(r => r.isFavorite)}
          onReportSelect={handleSelectReport}
        />
        <div className="flex gap-2 shadow-lg rounded-lg p-2 bg-white">
          {['daily', 'monthly', 'rawMaterial'].map((type) => (
            <Button
              key={type}
              onClick={() => handleReportTypeChange(type)}
              className={`${
                currentReportType === type
                  ? 'bg-black text-white hover:bg-black/90'
                  : 'bg-white text-black hover:bg-white/90'
              } transition-colors duration-200 ease-in-out`}
            >
              {type === 'daily' ? 'Reportes Diarios' : type === 'monthly' ? 'Reportes Mensuales' : 'Materia Prima'} ({reportsByType[type]?.length || 0})
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6 flex-grow transition-opacity duration-150 ease-out">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-3/5 h-full">
            <div className="h-[565px] overflow-y-auto pr-2 custom-scrollbar">
              <ExportReportBox
                reports={exportReportData.reports}
                selectedReport={exportReportData.selectedReport}
                normalizedData={exportReportData.normalizedData}
                onReportChange={(e) => {
                  const foundReport = currentReports.find(r => r.id === e.target.value);
                  if (foundReport && foundReport !== selectedReport) {
                    handleSelectReport(foundReport);
                  }
                }}
                onToggleFavorite={toggleFavorite}
                reportType={exportReportData.reportType}
              />
            </div>
          </div>

          <div className="w-full lg:w-2/5 h-[565px] overflow-y-auto pr-2">
            <SearchReportsBox
              reports={searchReportData.reports}
              onToggleFavorite={toggleFavorite}
              onReportSelect={handleSelectReport}
              reportType={searchReportData.reportType}
            />
          </div>
        </div>

        <div className="w-full">
          <GraphicsDisplayBox
            selectedReport={selectedReport}
            allReports={unifiedReportsData}
            currentReportType={currentReportType}
          />
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;