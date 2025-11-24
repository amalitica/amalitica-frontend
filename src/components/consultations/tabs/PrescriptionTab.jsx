// src/components/consultations/tabs/PrescriptionTab.jsx
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrescriptionTab() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const RxFields = ({ eye, prefix }) => (
    <div className='space-y-4'>
      <h4 className='font-medium text-sm text-gray-700 uppercase'>{eye}</h4>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
        {/* Esfera */}
        <div>
          <label className='block text-xs font-medium mb-1'>Esfera (SPH)</label>
          <Input
            type='number'
            step='0.25'
            {...register(`${prefix}.sphere`, { valueAsNumber: true })}
            placeholder='0.00'
            className='text-sm'
          />
        </div>

        {/* Cilindro */}
        <div>
          <label className='block text-xs font-medium mb-1'>
            Cilindro (CYL)
          </label>
          <Input
            type='number'
            step='0.25'
            {...register(`${prefix}.cylinder`, { valueAsNumber: true })}
            placeholder='0.00'
            className='text-sm'
          />
        </div>

        {/* Eje */}
        <div>
          <label className='block text-xs font-medium mb-1'>Eje (AXIS)</label>
          <Input
            type='number'
            min='0'
            max='180'
            {...register(`${prefix}.axis`, { valueAsNumber: true })}
            placeholder='0-180'
            className='text-sm'
          />
        </div>

        {/* Adición */}
        <div>
          <label className='block text-xs font-medium mb-1'>
            Adición (ADD)
          </label>
          <Input
            type='number'
            step='0.25'
            {...register(`${prefix}.addition`, { valueAsNumber: true })}
            placeholder='0.00'
            className='text-sm'
          />
        </div>

        {/* Prisma */}
        <div>
          <label className='block text-xs font-medium mb-1'>Prisma</label>
          <Input
            type='number'
            step='0.25'
            {...register(`${prefix}.prism`, { valueAsNumber: true })}
            placeholder='0.00'
            className='text-sm'
          />
        </div>

        {/* Base */}
        <div>
          <label className='block text-xs font-medium mb-1'>Base</label>
          <Input
            {...register(`${prefix}.base`)}
            placeholder='Ej: UP, DOWN'
            maxLength='50'
            className='text-sm'
          />
        </div>

        {/* DIP (Distancia Interpupilar) */}
        <div>
          <label className='block text-xs font-medium mb-1'>DIP (mm)</label>
          <Input
            type='number'
            step='0.5'
            min='0'
            {...register(`${prefix}.dip`, { valueAsNumber: true })}
            placeholder='mm'
            className='text-sm'
          />
        </div>

        {/* Altura */}
        <div>
          <label className='block text-xs font-medium mb-1'>Altura (mm)</label>
          <Input
            type='number'
            step='0.5'
            min='0'
            {...register(`${prefix}.height`, { valueAsNumber: true })}
            placeholder='mm'
            className='text-sm'
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className='space-y-6'>
      {/* Prescripción Final (RX Final) */}
      <Card>
        <CardHeader>
          <CardTitle>Prescripción Final (RX Final)</CardTitle>
          <p className='text-sm text-gray-600'>
            Graduación final prescrita al paciente
          </p>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Ojo Derecho */}
          <RxFields eye='Ojo Derecho (OD)' prefix='final_rx_od' />

          {/* Separador */}
          <div className='border-t my-6'></div>

          {/* Ojo Izquierdo */}
          <RxFields eye='Ojo Izquierdo (OS)' prefix='final_rx_os' />
        </CardContent>
      </Card>

      {/* Prescripción Subjetiva */}
      <Card>
        <CardHeader>
          <CardTitle>Prescripción Subjetiva</CardTitle>
          <p className='text-sm text-gray-600'>
            Graduación basada en la respuesta del paciente
          </p>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Ojo Derecho */}
          <RxFields eye='Ojo Derecho (OD)' prefix='subjective_rx_od' />

          {/* Separador */}
          <div className='border-t my-6'></div>

          {/* Ojo Izquierdo */}
          <RxFields eye='Ojo Izquierdo (OS)' prefix='subjective_rx_os' />
        </CardContent>
      </Card>

      {/* Prescripción Objetiva (Retinoscopía) */}
      <Card>
        <CardHeader>
          <CardTitle>Prescripción Objetiva (Retinoscopía)</CardTitle>
          <p className='text-sm text-gray-600'>
            Graduación obtenida mediante retinoscopía
          </p>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Ojo Derecho */}
          <RxFields eye='Ojo Derecho (OD)' prefix='objective_rx_od' />

          {/* Separador */}
          <div className='border-t my-6'></div>

          {/* Ojo Izquierdo */}
          <RxFields eye='Ojo Izquierdo (OS)' prefix='objective_rx_os' />
        </CardContent>
      </Card>
    </div>
  );
}
