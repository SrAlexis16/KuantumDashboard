"use client"

import React, { useState, useEffect } from 'react';

import { Button } from "@/components/ui/button";
import { X, Copy, Calendar, FileText, Tag, TrendingUp, Package, Check } from "lucide-react";

function NavBarDialog({ report, isOpen, onClose }) {
  const [copiedFields, setCopiedFields] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Controlar la animación de entrada y salida
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10); // Pequeño delay para trigger animation
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 300); // Esperar a que termine la animación
    }
  }, [isOpen]);

  if (!isVisible || !report) return null;

  // Función para formatear fecha
  const formatDate = (report) => {
    if (report.fullDateISO) {
      return new Date(report.fullDateISO).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    if (report.displayDate && report.displayDate !== 'N/A') {
      return new Date(report.displayDate).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return `${report.month} ${report.year}`;
  };

  // Función para obtener icono según tipo
  const getIconForType = (type) => {
    const iconMap = {
      'daily': Calendar,
      'monthly': TrendingUp,
      'material': Package,
      'id': Tag,
      'name': FileText,
      'reportNumber': FileText,
      'date': Calendar
    };
    const reportTypeMap = {
        'daily': Calendar,
        'monthly': TrendingUp,
        'material': Package
    };
    return reportTypeMap[type] || iconMap[type] || FileText;
  };

  // Función para obtener etiqueta del tipo de reporte
  const getReportTypeLabel = (type) => {
    const labels = {
      'daily': 'Diario',
      'monthly': 'Mensual',
      'material': 'Materia Prima'
    };
    return labels[type] || type;
  };

  // Función para copiar al portapapeles con animación
  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFields(prev => ({ ...prev, [field]: true }));
      
      setTimeout(() => {
        setCopiedFields(prev => ({ ...prev, [field]: false }));
      }, 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // Preparar datos para mostrar
  const reportData = [
    { label: 'ID', value: report.id, field: 'id', icon: Tag },
    { label: 'Nombre', value: report.name, field: 'name', icon: FileText },
    { label: 'Número de Reporte', value: report.reportNumber?.toString() || 'N/A', field: 'reportNumber', icon: FileText },
    { label: 'Tipo', value: getReportTypeLabel(report.type), field: 'type', icon: getIconForType(report.type) },
    { label: 'Fecha', value: formatDate(report), field: 'date', icon: Calendar },
    { label: 'Mes', value: report.month || 'N/A', field: 'month', icon: Calendar },
    { label: 'Año', value: report.year?.toString() || 'N/A', field: 'year', icon: Calendar }
  ].filter(item => item.value && item.value !== 'N/A');

  return (
    <div 
      className={`fixed inset-0 bg-opacity-60 backdrop-blur-md flex items-center justify-center z-50 transition-all duration-300 ease-out ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        animation: isAnimating ? 'fadeIn 0.3s ease-out' : 'fadeOut 0.3s ease-out'
      }}
    >
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        
        @keyframes slideInUp {
          from { 
            transform: translateY(50px) scale(0.9);
            opacity: 0;
          }
          to { 
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        
        @keyframes slideOutDown {
          from { 
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          to { 
            transform: translateY(50px) scale(0.9);
            opacity: 0;
          }
        }
        
        @keyframes itemSlideIn {
          from { 
            transform: translateX(-20px);
            opacity: 0;
          }
          to { 
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }
        
        .header-title {
          color: black;
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .item-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .item-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }
        
        .close-button {
          transition: all 0.2s ease;
        }
        
        .close-button:hover {
          transform: rotate(90deg) scale(1.1);
        }
      `}</style>

      <div className="dialog-container bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold header-title">
            Información del Reporte
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="close-button h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
          {reportData.map((item, index) => {
            const IconComponent = item.icon;
            const isCopied = copiedFields[item.field];

            return (
              <div
                key={index}
                className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors ${
                  isCopied ? 'bg-green-50 border-green-200' : ''
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <IconComponent className={`h-4 w-4 text-gray-500 flex-shrink-0 ${
                    isCopied ? 'text-green-600' : ''
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {item.label}
                    </p>
                    <p className="text-sm text-gray-900 font-medium truncate">
                      {item.value}
                    </p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(item.value, item.field)}
                  className={`h-8 w-8 p-0 rounded-full transition-all duration-200 ${
                    isCopied 
                      ? 'bg-green-100 hover:bg-green-200 text-green-600' 
                      : 'hover:bg-gray-200'
                  }`}
                >
                  {isCopied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            );
          })}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">
              Haz clic en los íconos para copiar
            </p>
            <Button
              onClick={handleClose}
              variant="outline"
              size="sm"
              className="px-4 py-2 text-sm"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBarDialog;