"use client";

import React, { useMemo, useState, useEffect } from 'react';

import { ChartBarMixed } from "@/components/ui/ChartBarMixed.jsx";
import { ChartRadarDots } from "@/components/ui/ChartRadarDots.jsx";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function RMVToggleGraphics({ selectedReport, allReports }) {
    const fixedRawMaterialColors = [
        "#0A7E8C",
        "#00563F",
    ];

    // Función para generar colores pasteles únicos basándose en el nombre del material
    const generatePastelColor = (materialName) => {
        if (!materialName) return "#B8E6B8"; // Verde pastel por defecto
        
        let hash = 0;
        for (let i = 0; i < materialName.length; i++) {
            hash = materialName.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        const pastelColors = [
            "#FFA07A",
            "#98D8AA",
            "#FF6B6B",
            "#41ACC5",
            "#4ECDC4",
        ];
        
        const colorIndex = Math.abs(hash) % pastelColors.length;
        return pastelColors[colorIndex];
    };

    // Verificar múltiples posibles valores para reportType
    const RAW_MATERIAL_REPORT_TYPES = [
        "Reporte Mensual de Materia Prima",
        "Reporte de Materia Prima",
        "Raw Material Report",
        "Material Report"
    ];

    // Mejorar la obtención de reportes de materia prima
    const rawMaterialReports = useMemo(() => {
        // Verificar diferentes estructuras posibles
        let reports = [];
        
        if (allReports?.rawMaterial && Array.isArray(allReports.rawMaterial)) {
            reports = allReports.rawMaterial;
        } else if (allReports?.material && Array.isArray(allReports.material)) {
            reports = allReports.material;
        } else if (Array.isArray(allReports)) {
            // Si allReports es un array plano, filtrar por tipo
            reports = allReports.filter(report => 
                report.type === 'material' || 
                report.type === 'rawMaterial' ||
                RAW_MATERIAL_REPORT_TYPES.includes(report.reportType)
            );
        } else if (allReports?.all && Array.isArray(allReports.all)) {
            // Si hay una propiedad 'all' con todos los reportes
            reports = allReports.all.filter(report => 
                report.type === 'material' || 
                report.type === 'rawMaterial' ||
                RAW_MATERIAL_REPORT_TYPES.includes(report.reportType)
            );
        }
        
        return reports;
    }, [allReports]);

    //  Verificar si el reporte seleccionado es de materia prima
    const isSelectedReportRawMaterial = useMemo(() => {
        if (!selectedReport) return false;
        
        return (
            selectedReport.type === 'material' || 
            selectedReport.type === 'rawMaterial' ||
            RAW_MATERIAL_REPORT_TYPES.includes(selectedReport.reportType)
        );
    }, [selectedReport]);

    // Lógica para ChartBarMixed
    let barChartData = [];
    let barChartConfig = {};
    let barChartTitle = "Observaciones Clave de Materia Prima";
    let barChartDescription = "Cantidades y costos relevantes para el mes seleccionado.";
    let barChartFooter = "Datos del reporte de materia prima actual.";

    if (isSelectedReportRawMaterial && selectedReport.keyObservations && selectedReport.keyObservations.length > 0) {
        // Incluir la unidad en los datos del gráfico
        barChartData = selectedReport.keyObservations.map((observation) => ({
            name: observation.item,
            quantityUsed: observation.quantityUsed,
            cost: observation.cost,
            unit: observation.unit || "",
        }));

        barChartConfig = {
            quantityUsed: {
                label: "Cantidad Usada",
                color: fixedRawMaterialColors[0],
            },
            cost: {
                label: "Costo (Q)",
                color: fixedRawMaterialColors[1],
            },
        };

        barChartTitle = `Consumo de Materia Prima para ${selectedReport.month} ${selectedReport.year}`;
        barChartDescription = "Cantidades usadas y costos de los insumos clave.";
        barChartFooter = `Costo Total de Materia Prima: ${selectedReport.totalCostOfRawMaterials ? selectedReport.totalCostOfRawMaterials.toLocaleString('es-GT', { style: 'currency', currency: 'GTQ', minimumFractionDigits: 0, maximumFractionDigits: 0 }) : 'N/A'}`;
    } else {
        barChartTitle = "Gráfico de Cantidades y Costos no disponible";
        barChartDescription = "Selecciona un reporte de Materia Prima para ver sus cantidades y costos.";
        barChartData = [];
    }

    // Lógica para ChartRadarDots
    const availableMaterials = useMemo(() => {
        const materialsSet = new Set();
        rawMaterialReports.forEach(report => {
            if (report.keyObservations && Array.isArray(report.keyObservations)) {
                report.keyObservations.forEach(material => {
                    materialsSet.add(material.item);
                });
            }
        });
        
        const materials = Array.from(materialsSet).sort();
        return materials;
    }, [rawMaterialReports]);

    // Mejorar la inicialización del estado
    const [activeRadarMaterial, setActiveRadarMaterial] = useState(null);

    // Sincronizar mejor el estado del material activo
    useEffect(() => {
        if (availableMaterials.length > 0) {
            if (!activeRadarMaterial || !availableMaterials.includes(activeRadarMaterial)) {
                setActiveRadarMaterial(availableMaterials[0]);
            }
        } else {
            setActiveRadarMaterial(null);
        }
    }, [availableMaterials, activeRadarMaterial]);

    // Mejorar la generación de datos del radar
    let radarChartData = [];
    let radarChartConfig = {};
    let radarChartTitle = "Tendencia de Materia Prima (Cantidad)";
    let radarChartDescription = "Volumen de materia prima seleccionada a lo largo de los meses.";
    let radarChartFooter = "Datos históricos de materia prima.";
    let radarChartTrendingText = "";

    if (activeRadarMaterial && rawMaterialReports.length > 0) {
        radarChartData = rawMaterialReports
            .filter(report => {
                const hasObservations = report.keyObservations && Array.isArray(report.keyObservations);
                const hasMaterial = hasObservations && report.keyObservations.some(material => material.item === activeRadarMaterial);
                return hasMaterial;
            })
            .map(report => {
                const materialInfo = report.keyObservations.find(m => m.item === activeRadarMaterial);
                return {
                    period: `${report.month.substring(0, 3)}. ${report.year.toString().slice(-2)}`,
                    value: materialInfo?.quantityUsed || 0,
                    unit: materialInfo?.unit || "",
                };
            })
            .sort((a, b) => {
                const getMonthNumber = (monthName) => {
                    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
                    const normalizedMonthName = monthName.substring(0, 3);
                    return months.indexOf(normalizedMonthName);
                };
                
                const [monthAStr, yearAStr] = a.period.split('. ');
                const [monthBStr, yearBStr] = b.period.split('. ');
                const fullYearA = parseInt(`20${yearAStr}`, 10);
                const fullYearB = parseInt(`20${yearBStr}`, 10);

                const dateA = new Date(fullYearA, getMonthNumber(monthAStr));
                const dateB = new Date(fullYearB, getMonthNumber(monthBStr));
                return dateA.getTime() - dateB.getTime();
            });

        const materialColor = generatePastelColor(activeRadarMaterial);

        radarChartConfig = {
            value: {
                label: `Cantidad (${activeRadarMaterial})`,
                color: materialColor,
            },
        };

        radarChartTitle = `Tendencia de ${activeRadarMaterial} por Mes`;
        radarChartDescription = "Muestra la cantidad utilizada a lo largo del tiempo.";
        radarChartFooter = `Datos de ${radarChartData.length} meses.`;

        // Calcular tendencia
        if (radarChartData.length >= 2) {
            const lastValue = radarChartData[radarChartData.length - 1].value;
            const secondLastValue = radarChartData[radarChartData.length - 2].value;

            if (secondLastValue > 0) {
                const percentageChange = ((lastValue - secondLastValue) / secondLastValue) * 100;
                if (percentageChange > 0) radarChartTrendingText = `Subiendo un ${percentageChange.toFixed(1)}% con respecto al mes anterior.`;
                else if (percentageChange < 0) radarChartTrendingText = `Bajando un ${Math.abs(percentageChange).toFixed(1)}% con respecto al mes anterior.`;
                else radarChartTrendingText = "Estable este mes.";
            } else if (lastValue > 0) {
                radarChartTrendingText = `Incremento significativo desde 0 en el mes anterior.`;
            } else {
                radarChartTrendingText = "Se mantiene en 0 con respecto al mes anterior.";
            }
        }
    } else {
        radarChartTitle = "Gráfico de Tendencia no disponible";
        radarChartDescription = "Selecciona una materia prima para ver su tendencia histórica.";
        radarChartData = [];
    }

    // Condición de renderizado principal
    if (!selectedReport || !isSelectedReportRawMaterial) {
        return (
            <Card className="col-span-full">
                <CardHeader>
                    <CardTitle>Gráficos de Materia Prima</CardTitle>
                    <CardDescription>
                        Selecciona un "Reporte de Materia Prima" para ver sus gráficos.
                    </CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] flex items-center justify-center text-muted-foreground">
                    No hay reporte de materia prima seleccionado o disponible.
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
                <ChartBarMixed
                    chartData={barChartData}
                    chartConfig={barChartConfig}
                    title={barChartTitle}
                    description={barChartDescription}
                    footerText={barChartFooter}
                    trendingText={""}
                />
            </div>

            <div>
                <Card>
                    <CardHeader className="flex-row items-start space-y-0 pb-0">
                        <div className="grid gap-1">
                            <CardTitle>{radarChartTitle}</CardTitle>
                            <CardDescription>{radarChartDescription}</CardDescription>
                        </div>
                        <Select 
                            value={activeRadarMaterial || ""} 
                            onValueChange={setActiveRadarMaterial} 
                            disabled={availableMaterials.length === 0}>
                            <SelectTrigger
                                className="ml-auto h-7 w-[180px] rounded-lg pl-2.5"
                                aria-label="Select material">
                                <SelectValue placeholder="Seleccionar Materia Prima" />
                            </SelectTrigger>
                            <SelectContent align="end" className="rounded-xl">
                                {availableMaterials.length > 0 ? (
                                    availableMaterials.map((materialName) => {
                                        const materialColor = generatePastelColor(materialName);
                                        return (
                                            <SelectItem
                                                key={materialName}
                                                value={materialName}
                                                className="rounded-lg [&_span]:flex">
                                                <div className="flex items-center gap-2 text-xs">
                                                    <span
                                                        className="flex h-3 w-3 shrink-0 rounded-xs"
                                                        style={{
                                                            backgroundColor: materialColor,
                                                        }}
                                                    />
                                                    {materialName}
                                                </div>
                                            </SelectItem>
                                        );
                                    })
                                ) : (
                                    <SelectItem value="no-materials-available" disabled>
                                        No hay materias primas disponibles
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </CardHeader>
                    <CardContent className="pb-0">
                        <ChartRadarDots
                            chartData={radarChartData}
                            chartConfig={radarChartConfig}
                            footerText={radarChartFooter}
                            trendingText={radarChartTrendingText}
                            customColors={fixedRawMaterialColors}
                            materialName={activeRadarMaterial}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default RMVToggleGraphics;