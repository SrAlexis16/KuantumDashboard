"use client"

import React from "react";
import ChartBarInteractive from "@/components/ui/ChartBarInteractive";

function DVToggleGraphics({ selectedReport, allReports, currentReportType }) {
  if (!selectedReport || currentReportType !== "daily") return null;

  const dailyReports = allReports?.daily || [];

  // Preparar datos para el gráfico
  const chartData = dailyReports.map(report => ({
    date: report.details?.date || report.id.split('-').slice(-3).join('-'), // Extraer fecha del ID si no existe
    totalSales: report.details?.totalSales || 0,
    breadsSold: report.details?.breadsSold || 0,
    customersServed: report.details?.customersServed || 0
  }));

  // Configuración del gráfico
  const chartConfig = {
    totalSales: {
      label: " Ventas Totales",
      color: "#0c3953",
    },
    breadsSold: {
      label: " Panes Vendidos", 
      color: "#094c72",
    },
    customersServed: {
      label: " Clientes Atendidos",
      color: "#055a8c",
    },
  };


  return (
    <div className="w-full flex flex-col gap-4">
      <ChartBarInteractive 
        chartData={chartData}
        chartConfig={chartConfig}
        label="Reportes Diarios - Análisis Interactivo"
        description="Selecciona una métrica para visualizar su evolución en el tiempo"
      />

    </div>
  );
}

export { DVToggleGraphics };