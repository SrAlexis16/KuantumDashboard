import allDaily from "./allDailyReports";
import allMonthly from "./allMonthlyReports";
import allMaterial from "./allMaterialReports";

// Normalizador genérico
function normalizeReport(report, type) {
  return {
    id: report.id,
    name: report.name || "Sin nombre",
    summary: report.summary || "",
    type,
    date: report.details?.date || report.date || "Sin fecha",
  };
}

// Transformamos todos los reportes a formato plano
export const allReports = [
  ...allDaily.map((r) => normalizeReport(r, "Diario")),
  ...allMonthly.map((r) => normalizeReport(r, "Mensual")),
  ...allMaterial.map((r) => normalizeReport(r, "Materia Prima")),
];

export default normalizeReport