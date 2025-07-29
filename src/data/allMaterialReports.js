// src/data/allMaterialReports.js
import june2025RM from './rawMaterialReports/2025/rm1-june.json';
import july2025RM from './rawMaterialReports/2025/rm1-july.json';
import august2025RM from './rawMaterialReports/2025/rm1-august.json';
import january2026RM from './rawMaterialReports/2026/rm2-january.json';
import february2026RM from './rawMaterialReports/2026/rm2-february.json';

const allMaterialReports = [
    june2025RM,
    july2025RM,
    august2025RM,
    january2026RM,
    february2026RM,
].filter(Boolean);

export default allMaterialReports;