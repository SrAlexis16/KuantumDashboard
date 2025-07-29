// src/data/allMonthlyReports.js

// Las rutas están bien, pero verifica que los archivos existan
import june2025Monthly from './monthlyReports/2025/m1-june.json';
import july2025Monthly from './monthlyReports/2025/m1-july.json';
import august2025Monthly from './monthlyReports/2025/m1-august.json';
import january2026Monthly from './monthlyReports/2026/m2-january.json';
import february2026Monthly from './monthlyReports/2026/m2-february.json';

const allMonthlyReports = [
  june2025Monthly,
  july2025Monthly,
  august2025Monthly,
  january2026Monthly,
  february2026Monthly,
];

export default allMonthlyReports;