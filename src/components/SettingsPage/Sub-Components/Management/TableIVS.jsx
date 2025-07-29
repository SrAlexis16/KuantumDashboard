"use client"

import React from 'react';

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import { Search, Copy, Filter, Eye, Download, FileText, PieChart, BarChart3, DollarSign, ChevronDown, ChevronUp, ArrowUpDown, ChevronLeft, ChevronRight} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mapeo de iconos
const iconMap = {
    FileText,
    PieChart,
    BarChart3,
    ChevronDown,
    ChevronUp,
    ArrowUpDown
};

const TableIVS = ({
    // Datos
    currentReports,
    filteredReports,
    currentPage,
    totalPages,
    startIndex,

    // Estados de filtros
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,

    // Funciones de manejo
    handleSort,
    handleCopyId,
    handleViewDetails,
    handleDownloadReport,
    setCurrentPage,

    // Funciones de utilidad
    getTypeBadgeVariant,
    getTypeIcon,
    getSortIcon,
}) => {
    // Función para obtener el componente de icono
    const getIconComponent = (iconName) => {
        const IconComponent = iconMap[iconName];
        return IconComponent ? <IconComponent className="h-4 w-4" /> : <FileText className="h-4 w-4" />;
    };

    const getSortIconComponent = (columnKey) => {
        const iconName = getSortIcon(columnKey);
        const IconComponent = iconMap[iconName];
        const className = iconName === "ArrowUpDown" ? "ml-2 h-4 w-4 opacity-50" : "ml-2 h-4 w-4"; // Adjusted ml-2
        return IconComponent ? <IconComponent className={className} /> : <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    };

    const formatNormalizedDate = (report) => {
    if (report.type === 'daily') {
        if (report.day && report.month && report.year) {
            return `${report.day} de ${report.month} de ${report.year}`;
        }
        // Fallback para reportes diarios con fullDateISO
        if (report.fullDateISO) {
            const [year, month, day] = report.fullDateISO.split('-');
            return `${day}/${month}/${year}`;
        }
    } else {
        if (report.details && report.details.date) {
            return report.details.date;
        }
    }
    return 'N/A';
};

    return (
        <>
            <div className="mb-6 flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nombre o número..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[180px]">
                        <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Tipo de reporte" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los tipos</SelectItem>
                        <SelectItem value="daily">Diarios</SelectItem>
                        <SelectItem value="monthly">Mensuales</SelectItem>
                        <SelectItem value="material">Materia Prima</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex-1 border rounded-md overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="sticky top-0 bg-card z-10">
                            <TableRow>
                                <TableHead className="w-[60px]">#</TableHead>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleSort('name')}
                                        className="h-auto p-0 font-semibold hover:bg-transparent"
                                    >
                                        Reporte {getSortIconComponent('name')}
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleSort('type')}
                                        className="h-auto p-0 font-semibold hover:bg-transparent"
                                    >
                                        Tipo {getSortIconComponent('type')}
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleSort('displayDate')}
                                        className="h-auto p-0 font-semibold hover:bg-transparent"
                                    >
                                        Fecha {getSortIconComponent('displayDate')}
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleSort('mainMetric')}
                                        className="h-auto p-0 font-semibold hover:bg-transparent"
                                    >
                                        Métrica Principal {getSortIconComponent('mainMetric')}
                                    </Button>
                                </TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentReports.length > 0 ? (
                                currentReports.map((report, index) => (
                                    <TableRow key={report.id} className="hover:bg-muted/50">
                                        <TableCell className="font-medium text-muted-foreground">
                                            {startIndex + index + 1}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1">
                                                    {getIconComponent(getTypeIcon(report.type))}
                                                </div>
                                                <div>
                                                    <div className="font-medium">{report.name}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {report.reportNumber}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getTypeBadgeVariant(report.type)}>
                                                {report.type === 'daily' ? 'Diario' :
                                                report.type === 'monthly' ? 'Mensual' :
                                                report.type === 'material' ? 'Materia Prima' : report.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                                {formatNormalizedDate(report)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <DollarSign className="h-3 w-3 text-muted-foreground" />
                                                <span className="font-medium">{report.mainMetric}</span>
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {report.secondaryMetric}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleViewDetails(report)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDownloadReport(report)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleCopyId(report.id)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center gap-2">
                                            <FileText className="h-8 w-8 opacity-50" />
                                            <span>No se encontraron reportes que coincidan con los filtros.</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    Mostrando {currentReports.length > 0 ? startIndex + 1 : 0} - {startIndex + currentReports.length} de {filteredReports.length} reportes.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4 mr-2" /> Anterior
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                        }
                        disabled={currentPage === totalPages || totalPages === 0}
                    >
                        Siguiente <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </div>
        </>
    );
};

export default TableIVS;