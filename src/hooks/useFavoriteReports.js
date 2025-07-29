// hooks/useFavoriteReports.js
import { useState, useEffect, useMemo, useCallback } from 'react';

// Nombre de la clave en localStorage para guardar los favoritos
const FAVORITES_STORAGE_KEY = 'favoriteReportIds';

export function useFavoriteReports(reports) {
  // Inicializamos leyendo de localStorage
  const [favoriteIds, setFavoriteIds] = useState(() => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return storedFavorites ? new Set(JSON.parse(storedFavorites)) : new Set();
    } catch (e) {
      console.error("Error al leer favoritos de localStorage:", e);
      return new Set();
    }
  });

  // Efecto para guardar los IDs favoritos en localStorage cada vez que cambian
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(favoriteIds)));
    } catch (e) {
      console.error("Error al guardar favoritos en localStorage:", e);
    }
  }, [favoriteIds]);

  // Función para alternar el estado de favorito de un reporte
  // Usamos useCallback para memoizarla y evitar renders innecesarios
  const toggleFavorite = useCallback((reportToToggle) => {
    setFavoriteIds(prevFavoriteIds => {
      const newFavoriteIds = new Set(prevFavoriteIds);
      const reportIdentifier = `${reportToToggle.id}-${reportToToggle.type}`; // Usa ID y tipo para identificar un reporte único

      if (newFavoriteIds.has(reportIdentifier)) {
        newFavoriteIds.delete(reportIdentifier);
      } else {
        newFavoriteIds.add(reportIdentifier);
      }
      return newFavoriteIds;
    });
  }, []);

  // Adjuntar el estado 'isFavorite' a cada reporte
  // Usamos useMemo para recalcular esto solo cuando 'reports' o 'favoriteIds' cambian
  const reportsWithFavorites = useMemo(() => {
    if (!reports || reports.length === 0) {
      return [];
    }
    return reports.map(report => ({
      ...report,
      isFavorite: favoriteIds.has(`${report.id}-${report.type}`)
    }));
  }, [reports, favoriteIds]);

  return {
    reportsWithFavorites,
    toggleFavorite,
    favoriteIds: Array.from(favoriteIds)
  };
}