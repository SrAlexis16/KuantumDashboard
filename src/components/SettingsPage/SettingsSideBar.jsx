"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";

import { sidebarSettingsData } from "@/lib/sidebar-settings-data";

export default function SettingsSidebar({ activeComponent, onSetActiveComponent }) {
  const [openSectionId, setOpenSectionId] = useState('preferences');

  const toggleSection = (id) => {
    setOpenSectionId(prevId => (prevId === id ? null : id));
  };

  return (
    <div className="flex flex-col h-full w-64 bg-background border-r dark:border-gray-700">
      <div className="flex-1 p-4 overflow-y-auto">
        <nav className="grid items-start gap-2">
          {sidebarSettingsData.map((section) => (
            <Collapsible
              key={section.id}
              open={openSectionId === section.id}
              onOpenChange={() => toggleSection(section.id)}
              className="w-full space-y-2"
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-base font-medium transition-colors hover:bg-muted/50 dark:hover:bg-accent/50"
                >
                  <section.icon className="mr-3 h-5 w-5" />
                  {section.title}
                  <span className="ml-auto">
                    {openSectionId === section.id ? (
                      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                    ) : (
                      <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200" />
                    )}
                  </span>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent
                className={cn(
                  "overflow-hidden transition-all duration-150 ease-in data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down",
                  "pl-2 space-y-1"
                )}
              >
                {section.items.map((item) => (
                  <Button
                    key={item.name}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start pl-9 text-sm transition-colors hover:bg-muted/50 dark:hover:bg-accent/50",
                      activeComponent === item.component &&
                      "bg-accent text-accent-foreground hover:bg-accent dark:bg-accent/70 dark:text-accent-foreground"
                      )}
                    onClick={() => onSetActiveComponent(item.component)}
                  >
                    {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                    {item.name}
                  </Button>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </nav>
      </div>
      {/* Aqui podría ir un componente de avatar con lógica real de cuentas */}
      <div className="mt-auto p-4 border-t dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-primary-foreground flex items-center justify-center text-primary font-bold">
            S
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">TuCuenta</span>
            <span className="text-xs text-muted-foreground">m@example.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}