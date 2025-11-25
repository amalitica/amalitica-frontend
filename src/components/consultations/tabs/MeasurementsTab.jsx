// src/components/consultations/tabs/MeasurementsTab.jsx
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function MeasurementsTab() {
  const { register } = useFormContext();

  return (
    <div className='space-y-8'>
      {/* Lensometría - Ojo Derecho */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold border-b pb-2'>
          Lensometría - Ojo Derecho (OD/RE)
        </h3>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='lensometry.re.sph'>Esfera (SPH)</Label>
            <Input
              id='lensometry.re.sph'
              type='number'
              step='0.25'
              {...register('lensometry.re.sph', { valueAsNumber: true })}
              placeholder='-2.50'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='lensometry.re.cyl'>Cilindro (CYL)</Label>
            <Input
              id='lensometry.re.cyl'
              type='number'
              step='0.25'
              {...register('lensometry.re.cyl', { valueAsNumber: true })}
              placeholder='-1.00'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='lensometry.re.axis'>Eje (AXIS)</Label>
            <Input
              id='lensometry.re.axis'
              type='number'
              {...register('lensometry.re.axis', { valueAsNumber: true })}
              placeholder='90'
              min='0'
              max='180'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='lensometry.re.add'>Adición (ADD)</Label>
            <Input
              id='lensometry.re.add'
              type='number'
              step='0.25'
              {...register('lensometry.re.add', { valueAsNumber: true })}
              placeholder='+2.00'
            />
          </div>
        </div>
      </div>

      {/* Lensometría - Ojo Izquierdo */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold border-b pb-2'>
          Lensometría - Ojo Izquierdo (OS/LE)
        </h3>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='lensometry.le.sph'>Esfera (SPH)</Label>
            <Input
              id='lensometry.le.sph'
              type='number'
              step='0.25'
              {...register('lensometry.le.sph', { valueAsNumber: true })}
              placeholder='-2.50'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='lensometry.le.cyl'>Cilindro (CYL)</Label>
            <Input
              id='lensometry.le.cyl'
              type='number'
              step='0.25'
              {...register('lensometry.le.cyl', { valueAsNumber: true })}
              placeholder='-1.00'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='lensometry.le.axis'>Eje (AXIS)</Label>
            <Input
              id='lensometry.le.axis'
              type='number'
              {...register('lensometry.le.axis', { valueAsNumber: true })}
              placeholder='90'
              min='0'
              max='180'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='lensometry.le.add'>Adición (ADD)</Label>
            <Input
              id='lensometry.le.add'
              type='number'
              step='0.25'
              {...register('lensometry.le.add', { valueAsNumber: true })}
              placeholder='+2.00'
            />
          </div>
        </div>
      </div>

      {/* Retinoscopía - Ojo Derecho */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold border-b pb-2'>
          Retinoscopía - Ojo Derecho (OD/RE)
        </h3>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='retinoscopy.re.sph'>Esfera (SPH)</Label>
            <Input
              id='retinoscopy.re.sph'
              type='number'
              step='0.25'
              {...register('retinoscopy.re.sph', { valueAsNumber: true })}
              placeholder='-2.50'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='retinoscopy.re.cyl'>Cilindro (CYL)</Label>
            <Input
              id='retinoscopy.re.cyl'
              type='number'
              step='0.25'
              {...register('retinoscopy.re.cyl', { valueAsNumber: true })}
              placeholder='-1.00'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='retinoscopy.re.axis'>Eje (AXIS)</Label>
            <Input
              id='retinoscopy.re.axis'
              type='number'
              {...register('retinoscopy.re.axis', { valueAsNumber: true })}
              placeholder='90'
              min='0'
              max='180'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='retinoscopy.re.add'>Adición (ADD)</Label>
            <Input
              id='retinoscopy.re.add'
              type='number'
              step='0.25'
              {...register('retinoscopy.re.add', { valueAsNumber: true })}
              placeholder='+2.00'
            />
          </div>
        </div>
      </div>

      {/* Retinoscopía - Ojo Izquierdo */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold border-b pb-2'>
          Retinoscopía - Ojo Izquierdo (OS/LE)
        </h3>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='retinoscopy.le.sph'>Esfera (SPH)</Label>
            <Input
              id='retinoscopy.le.sph'
              type='number'
              step='0.25'
              {...register('retinoscopy.le.sph', { valueAsNumber: true })}
              placeholder='-2.50'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='retinoscopy.le.cyl'>Cilindro (CYL)</Label>
            <Input
              id='retinoscopy.le.cyl'
              type='number'
              step='0.25'
              {...register('retinoscopy.le.cyl', { valueAsNumber: true })}
              placeholder='-1.00'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='retinoscopy.le.axis'>Eje (AXIS)</Label>
            <Input
              id='retinoscopy.le.axis'
              type='number'
              {...register('retinoscopy.le.axis', { valueAsNumber: true })}
              placeholder='90'
              min='0'
              max='180'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='retinoscopy.le.add'>Adición (ADD)</Label>
            <Input
              id='retinoscopy.le.add'
              type='number'
              step='0.25'
              {...register('retinoscopy.le.add', { valueAsNumber: true })}
              placeholder='+2.00'
            />
          </div>
        </div>
      </div>

      {/* Notas de Retinoscopía */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold border-b pb-2'>
          Notas de Retinoscopía
        </h3>
        <div className='space-y-2'>
          <Label htmlFor='retinoscopy_notes'>Notas</Label>
          <Textarea
            id='retinoscopy_notes'
            {...register('retinoscopy_notes')}
            placeholder='Observaciones sobre la retinoscopía...'
            rows={4}
          />
        </div>
      </div>
    </div>
  );
}
