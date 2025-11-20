import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getCustomers } from '@/api/customers'; // Necesitarás crear este archivo en src/api
import { createConsultation } from '@/api/consultations';

// 1. Schema de validación con Zod
const consultationSchema = z.object({
  customer_id: z.string().nonempty({ message: 'Cliente es requerido.' }),
  reason: z.string().optional(),
  // Agrega aquí todos los campos de la consulta que necesites
  // Ejemplo para la graduación:
  rx_od_esfera: z.string().optional(),
  rx_od_cilindro: z.string().optional(),
  // ... y así sucesivamente
});

const ConsultationForm = ({ isOpen, onClose }) => {
  const [customers, setCustomers] = useState([]);
  const form = useForm({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      customer_id: '',
      reason: '',
      rx_od_esfera: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      const fetchCustomers = async () => {
        const response = await getCustomers({ page: 1, size: 1000 }); // Obtener todos los clientes
        setCustomers(response.data.items);
      };
      fetchCustomers();
    }
  }, [isOpen]);

  const onSubmit = async (values) => {
    try {
      await createConsultation(values);
      console.log('Consulta creada:', values);
      onClose(); // Cierra el modal
      // Aquí podrías agregar una notificación de éxito y recargar la lista
    } catch (error) {
      console.error('Error al crear la consulta:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Nueva Consulta Oftalmológica</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='customer_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Selecciona un cliente' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem
                          key={customer.id}
                          value={customer.id.toString()}
                        >
                          {customer.name} {customer.paternal_surname}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='reason'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo de la Consulta</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Ej: Revisión anual, dolor de cabeza...'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Aquí irían los demás campos del formulario (graduación, etc.) */}
            <h3 className='text-lg font-medium pt-4'>Graduación</h3>
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='rx_od_esfera'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Esfera (OD)</FormLabel>
                    <FormControl>
                      <Input placeholder='+1.25' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* ... más campos de graduación ... */}
            </div>

            <DialogFooter>
              <Button type='button' variant='outline' onClick={onClose}>
                Cancelar
              </Button>
              <Button type='submit'>Guardar Consulta</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationForm;
