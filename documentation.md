# 📘 Documentación Técnica del Proyecto de Reportes

Este proyecto permite el manejo y visualización de distintos reportes empresariales como ventas diarias, mensuales y consumo de materia prima. Para garantizar que tus datos se rendericen correctamente en el sistema, asegúrate de seguir las estructuras definidas a continuación.

---

## 🚨 Advertencias Importantes

> Si vas a usar parte de este código o integrar tus propios reportes, **asegúrate de que tengan las siguientes estructuras JSON** para evitar errores en visualizaciones, búsquedas o filtros del sistema.

> [!IMPORTANT]
> Este código actualmente **solo acepta datos estáticos**. Si deseas realizar llamadas a APIs para obtener datos dinámicos, deberás configurarlas en el hook:
>
> ```javascript
> // hooks/useUnifiedReports.js
> import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
> import { format } from "date-fns";
> import { es } from "date-fns/locale";
>
> // Importa tus datos (estas líneas deberán ser modificadas para llamadas a API)
> import allDaily from "@/data/allDailyReports";
> import allMonthly from "@/data/allMonthlyReports";
> import allMaterial from "@/data/allMaterialReports";
>
> // Context interno (no lo exportamos directamente)
> const ReportsContext = createContext();
>
> // Función para normalizar fechas de reportes diarios
> function normalizeDailyReport(report) {
>     const rawDate = report.details?.date || report.date;
>
>     let monthNumber = null;
>     let year = null;
>     let day = null;
>     let dateKey = null;
>     let fullDateISO = null;
>     let monthName = "";
>
>     // Generación de ID único si no existe
>     let cleanedId;
>     if (report.id) {
>         cleanedId = String(report.id).replace(/reporte-(diario|mensual|material)-/, '');
>     } else {
>         cleanedId = `${(report.name || 'reporte').replace(/\s/g, '-')}-${rawDate || 'no-date'}-daily-${Math.random().toString(36).substr(2, 9)}`;
>     }
>
>     // Procesamiento de fechas en múltiples formatos
>     if (typeof rawDate === 'string' && rawDate.length > 0) {
>         try {
>             // Formato ISO: YYYY-MM-DD
>             const isoParts = rawDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
>             if (isoParts) {
>                 year = parseInt(isoParts[1], 10);
>                 monthNumber = parseInt(isoParts[2], 10);
>                 day = parseInt(isoParts[3], 10);
>                 fullDateISO = rawDate;
>             } else {
>                 // Formato humano: "DD de Mes de YYYY"
>                 const humanParts = rawDate.match(/(\d{1,2}) de (\w+) de (\d{4})/i);
>                 if (humanParts) {
>                     day = parseInt(humanParts[1], 10);
>                     year = parseInt(humanParts[3], 10);
>                     const monthNames = [
>                         "enero", "febrero", "marzo", "abril", "mayo", "junio",
>                         "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
>                     ];
>                     const monthIndex = monthNames.indexOf(humanParts[2].toLowerCase());
>                     if (monthIndex !== -1) {
>                         monthNumber = monthIndex + 1;
>                         fullDateISO = `${year}-${String(monthNumber).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
>                     }
>                 }
>             }
>
>             // Generación de dateKey y nombre del mes
>             if (monthNumber && year) {
>                 dateKey = `${year}-${String(monthNumber).padStart(2, "0")}`;
>                 try {
>                     const tempDate = new Date(year, monthNumber - 1, 1);
>                     monthName = format(tempDate, 'MMMM', { locale: es });
>                     monthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
>                 } catch (e) {
>                     monthName = "";
>                 }
>             }
>         } catch (e) {
>             console.warn("Error al procesar fecha diaria:", rawDate, e);
>         }
>     }
>
>     // Extracción de métricas clave
>     const totalSales = parseFloat(report.details?.totalSales || report.totalSales || 0);
>     const breadsSold = parseInt(report.details?.breadsSold || report.breadsSold || 0, 10);
>     const reportNumber = report.details?.reportNumber || report.reportNumber || 'N/A';
>
>     return {
>         ...report,
>         id: cleanedId,
>         type: "daily",
>         name: report.name || `Reporte Diario #${reportNumber}`,
>         reportNumber: reportNumber,
>         date: rawDate,
>         displayDate: fullDateISO || rawDate,
>         month: monthName,
>         monthNumber: monthNumber,
>         year: year,
>         day: day,
>         dateKey: dateKey,
>         fullDateISO: fullDateISO,
>         details: {
>             ...report.details,
>             totalSales: totalSales,
>             breadsSold: breadsSold,
>             reportNumber: reportNumber,
>             date: rawDate
>         },
>         totalSalesForDay: totalSales,
>         breadsSoldForDay: breadsSold,
>         isValid: !!(fullDateISO && monthNumber && year)
>     };
> }
>
> // Función para normalizar reportes mensuales y de materiales
> function normalizeMonthlyMaterialReport(report, type) {
>     // Conversión de tipos para monthNumber y year
>     const monthNumber = typeof report.monthNumber === "string" ?
>         parseInt(report.monthNumber, 10) : report.monthNumber;
>     const year = typeof report.year === "string" ?
>         parseInt(report.year, 10) : report.year;
>
>     // Generación del nombre del mes
>     let monthName = "";
>     if (report.month) {
>         monthName = report.month.charAt(0).toUpperCase() + report.month.toLowerCase().slice(1);
>     } else if (monthNumber && year) {
>         try {
>             const tempDate = new Date(year, monthNumber - 1, 1);
>             monthName = format(tempDate, 'MMMM', { locale: es });
>             monthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
>         } catch (e) {
>             monthName = "";
>         }
>     }
>
>     // Generación de claves de fecha y visualización
>     const dateKey = (monthNumber && year) ?
>         `${year}-${String(monthNumber).padStart(2, "0")}` : null;
>     const displayDate = dateKey ? `${dateKey}-01` : 'N/A';
>
>     // Generación de ID único
>     let cleanedId;
>     if (report.id) {
>         cleanedId = String(report.id).replace(/reporte-(diario|mensual|material)-/, '');
>     } else {
>         cleanedId = `${(report.name || 'reporte').replace(/\s/g, '-')}-${dateKey || 'no-date'}-${type}-${Math.random().toString(36).substr(2, 9)}`;
>     }
>
>     // Extracción de métricas según el tipo de reporte
>     let mainMetricValue = 0;
>     let secondaryMetricValue = 'N/A';
>
>     if (type === "monthly") {
>         mainMetricValue = parseFloat(report.totalSalesForMonth || 0);
>         secondaryMetricValue = parseFloat(report.netProfitForMonth || 0);
>     } else if (type === "material") {
>         mainMetricValue = parseFloat(report.totalCostOfRawMaterials || 0);
>         secondaryMetricValue = parseFloat(report.costOfMainIngredient?.cost || 0);
>     }
>
>     const reportNumber = report.details?.reportNumber || report.reportNumber || `${monthName} ${year}`;
>
>     return {
>         ...report,
>         id: cleanedId,
>         type: type,
>         name: report.name || `Reporte ${type === 'monthly' ? 'Mensual' : 'Materia Prima'} ${monthName} ${year}`,
>         reportNumber: reportNumber,
>         month: monthName,
>         monthNumber: monthNumber,
>         year: year,
>         dateKey: dateKey,
>         displayDate: displayDate,
>         mainMetricValue: mainMetricValue,
>         secondaryMetricValue: secondaryMetricValue,
>         isValid: !!(monthNumber && year && dateKey)
>     };
> }
>
> // Componente Provider
> function ReportsProvider({ children }) {
>     const [rawData, setRawData] = useState({
>         daily: [],
>         monthly: [],
>         material: []
>     });
>     const [loading, setLoading] = useState(true);
>     const [error, setError] = useState(null);
>
>     // ✅ CARGA ÚNICA DE DATOS EN TODA LA APLICACIÓN
>     useEffect(() => {
>         try {
>             console.log('🔄 Cargando datos iniciales una sola vez...');
>
>             // ⚠️ AQUÍ es donde deberías reemplazar la carga de datos estáticos
>             // por tus llamadas a APIs. Por ejemplo:
>             // const dailyData = await fetch('/api/dailyReports').then(res => res.json());
>             // const monthlyData = await fetch('/api/monthlyReports').then(res => res.json());
>             // const materialData = await fetch('/api/materialReports').then(res => res.json());
>
>             const dailyData = Array.isArray(allDaily) ? allDaily : [];
>             const monthlyData = Array.isArray(allMonthly) ? allMonthly : [];
>             const materialData = Array.isArray(allMaterial) ? allMaterial : [];
>
>             setRawData({
>                 daily: dailyData,
>                 monthly: monthlyData,
>                 material: materialData
>             });
>
>             console.log('✅ Datos cargados exitosamente:', {
>                 daily: dailyData.length,
>                 monthly: monthlyData.length,
>                 material: materialData.length
>             });
>
>         } catch (err) {
>             console.error("❌ Error al cargar datos:", err);
>             setError("Error al cargar datos iniciales");
>         } finally {
>             setLoading(false);
>         }
>     }, []);
>
>     // Normalización y procesamiento de datos con memoización
>     const normalizedData = useMemo(() => {
>         if (loading) return { daily: [], monthly: [], material: [], all: [] };
>
>         const daily = rawData.daily.map(report => normalizeDailyReport(report));
>         const monthly = rawData.monthly.map(report => normalizeMonthlyMaterialReport(report, "monthly"));
>         const material = rawData.material.map(report => normalizeMonthlyMaterialReport(report, "material"));
>
>         let allReports = [...daily, ...monthly, ...material].filter(report => report.isValid);
>
>         // Sistema de deduplicación
>         const initialReportCount = allReports.length;
>         const seenIds = new Set();
>         const uniqueReports = [];
>         for (const report of allReports) {
>             if (report.id && !seenIds.has(report.id)) {
>                 uniqueReports.push(report);
>                 seenIds.add(report.id);
>             }
>         }
>         allReports = uniqueReports;
>         const duplicatesRemoved = initialReportCount - allReports.length;
>
>         if (duplicatesRemoved > 0) {
>             console.log(`🧹 Duplicados eliminados: ${duplicatesRemoved}`);
>         }
>
>         // Ordenamiento por fecha (más recientes primero)
>         allReports.sort((a, b) => {
>             const dateA = new Date(a.fullDateISO || a.displayDate);
>             const dateB = new Date(b.fullDateISO || b.displayDate);
>             return dateB.getTime() - dateA.getTime();
>         });
>
>         return { daily, monthly, material, all: allReports };
>     }, [rawData, loading]);
>
>     // Funciones de utilidad con memoización para optimización
>     const getReportsByYear = useMemo(() => (year, type = null) => {
>         const targetData = type ? normalizedData[type] : normalizedData.all;
>         return targetData.filter(report => report.year === parseInt(year));
>     }, [normalizedData]);
>
>     const getReportsByDateKey = useMemo(() => (dateKey, type = null) => {
>         const targetData = type ? normalizedData[type] : normalizedData.all;
>         return targetData.filter(report => report.dateKey === dateKey);
>     }, [normalizedData]);
>
>     const getAvailableYears = useMemo(() => {
>         const years = new Set();
>         normalizedData.all.forEach(report => {
>             if (report.year) years.add(report.year);
>         });
>         return Array.from(years).sort((a, b) => b - a);
>     }, [normalizedData]);
>
>     const getChartData = useMemo(() => (year, viewType) => {
>         const reports = getReportsByYear(year, viewType === 'sales' ? 'monthly' : 'material');
>
>         return reports
>             .sort((a, b) => a.monthNumber - b.monthNumber)
>             .map(report => ({
>                 month: format(new Date(report.year, report.monthNumber - 1), 'MMM', { locale: es }),
>                 desktop: viewType === 'sales' ? (report.mainMetricValue || 0) : (report.mainMetricValue || 0),
>                 mobile: viewType === 'sales' ? (report.secondaryMetricValue || 0) : (report.secondaryMetricValue || 0),
>                 originalReport: report
>             }));
>     }, [getReportsByYear]);
>
>     const value = {
>         data: normalizedData,
>         loading,
>         error,
>         getReportsByYear,
>         getReportsByDateKey,
>         getAvailableYears,
>         getChartData
>     };
>
>     return (
>         <ReportsContext.Provider value={value}>
>             {children}
>         </ReportsContext.Provider>
>     );
> }
>
> // ✅ HOOK PRINCIPAL PARA CONSUMIR LOS REPORTES
> export function useUnifiedReports() {
>     const context = useContext(ReportsContext);
>     if (!context) {
>         throw new Error('useUnifiedReports debe ser usado dentro de un ReportsProvider. Asegúrate de envolver tu App con <ReportsProvider>');
>     }
>     return context;
> }
>
> // ✅ EXPORTACIÓN DEL PROVIDER
> export { ReportsProvider };
> ```
>
> **Punto clave:** La parte donde debes configurar tus llamadas a APIs está en el `useEffect` dentro del `ReportsProvider` en el archivo `hooks/useUnifiedReports.js`. Busca el comentario `// ⚠️ AQUÍ es donde deberías reemplazar la carga de datos estáticos`.

---

## 🔧 Uso del Hook `useUnifiedReports`

El hook `useUnifiedReports` proporciona un acceso unificado y normalizado a todos los tipos de reportes (diarios, mensuales y de material). Está diseñado para centralizar la lógica de carga y procesamiento de datos, facilitando el consumo de los mismos en cualquier parte de tu aplicación.

### 📋 Configuración inicial:

1. **Envolver tu aplicación con `ReportsProvider`**: Este componente gestiona el estado global de los reportes y los hace disponibles para sus componentes hijos. El `ReportsProvider` ya debe estar configurado en `app.jsx`.

   ```javascript
   // En app.jsx o tu componente raíz
   import { ReportsProvider } from './hooks/useUnifiedReports';

   function App() {
     return (
       <ReportsProvider>
         {/* Tus componentes aquí */}
         <HomePage />
         <ReportPage />
         <SettingsPage />
       </ReportsProvider>
     );
   }
   ```

2. **Consumir el hook en componentes hijos**: Una vez envueltos en `ReportsProvider`, puedes usar `useUnifiedReports` en cualquier componente.

   ```javascript
   // En un componente como HomePage.js, ReportPage.js o SettingsPage.js
   import React from 'react';
   import { useUnifiedReports } from '../hooks/useUnifiedReports';

   function HomePage() {
     const { data, loading, error, getAvailableYears, getReportsByYear } = useUnifiedReports();

     if (loading) return <p>Cargando reportes...</p>;
     if (error) return <p>Error: {error}</p>;

     const years = getAvailableYears();
     const reports2024 = getReportsByYear(2024);

     return (
       <div>
         <h1>Panel de Reportes</h1>
         <p>Total de reportes cargados: {data.all.length}</p>
         <p>Años disponibles: {years.join(', ')}</p>
         {/* Renderiza tus datos */}
       </div>
     );
   }

   export default HomePage;
   ```

### 📊 Valores proporcionados por `useUnifiedReports`:

#### Estados principales:
- **`data`**: Objeto con reportes normalizados separados por tipo:
  - `data.daily`: Array de reportes diarios normalizados
  - `data.monthly`: Array de reportes mensuales normalizados  
  - `data.material`: Array de reportes de materia prima normalizados
  - `data.all`: Array combinado de todos los reportes, deduplicados y ordenados por fecha

- **`loading`**: Booleano que indica si los datos están cargando
- **`error`**: String con cualquier error ocurrido durante la carga

#### Funciones de utilidad:
- **`getReportsByYear(year, type)`**: Filtra reportes por año específico
  - `year`: Año a filtrar (número)
  - `type`: Opcional. Tipo específico ('daily', 'monthly', 'material')
  
- **`getReportsByDateKey(dateKey, type)`**: Filtra reportes por clave de fecha
  - `dateKey`: Formato "YYYY-MM" (ej: "2023-01")
  - `type`: Opcional. Tipo específico de reporte

- **`getAvailableYears()`**: Retorna array de años disponibles, ordenados descendentemente

- **`getChartData(year, viewType)`**: Datos formateados para gráficos
  - `year`: Año específico
  - `viewType`: Tipo de vista ('sales' para mensuales, 'material' para materiales)

---

## 🗓️ Estructura para Reportes Diarios

Los reportes diarios deben seguir esta estructura JSON exacta:

```json
[
  {
    "id": "reporte-diario-2025-08-01",
    "name": "Reporte Agosto #1",
    "summary": "Primer día de agosto con ventas sólidas, impulsadas por el interés en los productos de chocolate.",
    "details": {
      "date": "01 de Agosto de 2025",
      "info": "Ventas totales, tipos de panes vendidos, producción del día, ganancias netas.",
      "reportNumber": "001-20250801",
      "totalSales": 1450.75,
      "breadsSold": 280,
      "topProduct": "Pan de Chocolate y Nuez",
      "customersServed": 155
    },
    "previewImage": null,
    "notes": "Inicio prometedor del mes. Buen rendimiento de los panes de chocolate."
  }
]
```

### 🔍 Formatos de fecha soportados:
- **ISO**: `"2025-08-01"`
- **Humano**: `"01 de Agosto de 2025"`

## 📅 Estructura para Reportes Mensuales

```json
{
  "id": "agostoMontly-08",
  "name": "Reporte Mensual de Ventas - Agosto 2025",
  "reportType": "Reporte Mensual de Ventas",
  "details": {
    "date": "2025-08-31",
    "reportNumber": "M-20250831"
  },
  "month": "Agosto",
  "monthNumber": "08",
  "year": "2025",
  "currency": "Q",
  "summary": "Resumen de las actividades de ventas del mes de Agosto...",
  "totalSalesForMonth": 46500.00,
  "totalExpensesForMonth": 19000.00,
  "netProfitForMonth": 27500.00,
  "totalBreadsSold": 7800,
  "averageDailySales": 1500.00,
  "topProductsThisMonth": [
    { "product": "Pan de Chocolate y Nuez", "estimatedSalesCount": 1500, "revenue": 5250.00 },
    { "product": "Pan de Queso", "estimatedSalesCount": 1600, "revenue": 4800.00 },
    { "product": "Semita de Yema", "estimatedSalesCount": 1700, "revenue": 4250.00 },
    { "product": "Roles de Canela", "estimatedSalesCount": 1300, "revenue": 3900.00 }
  ],
  "customerSatisfaction": "Muy alto...",
  "marketingEfforts": [
    "Lanzamiento de la 'Semana del Chocolate'",
    "Colaboración con cafeterías locales"
  ],
  "challenges": [
    "Asegurar calidad de insumos",
    "Mantener eficiencia productiva"
  ],
  "recommendations": [
    "Innovar en productos",
    "Revisar cadena de suministro",
    "Contratar personal adicional"
  ]
}
```

