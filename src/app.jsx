// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar.jsx';
import HomePage from './pages/HomePage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import { Link } from 'react-router-dom';
import { Toaster } from "sonner"
import { ReportsProvider } from '@/hooks/useUnifiedReports';

function App() {
  return (
    <ReportsProvider>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={
          <div className="page-content p-6 bg-gray-900 min-h-screen text-white flex flex-col items-center justify-center">
            <h2 className="text-3xl font-bold text-red-500 mb-4">404: Página No Encontrada</h2>
            <p className="text-gray-400 text-lg">Lo sentimos, la página que buscas no existe.</p>
            <Link to="/" className="mt-6 text-blue-400 hover:underline">Volver a la página de inicio</Link>
          </div>
        } />
      </Routes>

      <Toaster 
        position="top-right"
        richColors
        closeButton
        duration={3000}
        expand={true}
        visibleToasts={5}
      />
    </ReportsProvider>
  );
}

export default App;