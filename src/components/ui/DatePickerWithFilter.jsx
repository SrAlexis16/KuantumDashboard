"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Función auxiliar para obtener el nombre del día y fecha completa
const getDayNameAndDate = (date) => {
  if (!date) return "Seleccionar Día";
  // Usamos 'PPP' para un formato como "Jul 1, 2025" o "1 de julio de 2025" dependiendo del locale
  return format(date, "PPP", { locale: es });
};

export function DatePickerWithFilter({
  selectedDate, // Ahora siempre será para un día específico
  onDateSelect, // La función que recibe el día seleccionado
  availableDates, // Array de strings 'YYYY-MM-DD'
  className,
}) {
  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);

  // Función para deshabilitar fechas no disponibles (que no están en availableDates)
  const disabledDates = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd'); // Formateamos la fecha del calendario a 'YYYY-MM-DD'
    return !availableDates.includes(dateStr); // Deshabilita si el día no está en el array de días disponibles
  };

  // Determinar el año de inicio y fin para los dropdowns del calendario
  // Asumimos que availableDates está ordenado
  const fromYear = availableDates.length > 0 ? parseInt(availableDates[0].split('-')[0]) : undefined;
  const toYear = availableDates.length > 0 ? parseInt(availableDates[availableDates.length - 1].split('-')[0]) : undefined;

  return (
    <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date-picker-trigger"
          className={cn("w-48 justify-between font-normal text-black bg-white hover:bg-gray-100", className)}
        >
          {getDayNameAndDate(selectedDate)} {/* Mostrar el día y la fecha completa */}
          <ChevronDownIcon className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          captionLayout="dropdown" // Permite seleccionar año y mes desde un dropdown
          onSelect={(date) => {
            onDateSelect(date); // Simplemente pasamos la fecha seleccionada tal cual
            setIsDatePickerOpen(false); // Cierra el popover al seleccionar
          }}
          fromYear={fromYear}
          toYear={toYear}
          disabled={disabledDates} // Usa la nueva función disabledDates
          locale={es}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}