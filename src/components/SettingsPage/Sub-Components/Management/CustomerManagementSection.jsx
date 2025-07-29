"use client"

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader,DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, PlusCircle, Edit, Trash2, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Copy } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

const ITEMS_PER_PAGE = 8;

export default function CustomerManagementSection() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [customerToCopy, setCustomerToCopy] = useState(null);
  const [customerForm, setCustomerForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isLoaded, setIsLoaded] = useState(false); // Flag para controlar cuando ya se cargaron los datos

  // Cargar clientes desde localStorage al inicio
  useEffect(() => {
    const storedCustomers = localStorage.getItem('customers');
    if (storedCustomers) {
      try {
        const parsedCustomers = JSON.parse(storedCustomers);
        setCustomers(parsedCustomers);
      } catch (error) {
        console.error('Error parsing stored customers:', error);
      }
    }
    setIsLoaded(true); // Marcar como cargado
  }, []);

  // Guardar clientes en localStorage cada vez que el estado 'customers' cambie, PERO solo después de que se hayan cargado los datos iniciales
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('customers', JSON.stringify(customers));
    }
  }, [customers, isLoaded]);

  const handleFormChange = useCallback((e) => {
    const { id, value } = e.target;
    setCustomerForm(prev => ({ ...prev, [id]: value }));
    if (formErrors[id]) {
      setFormErrors(prev => ({ ...prev, [id]: '' }));
    }
  }, [formErrors]);

  const validateForm = useCallback(() => {
    const errors = {};
    if (!customerForm.name.trim()) errors.name = "El nombre es obligatorio.";
    if (!customerForm.email.trim()) {
      errors.email = "El email es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(customerForm.email)) {
      errors.email = "Formato de email inválido.";
    }
    if (!customerForm.phone.trim()) errors.phone = "El teléfono es obligatorio.";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [customerForm]);

  const handleAddCustomerClick = useCallback(() => {
    setCurrentCustomer(null);
    setCustomerForm({ name: '', email: '', phone: '', address: '', notes: '' });
    setFormErrors({});
    setIsDialogOpen(true);
  }, []);

  const handleEditCustomerClick = useCallback((customer) => {
    setCurrentCustomer(customer);
    setCustomerForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      notes: customer.notes
    });
    setFormErrors({});
    setIsDialogOpen(true);
  }, []);

  const handleCopyCustomerClick = useCallback((customer) => {
    setCustomerToCopy(customer);
    setIsCopyDialogOpen(true);
  }, []);

  const handleCopyToClipboard = useCallback(async () => {
    if (!customerToCopy) return;

    const customerInfo = `
      Nombre: ${customerToCopy.name}
      Email: ${customerToCopy.email}
      Teléfono: ${customerToCopy.phone}
      Dirección: ${customerToCopy.address || 'N/A'}
      Notas: ${customerToCopy.notes || 'N/A'}
    `.trim();

    try {
      await navigator.clipboard.writeText(customerInfo);
      toast.success("Información copiada", {
        description: `La información de "${customerToCopy.name}" ha sido copiada al portapapeles.`,
      });
      setIsCopyDialogOpen(false);
    } catch (error) {
      toast.error("Error al copiar", {
        description: "No se pudo copiar la información al portapapeles.",
      });
    }
  }, [customerToCopy]);

  const handleSaveCustomer = useCallback((e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Errores en el formulario", {
        description: "Por favor, corrige los campos marcados.",
      });
      return;
    }

    if (currentCustomer) {
      setCustomers(prev =>
        prev.map(c => (c.id === currentCustomer.id ? { ...c, ...customerForm } : c))
      );
      toast.success("Cliente actualizado", {
        description: `El cliente "${customerForm.name}" ha sido actualizado.`,
      });
    } else {
      const newCustomer = { id: uuidv4(), ...customerForm };
      setCustomers(prev => [...prev, newCustomer]);
      toast.success("Cliente añadido", {
        description: `"${customerForm.name}" ha sido añadido a tus clientes.`,
      });
    }
    setIsDialogOpen(false);
  }, [currentCustomer, customerForm, validateForm]);

  const handleDeleteCustomer = useCallback((customerId, customerName) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar a "${customerName}"? Esta acción no se puede deshacer.`)) {
      setCustomers(prev => prev.filter(c => c.id !== customerId));
      toast.success("Cliente eliminado", {
        description: `"${customerName}" ha sido eliminado de tus clientes.`,
      });
    }
  }, []);

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm]);

  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentCustomers = filteredCustomers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="p-6 bg-card text-card-foreground rounded-lg shadow-sm h-full flex flex-col">
      <h2 className="text-3xl font-bold mb-6 text-primary">Gestión de Clientes</h2>
      <p className="text-muted-foreground mb-8">
        Gestiona y organiza la información de tus clientes.
      </p>

      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cliente por nombre, email o teléfono..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddCustomerClick}>
              <PlusCircle className="mr-2 h-4 w-4" /> Añadir Nuevo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{currentCustomer ? "Editar Cliente" : "Añadir Nuevo Cliente"}</DialogTitle>
              <DialogDescription>
                {currentCustomer ? "Modifica los detalles del cliente." : "Introduce los detalles para añadir un nuevo cliente."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSaveCustomer} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="name"
                  value={customerForm.name}
                  onChange={handleFormChange}
                  className="col-span-3"
                  required
                />
                {formErrors.name && <p className="col-span-4 text-right text-destructive text-sm">{formErrors.name}</p>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={customerForm.email}
                  onChange={handleFormChange}
                  className="col-span-3"
                  required
                />
                {formErrors.email && <p className="col-span-4 text-right text-destructive text-sm">{formErrors.email}</p>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Teléfono
                </Label>
                <Input
                  id="phone"
                  value={customerForm.phone}
                  onChange={handleFormChange}
                  className="col-span-3"
                  required
                />
                {formErrors.phone && <p className="col-span-4 text-right text-destructive text-sm">{formErrors.phone}</p>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Dirección
                </Label>
                <Input
                  id="address"
                  value={customerForm.address}
                  onChange={handleFormChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notas
                </Label>
                <Textarea
                  id="notes"
                  value={customerForm.notes}
                  onChange={handleFormChange}
                  className="col-span-3"
                  placeholder="Notas adicionales sobre el cliente..."
                />
              </div>
              <DialogFooter>
                <Button type="submit">{currentCustomer ? "Guardar Cambios" : "Añadir Cliente"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Diálogo para copiar información */}
      <Dialog open={isCopyDialogOpen} onOpenChange={setIsCopyDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Copiar Información del Cliente</DialogTitle>
            <DialogDescription>
              Haz clic en el botón para copiar la información de {customerToCopy?.name} al portapapeles.
            </DialogDescription>
          </DialogHeader>
          {customerToCopy && (
            <div className="bg-muted p-4 rounded-lg">
              <div className="space-y-2 text-sm">
                <div><strong>Nombre:</strong> {customerToCopy.name}</div>
                <div><strong>Email:</strong> {customerToCopy.email}</div>
                <div><strong>Teléfono:</strong> {customerToCopy.phone}</div>
                <div><strong>Dirección:</strong> {customerToCopy.address || 'N/A'}</div>
                <div><strong>Notas:</strong> {customerToCopy.notes || 'N/A'}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCopyDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCopyToClipboard}>
              <Copy className="mr-2 h-4 w-4" /> Copiar al Portapapeles
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tabla de Clientes */}
      <div className="flex-1 border rounded-md overflow-hidden relative">
        <div className="overflow-y-auto h-full">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentCustomers.length > 0 ? (
                currentCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell className="truncate max-w-[200px]">{customer.address || 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyCustomerClick(customer)}
                          title="Copiar información"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCustomerClick(customer)}
                          title="Editar cliente"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteCustomer(customer.id, customer.name)}
                          title="Eliminar cliente"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No se encontraron clientes que coincidan con la búsqueda.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            {/* Footer de la Tabla con Paginación */}
            {filteredCustomers.length > ITEMS_PER_PAGE && (
              <TableFooter className="sticky bottom-0 bg-card z-10">
                <TableRow>
                  <TableCell colSpan={5} className="text-right p-2">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        aria-label="Ir a la primera página"
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        aria-label="Ir a la página anterior"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium">
                        Página {currentPage} de {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        aria-label="Ir a la página siguiente"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        aria-label="Ir a la última página"
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </div>
      </div>
    </div>
  );
}