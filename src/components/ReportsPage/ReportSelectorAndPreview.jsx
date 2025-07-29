"use client"

import React from 'react'

function ReportSelectorAndPreview({ selectedReport, normalizedData }) {
  if (!selectedReport) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col justify-center items-center text-gray-700">
        <h3 className="text-xl font-semibold mb-4">Selecciona un Reporte</h3>
        <p className="text-gray-500">Elige un reporte para ver sus estadísticas</p>
      </div>
    );
  }

  // Define valores por defecto
  const reportName = selectedReport.name || 'Reporte sin nombre';
  const reportNumber = selectedReport.details?.reportNumber || 'N/A';
  const reportDate = selectedReport.details?.date || 'N/A';
  const reportSummary = selectedReport.summary || 'Sin resumen disponible.';

  // Función para calcular estadísticas contextuales del reporte
  const getReportContextStats = () => {
    const reportType = selectedReport.type;
    const reportYear = selectedReport.year;
    const reportMonth = selectedReport.monthNumber;

    // Estadísticas base del reporte actual
    const baseStats = {
      type: reportType,
      year: reportYear,
      month: selectedReport.month
    };

    if (reportType === 'daily') {
      const currentDayValue = selectedReport.totalSalesForDay || 0;
      const sameMonthReports = normalizedData.daily.filter(r =>
        r.year === reportYear && r.monthNumber === reportMonth
      );
      const monthlyAverage = sameMonthReports.length > 0
        ? sameMonthReports.reduce((sum, r) => sum + (r.totalSalesForDay || 0), 0) / sameMonthReports.length
        : 0;

      const percentageVsMonthAvg = monthlyAverage > 0
        ? ((currentDayValue - monthlyAverage) / monthlyAverage * 100).toFixed(1)
        : 0;

      return {
        ...baseStats,
        currentValue: currentDayValue,
        monthlyAverage: monthlyAverage,
        percentageVsMonthAvg: percentageVsMonthAvg,
        breadsSold: selectedReport.breadsSoldForDay || 0,
        customersServed: selectedReport.details?.customersServed || 0,
        topProduct: selectedReport.details?.topProduct || 'N/A'
      };
    }

    if (reportType === 'monthly') {
      const currentMonthValue = selectedReport.mainMetricValue || 0;
      const sameYearReports = normalizedData.monthly.filter(r => r.year === reportYear);
      const yearlyAverage = sameYearReports.length > 0
        ? sameYearReports.reduce((sum, r) => sum + (r.mainMetricValue || 0), 0) / sameYearReports.length
        : 0;

      const percentageVsYearAvg = yearlyAverage > 0
        ? ((currentMonthValue - yearlyAverage) / yearlyAverage * 100).toFixed(1)
        : 0;

      return {
        ...baseStats,
        currentValue: currentMonthValue,
        yearlyAverage: yearlyAverage,
        percentageVsYearAvg: percentageVsYearAvg,
        netProfit: selectedReport.secondaryMetricValue || 0,
        profitMargin: currentMonthValue > 0
          ? ((selectedReport.secondaryMetricValue || 0) / currentMonthValue * 100).toFixed(1)
          : 0
      };
    }

    if (reportType === 'material') {
      const currentCost = selectedReport.mainMetricValue || 0;
      const sameYearReports = normalizedData.material.filter(r => r.year === reportYear);
      const yearlyAverage = sameYearReports.length > 0
        ? sameYearReports.reduce((sum, r) => sum + (r.mainMetricValue || 0), 0) / sameYearReports.length
        : 0;

      const percentageVsYearAvg = yearlyAverage > 0
        ? ((currentCost - yearlyAverage) / yearlyAverage * 100).toFixed(1)
        : 0;

      return {
        ...baseStats,
        currentValue: currentCost,
        yearlyAverage: yearlyAverage,
        percentageVsYearAvg: percentageVsYearAvg,
        mainIngredientCost: selectedReport.secondaryMetricValue || 0,
        mainIngredientPercentage: currentCost > 0
          ? ((selectedReport.secondaryMetricValue || 0) / currentCost * 100).toFixed(1)
          : 0
      };
    }

    return baseStats;
  };

  // Función para renderizar estadísticas específicas por tipo de forma más compacta
  const renderCompactStats = () => {
    if (contextStats.type === 'daily') {
      return (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Ventas del día:</span>
            <span className="font-semibold text-blue-600">Q{contextStats.currentValue.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Panes vendidos:</span>
            <span className="font-semibold text-green-600">{contextStats.breadsSold}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">vs Promedio mensual:</span>
            <span className={`font-semibold ${contextStats.percentageVsMonthAvg >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {contextStats.percentageVsMonthAvg >= 0 ? '+' : ''}{contextStats.percentageVsMonthAvg}%
            </span>
          </div>
          {contextStats.topProduct !== 'N/A' && (
            <div className="text-sm">
              <span className="text-gray-600">Producto top:</span>
              <div className="text-yellow-700 font-medium text-xs mt-1 bg-yellow-50 px-2 py-1 rounded">
                {contextStats.topProduct}
              </div>
            </div>
          )}
          {contextStats.customersServed > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Clientes atendidos:</span>
              <span className="font-semibold text-black">{contextStats.customersServed}</span>
            </div>
          )}
        </div>
      );
    }

    if (contextStats.type === 'monthly') {
      return (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Ventas del mes:</span>
            <span className="font-semibold text-blue-600">Q{contextStats.currentValue.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Ganancia neta:</span>
            <span className="font-semibold text-green-600">Q{contextStats.netProfit.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Margen de ganancia:</span>
            <span className="font-semibold text-indigo-600">{contextStats.profitMargin}%</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">vs Promedio anual:</span>
            <span className={`font-semibold ${contextStats.percentageVsYearAvg >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {contextStats.percentageVsYearAvg >= 0 ? '+' : ''}{contextStats.percentageVsYearAvg}%
            </span>
          </div>
        </div>
      );
    }

    if (contextStats.type === 'material') {
      return (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Costo total:</span>
            <span className="font-semibold text-red-600">Q{contextStats.currentValue.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Ingrediente principal:</span>
            <span className="font-semibold text-orange-600">Q{contextStats.mainIngredientCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">% Ingrediente principal:</span>
            <span className="font-semibold text-yellow-600">{contextStats.mainIngredientPercentage}%</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">vs Promedio anual:</span>
            <span className={`font-semibold ${contextStats.percentageVsYearAvg >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {contextStats.percentageVsYearAvg >= 0 ? '+' : ''}{contextStats.percentageVsYearAvg}%
            </span>
          </div>
        </div>
      );
    }

    return null;
  };

  const contextStats = getReportContextStats();

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 mb-4 p-2 bg-gray-50 border border-gray-200 rounded-md">
        <p className="block text-black text-sm mb-2">
          Reporte actual para exportar: <span className="font-bold">{reportName}</span>
        </p>
        <div className="flex justify-between items-center">
          <span className="text-sm"><span className="font-bold">Número de reporte:</span> {reportNumber}</span>
        </div>
      </div>

      <div className="flex flex-row gap-4 flex-1 min-h-0">
        <div className="w-1/4 bg-gray-50 border border-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
          <div className="text-gray-400 text-xs text-center p-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="40" height="40" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="mx-auto mb-2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <p className="text-xs leading-tight">No hay vista previa disponible</p>
          </div>
        </div>

        <div className="w-3/4 bg-gray-50 rounded-md border border-gray-200 overflow-y-auto custom-scrollbar">
          <div className="p-4">
            <div className="border-b border-gray-300 pb-3 mb-3">
              <span className="font-bold text-gray-700 text-sm">Fecha:</span>
              <span className="text-gray-600 text-sm"> {reportDate}</span>
            </div>

            <div className="mb-4">
              <div className="font-bold text-gray-700 text-sm mb-3">Estadísticas:</div>
              {renderCompactStats()}
            </div>

            <div className="border-t border-gray-300 pt-3">
              <div className="font-bold text-gray-700 text-sm mb-2">Notas:</div>
              <div className="text-gray-600 text-sm leading-relaxed">
                {reportSummary}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportSelectorAndPreview;