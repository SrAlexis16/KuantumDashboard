"use client"

import React from 'react';

function QuickReportViewBox({ reports, displayedReport, setDisplayedReport, toggleFavorite }) {
  const [quickViewSearchTerm, setQuickViewSearchTerm] = React.useState('');
  const [showSearchResults, setShowSearchResults] = React.useState(false);
  const searchResultsRef = React.useRef(null);

  const filteredReportsForQuickView = reports.filter(report =>
    report.name.toLowerCase().includes(quickViewSearchTerm.toLowerCase())
  );

  const reportDetails = displayedReport?.details || {};

  const reportInfo = {
    date: reportDetails.date || 'N/A',
    info: reportDetails.info || null,
    reportNumber: reportDetails.reportNumber || 'N/A',
    totalSales: typeof reportDetails.totalSales === 'number' ? `Q ${reportDetails.totalSales.toFixed(2)}` : null,
    breadsSold: typeof reportDetails.breadsSold === 'number' ? reportDetails.breadsSold : null,
    topProduct: reportDetails.topProduct || null,
    customersServed: typeof reportDetails.customersServed === 'number' ? reportDetails.customersServed : null,
  };

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchResultsRef]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 flex flex-col h-[560px] relative">
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
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="M4.268 21a2 2 0 0 0 1.727 1H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3" />
            <path d="M9 18l-1.5-1.5" />
            <circle cx="5" cy="14" r="3" />
        </svg>
        Visualización Rápida
      </h3>

      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Buscar reporte..."
          className="flex-grow p-3 border border-gray-300 bg-gray-50 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-black focus:ring focus:ring-gray-300 text-base w-full"
          value={quickViewSearchTerm}
          onChange={(e) => {
            setQuickViewSearchTerm(e.target.value);
            setShowSearchResults(true);
          }}
          onFocus={() => setShowSearchResults(true)}
        />

        {showSearchResults && quickViewSearchTerm.trim() !== '' && filteredReportsForQuickView.length > 0 && (
          <div
            ref={searchResultsRef}
            className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow overflow-y-auto max-h-[200px]"
          >
            {filteredReportsForQuickView.map(report => (
              <div
                key={report.id} // Asegúrate que cada reporte tiene un 'id' único
                className="p-2 cursor-pointer hover:bg-gray-100 text-sm text-gray-800 border-b border-gray-100 last:border-b-0"
                onClick={() => {
                  setDisplayedReport(report);
                  setQuickViewSearchTerm(report.name);
                  setShowSearchResults(false);
                }}
              >
                {report.name}
              </div>
            ))}
          </div>
        )}

        {showSearchResults && quickViewSearchTerm.trim() !== '' && filteredReportsForQuickView.length === 0 && (
          <div
            ref={searchResultsRef}
            className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-md p-2"
          >
            <p className="p-2 text-gray-500 text-sm">No se encontraron resultados.</p>
          </div>
        )}
      </div>

      {/* Panel de detalles del reporte seleccionado */}
      <div className="flex bg-gray-50 flex-col flex-grow border border-gray-200 rounded-md p-4 overflow-y-auto">
        {displayedReport ? (
          <>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold text-gray-800">{displayedReport.name || 'Reporte no seleccionado'}</h3>
              {displayedReport.id && (
                <button
                  onClick={() => toggleFavorite(displayedReport)}
                  className={`p-1 rounded-full transition-colors duration-200 ${
                    displayedReport.isFavorite ? 'text-yellow-500 hover:text-yellow-400' : 'text-gray-400 hover:text-gray-500'
                  } cursor-pointer`}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.92 8.72a1 1 0 01.588-1.81h3.462a1 1 0 00.95-.69L9.049 2.927z" />
                  </svg>
                </button>
              )}
            </div>
            <p className="text-gray-700 mb-2"><span className="font-semibold">Fecha:</span> {reportInfo.date}</p>
            <p className="text-gray-700 mb-2"><span className="font-semibold">Nº Reporte:</span> {reportInfo.reportNumber}</p>
            <p className="text-gray-700 mb-4"><span className="font-semibold">Resumen:</span> {displayedReport.summary || 'Sin resumen.'}</p>
            <p className="text-gray-700 font-semibold mt-4 mb-2">Información Adicional:</p>
              <ul className="list-disc list-inside text-gray-700 ml-4">
                {reportInfo.totalSales && (
                  <li><span className="font-semibold">Total de Ventas:</span> {reportInfo.totalSales}</li>
                )}
                {reportInfo.breadsSold && (
                  <li><span className="font-semibold">Total de Pan Vendido:</span> {reportInfo.breadsSold}</li>
                )}
                {reportInfo.topProduct && (
                  <li><span className="font-semibold">Pan Más Vendido:</span> {reportInfo.topProduct}</li>
                )}
                {reportInfo.customersServed && (
                  <li><span className="font-semibold">Clientes Atendidos:</span> {reportInfo.customersServed}</li>
                )}
              </ul>
            </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-600 text-center">No hay reporte seleccionado o disponible.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuickReportViewBox;