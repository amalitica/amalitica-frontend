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
import { getCustomers } from '@/api/customers';
import { createConsultation } from '@/api/consultations';
import { useAuth } from '@/hooks/useAuth';

// Schema de validación con Zod
const consultationSchema = z.object({
  customer_id: z.string().nonempty({ message: 'Cliente es requerido.' }),
  branch_id: z.string().nonempty({ message: 'Sucursal es requerida.' }),
  // Campos opcionales de prescripción
  re_sph_final: z.string().optional(),
  re_cyl_final: z.string().optional(),
  re_axis_final: z.string().optional(),
  re_add_final: z.string().optional(),
  le_sph_final: z.string().optional(),
  le_cyl_final: z.string().optional(),
  le_axis_final: z.string().optional(),
  le_add_final: z.string().optional(),
  re_pd_final: z.string().optional(),
  le_pd_final: z.string().optional(),
  additional_notes: z.string().optional(),
});

const ConsultationForm = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const form = useForm({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      customer_id: '',
      branch_id: '',
      re_sph_final: '',
      re_cyl_final: '',
      re_axis_final: '',
      re_add_final: '',
      le_sph_final: '',
      le_cyl_final: '',
      le_axis_final: '',
      le_add_final: '',
      re_pd_final: '',
      le_pd_final: '',
      additional_notes: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      fetchCustomers();
      // Si el usuario tiene una sucursal asignada, pre-seleccionarla
      if (user?.branch_id) {
        form.setValue('branch_id', user.branch_id.toString());
      }
    }
  }, [isOpen, user]);

  const fetchCustomers = async () => {
    try {
      const response = await getCustomers({ page: 1, size: 1000 });
      setCustomers(response.data.items || []);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      setError('Error al cargar la lista de clientes.');
    }
  };

  const onSubmit = async (values) => {
    setLoading(true);
    setError('');

    try {
      // Convertir strings vacíos a null y parsear números
      const payload = {
        customer_id: parseInt(values.customer_id),
        branch_id: parseInt(values.branch_id),
        re_sph_final: values.re_sph_final
          ? parseFloat(values.re_sph_final)
          : null,
        re_cyl_final: values.re_cyl_final
          ? parseFloat(values.re_cyl_final)
          : null,
        re_axis_final: values.re_axis_final
          ? parseInt(values.re_axis_final)
          : null,
        re_add_final: values.re_add_final
          ? parseFloat(values.re_add_final)
          : null,
        le_sph_final: values.le_sph_final
          ? parseFloat(values.le_sph_final)
          : null,
        le_cyl_final: values.le_cyl_final
          ? parseFloat(values.le_cyl_final)
          : null,
        le_axis_final: values.le_axis_final
          ? parseInt(values.le_axis_final)
          : null,
        le_add_final: values.le_add_final
          ? parseFloat(values.le_add_final)
          : null,
        re_pd_final: values.re_pd_final ? parseFloat(values.re_pd_final) : null,
        le_pd_final: values.le_pd_final ? parseFloat(values.le_pd_final) : null,
        additional_notes: values.additional_notes || null,
      };

      await createConsultation(payload);
      form.reset();
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      console.error('Error al crear la consulta:', error);
      setError(
        error.response?.data?.detail ||
        'Error al crear la consulta. Por favor, verifica los datos.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[800px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Nueva Consulta Oftalmológica</DialogTitle>
        </DialogHeader>

        {error && (
          <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4'>
            {error}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* Información General */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium'>Información General</h3>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='customer_id'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
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
                              {customer.name} {customer.paternal_surname}{' '}
                              {customer.maternal_surname}
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
                  name='branch_id'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sucursal *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Selecciona una sucursal' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {/* Por ahora, usamos la sucursal del usuario */}
                          {user?.branch_id && (
                            <SelectItem value={user.branch_id.toString()}>
                              Sucursal Principal
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Prescripción Ojo Derecho (OD) */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium border-b pb-2'>
                Prescripción Ojo Derecho (OD)
              </h3>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                <FormField
                  control={form.control}
                  name='re_sph_final'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Esfera (SPH)</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          step='0.25'
                          placeholder='+1.25'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='re_cyl_final'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cilindro (CYL)</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          step='0.25'
                          placeholder='-0.50'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='re_axis_final'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Eje (AXIS)</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          min='0'
                          max='180'
                          placeholder='90'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='re_add_final'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adición (ADD)</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          step='0.25'
                          placeholder='+2.00'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='re_pd_final'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distancia Pupilar OD (mm)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='0.5'
                        placeholder='32.0'
                        className='max-w-xs'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Prescripción Ojo Izquierdo (OI) */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium border-b pb-2'>
                Prescripción Ojo Izquierdo (OI)
              </h3>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                <FormField
                  control={form.control}
                  name='le_sph_final'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Esfera (SPH)</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          step='0.25'
                          placeholder='+1.25'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='le_cyl_final'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cilindro (CYL)</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          step='0.25'
                          placeholder='-0.50'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='le_axis_final'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Eje (AXIS)</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          min='0'
                          max='180'
                          placeholder='90'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='le_add_final'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adición (ADD)</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          step='0.25'
                          placeholder='+2.00'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='le_pd_final'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distancia Pupilar OI (mm)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='0.5'
                        placeholder='32.0'
                        className='max-w-xs'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Notas Adicionales */}
            <FormField
              control={form.control}
              name='additional_notes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas Adicionales</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Observaciones, recomendaciones, etc.'
                      className='min-h-[100px]'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type='submit' disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar Consulta'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationForm;
