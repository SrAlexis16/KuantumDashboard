"use client"

import React, { useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch, CheckCircle} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AppVersionSection() {
  const [currentVersion] = useState("1.0.0");


  return (
    <div className="p-6 bg-card text-card-foreground rounded-lg shadow-sm h-full">
      <h2 className="text-3xl font-bold mb-6 text-primary">Versión de la Aplicación</h2>
      <p className="text-muted-foreground mb-1">
        Consulta la versión actual de la aplicación y verifica si hay actualizaciones disponibles.
      </p>
      <p className="text-muted-foreground mb-8">
        (Esta aplicacion no cuenta con caracteristicas responsive. Se recomienda discreción)
      </p>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <GitBranch className="mr-2 h-5 w-5 text-purple-500" /> Detalles de la Versión
          </CardTitle>
          <CardDescription>Información sobre tu versión instalada.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium">Versión Actual:</p>
            <p className="text-lg font-semibold">{currentVersion}</p>
          </div>
          <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <Badge variant="default">Tu Aplicación está Actualizada</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}