## 🧂 Estructura para Reportes de Materia Prima

```json
{
  "id": "raw-material-agosto-2025",
  "name": "Reporte de Materia Prima - Agosto 2025",
  "reportType": "Reporte Mensual de Materia Prima",
  "details": {
    "date": "2025-08-15",
    "reportNumber": "RM-20250815"
  },
  "month": "Agosto",
  "monthNumber": "08",
  "year": "2025",
  "summary": "Análisis del uso y gestión de materia prima durante Agosto...",
  "keyObservations": [
    {
      "item": "Harina de Trigo",
      "status": "Aumento en consumo, bien gestionado",
      "notes": "Mayor producción impulsó el consumo...",
      "quantityUsed": 3500,
      "unit": "kg",
      "cost": 14000.00
    },
    {
      "item": "Chocolate Semiamargo",
      "status": "Alta demanda (estacional)",
      "notes": "La introducción de nuevos postres elevó su consumo...",
      "quantityUsed": 250,
      "unit": "kg",
      "cost": 3750.00
    }
  ],
  "totalCostOfRawMaterials": 35645.00,
  "wastePercentage": "2.5%",
  "costOfMainIngredient": {
    "item": "Harina de Trigo",
    "cost": 14000.00,
    "currency": "Q"
  },
  "recommendations": [
    "Comprar chocolate al por mayor",
    "Optimizar uso de azúcar",
    "Capacitación en técnicas de horneado"
  ]
}
```

