"use client"

import React, { useState, useEffect } from 'react';
import { ChartAreaLegend } from '@/components/ui/ChartAreaLegend';
import { YearSelector } from '@/components/ui/YearSelector';
import { Button } from '@/components/ui/button';
import { useUnifiedReports } from '@/hooks/useUnifiedReports';

function MonthlyViewToggle() {
  const [currentView, setCurrentView] = useState('sales');
  const [selectedYear, setSelectedYear] = useState(undefined);
  const [chartDisplayType, setChartDisplayType] = useState('area');

  // Usar el hook unificado
  const { 
    loading, 
    error, 
    getAvailableYears, 
    getChartData,
  } = useUnifiedReports();

  // Obtener años disponibles
  const availableYears = getAvailableYears;

  // Establecer año por defecto
  useEffect(() => {
    if (availableYears.length > 0 && selectedYear === undefined) {
      setSelectedYear(availableYears[0]); // El año más reciente
    }
  }, [availableYears, selectedYear]);

  // Obtener datos del gráfico
  const chartData = selectedYear ? getChartData(selectedYear, currentView) : [];

  // Determinar tipo de gráfico basado en cantidad de datos
  useEffect(() => {
    setChartDisplayType(chartData.length <= 1 ? 'bar' : 'area');
  }, [chartData.length]);

  const chartConfig = {
    desktop: {
      label: currentView === 'sales' ? "Ventas Totales (Q)" : "Costo Total MP (Q)",
      color: "var(--chart-1)",
    },
    mobile: {
      label: currentView === 'sales' ? "Panes Vendidos" : "Costo Ingrediente Clave (Q)",
      color: "var(--chart-2)",
    },
  };

  // Mostar estados de carga o error
  if (loading) {
    return (
      <div className="background-boxes p-6 rounded-lg shadow-md flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando reportes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="background-boxes p-6 rounded-lg shadow-md">
        <div className="text-center text-red-600">
          <p className="font-semibold">Error al cargar datos:</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="background-boxes p-6 rounded-lg shadow-md flex flex-col max-h-[600px]">
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
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="M10 9H8" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
        </svg>
        Reportes Generales
      </h3>

      <div className="flex space-x-2 mb-4 justify-start items-center">
        <Button
          onClick={() => setCurrentView('sales')}
          className={`${currentView === 'sales'
            ? 'bg-black text-white hover:bg-black/90'
            : 'bg-white text-black hover:bg-white/90'
          }`}
        >
          <p>Ventas Mensuales</p>
        </Button>

        <Button
          onClick={() => setCurrentView('rawMaterial')}
          className={`${currentView === 'rawMaterial'
            ? 'bg-black text-white hover:bg-black/90'
            : 'bg-white text-black hover:bg-white/90'
          }`}
        >
          <p>Materia Prima</p>
        </Button>

        <YearSelector
          selectedYear={selectedYear}
          onYearSelect={setSelectedYear}
          availableYears={availableYears}
        />
      </div>

      {chartData.length > 0 && (
        <div className="mb-6 -mt-2">
          <ChartAreaLegend
            data={chartData}
            config={chartConfig}
            title={currentView === 'sales' ? 
              `Gráfico de Ventas Anuales (${selectedYear})` : 
              `Gráfico de Costo de Materia Prima Anual (${selectedYear})`}
            description={currentView === 'sales' ? 
              `Tendencia de ventas y panes vendidos en ${selectedYear}` : 
              `Tendencia del costo total y costo de ingrediente clave en ${selectedYear}`}
            chartType={chartDisplayType}
          />
        </div>
      )}

      {chartData.length === 0 && selectedYear && (
        <div className="text-center text-gray-600 py-8">
          <p className="text-lg font-medium mb-2">
            No hay datos disponibles
          </p>
          <p className="text-sm">
            No se encontraron reportes de {currentView === 'sales' ? 'ventas' : 'materia prima'} para el año {selectedYear}
          </p>
        </div>
      )}
    </div>
  );
}

export default MonthlyViewToggle;