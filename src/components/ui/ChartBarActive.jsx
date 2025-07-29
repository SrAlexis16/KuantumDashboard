"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A bar chart with an active bar"

export function ChartBarActive({ chartData, chartConfig, title, description, footerText, trendingText }) {
  if (!chartData || chartData.length === 0 || !chartConfig) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title || "Gráfico de Barras"}</CardTitle>
          <CardDescription>{description || "No hay datos disponibles para mostrar."}</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
          Cargando datos o no se encontraron datos.
        </CardContent>
      </Card>
    );
  }

  const dataKeys = Object.keys(chartData[0] || {});
  const categoryKey = dataKeys.find(key => key === "browser" || key === "product");
  const valueKey = dataKeys.find(key => key !== "browser" && key !== "product" && typeof chartData[0][key] === "number");

  const maxDataPoint = chartData.reduce((prev, current, index) => {
    if (current[valueKey] > prev.value) {
      return { value: current[valueKey], index };
    }
    return prev;
  }, { value: -1, index: -1 });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title || "Gráfico de Barras - Activo"}</CardTitle>
        <CardDescription>{description || "Enero - Junio 2024"}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[400px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 20, right: 0, left: 0, bottom: 10 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={categoryKey}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              interval={0}
              hide={true}
              tickFormatter={(value) => chartConfig[value]?.label || value}
            />
            {valueKey && (
              <YAxis
                dataKey={valueKey}
                tickLine={false}
                axisLine={false}
                hide={true}
              />
            )}
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const dataPoint = payload[0].payload;
                  const productName = dataPoint[categoryKey];
                  const salesCount = dataPoint[valueKey];
                  return (
                    <div className="rounded-md border bg-white px-3 py-2 text-sm shadow-md">
                      <div>
                        <strong>{productName}</strong>
                        <div>Cantidad Vendida: {salesCount} unidades</div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey={valueKey}
              strokeWidth={2}
              radius={8}
              activeIndex={maxDataPoint.index !== -1 ? maxDataPoint.index : 0}
              activeBar={({ ...props }) => (
                <Rectangle
                  {...props}
                  fillOpacity={0.8}
                  stroke={props.payload.fill}
                  strokeDasharray={4}
                  strokeDashoffset={4}
                />
              )}
            />
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
          {footerText || "Mostrando datos consolidados."}
        </div>
      </CardFooter>
    </Card>
  );
}

export default ChartBarActive
