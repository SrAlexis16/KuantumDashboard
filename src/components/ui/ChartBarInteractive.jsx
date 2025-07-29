"use client"

import React, { useMemo, useState } from "react"
import { BarChart, Bar, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

function ChartBarInteractive({ 
  chartData = [], 
  dataKeys = [], 
  chartConfig = {}, 
  color = "#000", 
  label = "Reporte",
  description = "Mostrando datos del período seleccionado"
}) {
  // Si se pasa un solo dataKey (compatibilidad hacia atrás)
  const keys = Array.isArray(dataKeys) && dataKeys.length > 0 ? dataKeys : Object.keys(chartConfig);
  const [activeChart, setActiveChart] = useState(keys[0] || dataKeys[0])

  const total = useMemo(() => {
    if (!chartData || chartData.length === 0) return {}
    
    const totals = {}
    keys.forEach(key => {
      totals[key] = chartData.reduce((acc, curr) => acc + (curr[key] || 0), 0)
    })
    return totals
  }, [chartData, keys])

  // Validaciones adicionales
  if (!keys || keys.length === 0) {
    console.error("ChartBarInteractive: dataKeys or chartConfig is required")
    return null
  }

  if (!chartData || chartData.length === 0) {
    return (
      <Card className="py-0">
        <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
            <CardTitle>{label}</CardTitle>
            <CardDescription>No hay datos disponibles</CardDescription>
          </div>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle>{label}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {keys.length > 1 && (
          <div className="flex">
            {keys.map((key) => {
              return (
                <button
                  key={key}
                  data-active={activeChart === key}
                  className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-8 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-10 sm:py-6 cursor-pointer"
                  onClick={() => setActiveChart(key)}
                >
                  <span className="text-muted-foreground text-xs sm:text-sm whitespace-nowrap truncate">
                    {chartConfig[key]?.label || key}
                  </span>
                  <span className="text-lg leading-none font-bold sm:text-3xl">
                    {total[key]?.toLocaleString("es-GT") || 0}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </CardHeader>

      <CardContent className="px-2 sm:p-6">
        <ChartContainer 
          config={chartConfig}
          className="h-[280px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                if (!value) return ""
                
                // Si el valor ya es una fecha formateada (como "01 de Julio de 2025")
                if (typeof value === 'string' && value.includes('de')) {
                  const parts = value.split(' de ');
                  if (parts.length >= 2) {
                    return `${parts[0]} ${parts[1].substring(0, 3)}`;
                  }
                  return value.substring(0, 6);
                }
                
                // Si es una fecha ISO o similar
                const date = new Date(value);
                if (!isNaN(date.getTime())) {
                  return date.toLocaleDateString("es-GT", {
                    day: "2-digit",
                    month: "short",
                  });
                }
                
                return value;
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[200px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    if (!value) return ""
                    // Si el valor ya es una fecha formateada (como "01 de Julio de 2025")
                    if (typeof value === 'string' && value.includes('de')) {
                      return value;
                    }
                    // Si es una fecha ISO o similar
                    const date = new Date(value);
                    if (!isNaN(date.getTime())) {
                      return date.toLocaleDateString("es-GT", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      });
                    }
                    return value;
                  }}
                  formatter={(value, name) => {
                    if (name === 'totalSales') {
                      return [
                        `Q${Number(value).toLocaleString("es-GT", { minimumFractionDigits: 2 })}`,
                        chartConfig[name]?.label || name
                      ];
                    }
                    return [
                      Number(value).toLocaleString("es-GT"),
                      chartConfig[name]?.label || name
                    ];
                  }}
                />
              }
            />
            <Bar 
              dataKey={activeChart} 
              fill={chartConfig[activeChart]?.color || color}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default ChartBarInteractive