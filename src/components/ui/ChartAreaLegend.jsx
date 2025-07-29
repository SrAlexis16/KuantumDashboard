"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export function ChartAreaLegend({ data, config, title, description, chartType = "area" }) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title || "Gráfico"}</CardTitle>
          <CardDescription>{description || "No hay datos para mostrar."}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px] text-gray-500">
          No hay datos disponibles para el gráfico en el año seleccionado.
        </CardContent>
        <CardFooter />
      </Card>
    )
  }

  const ChartBody =
    chartType === "area" ? (
      <AreaChart data={data} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
        <Area
          dataKey="mobile"
          type="natural"
          fill="var(--color-mobile)"
          fillOpacity={0.4}
          stroke="var(--color-mobile)"
          stackId="a"
        />
        <Area
          dataKey="desktop"
          type="natural"
          fill="var(--color-desktop)"
          fillOpacity={0.4}
          stroke="var(--color-desktop)"
          stackId="a"
        />
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    ) : (
      <BarChart data={data} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" />
        <Bar dataKey="desktop" fill="var(--color-desktop)" />
        <ChartLegend content={<ChartLegendContent />} />
      </BarChart>
    )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title || "Gráfico de Actividad"}</CardTitle>
        <CardDescription>
          {description || "Comparativa entre dispositivos en los últimos 6 meses"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
            {ChartBody}
        </ChartContainer>
      </CardContent>
      <CardFooter />
    </Card>
  )
}
