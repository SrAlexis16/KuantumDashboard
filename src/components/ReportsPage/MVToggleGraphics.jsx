"use client"

import React from 'react';

import { ChartBarActive } from "@/components/ui/ChartBarActive.jsx";
import { ChartPieInteractive } from "@/components/ui/ChartPieInteractive";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function MVToggleGraphics({ allReports, currentReportType }) {
    const fixedBarColors = [
        "#0A7E8C",
        "#00563F",
        "#003153",
        "#1560BD",
        "#1A9ABF"
    ];

    const fixedPieColors = [
        "#FF6B6B", // Rojo claro
        "#4ECDC4", // Turquesa
        "#45B7D1", // Azul cielo
        "#FFA07A", // Naranja claro
        "#98D8AA", // Verde menta
        "#DAA06D", // Marrón claro
        "#A87A9A", // Púrpura suave
        "#78C0E0", // Azul claro
        "#D4AF37", // Dorado
        "#50C878", // Esmeralda
    ];

    // Lógica para ChartBarActive
    let barChartData = [];
    let barChartConfig = {};
    let barChartTitle = "Gráfico de Ventas";
    let barChartDescription = "Productos con más ventas";
    let barChartFooter = "Mostrando ventas estimadas por producto";
    let barChartTrendingText = "";
    let maxSalesValue = 0;

    if (currentReportType === 'monthly' && allReports && allReports.monthly) {
        const productSalesMap = new Map();
            allReports.monthly.forEach(report => {
                if (report.topProductsThisMonth && Array.isArray(report.topProductsThisMonth)) {
                    report.topProductsThisMonth.forEach(productInfo => {
                        const currentSales = productSalesMap.get(productInfo.product) || 0;
                        productSalesMap.set(productInfo.product, currentSales + productInfo.estimatedSalesCount);
                    });
                }
        });

        barChartData = Array.from(productSalesMap).map(([product, estimatedSalesCount], index) => {
            if (estimatedSalesCount > maxSalesValue) {
                maxSalesValue = estimatedSalesCount;
            }
            return {
                product: product,
                estimatedSalesCount: estimatedSalesCount,
                fill: fixedBarColors[index % fixedBarColors.length]
            };
        });

        barChartData.sort((a, b) => b.estimatedSalesCount - a.estimatedSalesCount);
        if (barChartData.length > 0) {
            barChartConfig = {
                estimatedSalesCount: {
                    label: "Cantidad Vendida",
                },
            };
            barChartData.forEach((item, index) => {
                barChartConfig[item.product] = {
                    label: item.product,
                    color: item.fill,
                };
            });
            barChartTitle = "Ventas Consolidadas de Productos";
            barChartDescription = "Total de ventas estimadas por producto en todos los reportes mensuales.";
            barChartFooter = `Datos de ${allReports.monthly.length} meses analizados.`;

            if (allReports.monthly.length >= 2) {
                const lastMonthSales = allReports.monthly[allReports.monthly.length - 1].totalSalesForMonth || 0;
                const secondLastMonthSales = allReports.monthly[allReports.monthly.length - 2].totalSalesForMonth || 0;
                if (secondLastMonthSales > 0) {
                    const percentageChange = ((lastMonthSales - secondLastMonthSales) / secondLastMonthSales) * 100;
                    if (percentageChange > 0) barChartTrendingText = `Subiendo un ${percentageChange.toFixed(1)}% con respecto al ultimo mes`;
                    else if (percentageChange < 0) barChartTrendingText = `Bajando un ${Math.abs(percentageChange).toFixed(1)}% con respecto al ultimo mes`;
                    else barChartTrendingText = "Estable este mes";
                }
            }
        }
    } else if (currentReportType !== 'monthly') {
        barChartTitle = "Gráfico no disponible";
        barChartDescription = "Este gráfico solo muestra datos para Reportes Mensuales.";
        barChartData = [];
    }

    // Lógica para ChartPieInteractive
    const [activePieMonth, setActivePieMonth] = React.useState('');
    let pieChartData = [];
    let pieChartConfig = {};
    let pieChartTitle = "Distribución de Ventas por Producto";
    let pieChartDescription = "Ventas estimadas por producto para el mes seleccionado.";
    let totalSalesForActiveMonth = 0;

    React.useEffect(() => {
        if (currentReportType === 'monthly' && allReports && allReports.monthly.length > 0) {
            const lastReportMonth = allReports.monthly[allReports.monthly.length - 1]?.monthNumber;
            if (lastReportMonth) {
                setActivePieMonth(lastReportMonth);
            } else if (allReports.monthly[0]?.monthNumber) {
                setActivePieMonth(allReports.monthly[0].monthNumber);
            }
        } else {
            setActivePieMonth('');
        }
    }, [currentReportType, allReports]);

    if (currentReportType === 'monthly' && allReports && allReports.monthly) {
        const selectedMonthReport = allReports.monthly.find(
            report => report.monthNumber === activePieMonth
        );

        if (selectedMonthReport && selectedMonthReport.topProductsThisMonth) {
            pieChartData = selectedMonthReport.topProductsThisMonth.map((item, index) => ({
                product: item.product,
                salesCount: item.estimatedSalesCount,
                fill: fixedPieColors[index % fixedPieColors.length], // Asigna colores cíclicamente
            }));

            totalSalesForActiveMonth = selectedMonthReport.totalSalesForMonth || 0;
            // Config para el Pie Chart: solo para los labels de los productos en el tooltip
            pieChartConfig = {
                // Puedes agregar una entrada para el dataKey principal si el tooltip la necesita genéricamente
                salesCount: { label: "Cantidad Vendida" },
            };
            pieChartData.forEach(item => {
                pieChartConfig[item.product] = {
                    label: item.product,
                    color: item.fill,
                };
            });

            pieChartTitle = `Distribución de Ventas para ${selectedMonthReport.month} ${selectedMonthReport.year}`;
            pieChartDescription = "Ventas estimadas de productos principales.";

        } else if (activePieMonth) {
            pieChartDescription = `No hay datos de productos principales para ${activePieMonth}.`;
            pieChartData = [];
            totalSalesForActiveMonth = 0;
        } else {
            pieChartDescription = "Selecciona un mes para ver la distribución de ventas.";
            pieChartData = [];
            totalSalesForActiveMonth = 0;
        }

    } else {
        pieChartTitle = "Gráfico no disponible";
        pieChartDescription = "Este gráfico solo muestra datos para Reportes Mensuales.";
        pieChartData = [];
        totalSalesForActiveMonth = 0;
    }

    const availableMonths = React.useMemo(() => {
        if (allReports && allReports.monthly) {
            return allReports.monthly.map(report => ({
                value: report.monthNumber,
                label: `${report.month} ${report.year}`,
                color: fixedPieColors[parseInt(report.monthNumber) % fixedPieColors.length] || 'gray'
            })).sort((a,b) => parseInt(a.value) - parseInt(b.value));
        }
        return [];
    }, [allReports, fixedPieColors]); // Dependencia fixedPieColors para que se re-genere si cambian

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
                <ChartBarActive
                    chartData={barChartData}
                    chartConfig={barChartConfig}
                    title={barChartTitle}
                    description={barChartDescription}
                    footerText={barChartFooter}
                    trendingText={barChartTrendingText}
                />
            </div>

            {currentReportType === 'monthly' ? (
                <ChartPieInteractive
                    pieChartData={pieChartData}
                    pieChartConfig={pieChartConfig}
                    title={pieChartTitle}
                    description={pieChartDescription}
                    totalSalesForActiveMonth={totalSalesForActiveMonth}
                    availableMonths={availableMonths}
                    activeMonth={activePieMonth}
                    setActiveMonth={setActivePieMonth}
                />
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>{pieChartTitle}</CardTitle>
                        <CardDescription>{pieChartDescription}</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                        {pieChartDescription}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default MVToggleGraphics;