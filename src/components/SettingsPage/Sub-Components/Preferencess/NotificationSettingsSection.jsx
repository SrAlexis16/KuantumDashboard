"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Cookies from 'js-cookie';

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import {
  Bell,
  Settings,
  Volume2,
  VolumeX,
  FileText,
  ShoppingCart,
  X,
  Check,
  AlertCircle,
  Zap,
  BellRing // Nuevo ícono para unread count
} from "lucide-react";

// Importaciones para la paginación de Shadcn UI
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination";

const NotificationCard = ({ notification, onClose, onMarkAsRead }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'new_report':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'pending_order':
        return <ShoppingCart className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card className={`mb-3 transition-all duration-200 ${!notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50/20 dark:bg-blue-950/20' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getIcon(notification.type)}
            <CardTitle className="text-sm font-medium">{notification.title}</CardTitle>
            {!notification.read && <Badge variant="secondary" className="text-xs">Nuevo</Badge>}
          </div>
          <div className="flex gap-1">
            {!notification.read && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMarkAsRead(notification.id)}
                className="h-6 w-6 p-0"
              >
                <Check className="h-3 w-3" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onClose(notification.id)}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-xs">{notification.message}</CardDescription>
        <p className="text-xs text-muted-foreground mt-1">
          {notification.timestamp.toLocaleTimeString()}
        </p>
      </CardContent>
    </Card>
  );
};

const NOTIFICATION_SETTINGS_COOKIE_NAME = 'notificationSettings';
const ITEMS_PER_PAGE = 3;

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState(() => {
    const savedSettings = Cookies.get(NOTIFICATION_SETTINGS_COOKIE_NAME);
    const defaultSettings = {
      desktopNotifications: false,
      inAppNotifications: true,
      newReportsEnabled: true,
      pendingOrdersEnabled: true,
      soundEnabled: true,
      soundVolume: 0.5
    };

    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        return { ...defaultSettings, ...parsedSettings };
      } catch (error) {
        console.error("Error al parsear la configuración de cookies:", error);
      }
    }
    return defaultSettings;
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    Cookies.set(NOTIFICATION_SETTINGS_COOKIE_NAME, JSON.stringify(settings), { expires: 365 });
  }, [settings]);

  useEffect(() => {
    if ('Notification' in window) {
      const currentPermission = Notification.permission;
      setPermissionStatus(currentPermission);

      if (currentPermission === 'granted' && !settings.desktopNotifications) {
        setSettings(prev => ({ ...prev, desktopNotifications: true }));
      } else if (currentPermission === 'denied' && settings.desktopNotifications) {
        setSettings(prev => ({ ...prev, desktopNotifications: false }));
      }
    }
  }, [settings.desktopNotifications]);

  const requestDesktopPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      if (permission === 'granted') {
        setSettings(prev => ({ ...prev, desktopNotifications: true }));
      } else {
        setSettings(prev => ({ ...prev, desktopNotifications: false }));
      }
    }
  }, []);

  const playNotificationSound = useCallback(() => {
    if (settings.soundEnabled && settings.soundVolume > 0) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(settings.soundVolume, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    }
  }, [settings.soundEnabled, settings.soundVolume]);

  const showDesktopNotification = useCallback((notification) => {
    if (settings.desktopNotifications && permissionStatus === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: notification.icon,
        tag: notification.id
      });
    }
  }, [settings.desktopNotifications, permissionStatus]);

  const processNotification = useCallback((notification) => {
    const shouldProcess =
      (notification.type === 'new_report' && settings.newReportsEnabled) ||
      (notification.type === 'pending_order' && settings.pendingOrdersEnabled);

    if (!shouldProcess) return;

    if (settings.inAppNotifications) {
      setNotifications(prev => [notification, ...prev]);
    }

    showDesktopNotification(notification);
    playNotificationSound();
    setCurrentPage(1);
  }, [settings, showDesktopNotification, playNotificationSound]);

  const handleCloseNotification = (id) => {
    setNotifications(prev => {
      const updatedNotifications = prev.filter(n => n.id !== id);
      const totalPagesAfterRemoval = Math.ceil(updatedNotifications.length / ITEMS_PER_PAGE);
      if (currentPage > totalPagesAfterRemoval && totalPagesAfterRemoval > 0) {
        setCurrentPage(totalPagesAfterRemoval);
      } else if (updatedNotifications.length === 0) {
        setCurrentPage(1);
      }
      return updatedNotifications;
    });
  };

  const handleMarkAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setCurrentPage(1);
  };

  const handleSaveSettingsAndCloseDialog = () => {
    setIsDialogOpen(false);
        toast.success("Ajustes de Notificaciones guardados", {
          description: "Tus ajustes en las notificaciones fueron guardados.",
        });
    
  };

  const generateTestNotification = () => {
    const types = ['new_report', 'pending_order'];
    const randomType = types[Math.floor(Math.random() * types.length)];

    let title = '';
    let message = '';

    if (randomType === 'new_report') {
      title = 'Nuevo Reporte de Prueba';
      message = `Este es un reporte generado para pruebas - ${new Date().toLocaleTimeString()}`;
    } else {
      title = 'Pedido Pendiente de Prueba';
      message = `Hay un pedido pendiente generado para pruebas - ${new Date().toLocaleTimeString()}`;
    }

    const newNotification = {
      id: Date.now() + Math.random(),
      type: randomType,
      title: title,
      message: message,
      timestamp: new Date(),
      read: false
    };
    processNotification(newNotification);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const totalPages = useMemo(() => Math.ceil(notifications.length / ITEMS_PER_PAGE), [notifications.length]);

  const currentNotifications = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return notifications.slice(startIndex, endIndex);
  }, [notifications, currentPage]);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, 4, 'ellipsis', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages);
      }
    }
    return pageNumbers;
  };

  return (
    <div className="flex flex-col h-[800px] w-full p-6 rounded-lg shadow-xl bg-card text-card-foreground">
      <div className="flex-grow overflow-y-auto pr-2">
        <h1 className="text-3xl font-bold mb-8 text-primary">Sistema de Notificaciones</h1>

        <div className="flex items-center justify-between mb-6 border-b pb-4">
          <div className="flex items-center gap-3">
            <span className="text-xl font-semibold text-muted-foreground">
                <BellRing className="h-6 w-6 inline-block mr-2 text-black" />
                Sin leer:
            </span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2 text-base px-3 py-1">
                {unreadCount}
              </Badge>
            )}
            {unreadCount === 0 && (
                <Badge variant="outline" className="ml-2 text-base px-3 py-1 text-green-600">
                    Todas leídas
                </Badge>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={generateTestNotification}
            >
              <Zap className="h-4 w-4 mr-2" />
              Generar Notificación (Dev)
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={clearAllNotifications}
              disabled={notifications.length === 0}
            >
              Limpiar Todo
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Configuración de Notificaciones</DialogTitle>
                  <DialogDescription>
                    Ajusta tus preferencias de notificación y cómo te llegan las alertas.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Canales de Notificación</h3>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="desktop">Notificaciones de Escritorio</Label>
                      <Switch
                        id="desktop"
                        checked={settings.desktopNotifications}
                        onCheckedChange={(checked) => {
                          if (checked && permissionStatus !== 'granted') {
                            requestDesktopPermission();
                          } else {
                            setSettings(prev => ({ ...prev, desktopNotifications: checked }));
                          }
                        }}
                      />
                    </div>
                    {permissionStatus === 'denied' && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          Los permisos de notificación están bloqueados. Habilítalos en la configuración del navegador.
                        </AlertDescription>
                      </Alert>
                    )}
                    <div className="flex items-center justify-between">
                      <Label htmlFor="inapp">Notificaciones en la Aplicación</Label>
                      <Switch
                        id="inapp"
                        checked={settings.inAppNotifications}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({ ...prev, inAppNotifications: checked }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Tipos de Notificación</h3>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="reports">Nuevos Reportes</Label>
                      <Switch
                        id="reports"
                        checked={settings.newReportsEnabled}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({ ...prev, newReportsEnabled: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="orders">Pedidos Pendientes</Label>
                      <Switch
                        id="orders"
                        checked={settings.pendingOrdersEnabled}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({ ...prev, pendingOrdersEnabled: checked }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Alertas Sonoras</h3>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sound" className="flex items-center gap-2">
                        {settings.soundEnabled ? (
                          <Volume2 className="h-4 w-4" />
                        ) : (
                          <VolumeX className="h-4 w-4" />
                        )}
                        Sonidos de Notificación
                      </Label>
                      <Switch
                        id="sound"
                        checked={settings.soundEnabled}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({ ...prev, soundEnabled: checked }))
                        }
                      />
                    </div>
                    {settings.soundEnabled && (
                      <div className="space-y-2">
                        <Label htmlFor="volume">Volumen del Sonido ({Math.round(settings.soundVolume * 100)}%)</Label>
                        <Slider
                          id="volume"
                          defaultValue={[settings.soundVolume]}
                          max={1}
                          step={0.01}
                          min={0}
                          onValueChange={(value) => setSettings(prev => ({ ...prev, soundVolume: value[0] }))}
                          className="w-[80%] mx-auto"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <DialogFooter className="pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveSettingsAndCloseDialog}>
                    Guardar Configuración
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="space-y-4">
          {currentNotifications.length === 0 && notifications.length === 0 ? (
            <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700 bg-background/50">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4 animate-bounce" />
                <p className="text-xl font-semibold text-muted-foreground mb-1">¡Todo en orden!</p>
                <p className="text-sm text-muted-foreground">
                  No hay notificaciones pendientes. Las nuevas aparecerán aquí.
                </p>
                <Button
                    variant="ghost"
                    className="mt-4 text-sm text-blue-600 dark:text-blue-400"
                    onClick={generateTestNotification}
                >
                    <Zap className="h-4 w-4 mr-2" /> Generar notificación de prueba
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {currentNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onClose={handleCloseNotification}
                  onMarkAsRead={handleMarkAsRead}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto p-4 bg-white rounded-lg flex justify-center items-center">
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent className="justify-center">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => { e.preventDefault(); goToPreviousPage(); }}
                  aria-disabled={currentPage === 1}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>

              {getPageNumbers().map((pageNumber, index) => (
                <PaginationItem key={index}>
                  {pageNumber === 'ellipsis' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      isActive={pageNumber === currentPage}
                      onClick={(e) => { e.preventDefault(); goToPage(pageNumber); }}
                    >
                      {pageNumber}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => { e.preventDefault(); goToNextPage(); }}
                  aria-disabled={currentPage === totalPages}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}