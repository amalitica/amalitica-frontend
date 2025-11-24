// src/components/consultations/tabs/GeneralTab.jsx
import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getCustomers } from '@/api/customers';

export default function GeneralTab() {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoadingCustomers(true);
      // Llamar a getCustomers con params como objeto
      const response = await getCustomers({ page: 1, size: 100 });
      setCustomers(response.data.items || []);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    } finally {
      setLoadingCustomers(false);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Información Básica */}
      <Card>
        <CardHeader>
          <CardTitle>Información General</CardTitle>
        </CardHeader>
        <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Folio */}
          <div>
            <Label htmlFor='folio'>
              Folio <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='folio'
              {...register('folio', { required: 'El folio es obligatorio' })}
              placeholder='Ej: CONS-2024-001'
            />
            {errors.folio && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.folio.message}
              </p>
            )}
          </div>

          {/* Fecha de Consulta */}
          <div>
            <Label htmlFor='consultation_date'>
              Fecha de Consulta <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='consultation_date'
              type='date'
              {...register('consultation_date', {
                required: 'La fecha es obligatoria',
              })}
            />
            {errors.consultation_date && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.consultation_date.message}
              </p>
            )}
          </div>

          {/* Cliente */}
          <div className='md:col-span-2'>
            <Label htmlFor='customer_id'>
              Cliente <span className='text-red-500'>*</span>
            </Label>
            {loadingCustomers ? (
              <p className='text-sm text-gray-500 py-2'>Cargando clientes...</p>
            ) : (
              <Select
                onValueChange={(value) =>
                  setValue('customer_id', parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Seleccionar cliente' />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem
                      key={customer.id}
                      value={customer.id.toString()}
                    >
                      {customer.first_name} {customer.last_name} -{' '}
                      {customer.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {errors.customer_id && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.customer_id.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Cuestionario General */}
      <Card>
        <CardHeader>
          <CardTitle>Cuestionario General</CardTitle>
        </CardHeader>
        <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Fecha del último examen visual */}
          <div>
            <Label htmlFor='last_eye_exam_date'>
              Fecha del último examen visual
            </Label>
            <Input
              id='last_eye_exam_date'
              type='date'
              {...register('last_eye_exam_date')}
            />
          </div>

          {/* Fecha del último examen de salud general */}
          <div>
            <Label htmlFor='last_health_exam_date'>
              Fecha del último examen de salud general
            </Label>
            <Input
              id='last_health_exam_date'
              type='date'
              {...register('last_health_exam_date')}
            />
          </div>

          {/* Horas frente a pantallas */}
          <div>
            <Label htmlFor='screen_hours_per_day'>
              Horas frente a pantallas (por día)
            </Label>
            <Input
              id='screen_hours_per_day'
              type='number'
              step='0.5'
              min='0'
              max='24'
              {...register('screen_hours_per_day')}
              placeholder='Ej: 8'
            />
          </div>

          {/* Actividad principal */}
          <div>
            <Label htmlFor='main_activity'>Actividad principal</Label>
            <Input
              id='main_activity'
              {...register('main_activity')}
              placeholder='Ej: Oficina, Construcción, Estudiante'
            />
          </div>

          {/* ¿Usa lentes actualmente? */}
          <div>
            <Label htmlFor='currently_wears_glasses'>
              ¿Usa lentes actualmente?
            </Label>
            <Select
              onValueChange={(value) =>
                setValue('currently_wears_glasses', value === 'true')
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Seleccionar' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='true'>Sí</SelectItem>
                <SelectItem value='false'>No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ¿Usa lentes de contacto? */}
          <div>
            <Label htmlFor='wears_contact_lenses'>
              ¿Usa lentes de contacto?
            </Label>
            <Select
              onValueChange={(value) =>
                setValue('wears_contact_lenses', value === 'true')
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Seleccionar' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='true'>Sí</SelectItem>
                <SelectItem value='false'>No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
