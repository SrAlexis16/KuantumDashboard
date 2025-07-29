"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  Label
} from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const barChartSettings = {
  quantity: {
    label: " Cantidad Vendida",
    color: "#003153",
  },
};

// Colores fijos para cada posición del bar chart
const BAR_COLORS = [
  "#45B7D1", // Primer producto
  "#98D8AA", // Segundo producto
  "#FFA07A", // Tercer producto
  "#FF6B6B", // Cuarto producto
  "#4ECDC4"  // Quinto producto
];

const radialChartConfig = {
  quantity: {
    label: " Unidades Vendidas",
    color: "#98D8AA", // Verde claro
  },
  totalSales: { // Nueva configuración para Total de Ventas
    label: "Ventas Totales",
    color: "#4ECDC4", // Turquesa
  },
};

// Función auxiliar para truncar nombres largos
const truncateString = (str, num) => {
  // Asegurarse de que str sea una cadena antes de operar
  const s = String(str);
  if (s.length <= num) {
    return s;
  }
  return s.slice(0, num) + '...';
};

export function ProductsBarChart({ data }) {
  const MAX_POSSIBLE_UNITS_FOR_RADIAL = 500;
  // Define un valor máximo para el total de ventas. AJUSTA ESTO a tus datos reales.
  const MAX_POSSIBLE_SALES_FOR_RADIAL = 5000; // Por ejemplo, Q5000 como máximo en ventas de un solo producto en un día.
                                             // Considera cuál es tu venta más alta en un día para escalarlo correctamente.
  const FIXED_CHART_HEIGHT = 420; // Altura fija para todos los gráficos
  const MAX_LABEL_LENGTH = 15; // Límite para truncar etiquetas del eje X

  const renderCardHeader = (title) => (
    <CardHeader className="flex flex-col items-stretch border-b !p-4 sm:flex-row">
      <div className="flex flex-1 flex-col justify-center gap-1">
        <CardTitle className="text-lg flex flex-row gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            className="self-center size-6"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round">
            <path 
              d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
            />
          </svg>
          {title}
        </CardTitle>
      </div>
    </CardHeader>
  );

  if (!data?.length) {
    return (
      <Card className="flex-grow flex flex-col">
        {renderCardHeader("Top 5 Productos más Vendidos")}
        <CardContent className={`flex-grow flex items-center justify-center min-h-[${FIXED_CHART_HEIGHT}px] transition-all duration-300 ease-in-out`}>
          <p className="text-center text-gray-500">No hay datos de productos más vendidos para el período seleccionado.</p>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 1) {
    const product = data[0];
    const qty = typeof product.quantity === 'number' ? product.quantity : 0;
    const totalSales = typeof product.totalSales === 'number' ? product.totalSales : 0; // Obtiene el total de ventas

    return (
      <Card className="flex flex-col flex-grow min-h-[450px]">
        {renderCardHeader("Producto Más Vendido (Día Específico)")}
        <CardContent className={`flex flex-col sm:flex-row items-center justify-center flex-1 min-h-[${FIXED_CHART_HEIGHT}px] transition-all duration-300 ease-in-out gap-4 p-4`}>
          {/* Primer Gráfico Radial: Cantidad Vendida */}
          <div className="flex-1 flex flex-col items-center justify-center w-full sm:w-1/2 h-full">
            <h3 className="text-lg font-semibold mb-2"> Unidades Vendidas </h3>
            <ChartContainer config={radialChartConfig} className="h-full w-full max-w-xs">
              <RadialBarChart
                data={[{ name: product.name, quantity: qty, fill: radialChartConfig.quantity.color }]}
                endAngle={Math.min((qty / MAX_POSSIBLE_UNITS_FOR_RADIAL) * 360, 360)}
                innerRadius={80}
                outerRadius={120}
                barSize={20}
              >
                <PolarGrid radialLines={false} stroke="none" />
                <RadialBar dataKey="quantity" background cornerRadius={10} />
                <PolarRadiusAxis tick={false} axisLine={false}>
                  <Label content={({ viewBox }) => {
                    const { cx, cy } = viewBox;
                    return (
                      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan className="fill-foreground text-lg font-bold">{qty}</tspan>
                        <tspan x={cx} y={cy + 24} className="fill-muted-foreground">Unidades</tspan>
                      </text>
                    );
                  }} />
                </PolarRadiusAxis>
              </RadialBarChart>
            </ChartContainer>
            <div className="text-muted-foreground mt-2 text-center text-sm">
              {product.name} (Representa el {((qty / MAX_POSSIBLE_UNITS_FOR_RADIAL) * 100).toFixed(1)}% de {MAX_POSSIBLE_UNITS_FOR_RADIAL} unidades)
            </div>
          </div>

          {/* Segundo Gráfico Radial: Ventas Totales */}
          <div className="flex-1 flex flex-col items-center justify-center w-full sm:w-1/2 h-full">
            <h3 className="text-lg font-semibold mb-2">Ventas Totales</h3>
            <ChartContainer config={radialChartConfig} className="h-full w-full max-w-xs">
              <RadialBarChart
                data={[{ name: product.name, totalSales: totalSales, fill: radialChartConfig.totalSales.color }]}
                endAngle={Math.min((totalSales / MAX_POSSIBLE_SALES_FOR_RADIAL) * 360, 360)}
                innerRadius={80}
                outerRadius={120}
                barSize={20}
              >
                <PolarGrid radialLines={false} stroke="none" />
                <RadialBar dataKey="totalSales" background cornerRadius={10} />
                <PolarRadiusAxis tick={false} axisLine={false}>
                  <Label content={({ viewBox }) => {
                    const { cx, cy } = viewBox;
                    return (
                      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                        {/* Usamos toLocaleString para formatear a moneda de Guatemala */}
                        <tspan className="fill-foreground text-lg font-bold">{totalSales.toLocaleString('es-GT', { style: 'currency', currency: 'GTQ' })}</tspan>
                        <tspan x={cx} y={cy + 24} className="fill-muted-foreground">Ventas</tspan>
                      </text>
                    );
                  }} />
                </PolarRadiusAxis>
              </RadialBarChart>
            </ChartContainer>
            <div className="text-muted-foreground mt-2 text-center text-sm">
              {product.name} (Representa el {((totalSales / MAX_POSSIBLE_SALES_FOR_RADIAL) * 100).toFixed(1)}% de {MAX_POSSIBLE_SALES_FOR_RADIAL.toLocaleString('es-GT', { style: 'currency', currency: 'GTQ' })} en ventas)
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Asignar colores fijos a cada producto según su posición
  const dataWithColors = data.map((item, index) => ({
    ...item,
    fill: BAR_COLORS[index % BAR_COLORS.length] // Usa el color correspondiente a la posición
  }));

  // Gráfico de barras
  return (
    <Card className="flex-grow flex flex-col max-h-[450px]">
      {renderCardHeader("Top 5 Productos más Vendidos")}
      <CardContent className="px-2 sm:p-6 flex-grow flex items-center justify-center">
        <ChartContainer
          config={barChartSettings}
          className={`w-full max-h-[440px]`} // Usa la altura fija
        >
          <BarChart
            data={dataWithColors}
            margin={{ top: 12, left: 12, right: 12, bottom: 150}} // Ajustado para dar más espacio a etiquetas
            width="100%"
            height= {FIXED_CHART_HEIGHT} // Usa la altura fija
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              angle={-45}
              textAnchor="end"
              interval={0}
              height={80} // Asegura suficiente altura para las etiquetas
              tickFormatter={(value) => truncateString(value, MAX_LABEL_LENGTH)}
            />
            <YAxis
              dataKey="quantity"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => v.toLocaleString()}
            />
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const dataPoint = payload[0].payload;
                  const productName = dataPoint.name; // 'name' es la clave para el nombre del producto
                  const unitsSold = dataPoint.quantity; // 'quantity' es la clave para las unidades vendidas

                  return (
                    <div className="rounded-md border bg-white px-3 py-2 text-sm shadow-md">
                      <div>
                        <strong>{productName}</strong>
                        {/* Se usa 'unitsSold' que ya trae el valor correcto */}
                        <div>Cantidad Vendida: {unitsSold} unidades</div> 
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="quantity" fill={(entry) => entry.fill} radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}