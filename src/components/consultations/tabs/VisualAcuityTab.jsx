// src/components/consultations/tabs/VisualAcuityTab.jsx
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function VisualAcuityTab() {
  const { register } = useFormContext();

  const AcuityFields = ({ eye, prefix }) => (
    <div className='space-y-4'>
      <h4 className='font-medium text-sm text-gray-700 uppercase'>{eye}</h4>
      <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
        {/* Sin Corrección - Lejos */}
        <div>
          <label className='block text-xs font-medium mb-1'>
            Sin Corrección - Lejos
          </label>
          <Input
            {...register(`${prefix}.uncorrected_distance`)}
            placeholder='Ej: 20/40'
            maxLength='20'
            className='text-sm'
          />
        </div>

        {/* Sin Corrección - Cerca */}
        <div>
          <label className='block text-xs font-medium mb-1'>
            Sin Corrección - Cerca
          </label>
          <Input
            {...register(`${prefix}.uncorrected_near`)}
            placeholder='Ej: 20/30'
            maxLength='20'
            className='text-sm'
          />
        </div>

        {/* Con Corrección - Lejos */}
        <div>
          <label className='block text-xs font-medium mb-1'>
            Con Corrección - Lejos
          </label>
          <Input
            {...register(`${prefix}.corrected_distance`)}
            placeholder='Ej: 20/20'
            maxLength='20'
            className='text-sm'
          />
        </div>

        {/* Con Corrección - Cerca */}
        <div>
          <label className='block text-xs font-medium mb-1'>
            Con Corrección - Cerca
          </label>
          <Input
            {...register(`${prefix}.corrected_near`)}
            placeholder='Ej: 20/20'
            maxLength='20'
            className='text-sm'
          />
        </div>

        {/* Agujero Estenopeico */}
        <div>
          <label className='block text-xs font-medium mb-1'>
            Agujero Estenopeico
          </label>
          <Input
            {...register(`${prefix}.pinhole`)}
            placeholder='Ej: 20/25'
            maxLength='20'
            className='text-sm'
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className='space-y-6'>
      {/* Agudeza Visual */}
      <Card>
        <CardHeader>
          <CardTitle>Agudeza Visual</CardTitle>
          <p className='text-sm text-gray-600'>
            Medición de la capacidad visual del paciente
          </p>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Ojo Derecho */}
          <AcuityFields eye='Ojo Derecho (OD)' prefix='visual_acuity_od' />

          {/* Separador */}
          <div className='border-t my-6'></div>

          {/* Ojo Izquierdo */}
          <AcuityFields eye='Ojo Izquierdo (OS)' prefix='visual_acuity_os' />

          {/* Separador */}
          <div className='border-t my-6'></div>

          {/* Binocular */}
          <div className='space-y-4'>
            <h4 className='font-medium text-sm text-gray-700 uppercase'>
              Binocular (OU)
            </h4>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
              <div>
                <label className='block text-xs font-medium mb-1'>
                  Sin Corrección - Lejos
                </label>
                <Input
                  {...register('visual_acuity_ou.uncorrected_distance')}
                  placeholder='Ej: 20/30'
                  maxLength='20'
                  className='text-sm'
                />
              </div>

              <div>
                <label className='block text-xs font-medium mb-1'>
                  Sin Corrección - Cerca
                </label>
                <Input
                  {...register('visual_acuity_ou.uncorrected_near')}
                  placeholder='Ej: 20/25'
                  maxLength='20'
                  className='text-sm'
                />
              </div>

              <div>
                <label className='block text-xs font-medium mb-1'>
                  Con Corrección - Lejos
                </label>
                <Input
                  {...register('visual_acuity_ou.corrected_distance')}
                  placeholder='Ej: 20/20'
                  maxLength='20'
                  className='text-sm'
                />
              </div>

              <div>
                <label className='block text-xs font-medium mb-1'>
                  Con Corrección - Cerca
                </label>
                <Input
                  {...register('visual_acuity_ou.corrected_near')}
                  placeholder='Ej: 20/20'
                  maxLength='20'
                  className='text-sm'
                />
              </div>

              <div>
                <label className='block text-xs font-medium mb-1'>
                  Agujero Estenopeico
                </label>
                <Input
                  {...register('visual_acuity_ou.pinhole')}
                  placeholder='Ej: 20/20'
                  maxLength='20'
                  className='text-sm'
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información Adicional */}
      <Card>
        <CardHeader>
          <CardTitle>Información Adicional</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* Notas sobre Agudeza Visual */}
          <div>
            <label className='block text-sm font-medium mb-2'>
              Notas sobre Agudeza Visual
            </label>
            <textarea
              {...register('visual_acuity_notes')}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              rows='3'
              placeholder='Observaciones adicionales sobre la agudeza visual del paciente...'
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
