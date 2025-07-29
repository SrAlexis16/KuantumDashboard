"use client";

import React from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, HelpCircle} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function InfoSection() {
  const handleOpenHelpCenter = () => {
    toast.info("Visitando el repositorio...", {
      description: "Serás redirigido al GitHub del proyecto para más información y soporte.",
    });
    window.open("https://github.com/SrAlexis16/KuantumDashboard", "_blank"); 
  };

  const handleOpenPortfolio = () => {
    toast.info("Visitando el portafolio...", {
      description: "Serás redirigido a mi portafolio personal.",
    });
    window.open("https://sralexisportfolio.vercel.app/", "_blank"); 
  };

  const handleOpenDocumentation = () => {
    toast.info("Visitando documentación...", {description: "Serás redirigido a la documentación oficial."});
    window.open("https://github.com/SrAlexis16/KuantumDashboard/blob/main/documentation.md")
  }
  return (
    <div className="p-6 bg-card text-card-foreground rounded-lg shadow-sm h-full">
      <h2 className="text-3xl font-bold mb-6 text-primary">Información General</h2>
      <p className="text-muted-foreground mb-8">
        Encuentra recursos útiles y detalles sobre el funcionamiento de esta aplicación.
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Info className="mr-2 h-5 w-5 text-blue-500" /> Acerca del Proyecto
            </CardTitle>
            <CardDescription>Conoce la historia y el propósito de esta aplicación.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Este proyecto fue desarrollado por Alexander, un joven coder de 16 años en Guatemala. Mi objetivo es ayudarte a mejorar la visualizacion de reportes en tu negocio/pequeña empresa. ¡Espero que te sea de gran ayuda!
            </p>
            <Button onClick={handleOpenPortfolio}>
              <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-folders"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 2a1 1 0 0 1 .707 .293l1.708 1.707h4.585a3 3 0 0 1 2.995 2.824l.005 .176v7a3 3 0 0 1 -3 3h-1v1a3 3 0 0 1 -3 3h-10a3 3 0 0 1 -3 -3v-9a3 3 0 0 1 3 -3h1v-1a3 3 0 0 1 3 -3zm-6 6h-1a1 1 0 0 0 -1 1v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1 -1v-1h-7a3 3 0 0 1 -3 -3z" /></svg>
              Portafolio
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <HelpCircle className="mr-2 h-5 w-5 text-green-500" /> Soporte y Recursos
            </CardTitle>
            <CardDescription>¡Encuentra como reportar problemas, ver mas detalles o darme sugerencias para mejorar mi codigo!</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Si tienes dudas, sugerencias o encuentras algún error, puedes visitar el repositorio en GitHub para más información y contactarme. 
            </p>
            <div className='flex flex-row gap-2 center'>
            <Button onClick={handleOpenHelpCenter}>
              <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-library"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18.333 2a3.667 3.667 0 0 1 3.667 3.667v8.666a3.667 3.667 0 0 1 -3.667 3.667h-8.666a3.667 3.667 0 0 1 -3.667 -3.667v-8.666a3.667 3.667 0 0 1 3.667 -3.667zm-4.333 10h-3a1 1 0 0 0 0 2h3a1 1 0 0 0 0 -2m3 -3h-6a1 1 0 0 0 0 2h6a1 1 0 0 0 0 -2m-1 -3h-5a1 1 0 0 0 0 2h5a1 1 0 0 0 0 -2" /><path d="M3.517 6.391a1 1 0 0 1 .99 1.738c-.313 .178 -.506 .51 -.507 .868v10c0 .548 .452 1 1 1h10c.284 0 .405 -.088 .626 -.486a1 1 0 0 1 1.748 .972c-.546 .98 -1.28 1.514 -2.374 1.514h-10c-1.652 0 -3 -1.348 -3 -3v-10.002a3 3 0 0 1 1.517 -2.605" /></svg>
              GitHub
            </Button>
            <Button onClick={handleOpenDocumentation}>
              <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-file-code-2"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 2l.117 .007a1 1 0 0 1 .876 .876l.007 .117v4l.005 .15a2 2 0 0 0 1.838 1.844l.157 .006h4l.117 .007a1 1 0 0 1 .876 .876l.007 .117v9a3 3 0 0 1 -2.824 2.995l-.176 .005h-10a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-14a3 3 0 0 1 2.824 -2.995l.176 -.005zm-2 9h-1a1 1 0 0 0 -1 1v5a1 1 0 0 0 1 1h1a1 1 0 0 0 1 -1l-.007 -.117a1 1 0 0 0 -.876 -.876l-.117 -.007v-3a1 1 0 0 0 0 -2m5 0h-1a1 1 0 0 0 0 2v3a1 1 0 0 0 0 2h1a1 1 0 0 0 1 -1v-5a1 1 0 0 0 -1 -1m-.001 -8.001l4.001 4.001h-4z" /></svg>
              Documentación
            </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}