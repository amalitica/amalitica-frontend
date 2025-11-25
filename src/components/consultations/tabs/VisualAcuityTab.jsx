// src/components/consultations/tabs/VisualAcuityTab.jsx
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function VisualAcuityTab() {
  const { register } = useFormContext();

  return (
    <div className='space-y-8'>
      {/* Agudeza Visual Final - Ojo Derecho */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold border-b pb-2'>
          Agudeza Visual Final - Ojo Derecho (OD/RE)
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='va_final_re_distance'>AV de Lejos</Label>
            <Input
              id='va_final_re_distance'
              type='text'
              {...register('va_final_re_distance')}
              placeholder='20/20'
              maxLength={10}
            />
            <p className='text-xs text-gray-500'>
              Ejemplo: 20/20, 20/40, etc.
            </p>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='va_final_re_near'>AV de Cerca</Label>
            <Input
              id='va_final_re_near'
              type='text'
              {...register('va_final_re_near')}
              placeholder='J1'
              maxLength={10}
            />
            <p className='text-xs text-gray-500'>
              Ejemplo: J1, J2, etc.
            </p>
          </div>
        </div>
      </div>

      {/* Agudeza Visual Final - Ojo Izquierdo */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold border-b pb-2'>
          Agudeza Visual Final - Ojo Izquierdo (OS/LE)
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='va_final_le_distance'>AV de Lejos</Label>
            <Input
              id='va_final_le_distance'
              type='text'
              {...register('va_final_le_distance')}
              placeholder='20/20'
              maxLength={10}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='va_final_le_near'>AV de Cerca</Label>
            <Input
              id='va_final_le_near'
              type='text'
              {...register('va_final_le_near')}
              placeholder='J1'
              maxLength={10}
            />
          </div>
        </div>
      </div>

      {/* Agudeza Visual Final - Ambos Ojos */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold border-b pb-2'>
          Agudeza Visual Final - Ambos Ojos (OU)
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='va_final_both_distance'>AV de Lejos</Label>
            <Input
              id='va_final_both_distance'
              type='text'
              {...register('va_final_both_distance')}
              placeholder='20/20'
              maxLength={10}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='va_final_both_near'>AV de Cerca</Label>
            <Input
              id='va_final_both_near'
              type='text'
              {...register('va_final_both_near')}
              placeholder='J1'
              maxLength={10}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
