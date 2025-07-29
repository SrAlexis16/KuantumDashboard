// hooks/useUnifiedReports.js
import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Importa tus datos
import allDaily from "@/data/allDailyReports";
import allMonthly from "@/data/allMonthlyReports";
import allMaterial from "@/data/allMaterialReports";

// Context interno
const ReportsContext = createContext();

// Función para normalizar fechas de reportes diarios
function normalizeDailyReport(report) {
    const rawDate = report.details?.date || report.date;

    let monthNumber = null;
    let year = null;
    let day = null;
    let dateKey = null;
    let fullDateISO = null;

    let monthName = "";

    let cleanedId;
    if (report.id) {
        cleanedId = String(report.id).replace(/reporte-(diario|mensual|material)-/, '');
    } else {
        cleanedId = `${(report.name || 'reporte').replace(/\s/g, '-')}-${rawDate || 'no-date'}-daily-${Math.random().toString(36).substr(2, 9)}`;
    }

    if (typeof rawDate === 'string' && rawDate.length > 0) {
        try {
            const isoParts = rawDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
            if (isoParts) {
                year = parseInt(isoParts[1], 10);
                monthNumber = parseInt(isoParts[2], 10);
                day = parseInt(isoParts[3], 10);
                fullDateISO = rawDate;
            } else {
                const humanParts = rawDate.match(/(\d{1,2}) de (\w+) de (\d{4})/i);
                if (humanParts) {
                    day = parseInt(humanParts[1], 10);
                    year = parseInt(humanParts[3], 10);
                    const monthNames = [
                        "enero", "febrero", "marzo", "abril", "mayo", "junio",
                        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
                    ];
                    const monthIndex = monthNames.indexOf(humanParts[2].toLowerCase());
                    if (monthIndex !== -1) {
                        monthNumber = monthIndex + 1;
                        fullDateISO = `${year}-${String(monthNumber).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    }
                }
            }

            if (monthNumber && year) {
                dateKey = `${year}-${String(monthNumber).padStart(2, "0")}`;
                try {
                    const tempDate = new Date(year, monthNumber - 1, 1);
                    monthName = format(tempDate, 'MMMM', { locale: es });
                    monthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
                } catch (e) {
                    monthName = "";
                }
            }
        } catch (e) {
            console.warn("Error al procesar fecha diaria:", rawDate, e);
        }
    }

    const totalSales = parseFloat(report.details?.totalSales || report.totalSales || 0);
    const breadsSold = parseInt(report.details?.breadsSold || report.breadsSold || 0, 10);
    const reportNumber = report.details?.reportNumber || report.reportNumber || 'N/A';

    return {
        ...report,
        id: cleanedId,
        type: "daily",
        name: report.name || `Reporte Diario #${reportNumber}`,
        reportNumber: reportNumber,
        date: rawDate,
        displayDate: fullDateISO || rawDate,
        month: monthName,
        monthNumber: monthNumber,
        year: year,
        day: day,
        dateKey: dateKey,
        fullDateISO: fullDateISO,
        details: {
            ...report.details,
            totalSales: totalSales,
            breadsSold: breadsSold,
            reportNumber: reportNumber,
            date: rawDate
        },
        totalSalesForDay: totalSales,
        breadsSoldForDay: breadsSold,
        isValid: !!(fullDateISO && monthNumber && year)
    };
}

// Función para normalizar reportes mensuales/materiales
function normalizeMonthlyMaterialReport(report, type) {
    const monthNumber = typeof report.monthNumber === "string" ?
        parseInt(report.monthNumber, 10) : report.monthNumber;
    const year = typeof report.year === "string" ?
        parseInt(report.year, 10) : report.year;

    let monthName = "";
    if (report.month) {
        monthName = report.month.charAt(0).toUpperCase() + report.month.toLowerCase().slice(1);
    } else if (monthNumber && year) {
        try {
            const tempDate = new Date(year, monthNumber - 1, 1);
            monthName = format(tempDate, 'MMMM', { locale: es });
            monthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
        } catch (e) {
            monthName = "";
        }
    }

    const dateKey = (monthNumber && year) ?
        `${year}-${String(monthNumber).padStart(2, "0")}` : null;
    const displayDate = dateKey ? `${dateKey}-01` : 'N/A';

    let cleanedId;
    if (report.id) {
        cleanedId = String(report.id).replace(/reporte-(diario|mensual|material)-/, '');
    } else {
        cleanedId = `${(report.name || 'reporte').replace(/\s/g, '-')}-${dateKey || 'no-date'}-${type}-${Math.random().toString(36).substr(2, 9)}`;
    }

    let mainMetricValue = 0;
    let secondaryMetricValue = 'N/A';

    if (type === "monthly") {
        mainMetricValue = parseFloat(report.totalSalesForMonth || 0);
        secondaryMetricValue = parseFloat(report.netProfitForMonth || 0);
    } else if (type === "material") {
        mainMetricValue = parseFloat(report.totalCostOfRawMaterials || 0);
        secondaryMetricValue = parseFloat(report.costOfMainIngredient?.cost || 0);
    }
    
    const reportNumber = report.details?.reportNumber || report.reportNumber || `${monthName} ${year}`;

    return {
        ...report,
        id: cleanedId,
        type: type,
        name: report.name || `Reporte ${type === 'monthly' ? 'Mensual' : 'Materia Prima'} ${monthName} ${year}`,
        reportNumber: reportNumber,
        month: monthName,
        monthNumber: monthNumber,
        year: year,
        dateKey: dateKey,
        displayDate: displayDate,
        mainMetricValue: mainMetricValue,
        secondaryMetricValue: secondaryMetricValue,
        isValid: !!(monthNumber && year && dateKey)
    };
}

// Provider component
function ReportsProvider({ children }) {
    const [rawData, setRawData] = useState({
        daily: [],
        monthly: [],
        material: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // CARGA ÚNICA EN TODA LA APLICACIÓN
    useEffect(() => {
        try {
            console.log('🔄 Cargando datos iniciales una sola vez...');

            const dailyData = Array.isArray(allDaily) ? allDaily : [];
            const monthlyData = Array.isArray(allMonthly) ? allMonthly : [];
            const materialData = Array.isArray(allMaterial) ? allMaterial : [];

            setRawData({
                daily: dailyData,
                monthly: monthlyData,
                material: materialData
            });

            console.log('✅ Datos cargados exitosamente:', {
                daily: dailyData.length,
                monthly: monthlyData.length,
                material: materialData.length
            });

        } catch (err) {
            console.error("❌ Error al cargar datos:", err);
            setError("Error al cargar datos iniciales");
        } finally {
            setLoading(false);
        }
    }, []);

    // Normalizar y procesar datos
    const normalizedData = useMemo(() => {
        if (loading) return { daily: [], monthly: [], material: [], all: [] };

        const daily = rawData.daily.map(report => normalizeDailyReport(report));
        const monthly = rawData.monthly.map(report => normalizeMonthlyMaterialReport(report, "monthly"));
        const material = rawData.material.map(report => normalizeMonthlyMaterialReport(report, "material"));

        let allReports = [...daily, ...monthly, ...material].filter(report => report.isValid);

        // Deduplicación
        const initialReportCount = allReports.length;
        const seenIds = new Set();
        const uniqueReports = [];
        for (const report of allReports) {
            if (report.id && !seenIds.has(report.id)) {
                uniqueReports.push(report);
                seenIds.add(report.id);
            }
        }
        allReports = uniqueReports;
        const duplicatesRemoved = initialReportCount - allReports.length;

        if (duplicatesRemoved > 0) {
            console.log(`🧹 [GLOBAL] Duplicados eliminados: ${duplicatesRemoved}`);
        }

        // Ordenar por fecha
        allReports.sort((a, b) => {
            const dateA = new Date(a.fullDateISO || a.displayDate);
            const dateB = new Date(b.fullDateISO || b.displayDate);
            return dateB.getTime() - dateA.getTime();
        });

        return { daily, monthly, material, all: allReports };
    }, [rawData, loading]);

    // Funciones de utilidad
    const getReportsByYear = useMemo(() => (year, type = null) => {
        const targetData = type ? normalizedData[type] : normalizedData.all;
        return targetData.filter(report => report.year === parseInt(year));
    }, [normalizedData]);

    const getReportsByDateKey = useMemo(() => (dateKey, type = null) => {
        const targetData = type ? normalizedData[type] : normalizedData.all;
        return targetData.filter(report => report.dateKey === dateKey);
    }, [normalizedData]);

    const getAvailableYears = useMemo(() => {
        const years = new Set();
        normalizedData.all.forEach(report => {
            if (report.year) years.add(report.year);
        });
        return Array.from(years).sort((a, b) => b - a);
    }, [normalizedData]);

    const getChartData = useMemo(() => (year, viewType) => {
        const reports = getReportsByYear(year, viewType === 'sales' ? 'monthly' : 'material');

        return reports
            .sort((a, b) => a.monthNumber - b.monthNumber)
            .map(report => ({
                month: format(new Date(report.year, report.monthNumber - 1), 'MMM', { locale: es }),
                desktop: viewType === 'sales' ? (report.mainMetricValue || 0) : (report.mainMetricValue || 0),
                mobile: viewType === 'sales' ? (report.secondaryMetricValue || 0) : (report.secondaryMetricValue || 0),
                originalReport: report
            }));
    }, [getReportsByYear]);

    const value = {
        data: normalizedData,
        loading,
        error,
        getReportsByYear,
        getReportsByDateKey,
        getAvailableYears,
        getChartData
    };

    return (
        <ReportsContext.Provider value={value}>
            {children}
        </ReportsContext.Provider>
    );
}

// HOOK
export function useUnifiedReports() {
    const context = useContext(ReportsContext);
    if (!context) {
        throw new Error('useUnifiedReports debe ser usado dentro de un ReportsProvider. Asegúrate de envolver tu App con <ReportsProvider>');
    }
    return context;
}

export { ReportsProvider };