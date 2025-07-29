// hooks/useReportStats.js
import { useMemo } from "react";

export function useReportStats(normalizedData) {
    const stats = useMemo(() => {
        if (!normalizedData || !normalizedData.all) {
            return {
                totalReports: 0,
                validReports: 0,
                invalidReports: 0,
                byType: { daily: 0, monthly: 0, material: 0 },
                totalSalesAcrossAllDaily: 0,
                totalSalesAcrossAllMonthly: 0,
                totalCostAcrossAllMaterial: 0,
                // Puedes añadir más estadísticas aquí si las necesitas
            };
        }

        const totalReports = normalizedData.all.length;
        const dailyReports = normalizedData.daily.length;
        const monthlyReports = normalizedData.monthly.length;
        const materialReports = normalizedData.material.length;

        // Calcular métricas sumadas para las tarjetas de resumen
        // Asegúrate de que las propiedades `totalSalesForDay` y `mainMetricValue` existan en tus reportes normalizados
        const totalSalesAcrossAllDaily = normalizedData.daily.reduce((sum, report) => sum + (report.totalSalesForDay || 0), 0);
        const totalSalesAcrossAllMonthly = normalizedData.monthly.reduce((sum, report) => sum + (report.mainMetricValue || 0), 0);
        const totalCostAcrossAllMaterial = normalizedData.material.reduce((sum, report) => sum + (report.mainMetricValue || 0), 0);

        return {
            totalReports: totalReports,
            validReports: normalizedData.all.filter(r => r.isValid).length,
            invalidReports: normalizedData.all.filter(r => !r.isValid).length,
            byType: {
                daily: dailyReports,
                monthly: monthlyReports,
                material: materialReports
            },
            totalSalesAcrossAllDaily: totalSalesAcrossAllDaily,
            totalSalesAcrossAllMonthly: totalSalesAcrossAllMonthly,
            totalCostAcrossAllMaterial: totalCostAcrossAllMaterial,
            totalOverallSales: totalSalesAcrossAllDaily + totalSalesAcrossAllMonthly,
            totalOverallCost: totalCostAcrossAllMaterial
        };
    }, [normalizedData]);
    return stats;
}