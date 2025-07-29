"use client"

import React from 'react';

import ReportSelectorAndPreview from './ReportSelectorAndPreview.jsx';
import ButtonExportLogic from './ButtonExportLogic.jsx';
import { useUnifiedReports } from '@/hooks/useUnifiedReports.jsx';

function ExportReportBox({ reports, selectedReport, onReportChange }) {
  // Obtener los datos normalizados usando el hook
  const { data: normalizedData } = useUnifiedReports();

  return (
    <div className="background-boxes border border-gray-200 p-6 rounded-lg shadow-md h-full flex flex-col">
      <div className="flex-shrink-0 mb-4">
        <h3 className="text-2xl font-semibold text-black flex flex-row gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            className="self-center size-6"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round">
              <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
              <path d="M16 22h2a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3.5"/>
              <path d="M4.017 11.512a6 6 0 1 0 8.466 8.475"/>
              <path d="M9 16a1 1 0 0 1-1-1v-4c0-.552.45-1.008.995-.917a6 6 0 0 1 4.922 4.922c.091.544-.365.995-.917.995z"/>
          </svg>
          Exportar Reporte
        </h3>
      </div>

      <div className="flex flex-col flex-1 min-h-0"> 
        <div className="flex-1 min-h-0 mb-4 overflow-y-auto">
          <ReportSelectorAndPreview
            reports={reports}
            selectedReport={selectedReport}
            onReportChange={onReportChange}
            normalizedData={normalizedData}
          />
        </div>
        
        {/* Botón fijo al final */}
        <div className="flex-shrink-0">
          <ButtonExportLogic
            selectedReport={selectedReport}
          />
        </div>
      </div>
    </div>
  );
}

export default ExportReportBox;