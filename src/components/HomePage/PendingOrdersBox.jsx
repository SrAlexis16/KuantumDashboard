import React from 'react';

function PendingOrdersBox() {
  return (
    <div className="background-boxes p-6 rounded-lg shadow-lg flex flex-col justify-between h-[600px]">
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
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M12 7v5l4 2" />
        </svg>
        Pedidos Pendientes
      </h3>

      <div className="flex-grow overflow-y-auto custom-scrollbar">
        {/* Aqui se llamaria una API si es que existiese */}
        <ul className="list-disc list-inside text-black">
          <li>Pan de Yema - 50 unidades (entrega 10:00 AM)</li>
          <li>Rosca de Queso - 15 unidades (entrega 11:30 AM)</li>
          <li>Galletas de Mantequilla - 100 unidades (entrega 02:00 PM)</li>
        </ul>
        <p className="text-gray-500 mt-4">Sin pedidos pendientes por ahora.</p>
      </div>
      <p className="text-gray-500 text-sm mt-4">Última actualización: {new Date().toLocaleTimeString('es-GT')}</p>
      <button className="mt-6 background-boxes-interior background-boxes-interior:hover text-white font-bold py-2 px-4 rounded-lg">
        Ver todos los pedidos
      </button>
    </div>
  );
}

export default PendingOrdersBox;