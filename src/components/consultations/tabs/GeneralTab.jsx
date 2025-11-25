// src/components/consultations/tabs/GeneralTab.jsx
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import CustomerSearchBox from '@/components/consultations/CustomerSearchBox';
import OptometristSelect from '@/components/consultations/OptometristSelect';
import { useAuth } from '@/hooks/useAuth';

// Función para formatear la fecha y hora en un formato legible
const formatDateTime = (date) => {
  if (!date) return 'Se asignará al guardar';
  const d = new Date(date);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return d.toLocaleString('es-ES', options);
};

export default function GeneralTab() {
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();
  const { user } = useAuth();

  const [displayDate, setDisplayDate] = useState('');

  const mode = getValues('id') ? 'edit' : 'create';

  // Establecer branch_id automáticamente desde el usuario autenticado
  useEffect(() => {
    if (user?.branch_id) {
      setValue('branch_id', user.branch_id);
    }

    // Lógica para la fecha
    const existingDate = getValues('creation_date');

    if (existingDate) {
      // Modo Edición: Usar la fecha existente
      setDisplayDate(formatDateTime(existingDate));
    } else {
      // Modo Creación: Usar la fecha actual
      setDisplayDate(formatDateTime(new Date()));
    }

    const existingOptometrist = getValues('optomoetrist_user_id');
    if (!existingOptometrist && user?.id) {
      setValue('optometrist_user_id', user.id);
    }

    // El array de dependencias es más estable y no causa bucles.
    // getValues es una función estable y no cambia entre renders.
  }, [user, setValue, getValues]);

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* --- CAMPO DE CLIENTE CON EL NUEVO COMPONENTE --- */}
        <div className='space-y-2'>
          <Label>
            Cliente <span className='text-red-500'>*</span>
          </Label>
          <CustomerSearchBox mode={mode} />
          <input
            type='hidden'
            {...register('customer_id', {
              required: 'El cliente es obligatorio',
            })}
          />
          {errors.customer_id && (
            <p className='text-sm text-red-500'>{errors.customer_id.message}</p>
          )}
        </div>{' '}
        {/* Sucursal */}
        <div className='space-y-2'>
          <Label htmlFor='branch_id'>
            Sucursal <span className='text-red-500'>*</span>
          </Label>
          <p className='flex h-10 w-full items-center rounded-md border border-input bg-slate-100 px-3 py-2 text-sm'>
            {user?.branch_name || 'Sucursal del usuario'}
          </p>
          <input
            type='hidden'
            {...register('branch_id', {
              required: 'La sucursal es obligatoria',
              valueAsNumber: true,
            })}
          />
          {errors.branch_id && (
            <p className='text-sm text-red-500'>{errors.branch_id.message}</p>
          )}
        </div>
        {/* Optometrista */}
        <div className='space-y-2'>
          <Label htmlFor='optometrist_user_id'>Optometrista</Label>
          <OptometristSelect mode={mode} />
          <input
            type='hidden'
            {...register('optometrist_user_id', { valueAsNumber: true })}
          />
        </div>
        {/* Consultation Date */}
        <div className='space-y-2'>
          <Label htmlFor='creation_date_display'>Fecha de Consulta</Label>
          <p
            id='creation_date_display'
            className='flex h-10 w-full rounded-md border border-input bg-slate-100 px-3 py-2 text-sm text-muted-foreground'
          >
            {displayDate}
          </p>
          {/* Campo oculto para que react-hook-form no pierda la referencia si lo necesitas */}
          <input type='hidden' {...register('creation_date')} />
        </div>
        {/* Folio */}
        <div className='space-y-2'>
          <Label htmlFor='folio'>Folio</Label>
          <Input
            id='folio'
            type='text'
            {...register('folio')}
            placeholder='Folio único de la consulta'
          />
        </div>
      </div>
    </div>
  );
}
