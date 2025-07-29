"use client"

import React, { useState, useEffect, useMemo } from 'react';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Copy, FileText, PieChart, BarChart3, TrendingUp, DollarSign, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUnifiedReports } from "@/hooks/useUnifiedReports";
import TableIVS from "./TableIVS";

// Mapeo de iconos
const iconMap = {
    FileText,
    PieChart,
    BarChart3,
    TrendingUp,
    DollarSign,
    Package
};

// Constantes
const REPORT_TYPES = {
    DAILY: "daily",
    MONTHLY: "monthly",
    MATERIAL: "material"
};

const ITEMS_PER_PAGE = 7;

export default function DynamicReportsTable() {
    // Hook unificado
    const { data, loading, error } = useUnifiedReports();

    // Estados locales
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedReport, setSelectedReport] = useState(null);
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: 'displayDate', direction: 'desc' });

    // Función para generar resumen - MOVIDA ARRIBA PARA EVITAR ReferenceError
    const generateSummary = (report) => {
        if (report.type === REPORT_TYPES.DAILY) {
            return `Reporte diario con ventas de Q${(report.totalSalesForDay || 0).toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} y ${report.breadsSoldForDay || 0} panes vendidos.`;
        } else if (report.type === REPORT_TYPES.MONTHLY) {
            return `Reporte mensual con ingresos totales de Q${(report.mainMetricValue || 0).toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} y ganancia neta de Q${(report.secondaryMetricValue || 0).toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`;
        } else if (report.type === REPORT_TYPES.MATERIAL) {
            return `Reporte de materia prima con costo total de Q${(report.mainMetricValue || 0).toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} y ${(report.secondaryMetricValue || 0).toFixed(2)}% de desperdicio.`;
        }
        return 'Reporte sin descripción disponible.';
    };

    // Procesamiento de datos
    const processedReports = useMemo(() => {
        if (!data.all || data.all.length === 0) return [];

        return data.all.map(report => {
            let mainMetric = 'N/A';
            let secondaryMetric = 'N/A';

            if (report.type === REPORT_TYPES.DAILY) {
                mainMetric = `Q${(report.totalSalesForDay || 0).toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                secondaryMetric = `${report.breadsSoldForDay || 0} panes`;
            } else if (report.type === REPORT_TYPES.MONTHLY) {
                mainMetric = `Q${(report.mainMetricValue || 0).toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                secondaryMetric = `Q${(report.secondaryMetricValue || 0).toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            } else if (report.type === REPORT_TYPES.MATERIAL) {
                mainMetric = `Q${(report.mainMetricValue || 0).toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                secondaryMetric = `${(report.secondaryMetricValue || 0).toFixed(2)}%`;
            }

            return {
                ...report,
                mainMetric,
                secondaryMetric,
                summary: generateSummary(report)
            };
        });
    }, [data.all]);


    // Filtrado y ordenamiento
    const filteredAndSortedReports = useMemo(() => {
        let filtered = processedReports.filter(report => {
            const matchesSearch = report.name?.toLowerCase().includes(searchTerm.toLowerCase()) || report.reportNumber?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesType = typeFilter === "all" || report.type === typeFilter;

            return matchesSearch && matchesType;
        });

        // Ordenamiento
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                // Conversiones especiales para ordenamiento
                if (sortConfig.key === 'displayDate') {
                    aValue = new Date(a.fullDateISO || a.displayDate);
                    bValue = new Date(b.fullDateISO || b.displayDate);
                } else if (sortConfig.key === 'mainMetric') {
                    // Extraer solo el valor numérico para ordenamiento
                    aValue = parseFloat(a.mainMetric.replace('Q', '').replace(/,/g, '')) || 0;
                    bValue = parseFloat(b.mainMetric.replace('Q', '').replace(/,/g, '')) || 0;
                }

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return filtered;
    }, [processedReports, searchTerm, typeFilter, sortConfig]);

    // Paginación
    const totalPages = Math.ceil(filteredAndSortedReports.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentReports = filteredAndSortedReports.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Estadísticas para las tarjetas
    const reportStats = useMemo(() => {
        // Usar los datos ya procesados para evitar duplicación
        const reportsByType = processedReports.reduce((acc, report) => {
            acc[report.type] = (acc[report.type] || 0) + 1;
            return acc;
        }, {});

        const totalRevenue = processedReports.reduce((sum, report) => {
            if (report.type === REPORT_TYPES.DAILY) {
                return sum + (report.totalSalesForDay || 0);
            } else if (report.type === REPORT_TYPES.MONTHLY) {
                return sum + (report.mainMetricValue || 0);
            }
            return sum;
        }, 0);

        // Calcular costo total de materia prima
        const totalMaterialCost = processedReports
            .filter(report => report.type === REPORT_TYPES.MATERIAL)
            .reduce((sum, report) => sum + (report.mainMetricValue || 0), 0);

        return {
            total: processedReports.length,
            daily: reportsByType[REPORT_TYPES.DAILY] || 0,
            monthly: reportsByType[REPORT_TYPES.MONTHLY] || 0,
            material: reportsByType[REPORT_TYPES.MATERIAL] || 0,
            totalRevenue,
            totalMaterialCost
        };
    }, [processedReports]);

    // Configuración de tarjetas de resumen
    const summaryCardsConfig = [
        {
            key: 'total',
            title: 'Total Reportes',
            value: reportStats.total.toLocaleString('es-GT'),
            icon: 'FileText',
            colorClass: 'text-blue-500'
        },
        {
            key: 'daily',
            title: 'Reportes Diarios',
            value: reportStats.daily.toLocaleString('es-GT'),
            icon: 'PieChart',
            colorClass: 'text-green-500'
        },
        {
            key: 'monthly',
            title: 'Reportes Mensuales',
            value: reportStats.monthly.toLocaleString('es-GT'),
            icon: 'BarChart3',
            colorClass: 'text-purple-500'
        },
        {
            key: 'material',
            title: 'Reportes Materia Prima',
            value: reportStats.material.toLocaleString('es-GT'),
            icon: 'Package',
            colorClass: 'text-orange-500'
        }
    ];

    // Funciones de manejo
    const handleSort = (key) => {
        setSortConfig(prevConfig => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'desc' ? 'asc' : 'desc'
        }));
    };

    const handleCopyId = async (reportId) => {
        try {
            await navigator.clipboard.writeText(reportId);
            // Aquí podrías mostrar una notificación de éxito
        } catch (err) {
            console.error('Error al copiar ID:', err);
        }
    };

    const handleViewDetails = (report) => {
        setSelectedReport(report);
        setShowDetailsDialog(true);
    };

    const getTypeBadgeVariant = (type) => {
        switch (type) {
            case REPORT_TYPES.DAILY: return 'default';
            case REPORT_TYPES.MONTHLY: return 'secondary';
            case REPORT_TYPES.MATERIAL: return 'outline';
            default: return 'default';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case REPORT_TYPES.DAILY: return 'FileText';
            case REPORT_TYPES.MONTHLY: return 'BarChart3';
            case REPORT_TYPES.MATERIAL: return 'PieChart';
            default: return 'FileText';
        }
    };

    const getSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) return 'ArrowUpDown';
        return sortConfig.direction === 'asc' ? 'ChevronUp' : 'ChevronDown';
    };

    // Reset página cuando cambien los filtros
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, typeFilter]);

    // Mostrar estados de carga o error
    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[400px]">
                <p className="text-xl text-muted-foreground">Cargando reportes...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-full min-h-[400px] text-destructive">
                <p className="text-xl font-bold mb-2">Error al cargar los datos</p>
                <p className="text-muted-foreground">{error}</p>
            </div>
        );
    }

    // Mostrar datos ya cargados
    return (
        <div className="p-6 bg-card text-card-foreground rounded-lg shadow-sm h-full flex flex-col">
            <div className="mb-6">
                <h2 className="text-3xl font-bold mb-2 text-primary">Gestión de Reportes</h2>
                <p className="text-muted-foreground">
                    Visualiza, filtra y gestiona todos tus reportes financieros de manera intuitiva.
                </p>
            </div>

            <div className="grid xl:grid-cols-4 gap-4 mb-6">
                {summaryCardsConfig.map(card => {
                    const IconComponent = iconMap[card.icon];
                    return (
                        <Card key={card.key}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                                {IconComponent && <IconComponent className={`h-4 w-4 ${card.colorClass}`} />}
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{card.value}</div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <TableIVS
                // Datos
                currentReports={currentReports}
                filteredReports={filteredAndSortedReports}
                currentPage={currentPage}
                totalPages={totalPages}
                startIndex={startIndex}

                // Estados de filtros
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}

                // Funciones de manejo
                handleSort={handleSort}
                handleCopyId={handleCopyId}
                handleViewDetails={handleViewDetails}
                // handleDownloadReport ha sido eliminado
                setCurrentPage={setCurrentPage}

                // Funciones de utilidad
                getTypeBadgeVariant={getTypeBadgeVariant}
                getTypeIcon={getTypeIcon}
                getSortIcon={getSortIcon}

                // Constantes
                ITEMS_PER_PAGE={ITEMS_PER_PAGE}
            />

            <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {selectedReport && iconMap[getTypeIcon(selectedReport.type)] &&
                                React.createElement(iconMap[getTypeIcon(selectedReport.type)], { className: "h-4 w-4" })
                            }
                            {selectedReport?.name}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedReport?.reportNumber} • {selectedReport?.displayDate}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedReport && (
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold mb-2">Resumen</h4>
                                <p className="text-sm text-muted-foreground">{selectedReport.summary}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold mb-2">Métrica Principal</h4>
                                    <p className="text-lg font-bold text-primary">{selectedReport.mainMetric}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Métrica Secundaria</h4>
                                    <p className="text-lg font-bold text-secondary-foreground">{selectedReport.secondaryMetric}</p>
                                </div>
                            </div>

                            {selectedReport.notes && (
                                <div>
                                    <h4 className="font-semibold mb-2">Notas</h4>
                                    <p className="text-sm text-muted-foreground">{selectedReport.notes}</p>
                                </div>
                            )}

                            {selectedReport.type === REPORT_TYPES.DAILY && selectedReport.breadsSoldForDay && (
                                <div>
                                    <h4 className="font-semibold mb-2">Detalles del Reporte Diario</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium">Panes vendidos:</span>
                                            <span className="ml-2">{selectedReport.breadsSoldForDay.toLocaleString('es-GT')}</span>
                                        </div>
                                        <div>
                                            <span className="font-medium">Ventas totales:</span>
                                            <span className="ml-2">Q{(selectedReport.totalSalesForDay || 0).toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedReport.type === REPORT_TYPES.MONTHLY && (
                                <div>
                                    <h4 className="font-semibold mb-2">Detalles del Reporte Mensual</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium">Ingresos totales:</span>
                                            <span className="ml-2">Q{(selectedReport.mainMetricValue || 0).toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                        </div>
                                        <div>
                                            <span className="font-medium">Ganancia neta:</span>
                                            <span className="ml-2">Q{(selectedReport.secondaryMetricValue || 0).toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedReport.type === REPORT_TYPES.MATERIAL && (
                                <div>
                                    <h4 className="font-semibold mb-2">Detalles de Materia Prima</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium">Costo total:</span>
                                            <span className="ml-2">Q{(selectedReport.mainMetricValue || 0).toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                        </div>
                                        <div>
                                            <span className="font-medium">Porcentaje de desperdicio:</span>
                                            <span className="ml-2">{selectedReport.secondaryMetricValue?.toFixed ? selectedReport.secondaryMetricValue.toFixed(2) : '0.00'}%</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-2 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => handleCopyId(selectedReport.id)}
                                    className="flex items-center gap-2"
                                >
                                    <Copy className="h-4 w-4" />
                                    Copiar ID
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}