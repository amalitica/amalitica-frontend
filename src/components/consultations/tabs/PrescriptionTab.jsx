// src/components/consultations/tabs/PrescriptionTab.jsx
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function PrescriptionTab() {
  const { register } = useFormContext();

  return (
    <div className='space-y-8'>
      {/* RX Final - Ojo Derecho (RE) */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold border-b pb-2'>
          RX Final - Ojo Derecho (OD/RE)
        </h3>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='re_sph_final'>Esfera (SPH)</Label>
            <Input
              id='re_sph_final'
              type='number'
              step='0.25'
              {...register('re_sph_final', { valueAsNumber: true })}
              placeholder='-2.50'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='re_cyl_final'>Cilindro (CYL)</Label>
            <Input
              id='re_cyl_final'
              type='number'
              step='0.25'
              {...register('re_cyl_final', { valueAsNumber: true })}
              placeholder='-1.00'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='re_axis_final'>Eje (AXIS)</Label>
            <Input
              id='re_axis_final'
              type='number'
              {...register('re_axis_final', { valueAsNumber: true })}
              placeholder='90'
              min='0'
              max='180'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='re_add_final'>Adición (ADD)</Label>
            <Input
              id='re_add_final'
              type='number'
              step='0.25'
              {...register('re_add_final', { valueAsNumber: true })}
              placeholder='+2.00'
            />
          </div>
        </div>
      </div>

      {/* RX Final - Ojo Izquierdo (LE) */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold border-b pb-2'>
          RX Final - Ojo Izquierdo (OS/LE)
        </h3>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='le_sph_final'>Esfera (SPH)</Label>
            <Input
              id='le_sph_final'
              type='number'
              step='0.25'
              {...register('le_sph_final', { valueAsNumber: true })}
              placeholder='-2.50'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='le_cyl_final'>Cilindro (CYL)</Label>
            <Input
              id='le_cyl_final'
              type='number'
              step='0.25'
              {...register('le_cyl_final', { valueAsNumber: true })}
              placeholder='-1.00'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='le_axis_final'>Eje (AXIS)</Label>
            <Input
              id='le_axis_final'
              type='number'
              {...register('le_axis_final', { valueAsNumber: true })}
              placeholder='90'
              min='0'
              max='180'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='le_add_final'>Adición (ADD)</Label>
            <Input
              id='le_add_final'
              type='number'
              step='0.25'
              {...register('le_add_final', { valueAsNumber: true })}
              placeholder='+2.00'
            />
          </div>
        </div>
      </div>

      {/* Mediciones Biométricas - Distancia Pupilar */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold border-b pb-2'>
          Distancia Pupilar (PD)
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='re_pd_final'>PD Ojo Derecho</Label>
            <Input
              id='re_pd_final'
              type='number'
              step='0.5'
              {...register('re_pd_final', { valueAsNumber: true })}
              placeholder='32.0'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='le_pd_final'>PD Ojo Izquierdo</Label>
            <Input
              id='le_pd_final'
              type='number'
              step='0.5'
              {...register('le_pd_final', { valueAsNumber: true })}
              placeholder='32.0'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='pd_final'>PD Binocular</Label>
            <Input
              id='pd_final'
              type='number'
              step='0.5'
              {...register('pd_final', { valueAsNumber: true })}
              placeholder='64.0'
            />
          </div>
        </div>
      </div>

      {/* Mediciones Biométricas - Altura de Segmento */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold border-b pb-2'>
          Altura de Segmento
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='re_seg_height_final'>Seg Height Ojo Derecho</Label>
            <Input
              id='re_seg_height_final'
              type='number'
              step='0.5'
              {...register('re_seg_height_final', { valueAsNumber: true })}
              placeholder='18.0'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='le_seg_height_final'>Seg Height Ojo Izquierdo</Label>
            <Input
              id='le_seg_height_final'
              type='number'
              step='0.5'
              {...register('le_seg_height_final', { valueAsNumber: true })}
              placeholder='18.0'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='seg_height_final'>Seg Height Binocular</Label>
            <Input
              id='seg_height_final'
              type='number'
              step='0.5'
              {...register('seg_height_final', { valueAsNumber: true })}
              placeholder='18.0'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
