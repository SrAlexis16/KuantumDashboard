"use client"

import React, { useState, useEffect } from 'react';
import SettingsSidebar from '@/components/SettingsPage/SettingsSideBar';
import { settingsComponentsMap } from '@/lib/sidebar-settings-data';

export default function SettingsPage() {
  const [activeComponent, setActiveComponent] = useState("DefaultMessage");

  // Cargar desde localStorage al montar
  useEffect(() => {
    const lastComponent = localStorage.getItem("lastActiveSettingsComponent");
    if (lastComponent && settingsComponentsMap[lastComponent]) {
      setActiveComponent(lastComponent);
    } else {
      setActiveComponent("DefaultMessage");
    }
  }, []);

  // Guardar en localStorage al cambiar de sección
  const handleSetActiveComponent = (component) => {
    setActiveComponent(component);
    localStorage.setItem("lastActiveSettingsComponent", component);
  };

  const CurrentComponent = settingsComponentsMap[activeComponent] || settingsComponentsMap.DefaultMessage;

  // Cargar componente padre
  return (
    <div className="flex bg-background text-foreground">
      <div className="page-content flex flex-row w-full p-6">
        <aside className="w-64 flex-shrink-0 border-r dark:border-gray-700 h-[900px]">
          <SettingsSidebar
            activeComponent={activeComponent}
            onSetActiveComponent={handleSetActiveComponent}
          />
        </aside>
        <main className="flex-1 p-8 overflow-y-auto">
          <CurrentComponent />
        </main>
      </div>
    </div>
  );
}
