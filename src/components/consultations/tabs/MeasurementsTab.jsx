// src/components/consultations/tabs/MeasurementsTab.jsx
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MeasurementsTab() {
  const { register } = useFormContext();

  const LensometryFields = ({ eye, prefix }) => (
    <div className='space-y-4'>
      <h4 className='font-medium text-sm text-gray-700 uppercase'>{eye}</h4>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
        <div>
          <label className='block text-xs font-medium mb-1'>Esfera</label>
          <Input
            type='number'
            step='0.25'
            {...register(`lensometry.${prefix}.sphere`, {
              valueAsNumber: true,
            })}
            placeholder='0.00'
            className='text-sm'
          />
        </div>

        <div>
          <label className='block text-xs font-medium mb-1'>Cilindro</label>
          <Input
            type='number'
            step='0.25'
            {...register(`lensometry.${prefix}.cylinder`, {
              valueAsNumber: true,
            })}
            placeholder='0.00'
            className='text-sm'
          />
        </div>

        <div>
          <label className='block text-xs font-medium mb-1'>Eje</label>
          <Input
            type='number'
            min='0'
            max='180'
            {...register(`lensometry.${prefix}.axis`, { valueAsNumber: true })}
            placeholder='0-180'
            className='text-sm'
          />
        </div>

        <div>
          <label className='block text-xs font-medium mb-1'>Adición</label>
          <Input
            type='number'
            step='0.25'
            {...register(`lensometry.${prefix}.addition`, {
              valueAsNumber: true,
            })}
            placeholder='0.00'
            className='text-sm'
          />
        </div>
      </div>
    </div>
  );

  const RetinoscopyFields = ({ eye, prefix }) => (
    <div className='space-y-4'>
      <h4 className='font-medium text-sm text-gray-700 uppercase'>{eye}</h4>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
        <div>
          <label className='block text-xs font-medium mb-1'>Esfera</label>
          <Input
            type='number'
            step='0.25'
            {...register(`retinoscopy.${prefix}.sphere`, {
              valueAsNumber: true,
            })}
            placeholder='0.00'
            className='text-sm'
          />
        </div>

        <div>
          <label className='block text-xs font-medium mb-1'>Cilindro</label>
          <Input
            type='number'
            step='0.25'
            {...register(`retinoscopy.${prefix}.cylinder`, {
              valueAsNumber: true,
            })}
            placeholder='0.00'
            className='text-sm'
          />
        </div>

        <div>
          <label className='block text-xs font-medium mb-1'>Eje</label>
          <Input
            type='number'
            min='0'
            max='180'
            {...register(`retinoscopy.${prefix}.axis`, { valueAsNumber: true })}
            placeholder='0-180'
            className='text-sm'
          />
        </div>

        <div>
          <label className='block text-xs font-medium mb-1'>Adición</label>
          <Input
            type='number'
            step='0.25'
            {...register(`retinoscopy.${prefix}.addition`, {
              valueAsNumber: true,
            })}
            placeholder='0.00'
            className='text-sm'
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className='space-y-6'>
      {/* Lensometría */}
      <Card>
        <CardHeader>
          <CardTitle>Lensometría</CardTitle>
          <p className='text-sm text-gray-600'>
            Medición de los lentes actuales del paciente
          </p>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Ojo Derecho */}
          <LensometryFields eye='Ojo Derecho (OD)' prefix='od' />

          {/* Separador */}
          <div className='border-t my-6'></div>

          {/* Ojo Izquierdo */}
          <LensometryFields eye='Ojo Izquierdo (OS)' prefix='os' />
        </CardContent>
      </Card>

      {/* Retinoscopía */}
      <Card>
        <CardHeader>
          <CardTitle>Retinoscopía</CardTitle>
          <p className='text-sm text-gray-600'>
            Medición objetiva de la refracción ocular
          </p>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Ojo Derecho */}
          <RetinoscopyFields eye='Ojo Derecho (OD)' prefix='od' />

          {/* Separador */}
          <div className='border-t my-6'></div>

          {/* Ojo Izquierdo */}
          <RetinoscopyFields eye='Ojo Izquierdo (OS)' prefix='os' />
        </CardContent>
      </Card>

      {/* Queratometría */}
      <Card>
        <CardHeader>
          <CardTitle>Queratometría</CardTitle>
          <p className='text-sm text-gray-600'>
            Medición de la curvatura corneal
          </p>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Ojo Derecho */}
          <div className='space-y-4'>
            <h4 className='font-medium text-sm text-gray-700 uppercase'>
              Ojo Derecho (OD)
            </h4>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
              <div>
                <label className='block text-xs font-medium mb-1'>K1</label>
                <Input
                  type='number'
                  step='0.25'
                  {...register('keratometry.od.k1', { valueAsNumber: true })}
                  placeholder='0.00'
                  className='text-sm'
                />
              </div>

              <div>
                <label className='block text-xs font-medium mb-1'>K2</label>
                <Input
                  type='number'
                  step='0.25'
                  {...register('keratometry.od.k2', { valueAsNumber: true })}
                  placeholder='0.00'
                  className='text-sm'
                />
              </div>

              <div>
                <label className='block text-xs font-medium mb-1'>Eje</label>
                <Input
                  type='number'
                  min='0'
                  max='180'
                  {...register('keratometry.od.axis', { valueAsNumber: true })}
                  placeholder='0-180'
                  className='text-sm'
                />
              </div>
            </div>
          </div>

          {/* Separador */}
          <div className='border-t my-6'></div>

          {/* Ojo Izquierdo */}
          <div className='space-y-4'>
            <h4 className='font-medium text-sm text-gray-700 uppercase'>
              Ojo Izquierdo (OS)
            </h4>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
              <div>
                <label className='block text-xs font-medium mb-1'>K1</label>
                <Input
                  type='number'
                  step='0.25'
                  {...register('keratometry.os.k1', { valueAsNumber: true })}
                  placeholder='0.00'
                  className='text-sm'
                />
              </div>

              <div>
                <label className='block text-xs font-medium mb-1'>K2</label>
                <Input
                  type='number'
                  step='0.25'
                  {...register('keratometry.os.k2', { valueAsNumber: true })}
                  placeholder='0.00'
                  className='text-sm'
                />
              </div>

              <div>
                <label className='block text-xs font-medium mb-1'>Eje</label>
                <Input
                  type='number'
                  min='0'
                  max='180'
                  {...register('keratometry.os.axis', { valueAsNumber: true })}
                  placeholder='0-180'
                  className='text-sm'
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notas de Mediciones */}
      <Card>
        <CardHeader>
          <CardTitle>Notas de Mediciones</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            {...register('measurements_notes')}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            rows='3'
            placeholder='Observaciones adicionales sobre las mediciones...'
          />
        </CardContent>
      </Card>
    </div>
  );
}
