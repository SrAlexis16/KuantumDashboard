"use client"

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useUnifiedReports } from '@/hooks/useUnifiedReports'; 
import { NavLink, useLocation } from 'react-router-dom';

import LogoUrl from "@/ui/Logo.png";

import { Input } from "@/components/ui/input";
import { Search, Calendar, FileText, Tag, TrendingUp, Package } from "lucide-react";
import NavBarDialog from './NavBarDialog';

const PAGE_TITLES = {
  '/': 'Inicio',
  '/reports': 'Reportes',
  '/settings': 'Configuración',
};

const ICON_MAP = {
  'daily': Calendar,
  'monthly': TrendingUp,
  'material': Package,
  'id': Tag,
  'name': FileText,
  'reportNumber': FileText,
  'date': Calendar
};

const TYPE_LABELS = {
  'id': 'ID',
  'name': 'Nombre',
  'reportNumber': 'Número',
  'type': 'Tipo',
  'date': 'Fecha',
  'month': 'Mes',
  'year': 'Año'
};

const REPORT_TYPE_LABELS = {
  'daily': 'Diario',
  'monthly': 'Mensual',
  'material': 'Materia Prima'
};

function NavBar() {
  const location = useLocation();
  const { data, loading } = useUnifiedReports();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  const OnlineStore = "https://github.com/SrAlexis16/KuantumDashboard";
  const currentPageTitle = PAGE_TITLES[location.pathname] || 'Página Desconocida';

  const formatDate = useCallback((report) => {
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    
    if (report.fullDateISO) {
      return new Date(report.fullDateISO).toLocaleDateString('es-ES', dateOptions);
    }
    if (report.displayDate && report.displayDate !== 'N/A') {
      return new Date(report.displayDate).toLocaleDateString('es-ES', dateOptions);
    }
    return `${report.month} ${report.year}`;
  }, []);

  // Índice de búsqueda optimizado
  const searchIndex = useMemo(() => {
    if (loading || !data?.all) return new Map();
    
    const index = new Map();
    
    data.all.forEach(report => {
      const searchableFields = [
        { value: report.id, type: 'id' },
        { value: report.name, type: 'name' },
        { value: report.reportNumber?.toString(), type: 'reportNumber' },
        { value: report.type, type: 'type' },
        { value: formatDate(report), type: 'date' },
        { value: report.month, type: 'month' },
        { value: report.year?.toString(), type: 'year' }
      ];

      searchableFields.forEach(({ value, type }) => {
        if (!value?.toString().trim()) return;
        
        const normalizedValue = value.toString().toLowerCase();
        const addToIndex = (key) => {
          if (!index.has(key)) index.set(key, []);
          index.get(key).push({ report, type, matchText: value });
        };

        // Indexar valor completo
        addToIndex(normalizedValue);
        
        // Indexar palabras individuales (solo si tienen más de 1 carácter)
        normalizedValue.split(/\s+/).forEach(word => {
          if (word.length > 1) addToIndex(word);
        });
      });
    });

    return index;
  }, [data, loading, formatDate]);

  // Búsqueda optimizada
  const getSuggestions = useCallback((query) => {
    if (!query.trim() || query.length < 2 || loading) return [];

    const queryLower = query.toLowerCase();
    const results = new Map();
    
    searchIndex.forEach((matches, indexedTerm) => {
      if (!indexedTerm.includes(queryLower)) return;
      
      matches.forEach(match => {
        const key = `${match.report.id}-${match.type}`;
        if (results.has(key)) return;
        
        // Calcular score
        let score = 60; // Base score
        if (indexedTerm === queryLower) score = 100;
        else if (indexedTerm.startsWith(queryLower)) score = 80;
        
        results.set(key, { ...match, score });
      });
    });

    return Array.from(results.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [searchIndex, loading]);

  // Debounce del término de búsqueda
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchTerm(searchTerm), 200);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Update suggestions when debounced term changes
  useEffect(() => {
    if (debouncedSearchTerm.length >= 2) {
      const newSuggestions = getSuggestions(debouncedSearchTerm);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    setSelectedSuggestion(-1);
  }, [debouncedSearchTerm, getSuggestions]);

  // Limpiar búsqueda al cambiar de ruta
  useEffect(() => {
    setSearchTerm('');
    setShowSuggestions(false);
    setSelectedSuggestion(-1);
  }, [location.pathname]);

  // Click fuera del componente
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current && !searchRef.current.contains(event.target) &&
        suggestionsRef.current && !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openReportDialog = useCallback((report) => {
    setSelectedReport(report);
    setIsDialogOpen(true);
    setSearchTerm('');
    setShowSuggestions(false);
    setSelectedSuggestion(-1);
  }, []);

  const closeDialog = useCallback(() => {
    setIsDialogOpen(false);
    setSelectedReport(null);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    
    let targetReport = null;
    if (selectedSuggestion >= 0 && suggestions[selectedSuggestion]) {
      targetReport = suggestions[selectedSuggestion].report;
    } else {
      const bestMatch = getSuggestions(searchTerm);
      targetReport = bestMatch.length > 0 ? bestMatch[0].report : null;
    }

    if (targetReport) {
      openReportDialog(targetReport);
    }

    setShowSuggestions(false);
    setSelectedSuggestion(-1);
  };

  const handleSuggestionClick = (suggestion) => {
    setShowSuggestions(false);
    setSelectedSuggestion(-1);
    openReportDialog(suggestion.report);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestion(prev => prev < suggestions.length - 1 ? prev + 1 : prev);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestion(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        if (selectedSuggestion >= 0) {
          e.preventDefault();
          handleSuggestionClick(suggestions[selectedSuggestion]);
        } else {
          handleSearchSubmit(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestion(-1);
        break;
    }
  };

  // Mostar estado de carga
  if (loading) {
    return (
      <nav className="bg-white shadow-lg rounded-full py-4 flex justify-center items-center max-w-5xl mx-auto mt-6 px-6 mb-3">
        <span className="text-gray-500">Cargando datos...</span>
      </nav>
    );
  }

  return (
    <>
      <nav className="bg-white shadow-lg rounded-full py-4 flex justify-center items-center max-w-5xl mx-auto mt-6 px-6 mb-3">
        <div className="w-full flex justify-between items-center ml-2.5">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <a href={OnlineStore} target="_blank" rel="noopener noreferrer">
                <img src={LogoUrl} alt="Logo de la aplicación" className="h-10 w-auto cursor-pointer" />
              </a>
            </div>
            
            <div className="text-center" style={{ minWidth: '250px' }}>
              <span className="text-xl font-semibold text-black">{currentPageTitle}</span>
            </div>
            
            <ul className="flex gap-6 list-none p-0 m-0">
              <li>
                <NavLink to="/" className={({ isActive }) => isActive ? "text-black" : "text-gray-500 hover:text-gray-700"}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                    <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  </svg>
                </NavLink>
              </li>
              <li>
                <NavLink to="/reports" className={({ isActive }) => isActive ? "text-black" : "text-gray-500 hover:text-gray-700"}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                    <path d="M8 2v4" />
                    <path d="M12 2v4" />
                    <path d="M16 2v4" />
                    <rect width="16" height="18" x="4" y="4" rx="2" />
                    <path d="M8 10h6" />
                    <path d="M8 14h8" />
                    <path d="M8 18h5" />
                  </svg>
                </NavLink>
              </li>
              <li>
                <NavLink to="/settings" className={({ isActive }) => isActive ? "text-black" : "text-gray-500 hover:text-gray-700"}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                    <path d="M21 16V8a2 2 0 0 1-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Buscar reportes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => debouncedSearchTerm.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
                  className="pl-10 pr-4 h-10 rounded-full text-sm w-[250px] shadow-sm border-gray-300 focus-visible:ring-1 focus-visible:ring-black transition duration-200"
                  autoComplete="off"
                />
              </div>
            </form>

            {showSuggestions && (
              <div
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
                style={{ width: '420px' }}
              >
                {suggestions.map((suggestion, index) => {
                  const IconComponent = ICON_MAP[suggestion.type] || FileText;
                  
                  return (
                    <div
                      key={`${suggestion.report.id}-${suggestion.type}-${index}`}
                      className={`px-4 py-3 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0 ${
                        index === selectedSuggestion ? 'bg-gray-100' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900 truncate">
                              {suggestion.matchText}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <span>{TYPE_LABELS[suggestion.type] || suggestion.type}</span>
                            <span>•</span>
                            <span>{REPORT_TYPE_LABELS[suggestion.report.type] || suggestion.report.type}</span>
                            <span>•</span>
                            <span className="truncate">{suggestion.report.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </nav>

      <NavBarDialog
        report={selectedReport}
        isOpen={isDialogOpen}
        onClose={closeDialog}
      />
    </>
  );
}

export default NavBar;