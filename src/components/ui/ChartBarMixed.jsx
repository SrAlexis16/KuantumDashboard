"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis, Tooltip, Legend } from "recharts";

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


export const description = "A mixed bar chart for raw materials";

export function ChartBarMixed({ chartData, chartConfig, title, description, footerText, trendingText }) {
  if (!chartData || chartData.length === 0 || !chartConfig) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title || "Gráfico de Barras Mixto"}</CardTitle>
          <CardDescription>{description || "No hay datos disponibles para mostrar."}</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
          Cargando datos o no se encontraron datos.
        </CardContent>
      </Card>
    );
  }

  const barDataKeys = Object.keys(chartConfig).filter(key => chartConfig[key] && typeof chartConfig[key] === 'object');

  if (barDataKeys.length === 0) {
    console.warn("ChartBarMixed: No se encontraron dataKeys válidas en chartConfig para renderizar las barras.");
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title || "Gráfico de Barras Mixto"}</CardTitle>
          <CardDescription>Error: No se pudieron cargar las series del gráfico.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
          Verifica la configuración de los datos del gráfico.
        </CardContent>
      </Card>
    );
  }

  const categoryKey = 'name';

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title || "Gráfico de Barras - Mixto"}</CardTitle>
        <CardDescription>{description || "Tendencias de Materia Prima"}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px]">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 10,
              right: 20,
              top: 10,
              bottom: 10,
            }}
          >
            <YAxis
              dataKey={categoryKey}
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
              width={100}
            />
            <XAxis
              type="number"
              hide
            />
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const dataPoint = payload[0].payload;
                  const materialName = dataPoint[categoryKey];
                  const unit = dataPoint.unit || ""; // Obtener la unidad del dato
                  
                  return (
                    <div className="rounded-md border bg-white px-3 py-2 text-sm shadow-md">
                      <strong>{materialName}</strong>
                      {barDataKeys.map(key => {
                        const value = dataPoint[key];
                        const config = chartConfig[key];
                        const isCost = config?.label?.includes("Costo");
                        
                        let formattedValue;
                        if (isCost) {
                          formattedValue = value.toLocaleString('es-GT', {
                            style: 'currency',
                            currency: 'GTQ', // Obtener la moneda de la configuración
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2
                          });
                        } else {
                          // Para cantidades, mostrar con la unidad
                          formattedValue = `${value.toLocaleString('es-GT', {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2
                          })} ${unit}`;
                        }
                        
                        return (
                          <div key={key}>
                            {config?.label || key}: {formattedValue}
                          </div>
                        );
                      })}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              layout="horizontal"
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingTop: '10px' }}
              formatter={(value, entry) => {
                const config = chartConfig[entry.dataKey];
                return <span style={{ color: config?.color || 'currentColor' }}>{config?.label || value}</span>;
              }}
            />

            {barDataKeys.map(key => (
                <Bar
                    key={key}
                    dataKey={key}
                    fill={chartConfig[key]?.color}
                    radius={5}
                />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {trendingText && (
          <div className="flex gap-2 leading-none font-medium">
            {trendingText} <TrendingUp className="h-4 w-4" />
          </div>
        )}
        <div className="text-muted-foreground leading-none">
          {footerText || "Mostrando observaciones clave."}
        </div>
      </CardFooter>
    </Card>
  );
}

export default ChartBarMixed;

// --- Actualización necesaria en RMVToggleGraphics.jsx ---
// En la sección donde se genera barChartData, cambiar:
/*
if (isSelectedReportRawMaterial && selectedReport.keyObservations && selectedReport.keyObservations.length > 0) {
    barChartData = selectedReport.keyObservations.map((observation, index) => ({
        name: observation.item,
        quantityUsed: observation.quantityUsed,
        cost: observation.cost,
        unit: observation.unit || "", // Agregar esta línea
    }));
*/