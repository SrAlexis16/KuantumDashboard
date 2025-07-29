"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { ProductsBarChart } from "@/components/ui/ProductsBarChart";
import { DatePickerWithFilter } from '@/components/ui/DatePickerWithFilter';
import { YearSelector } from '@/components/ui/YearSelector';
import { ButtonToggleTSP } from '@/components/HomePage/ButtonToggleTSP';
import { MonthSelector } from '@/components/ui/MonthSelector';
import { format, isValid } from 'date-fns';

// Mapeo de nombres de meses en español a números
const monthNamesMap = {
  "enero": 0, "febrero": 1, "marzo": 2, "abril": 3, "mayo": 4, "junio": 5,
  "julio": 6, "agosto": 7, "septiembre": 8, "octubre": 9, "noviembre": 10, "diciembre": 11
};

// Parsear fechas en formato español a objetos Date
const parseDailyReportDate = (dateString) => {
  if (!dateString) return null;
  const match = dateString.match(/(\d{1,2}) de ([a-zA-Z]+) de (\d{4})/);
  if (match && match.length === 4) {
    const day = parseInt(match[1], 10);
    const month = monthNamesMap[match[2].toLowerCase()];
    const year = parseInt(match[3], 10);
    const date = new Date(year, month, day);
    if (isValid(date)) return date;
  }
  return null;
};

