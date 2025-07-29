"use client"

import React, { useState } from 'react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

export default function ApiKeySection() {
  const [apiKey, setApiKey] = useState("sk_live_********************");

  const handleUpdateApiKey = () => {
    // En un caso real, esto generaría una nueva clave en tu backend
    setTimeout(() => {
      console.log("Actualizando API Key...");
      const newKey = `sk_live_${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`;
      setApiKey(newKey);
      toast.success("API Key Actualizada", {
        description: "Tu clave API ha sido generada o actualizada con éxito.",
      });
    }, 800);
  };

  return (
    <div className="p-6 bg-card text-card-foreground rounded-lg shadow-sm h-full">
      <h2 className="text-3xl font-bold mb-6 text-primary">Actualizar API Key</h2>
      <p className="text-muted-foreground mb-8">
        Genera o refresca tu clave API para asegurar la comunicación con servicios externos.
      </p>

      <div className="grid gap-4 max-w-lg">
        <div className="space-y-2">
          <Label htmlFor="apiKey">Tu Clave API Actual</Label>
          <Input
            id="apiKey"
            type="text"
            value={apiKey}
            readOnly
            className="font-mono bg-muted/50 dark:bg-muted/70 cursor-not-allowed"
          />
        </div>
        <Button onClick={handleUpdateApiKey} className="w-fit" variant="secondary">
          <RefreshCw className="mr-2 h-4 w-4" /> Generar Nueva Clave
        </Button>
      </div>
    </div>
  );
}