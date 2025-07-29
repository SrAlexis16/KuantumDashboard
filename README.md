# 📊 Dashboard de Reportes Empresariales

> **Sistema integral de análisis de datos y gestión empresarial para pequeños y medianos negocios**

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/SrAlexis16/DashboardReport)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4+-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3+-06B6D4.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

## 🚀 Descripción

Dashboard de Reportes es una plataforma web moderna diseñada para transformar la gestión empresarial a través del análisis inteligente de datos. Combina potentes herramientas de visualización con una interfaz intuitiva, permitiendo a las empresas tomar decisiones informadas basadas en datos reales.

### 🎯 ¿Por qué elegir este Dashboard?

- **📈 Análisis Visual Potente**: Convierte datos complejos en insights claros y accionables
- **⚡ Rendimiento Optimizado**: Interfaz rápida y responsiva para uso empresarial diario
- **🎨 Diseño Moderno**: UI/UX contemporáneo que mejora la productividad

## ✨ Características Principales

### 🏠 Dashboard Ejecutivo
**Centro de comando empresarial**
- **Visualización Rápida de Reportes**: Acceso inmediato a métricas clave con navegación fluida
- **Monitor de Pedidos en Tiempo Real**: Seguimiento completo de pedidos pendientes y entregas (funcion en desarrollo)
- **Reportes Favoritos**: Sistema de marcadores para acceso rápido a reportes críticos
- **Mini-Gráficos Interactivos**: Visualizaciones compactas de tendencias importantes
- **Bloc de Notas Flotante**: Herramienta integrada para anotaciones y recordatorios
- **Layout Optimizado**: Diseño con adaptaciones que maximiza el espacio útil de pantalla

### 📊 Análisis de Productos y Ventas
**Intelligence de negocio avanzado**
- **Top Productos**: Ranking visual de productos más exitosos
- **Filtros Temporales**: Análisis granular por día, mes o año
- **Gráficos Comparativos**: Visualizaciones coloridas e intuitivas
- **Tendencias de Consumo**: Identificación de patrones y estacionalidades

### 📋 Sistema Avanzado de Reportes
**Gestión profesional de información**
- **Motor de Búsqueda Inteligente**: Localización rápida de reportes específicos
- **Exportación Flexible**: Múltiples formatos de exportación con vista previa
- **Visualizaciones Múltiples**: 
  - Gráficos de barras horizontales y verticales
  - Gráficos de radar para análisis multidimensional
  - Gráficos de área para tendencias temporales
  - Análisis comparativo
- **Gestión de Favoritos**: Sistema de marcadores personalizable

### ⚙️ Centro de Configuración
**Personalización total del sistema**

#### 🏢 Información Empresarial
- Datos basicos de la empresa
- Soporte de moneda en Q (quetzales)

#### 📦 Control de Inventario
- Visualiar reportes
- Elimina reportes (funcion en desarrollo)
- Visualiza metras principales
- ¡Agrega clientes! [Puedes copiar unicamente su informacion]

#### 🔔 Sistema de Notificaciones
- Notificaciones de pedidos en tiempo real (funcion en desarrollo)
- Configuración basica de preferencias

## 🛠️ Stack Tecnológico

| Tecnología | Propósito | Beneficio |
|------------|-----------|-----------|
| **React 18+** | Frontend Framework | Rendimiento y ecosistema robusto |
| **React Router DOM** | Navegación SPA | Experiencia fluida sin recargas |
| **Tailwind CSS** | Framework de Estilos | Design system consistente |
| **Vite** | Build Tool | Desarrollo ultrarrápido |
| **Shadcn UI** | Visualizaciones | Gráficos interactivos profesionales |

## 📦 Instalación y Configuración

### Prerrequisitos del Sistema
```bash
Node.js >= 16.0.0
npm >= 8.0.0 o yarn >= 1.22.0
Git
```

### Instalación Rápida

```bash
# 1. Clonar repositorio
git clone https://github.com/SrAlexis16/KuantumDashboard
cd KuantumDashboard

# 2. Instalar dependencias
npm install

# 3. Iniciar desarrollo
npm run dev
```

### Scripts de Desarrollo

```bash
npm run dev      # Servidor de desarrollo con pequeños errores en hot reload
```

🌐 **Acceso**: `http://localhost:5173`

## 🎯 Casos de Uso

### Para Pequeñas Empresas
- Análisis de ventas diarias/mensuales y materia prima PARA panificadoras especialmente
- Gestión de pedidos y entregas
- Reportes financieros básicos

### Para Medianas Empresas
- Análisis de tendencias de mercado
- Reportes avanzados de performance

### Para Sectores Específicos
(No es lo mas recomendable)
- **Retail**: Control de productos más vendidos
- **Restaurantes**: Gestión de ingredientes y menús
- **Manufactura**: Control de materia prima
- **Servicios**: Análisis de productividad

## 📁 Arquitectura del Proyecto

```
src/
├── components/
│   ├── HomePage/                    # Dashboard principal
│   │   ├── ButtonToggleTSP.jsx     # Botón de toggle TSP
│   │   ├── LatestReportsListBox.jsx # Lista de reportes recientes
│   │   ├── MonthlyViewsToggle.jsx   # Toggle de vistas mensuales
│   │   ├── PendingOrdersBox.jsx     # Caja de pedidos pendientes
│   │   ├── QuickReportViewBox.jsx   # Vista rápida de reportes
│   │   ├── ToolsBox.jsx            # Caja de herramientas
│   │   └── TopSalesProduct.jsx     # Productos más vendidos
│   │
│   ├── ReportsPage/                 # Sistema de reportes
│   │   ├── ButtonExportLogic.jsx    # Lógica de exportación
│   │   ├── DVToggleGraphics.jsx     # Toggle de gráficos DV
│   │   ├── ExportReportBox.jsx      # Caja de exportación
│   │   ├── FeaturedReportsButton.jsx # Botón de reportes destacados
│   │   ├── GraphicsDisplayBox.jsx   # Display de gráficos
│   │   ├── MVToggleGraphics.jsx     # Toggle de gráficos MV
│   │   ├── ReportSelectorAndPreview.jsx # Selector y preview
│   │   ├── RMVToggleGraphics.jsx    # Toggle de gráficos RMV
│   │   └── SearchReportsBox.jsx     # Buscador de reportes
│   │
│   ├── SettingsPage/               # Configuraciones
│   │   └── Sub-Components/         # Subcomponentes
│   │       └── SettingsSideBar.jsx # Barra lateral de configuración
│ 
├── ui/                         # Componentes UI base
├── data/                           # Datos y configuración
├── hooks/                          # Custom hooks de React
├── lib/                           # Librerías y utilidades
└── pages/                         # Páginas principales
```

## 📄 Licencia

Este proyecto está distribuido bajo la Licencia MIT.

Esto significa que cualquier persona puede usar, copiar, modificar y distribuir el código con libertad, incluso para fines comerciales.  
Solo se requiere mantener el aviso de copyright original y aceptar que el software se entrega "tal cual", sin garantías.

Ver el archivo [`LICENSE`](./LICENSE) para más información detallada.


## 👨‍💻 Autor

**SrAlexis16**
- GitHub: [@SrAlexis16](https://github.com/SrAlexis16)

---

<div align="center">

*Construido con ❤️ para impulsar pequeñas y medianas empresas*

**[👀 Vista de la pagina](#)** • **[📖 Documentación](./documentation.md)** • **[🐛 Reportar Bug](mailto:alexander.arana@email.com)**

</div>
