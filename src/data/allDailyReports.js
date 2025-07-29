// src/data/allDailyReports.js

import june2025Reports from './dailyReports/2025/d1-june.json';
import july2025Reports from './dailyReports/2025/d1-july.json';
import august2025Reports from './dailyReports/2025/d1-august.json';
import january2026Reports from './dailyReports/2026/d2-january.json';
import february2026Reports from './dailyReports/2026/d2-february.json';

const allDailyReports = [
  ...june2025Reports,
  ...july2025Reports,
  ...august2025Reports,
  ...january2026Reports,
  ...february2026Reports,
];

export default allDailyReports;