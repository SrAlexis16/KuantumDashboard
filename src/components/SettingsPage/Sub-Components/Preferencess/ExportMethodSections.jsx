"use client"

import React from 'react';

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Save } from "lucide-react";

export default function ExportMethodSection() {
  // Establecemos el método de exportación a "pdf" y lo mantenemos fijo.
  const exportMethod = "pdf"; 

  const handleSaveExportMethod = () => {
    // Mostramos un toast de información, ya que no se está "guardando" nada nuevo.
    toast.info("El método de exportación predeterminado es PDF.", {
      description: "Este ajuste está configurado por defecto y no se puede modificar.",
      duration: 3000,
    });
  };

  return (
    <div className="p-6 bg-card text-card-foreground rounded-lg shadow-sm h-full">
      <h2 className="text-3xl font-bold mb-6 text-primary">Método de Exportación</h2>
      <p className="text-muted-foreground mb-8">
        Selecciona tu formato predeterminado para la exportación de reportes y datos.
      </p>

      <div className="grid gap-4 max-w-lg">
        <div className="space-y-2">
          <Label htmlFor="exportMethod">Formato Predeterminado</Label>
          <Select 
            value={exportMethod} 
            disabled // El select está deshabilitado
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecciona un formato" />
            </SelectTrigger>
            <SelectContent>
              {/* Solo mostramos la opción de PDF y está deshabilitada para selección */}
              <SelectItem value="pdf" disabled>PDF</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button 
          onClick={handleSaveExportMethod} 
          className="w-fit"
          disabled // El botón está deshabilitado
        >
          <Save className="mr-2 h-4 w-4" /> Guardar Método
        </Button>
      </div>
    </div>
  );
}