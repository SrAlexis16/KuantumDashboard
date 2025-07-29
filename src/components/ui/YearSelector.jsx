"use client";

import * as React from "react";
import { ChevronDownIcon, CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"; // Necesitas estos componentes de Shadcn UI
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function YearSelector({
  selectedYear,
  onYearSelect,
  availableYears,
  className,
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[150px] justify-between text-black bg-white hover:bg-gray-100", className)}
        >
          {selectedYear
            ? `Año: ${selectedYear}`
            : "Seleccionar Año..."}
          <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[150px] p-0">
        <Command>
          <CommandInput placeholder="Buscar año..." />
          <CommandEmpty>No se encontraron años.</CommandEmpty>
          <CommandGroup className="max-h-60 overflow-y-auto">
            {availableYears.map((year) => (
              <CommandItem
                key={year}
                value={year.toString()} // Asegurarse de que el valor sea un string para la búsqueda
                onSelect={(currentValue) => {
                  onYearSelect(parseInt(currentValue)); // Convertir de vuelta a número
                  setOpen(false);
                }}
              >
                {year}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    selectedYear === year ? "opacity-100" : "opacity-0"
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