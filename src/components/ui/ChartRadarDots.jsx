"use client";

import { TrendingUp } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A radar chart with dots for raw materials";

export function ChartRadarDots({ 
  chartData, 
  chartConfig, 
  title, 
  description, 
  footerText, 
  trendingText,
  customColors = null, // Colores personalizados como array
  materialName = null // Nuevo prop para el nombre del material actual
}) {
  if (!chartData || chartData.length === 0 || !chartConfig) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title || "Gráfico de Radar"}</CardTitle>
          <CardDescription>{description || "No hay datos disponibles para mostrar."}</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
          Cargando datos o no se encontraron datos.
        </CardContent>
      </Card>
    );
  }

  const periodKey = Object.keys(chartData[0]).find(key => typeof chartData[0][key] === 'string' && key !== 'fill');
  const valueKey = Object.keys(chartData[0]).find(key => typeof chartData[0][key] === 'number');

  if (!periodKey || !valueKey) {
    console.warn("ChartRadarDots: No se pudieron determinar las claves de datos (periodKey o valueKey).");
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title || "Gráfico de Radar"}</CardTitle>
          <CardDescription>Error: No se pudieron cargar los datos del gráfico correctamente.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
          Verifica la estructura de los datos proporcionados.
        </CardContent>
      </Card>
    );
  }

  // Función para generar colores pasteles únicos basándose en el nombre del material
  const generatePastelColor = (materialName) => {
    if (!materialName) return "#B8E6B8"; // Verde pastel por defecto
    
    // Crear un hash simple del nombre del material
    let hash = 0;
    for (let i = 0; i < materialName.length; i++) {
      hash = materialName.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Paleta de colores pasteles predefinidos
    const pastelColors = [
      "#FFB3BA", // Rosa pastel
      "#BAFFC9", // Verde pastel
      "#BAE1FF", // Azul pastel
      "#FFFFBA", // Amarillo pastel
      "#FFD3BA", // Durazno pastel
      "#E0BBE4", // Violeta pastel
      "#C7CEEA", // Lavanda pastel
      "#FFDAB9", // Coral pastel
      "#B8E6B8", // Verde menta pastel
      "#FFE4E1", // Rosa suave pastel
      "#E6E6FA", // Lavanda claro
      "#F0FFFF", // Azul hielo pastel
      "#FFF8DC", // Crema pastel
      "#F5DEB3", // Trigo pastel
      "#DDA0DD"  // Ciruela pastel
    ];
    
    // Usar el hash para seleccionar un color de la paleta
    const colorIndex = Math.abs(hash) % pastelColors.length;
    return pastelColors[colorIndex];
  };

  // Determinar el color a usar con la nueva lógica
  const getRadarColor = () => {
    // Prioridad 1: Color desde chartConfig
    if (chartConfig[valueKey]?.color) {
      return chartConfig[valueKey].color;
    }
    
    // Prioridad 2: Color basado en el nombre del material (nuevo)
    if (materialName) {
      return generatePastelColor(materialName);
    }
    
    // Prioridad 3: Color desde customColors (índice 2 para radar como en el original)
    if (customColors && customColors.length > 2) {
      return customColors[2];
    }
    
    // Prioridad 4: Fallback por defecto (verde pastel)
    return "#B8E6B8";
  };

  const radarColor = getRadarColor();

  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle>{title || "Gráfico de Radar - Puntos"}</CardTitle>
        <CardDescription>{description || "Tendencia de Materia Prima en el tiempo"}</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip
    cursor={false}
    content={({ active, payload }) => {
      if (active && payload && payload.length) {
        const dataPoint = payload[0].payload;
        const period = dataPoint[periodKey];
        const value = dataPoint[valueKey];
        const unit = dataPoint.unit || ""; // Asegúrate de que 'unit' exista en tus datos o sea una cadena vacía si no

        return (
          <div className="rounded-md border bg-white px-3 py-2 text-sm shadow-md">
            <div>
              <span className="inline-block w-3 h-3 rounded mr-2" style={{ backgroundColor: radarColor }}></span>
              <strong>{period}</strong>: {value.toLocaleString('es-GT')} {unit}
            </div>
          </div>
        );
      }
      return null;
    }}
  />

            <PolarAngleAxis 
              dataKey={periodKey}
              tick={{ fontSize: 12 }}
            />
            <PolarGrid 
              gridType="polygon"
              radialLines={true}
            />
            <Radar
              dataKey={valueKey}
              fill={radarColor}
              fillOpacity={0.3}
              stroke={radarColor}
              strokeWidth={2}
              dot={{
                r: 5,
                fill: radarColor,
                fillOpacity: 1,
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {trendingText && (
          <div className="flex items-center gap-2 leading-none font-medium">
            {trendingText} <TrendingUp className="h-4 w-4" />
          </div>
        )}
        <div className="text-muted-foreground flex items-center gap-2 leading-none">
          {footerText || "Mostrando datos históricos."}
        </div>
      </CardFooter>
    </Card>
  );
}

export default ChartRadarDots;