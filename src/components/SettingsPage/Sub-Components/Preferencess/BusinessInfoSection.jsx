"use client"

import React, { useState, useEffect, useMemo } from 'react';
import Cookies from 'js-cookie';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Save, Copy } from "lucide-react";

import { motion } from "framer-motion";

// Nombre de la cookie para la información del negocio
const BUSINESS_INFO_COOKIE_NAME = 'businessInfo';

export default function BusinessInfoSection() {
  // Estados para la información del negocio
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");

  // Estado para controlar la animación del botón de copiar
  const [setCopied] = useState(false);

  // Cargar información del negocio desde cookies al iniciar
  useEffect(() => {
    const savedInfo = Cookies.get(BUSINESS_INFO_COOKIE_NAME);
    if (savedInfo) {
      try {
        const parsedInfo = JSON.parse(savedInfo);
        setBusinessName(parsedInfo.name || '');
        setBusinessAddress(parsedInfo.address || '');
        setBusinessEmail(parsedInfo.email || '');
      } catch (error) {
        console.error("Error al parsear la información del negocio desde cookies:", error);
        Cookies.remove(BUSINESS_INFO_COOKIE_NAME);
      }
    }
  }, []);

  // Función para guardar la información del negocio en cookies
  const handleSaveBusinessInfo = () => {
    const infoToSave = {
      name: businessName,
      address: businessAddress,
      email: businessEmail
    };
    Cookies.set(BUSINESS_INFO_COOKIE_NAME, JSON.stringify(infoToSave), { expires: 365 });

    toast.success("Información del Negocio Guardada", {
      description: "Los detalles de tu empresa han sido actualizados y guardados.",
    });

    console.log("Información del negocio guardada en cookies:", infoToSave);
  };

  // Generar el texto pre-armado para el correo en un Textarea (usando useMemo para optimización)
  const preArmedEmailText = useMemo(() => {
    return `
Hola,

Aquí está la información de contacto de mi negocio:

Nombre del Negocio: ${businessName || 'No especificado'}
Dirección: ${businessAddress || 'No especificada'}
Correo Electrónico: ${businessEmail || 'No especificado'}

Saludos.
`.trim();
  }, [businessName, businessAddress, businessEmail]);

  // Función para copiar el texto del Textarea al portapapeles
  const handleCopyPreArmedEmailText = async () => {
    try {
      await navigator.clipboard.writeText(preArmedEmailText);
      setCopied(true);

      toast.success("¡Texto copiado!", {
        description: "El texto pre-armado ha sido copiado al portapapeles.",
        duration: 2000,
      });

      setTimeout(() => {
        setCopied(false);
      }, 500);

    } catch (err) {
      console.error('Error al copiar al portapapeles:', err);
      toast.error("Error al Copiar", {
        description: "No se pudo copiar el texto. Asegúrate de que tu navegador permita el acceso al portapapeles.",
      });
      setCopied(false);
    }
  };

  return (
    <div className="p-6 bg-card text-card-foreground rounded-lg shadow-sm h-full">
      <h2 className="text-3xl font-bold mb-6 text-primary">Información del Negocio</h2>
      <p className="text-muted-foreground mb-8">
        Actualiza los datos básicos de tu empresa y genera texto para tus correos.
      </p>

      <div className="grid gap-4 max-w-lg mb-12 border-b pb-8">
        <div className="space-y-2">
          <Label htmlFor="businessName">Nombre del Negocio</Label>
          <Input
            id="businessName"
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Ej. Mi Empresa S.A."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="businessAddress">Dirección</Label>
          <Input
            id="businessAddress"
            type="text"
            value={businessAddress}
            onChange={(e) => setBusinessAddress(e.target.value)}
            placeholder="Ej. Zona 10, Ciudad de Guatemala"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="businessEmail">Correo Electrónico de Contacto del Negocio</Label>
          <Input
            id="businessEmail"
            type="email"
            value={businessEmail}
            onChange={(e) => setBusinessEmail(e.target.value)}
            placeholder="ejemplo@miempresa.com"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <Button onClick={handleSaveBusinessInfo} className="w-fit sm:w-auto">
            <Save className="mr-2 h-4 w-4" /> Guardar Información
          </Button>
        </div>

        <div className="space-y-2 mt-6">
          <Label htmlFor="preArmedEmail">Texto Pre-armado para Correo (Edita y Copia)</Label>
          <Textarea
            id="preArmedEmail"
            value={preArmedEmailText}
            rows={8}
            className="font-mono text-sm"
            readOnly
          />
          <motion.button
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={handleCopyPreArmedEmailText}
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 
                        text-sm font-medium text-muted-foreground
                        bg-card border border-border rounded-lg
                        hover:bg-accent hover:text-accent-foreground
                        focus:outline-none focus:ring-2 focus:ring-muted focus:ring-offset-2
                        active:bg-accent/80
                        transition-all duration-200 ease-out
                        shadow-sm hover:shadow-md">
            <Copy className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
            <span className="select-none">Copiar</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}