---

## ⚡ Características del Sistema

### 🔄 Normalización automática
- **Fechas**: Convierte automáticamente entre formatos ISO y humanos
- **IDs**: Genera IDs únicos si no existen
- **Métricas**: Extrae y normaliza valores numéricos clave
- **Validación**: Filtra reportes inválidos automáticamente

### 🧹 Deduplicación inteligente
- Elimina reportes duplicados basándose en IDs únicos
- Registra en consola la cantidad de duplicados eliminados
- Mantiene solo la primera ocurrencia de cada reporte

### 📈 Optimización de rendimiento  
- **Memoización**: Todas las funciones de utilidad están memoizadas
- **Carga única**: Los datos se cargan una sola vez al inicializar la aplicación
- **Ordenamiento**: Los reportes se ordenan automáticamente por fecha (más recientes primero)

### 🔍 Sistema de filtrado avanzado
- Filtrado por año con soporte para tipos específicos
- Filtrado por clave de fecha (YYYY-MM)
- Generación de datos para gráficos optimizada

---

## 🔍 Notas Finales y Mejores Prácticas

Para mantener la integridad del sistema y evitar errores en la visualización de los reportes, ten en cuenta los siguientes puntos clave:

### ⚠️ **Sensibilidad a mayúsculas/minúsculas**  
Todos los campos del JSON son *case-sensitive*. Por ejemplo, `reportNumber` ≠ `ReportNumber`.

### 🆔 **Unicidad de Identificadores**  
Los campos `id` y `reportNumber` deben ser únicos para cada documento. Reutilizar valores puede causar fallos en búsquedas o reemplazos erróneos.

### 🖼️ **Vista previa de imágenes**  
El campo `previewImage` debe contener una ruta válida (relativa o absoluta) hacia la imagen.  
Si no se proporciona, su valor debe ser `null`.

### 🧹 **Campos opcionales vs requeridos**
- **Requeridos**: `id`, `name`, campos de fecha (`date`, `month`, `monthNumber`, `year`)
- **Opcionales**: `previewImage`, `notes`, `summary`
- **Métricas**: Deben ser numéricas válidas, se convierten automáticamente a 0 si están ausentes

### 📊 **Validación automática**
El sistema incluye validación automática que:
- Filtra reportes con fechas inválidas
- Convierte tipos de datos automáticamente
- Genera valores por defecto para campos faltantes
- Registra errores en la consola para debugging

### 🔧 **Migración a APIs**
Para migrar de datos estáticos a APIs dinámicas:
1. Localiza el comentario `// ⚠️ AQUÍ es donde deberías reemplazar la carga de datos estáticos`
2. Reemplaza las importaciones estáticas con llamadas `fetch()` o `axios`
3. Maneja los estados de carga y error apropiadamente
4. Asegúrate de que las APIs retornen la estructura JSON esperada

> 💡 **Consejo**: Mantén una plantilla base para cada tipo de reporte. Esto evitará errores comunes al repetir estructuras y asegurará que los reportes se comporten correctamente en los componentes de visualización.
> 
> 🧠 **Nota técnica**: El sistema cuenta con deduplicación automática, pero se recomienda evitar duplicación en el origen de datos para mejor rendimiento.