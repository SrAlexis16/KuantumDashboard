// src/lib/sidebar-settings-data.jsx
import {
  Settings,
  LayoutDashboard,
  Book,
  Info,
  Bell,
  RefreshCw,
  Download,
  Building,
  FileText,
  Box,
  GitBranch,
  AlertCircle,
  FileQuestion,
} from "lucide-react";

// *** IMPORTACIONES DE COMPONENTES DE PREFERENCIAS (NUEVAS RUTAS) ***
import BusinessInfoSection from "@/components/SettingsPage/Sub-Components/Preferencess/BusinessInfoSection";
import NotificationSettingsSection from "@/components/SettingsPage/Sub-Components/Preferencess/NotificationSettingsSection";
import ApiKeySection from "@/components/SettingsPage/Sub-Components/Preferencess/ApiKeySection";
import ExportMethodSection from "@/components/SettingsPage/Sub-Components/Preferencess/ExportMethodSections";

import CustomerManagementSection from "@/components/SettingsPage/Sub-Components/Management/CustomerManagementSection";
import InventoryViewSection from "@/components/SettingsPage/Sub-Components/Management/InventoryViewSection.jsx";

import InfoSection from "@/components/SettingsPage/Sub-Components/Documentationn/InfoSections";
import AppVersionSection from "@/components/SettingsPage/Sub-Components/Documentationn/AppVersionSection";
import PoliciesSection from "@/components/SettingsPage/Sub-Components/Documentationn/PolicesSection";


// Datos para la estructura del sidebar (sin cambios en la estructura del objeto)
export const sidebarSettingsData = [
  {
    id: "preferences",
    title: "Preferencias",
    icon: Settings,
    items: [
      { name: "Información del negocio", icon: Building, component: "BusinessInfoSection" },
      { name: "Notificaciones", icon: Bell, component: "NotificationSettingsSection" },
      { name: "Actualizar API", icon: RefreshCw, component: "ApiKeySection" },
      { name: "Método de exportación", icon: Download, component: "ExportMethodSection" },
    ],
  },
  {
    id: "management",
    title: "Gestión",
    icon: LayoutDashboard,
    items: [
      { name: "Visualizar clientes", icon: FileText, component: "CustomerManagementSection" },
      { name: "Visualizar inventario", icon: Box, component: "InventoryViewSection" },
    ],
  },
  {
    id: "documentation",
    title: "Documentación",
    icon: Book,
    items: [
      // *** ASIGNACIÓN A LOS NUEVOS COMPONENTES ***
      { name: "Información", icon: Info, component: "InfoSection" },
      { name: "Versión del app", icon: GitBranch, component: "AppVersionSection" },
      { name: "Políticas", icon: FileQuestion, component: "PoliciesSection" }, // Asegúrate de que el ícono sea FileQuestion
    ],
  },
];

// Mapa de componentes para renderizado dinámico en SettingsPage
export const settingsComponentsMap = {
  // Componentes de Preferencias (apuntan a los nuevos sub-componentes)
  BusinessInfoSection: BusinessInfoSection,
  NotificationSettingsSection: NotificationSettingsSection,
  ApiKeySection: ApiKeySection,
  ExportMethodSection: ExportMethodSection,

  CustomerManagementSection: CustomerManagementSection, // <--- NUEVO
  InventoryViewSection: InventoryViewSection,

  InfoSection: InfoSection,
  AppVersionSection: AppVersionSection,
  PoliciesSection: PoliciesSection,

  // Mensaje por defecto
  DefaultMessage: () => (
    <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
      <AlertCircle className="w-12 h-12 mb-4" />
      <p className="text-lg font-medium">Selecciona una categoría para empezar</p>
    </div>
  ),
};