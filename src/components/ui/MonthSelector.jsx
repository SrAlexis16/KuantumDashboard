"use client";

import * as React from "react";
import { ChevronDownIcon, CheckIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale"; // Necesitas el locale español para los nombres de los meses

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function MonthSelector({
  selectedMonthDate, // Usaremos un objeto Date para representar el mes seleccionado (ej. new Date(year, monthIndex, 1))
  onMonthSelect, // Función que recibe el objeto Date del mes seleccionado
  availableMonths, // Array de strings 'YYYY-MM'
  className,
}) {
  const [open, setOpen] = React.useState(false);

  // Mapeamos los 'YYYY-MM' a objetos { value: 'YYYY-MM', label: 'NombreMes YYYY' }
  const months = React.useMemo(() => {
    return availableMonths.map(monthStr => {
      const [year, monthNum] = monthStr.split('-').map(Number);
      const date = new Date(year, monthNum - 1, 1); // Crea una fecha para el primer día del mes
      return {
        value: monthStr,
        label: format(date, "MMMM yyyy", { locale: es }), // Formato "Julio 2025"
        dateObject: date, // Guardamos el objeto Date para fácil selección
      };
    }).sort((a, b) => a.dateObject.getTime() - b.dateObject.getTime()); // Ordenar cronológicamente
  }, [availableMonths]);

  // Formato para mostrar en el botón
  const displayMonth = selectedMonthDate
    ? format(selectedMonthDate, "MMMM yyyy", { locale: es })
    : "Seleccionar Mes...";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between text-black bg-white hover:bg-gray-100", className)}
        >
          {displayMonth}
          <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Buscar mes..." />
          <CommandEmpty>No se encontraron meses.</CommandEmpty>
          <CommandGroup className="max-h-60 overflow-y-auto">
            {months.map((month) => (
              <CommandItem
                key={month.value}
                value={month.label} // Usamos el label para la búsqueda
                onSelect={() => {
                  onMonthSelect(month.dateObject); // Pasa el objeto Date completo
                  setOpen(false);
                }}
              >
                {month.label}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    selectedMonthDate && format(selectedMonthDate, 'yyyy-MM') === month.value ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}