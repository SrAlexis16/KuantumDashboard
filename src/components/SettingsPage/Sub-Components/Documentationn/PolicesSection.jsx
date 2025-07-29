"use client"

import React from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileQuestion, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PoliciesSection() {
  const handleViewPolicy = (policyName) => {
    toast.info(`Abriendo ${policyName}...`, {
      description: "El documento se abrirá en una nueva pestaña.",
    });
    // Simular apertura de documento
    window.open(`https://politicas.ejemplo.com/${policyName.replace(/ /g, '-').toLowerCase()}.pdf`, "_blank"); // Reemplaza con tu URL real!
  };

  return (
    <div className="p-6 bg-card text-card-foreground rounded-lg shadow-sm h-full">
      <h2 className="text-3xl font-bold mb-6 text-primary">Políticas de la Aplicación</h2>
      <p className="text-muted-foreground mb-8">
        Revisa los términos y condiciones, política de privacidad y otras políticas importantes de nuestra plataforma.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <ScrollText className="mr-2 h-5 w-5 text-orange-500" /> Términos y Condiciones
            </CardTitle>
            <CardDescription>Acuerdo legal que rige el uso de nuestros servicios.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => handleViewPolicy("Términos y Condiciones")}>Ver Documento</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <FileQuestion className="mr-2 h-5 w-5 text-cyan-500" /> Política de Privacidad
            </CardTitle>
            <CardDescription>Cómo manejamos y protegemos tus datos personales.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => handleViewPolicy("Política de Privacidad")}>Ver Documento</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}