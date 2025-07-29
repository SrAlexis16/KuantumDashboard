"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
//  ChartStyle, // <-- ELIMINADO
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const description = "An interactive pie chart"

export function ChartPieInteractive({
    pieChartData,
    pieChartConfig, // Todavía necesario para el TooltipContent, pero no para ChartStyle
    title,
    description,
    totalSalesForActiveMonth,
    availableMonths,
    activeMonth,
    setActiveMonth
}) {
  const id = "pie-interactive"

  if (!pieChartData || pieChartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title || "Gráfico de Torta"}</CardTitle>
          <CardDescription>{description || "No hay datos disponibles para mostrar."}</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
          {description || "No se encontraron datos de ventas para este gráfico."}
        </CardContent>
      </Card>
    );
  }

  const activeIndex = React.useMemo(() => {
    if (!pieChartData || pieChartData.length === 0) return -1;
    let maxSales = -1;
    let maxIndex = 0;
    pieChartData.forEach((item, index) => {
      if (item.salesCount > maxSales) {
        maxSales = item.salesCount;
        maxIndex = index;
      }
    });
    return maxIndex;
  }, [pieChartData]);


  return (
    <Card data-chart={id} className="flex flex-col">
      {/* <ChartStyle id={id} config={pieChartConfig} /> ELIMINADO */}
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>{title || "Pie Chart - Interactivo"}</CardTitle>
          <CardDescription>{description || "Ventas estimadas por producto."}</CardDescription>
        </div>
        <Select value={activeMonth} onValueChange={setActiveMonth}>
          <SelectTrigger
            className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
            aria-label="Select a month"
          >
            <SelectValue placeholder="Seleccionar mes" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {availableMonths.map((monthItem) => {
              // const config = pieChartConfig[monthItem.value] // Esta línea ya no es necesaria aquí si pieChartConfig no tiene los meses
              return (
                <SelectItem
                  key={monthItem.value}
                  value={monthItem.value}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-xs"
                      style={{
                        backgroundColor: monthItem.color, // Usamos el color de availableMonths
                      }}
                    />
                    {monthItem.label}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        {/* Usamos pieChartConfig solo si ChartContainer lo requiere para otros fines, si no, se puede quitar */}
        <ChartContainer
          id={id}
          config={pieChartConfig} // Mantengo esto por si ChartContainer usa config para estilos internos no relacionados con TS/ChartStyle
          className="mx-auto aspect-square w-full max-w-[450px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              // Aseguramos que el formatter use pieChartConfig para los nombres de producto
              content={<ChartTooltipContent hideLabel formatter={(value, name) => [value.toLocaleString('es-GT', { style: 'currency', currency: 'GTQ', minimumFractionDigits: 0, maximumFractionDigits: 0 }) + " de ", pieChartConfig[name]?.label || name]} />}
            />
            <Pie
              data={pieChartData}
              dataKey="salesCount"
              nameKey="product"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({
                outerRadius = 0,
                ...props
              }) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              // ...existing code...
<Label
  content={({ viewBox }) => {
    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
      return (
        <text
          x={viewBox.cx}
          y={viewBox.cy}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          <tspan
            x={viewBox.cx}
            y={viewBox.cy}
            className="fill-foreground text-3xl font-bold"
          >
            {totalSalesForActiveMonth.toLocaleString('es-GT', { style: 'currency', currency: 'GTQ', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </tspan>
          <tspan
            x={viewBox.cx}
            y={(viewBox.cy || 0) + 24}
            className="fill-muted-foreground"
          >
            Ventas Totales
          </tspan>
        </text>
      );
    }
    return null; // <-- Add this line
  }}
/>
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}