function TopSalesProduct({ allDailyReportsData }) {
  const [processedData, setProcessedData] = useState([]);
  const [viewMode, setViewMode] = useState('month');
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [selectedYear, setSelectedYear] = useState(undefined);

  /**
   * Memo que procesa los reportes diarios agregando la fecha parseada a cada reporte
   * Se ejecuta cuando cambia allDailyReportsData
   */
  const processedDailyReports = useMemo(() => {
    if (!allDailyReportsData?.length) return [];
    return allDailyReportsData.map(report => ({
      ...report,
      parsedDate: report.details?.date ? parseDailyReportDate(report.details.date) : null,
    }));
  }, [allDailyReportsData]);

  /**
   * Memo que extrae todos los meses únicos disponibles en formato 'YYYY-MM'
   * Se usa para poblar el selector de meses
   */
  const availableMonths = useMemo(() => {
    const dates = new Set();
    processedDailyReports.forEach(r => r.parsedDate && dates.add(format(r.parsedDate, 'yyyy-MM')));
    return Array.from(dates).sort();
  }, [processedDailyReports]);

  /**
   * Memo que extrae todos los días únicos disponibles en formato 'YYYY-MM-DD'
   * Se usa para poblar el selector de días
   */
  const availableDays = useMemo(() => {
    const dates = new Set();
    processedDailyReports.forEach(r => r.parsedDate && dates.add(format(r.parsedDate, 'yyyy-MM-dd')));
    return Array.from(dates).sort();
  }, [processedDailyReports]);

  /**
   * Memo que extrae todos los años únicos disponibles
   * Se usa para poblar el selector de años
   */
  const availableYears = useMemo(() => {
    const years = new Set();
    processedDailyReports.forEach(r => r.parsedDate && years.add(r.parsedDate.getFullYear()));
    return Array.from(years).sort((a, b) => a - b);
  }, [processedDailyReports]);

  /**
   * Effect que inicializa las fechas/años seleccionados por defecto
   * Se ejecuta cuando cambia el modo de vista o cuando se cargan los datos disponibles
   * Selecciona automáticamente el último período disponible según el modo de vista
   */
  useEffect(() => {
    if (viewMode === 'month' && availableMonths.length && !selectedDate) {
      const [year, month] = availableMonths.at(-1).split('-').map(Number);
      setSelectedDate(new Date(year, month - 1, 1));
    } else if (viewMode === 'year' && availableYears.length && !selectedYear) {
      setSelectedYear(availableYears.at(-1));
    } else if (viewMode === 'day' && availableDays.length && !selectedDate) {
      const [year, month, day] = availableDays.at(-1).split('-').map(Number);
      setSelectedDate(new Date(year, month - 1, day));
    }
  }, [viewMode, availableMonths, availableYears, availableDays, selectedDate, selectedYear]);

  /**
   * Effect principal que procesa los datos de ventas según el modo de vista y filtros seleccionados
   * Agrupa las ventas por producto, calcula totales de cantidad y ingresos,
   * y genera el array de datos procesados para el gráfico
   */
  useEffect(() => {
    if (!processedDailyReports?.length) return setProcessedData([]);

    const productSales = {};
    const productRevenue = {};

    let reportsToProcess = [];

    // Filtrar reportes según el modo de vista y la selección del usuario
    if (viewMode === 'month' && selectedDate) {
      const y = selectedDate.getFullYear(), m = selectedDate.getMonth();
      reportsToProcess = processedDailyReports.filter(r =>
        r.parsedDate?.getFullYear() === y && r.parsedDate?.getMonth() === m
      );
    } else if (viewMode === 'year' && selectedYear) {
      reportsToProcess = processedDailyReports.filter(r =>
        r.parsedDate?.getFullYear() === selectedYear
      );
    } else if (viewMode === 'day' && selectedDate) {
      reportsToProcess = processedDailyReports.filter(r =>
        r.parsedDate?.toDateString() === selectedDate.toDateString()
      );
    }

    // Acumular ventas y ingresos por producto
    reportsToProcess.forEach(({ details }) => {
      const name = details?.topProduct;
      const qty = details?.breadsSold;
      const sales = details?.totalSales;

      if (name && typeof qty === 'number' && typeof sales === 'number') {
        productSales[name] = (productSales[name] || 0) + qty;
        productRevenue[name] = (productRevenue[name] || 0) + sales;
      }
    });

    // Ordenar productos por cantidad vendida y tomar los top 5
    const sorted = Object.entries(productSales)
      .map(([name, quantity]) => ({
        name,
        quantity,
        totalSales: productRevenue[name] || 0
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    setProcessedData(sorted);
  }, [viewMode, selectedDate, selectedYear, processedDailyReports]);

  /**
   * Función que maneja el cambio de modo de vista (día/mes/año)
   * Resetea las selecciones de fecha/año al cambiar el modo
   * @param {string} mode - El nuevo modo de vista ('day', 'month', 'year')
   */
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    setSelectedDate(undefined);
    setSelectedYear(undefined);
  };

  return (
    <div className="background-boxes p-6 rounded-lg shadow-lg flex flex-col mt-4 min-h-[500px]">
      <h3 className="text-2xl font-semibold text-black mb-4 flex flex-row gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          className="self-center size-6"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round">
          <path
            d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"
          />
          <circle cx="12" cy="8" r="6" />
        </svg>
        Productos Más Vendidos
      </h3>

      <div className="mb-4 flex items-center">
        <span className="text-sm font-semibold text-gray-700 mr-2">Visualizar por:</span>
        <ButtonToggleTSP viewMode={viewMode} onModeChange={handleViewModeChange} />
      </div>

      <div className="mb-4">
        <div className="min-h-[70px] flex flex-col justify-start">
          {viewMode === 'day' && (
            <div className="flex flex-col gap-2">
              <span className="text-gray-700">Selecciona un día en específico:</span>
              <DatePickerWithFilter
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                availableDates={availableDays}
              />
            </div>
          )}
          {viewMode === 'month' && (
            <div className='flex flex-col gap-2'>
            <span className="text-gray-700">Selecciona un mes en específico:</span>
            <MonthSelector
              selectedMonthDate={selectedDate}
              onMonthSelect={setSelectedDate}
              availableMonths={availableMonths}
            />
            </div>
          )}
          {viewMode === 'year' && (
            <div className='flex flex-col gap-2'>
            <span className="text-gray-700">Selecciona un año en específico:</span>
            <YearSelector
              selectedYear={selectedYear}
              onYearSelect={setSelectedYear}
              availableYears={availableYears}
            />
            </div>
          )}
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center transition-all duration-300 ease-in-out">
        <ProductsBarChart data={processedData} />
      </div>
    </div>
  );
}

export default TopSalesProduct;