"use client"

import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Importa la función auxiliar para leer la cookie
import { getBusinessInfoFromCookie } from '@/lib//utils'; 

function ButtonExportLogic({ selectedReport }) {
  const [businessNameFromCookie, setBusinessNameFromCookie] = useState('');

  // Cargar el nombre del negocio desde la cookie al montar el componente
  useEffect(() => {
    const info = getBusinessInfoFromCookie();
    if (info && info.name) {
      setBusinessNameFromCookie(info.name);
    }
  }, []);

  // Función helper para verificar si necesitamos una nueva página
  const checkAndAddPage = (doc, currentY, requiredHeight = 20) => {
    const pageHeight = doc.internal.pageSize.height;
    const marginBottom = 20;
    
    if (currentY + requiredHeight > pageHeight - marginBottom) {
      doc.addPage();
      return 20; // Posición Y inicial en la nueva página
    }
    return currentY;
  };

  // Función helper para escribir texto con salto de página automático
  const writeTextWithPagination = (doc, text, x, y, options = {}) => {
    const {
      fontSize = 12,
      fontStyle = 'normal',
      maxWidth = 180,
      lineHeight = 6
    } = options;

    doc.setFontSize(fontSize);
    doc.setFont('helvetica', fontStyle);
    
    const lines = doc.splitTextToSize(text, maxWidth);
    let currentY = y;
    
    lines.forEach(line => {
      currentY = checkAndAddPage(doc, currentY, lineHeight);
      doc.text(line, x, currentY);
      currentY += lineHeight;
    });
    
    return currentY;
  };

  const generatePDF = () => {
    if (!selectedReport) {
      alert('Por favor, selecciona un reporte para exportar.');
      return;
    }

    try {
      const doc = new jsPDF();
      let yPosition = 20;

      // Configurar fuentes
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');

      // Agregar el nombre del negocio
      if (businessNameFromCookie) {
        doc.text(businessNameFromCookie, 14, yPosition);
        yPosition += 10;
        doc.setFontSize(16);
      } else {
        doc.setFontSize(20);
      }

      // Título principal del reporte
      doc.text(selectedReport.name || 'Reporte', 14, yPosition);
      yPosition += 15;

      // Verificar si necesitamos nueva página después del título
      yPosition = checkAndAddPage(doc, yPosition);

      // Información básica del reporte
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      
      yPosition = checkAndAddPage(doc, yPosition);
      doc.text(`Fecha: ${selectedReport.details?.date || 'N/A'}`, 14, yPosition);
      yPosition += 10;
      
      yPosition = checkAndAddPage(doc, yPosition);
      doc.text(`Número de reporte: ${selectedReport.details?.reportNumber || 'N/A'}`, 14, yPosition);
      yPosition += 10;

      // ID del reporte
      if (selectedReport.id) {
        yPosition = checkAndAddPage(doc, yPosition);
        doc.text(`ID: ${selectedReport.id}`, 14, yPosition);
        yPosition += 10;
      }

      // Resumen
      if (selectedReport.summary) {
        yPosition = checkAndAddPage(doc, yPosition, 30);
        doc.setFont('helvetica', 'bold');
        doc.text('Resumen:', 14, yPosition);
        yPosition += 8;
        
        yPosition = writeTextWithPagination(doc, selectedReport.summary, 14, yPosition, {
          fontSize: 12,
          fontStyle: 'normal'
        });
        yPosition += 10;
      }

      // Determinar el tipo de reporte y generar contenido específico
      if (selectedReport.reportType === 'Reporte Mensual de Ventas') {
        generateMonthlySalesReport(doc, selectedReport, yPosition);
      } else if (selectedReport.reportType === 'Reporte Mensual de Materia Prima') {
        generateRawMaterialReport(doc, selectedReport, yPosition);
      } else {
        // Reporte diario
        generateDailyReport(doc, selectedReport, yPosition);
      }

      // Guardar el PDF
      const fileName = `${selectedReport.name.replace(/\s+/g, '_')}_${selectedReport.details?.reportNumber || 'reporte'}.pdf`;
      doc.save(fileName);

    } catch (error) {
      console.error('Error al generar el PDF:', error);
      alert('Error al generar el PDF. Por favor, intenta de nuevo.');
    }
  };

  const generateDailyReport = (doc, report, startY) => {
    const details = report.details || {};
    let currentY = startY;

    // Verificar espacio para la sección
    currentY = checkAndAddPage(doc, currentY, 50);

    // Métricas principales
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Métricas del Día', 14, currentY);
    currentY += 15;

    const dailyData = [
      ['Ventas Totales', `Q${details.totalSales?.toFixed(2) || '0.00'}`],
      ['Panes Vendidos', `${details.breadsSold || 0} unidades`],
      ['Producto Destacado', details.topProduct || 'N/A'],
      ['Clientes Atendidos', `${details.customersServed || 0} personas`]
    ];

    autoTable(doc, {
      head: [['Métrica', 'Valor']],
      body: dailyData,
      startY: currentY,
      styles: { fontSize: 11 },
      headStyles: {
        fillColor: [52, 152, 219],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      showHead: 'everyPage',
      pageBreak: 'auto'
    });

    // Notas adicionales
    if (report.notes) {
      currentY = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 15 : currentY + 50;
      currentY = checkAndAddPage(doc, currentY, 30);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Notas:', 14, currentY);
      currentY += 8;
      
      currentY = writeTextWithPagination(doc, report.notes, 14, currentY, {
        fontSize: 12,
        fontStyle: 'normal'
      });
    }
  };

  const generateMonthlySalesReport = (doc, report, startY) => {
    let currentY = startY;

    // Verificar espacio para la sección
    currentY = checkAndAddPage(doc, currentY, 50);

    // Resumen financiero
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumen Financiero', 14, currentY);
    currentY += 15;

    const financialData = [
      ['Ventas Totales del Mes', `Q${report.totalSalesForMonth?.toFixed(2) || '0.00'}`],
      ['Gastos Totales', `Q${report.totalExpensesForMonth?.toFixed(2) || '0.00'}`],
      ['Ganancia Neta', `Q${report.netProfitForMonth?.toFixed(2) || '0.00'}`],
      ['Panes Vendidos', `${report.totalBreadsSold || 0} unidades`],
      ['Promedio Ventas Diarias', `Q${report.averageDailySales?.toFixed(2) || '0.00'}`]
    ];

    autoTable(doc, {
      head: [['Métrica', 'Valor']],
      body: financialData,
      startY: currentY,
      styles: { fontSize: 11 },
      headStyles: {
        fillColor: [52, 152, 219],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      showHead: 'everyPage',
      pageBreak: 'auto'
    });

    // Productos más vendidos
    if (report.topProductsThisMonth && report.topProductsThisMonth.length > 0) {
      currentY = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 20 : currentY + 100;
      currentY = checkAndAddPage(doc, currentY, 50);
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Productos Más Vendidos', 14, currentY);
      currentY += 10;

      const topProductsData = report.topProductsThisMonth.map(product => [
        product.product || 'N/A',
        `${product.estimatedSalesCount || 0} unidades`,
        `Q${product.revenue?.toFixed(2) || '0.00'}`
      ]);

      autoTable(doc, {
        head: [['Producto', 'Cantidad Vendida', 'Ingresos']],
        body: topProductsData,
        startY: currentY,
        styles: { fontSize: 10 },
        headStyles: {
          fillColor: [46, 125, 50],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        showHead: 'everyPage',
        pageBreak: 'auto'
      });
    }

    // Recomendaciones
    if (report.recommendations && report.recommendations.length > 0) {
      currentY = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 20 : currentY + 50;
      currentY = checkAndAddPage(doc, currentY, 30);
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Recomendaciones', 14, currentY);
      currentY += 15;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');

      report.recommendations.forEach((rec, index) => {
        const recText = `${index + 1}. ${rec}`;
        currentY = writeTextWithPagination(doc, recText, 14, currentY, {
          fontSize: 11,
          fontStyle: 'normal'
        });
        currentY += 4;
      });
    }
  };

  const generateRawMaterialReport = (doc, report, startY) => {
    let currentY = startY;

    // Verificar espacio para la sección
    currentY = checkAndAddPage(doc, currentY, 50);

    // Resumen de costos
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumen de Costos de Materia Prima', 14, currentY);
    currentY += 15;

    const costSummary = [
      ['Costo Total de Materia Prima', `Q${report.totalCostOfRawMaterials?.toFixed(2) || '0.00'}`],
      ['Porcentaje de Desperdicio', `${report.wastePercentage || 'N/A'}`],
      ['Ingrediente Principal', report.costOfMainIngredient?.item || 'N/A'],
      ['Costo Ingrediente Principal', `Q${report.costOfMainIngredient?.cost?.toFixed(2) || '0.00'}`]
    ];

    autoTable(doc, {
      head: [['Métrica', 'Valor']],
      body: costSummary,
      startY: currentY,
      styles: { fontSize: 11 },
      headStyles: {
        fillColor: [52, 152, 219],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      showHead: 'everyPage',
      pageBreak: 'auto'
    });

    // Detalle de materiales
    if (report.keyObservations && report.keyObservations.length > 0) {
      currentY = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 20 : currentY + 100;
      currentY = checkAndAddPage(doc, currentY, 50);
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Detalle de Materiales', 14, currentY);
      currentY += 10;

      const materialsData = report.keyObservations.map(obs => [
        obs.item || 'N/A',
        `${obs.quantityUsed || 0} ${obs.unit || ''}`,
        `Q${obs.cost?.toFixed(2) || '0.00'}`,
        obs.status || 'N/A'
      ]);

      autoTable(doc, {
        head: [['Material', 'Cantidad Usada', 'Costo', 'Estado']],
        body: materialsData,
        startY: currentY,
        styles: { fontSize: 9 },
        headStyles: {
          fillColor: [255, 152, 0],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        showHead: 'everyPage',
        pageBreak: 'auto'
      });
    }

    // Recomendaciones
    if (report.recommendations && report.recommendations.length > 0) {
      currentY = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 20 : currentY + 50;
      currentY = checkAndAddPage(doc, currentY, 30);
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Recomendaciones', 14, currentY);
      currentY += 15;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');

      report.recommendations.forEach((rec, index) => {
        const recText = `${index + 1}. ${rec}`;
        currentY = writeTextWithPagination(doc, recText, 14, currentY, {
          fontSize: 11,
          fontStyle: 'normal'
        });
        currentY += 4;
      });
    }
  };

  return (
    <button
      onClick={generatePDF}
      className="mt-5 py-3 background-boxes-interior background-boxes-interior:hover text-white font-bold rounded-lg text-center w-full justify-center cursor-pointer"
      disabled={!selectedReport}
    >
      Exportar Reporte
    </button>
  );
}

export default ButtonExportLogic;