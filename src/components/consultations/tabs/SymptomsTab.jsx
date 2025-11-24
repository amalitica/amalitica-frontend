// src/components/consultations/tabs/SymptomsTab.jsx
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SymptomsTab() {
  const { register } = useFormContext();

  const Checkbox = ({ label, name }) => (
    <label className='flex items-center space-x-2 cursor-pointer'>
      <input
        type='checkbox'
        {...register(name)}
        className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
      />
      <span className='text-sm'>{label}</span>
    </label>
  );

  return (
    <div className='space-y-6'>
      {/* Síntomas Visuales */}
      <Card>
        <CardHeader>
          <CardTitle>Síntomas Visuales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <Checkbox
              label='Visión borrosa de lejos'
              name='symptoms.vision_symptoms.blurry_distance'
            />
            <Checkbox
              label='Visión borrosa de cerca'
              name='symptoms.vision_symptoms.blurry_near'
            />
            <Checkbox
              label='Letras/renglones se mueven'
              name='symptoms.vision_symptoms.blurry_letters'
            />
            <Checkbox
              label='Sensible al sol'
              name='symptoms.vision_symptoms.sun_sensitive'
            />
            <Checkbox
              label='Sensible a luz artificial'
              name='symptoms.vision_symptoms.artificial_light_sensitive'
            />
          </div>
        </CardContent>
      </Card>

      {/* Cefaleas */}
      <Card>
        <CardHeader>
          <CardTitle>Cefaleas (Dolores de Cabeza)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <Checkbox
              label='Cefalea frontal'
              name='symptoms.headache_symptoms.frontal'
            />
            <Checkbox
              label='Cefalea occipital'
              name='symptoms.headache_symptoms.occipital'
            />
            <Checkbox
              label='Cefalea temporal'
              name='symptoms.headache_symptoms.temporal'
            />
          </div>
        </CardContent>
      </Card>

      {/* Molestias Oculares */}
      <Card>
        <CardHeader>
          <CardTitle>Molestias Oculares</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <Checkbox
              label='Dolor ocular'
              name='symptoms.eye_discomfort_symptoms.eye_pain'
            />
            <Checkbox
              label='Comezón'
              name='symptoms.eye_discomfort_symptoms.itching'
            />
            <Checkbox
              label='Ardor'
              name='symptoms.eye_discomfort_symptoms.burning'
            />
            <Checkbox
              label='Lagaña'
              name='symptoms.eye_discomfort_symptoms.tearing'
            />
            <Checkbox
              label='Lagrimeo'
              name='symptoms.eye_discomfort_symptoms.watery_eyes'
            />
            <Checkbox
              label='Irritación'
              name='symptoms.eye_discomfort_symptoms.irritation'
            />
            <Checkbox
              label='Ojo seco'
              name='symptoms.eye_discomfort_symptoms.dry_eye'
            />
            <Checkbox
              label='Cansancio ocular'
              name='symptoms.eye_discomfort_symptoms.fatigue'
            />
          </div>
        </CardContent>
      </Card>

      {/* Condiciones de Salud */}
      <Card>
        <CardHeader>
          <CardTitle>Condiciones de Salud</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <Checkbox
              label='Hipertensión'
              name='symptoms.health_conditions.hypertension'
            />
            <Checkbox
              label='Diabetes'
              name='symptoms.health_conditions.diabetes'
            />
            <Checkbox
              label='Cansancio general'
              name='symptoms.health_conditions.tired'
            />
          </div>

          {/* Horas frente a pantallas */}
          <div className='mt-4'>
            <label className='block text-sm font-medium mb-2'>
              Horas frente a pantallas (por día)
            </label>
            <Input
              type='number'
              min='0'
              max='24'
              {...register('symptoms.health_conditions.screen_hours', {
                valueAsNumber: true,
              })}
              placeholder='0-24 horas'
              className='max-w-xs'
            />
          </div>
        </CardContent>
      </Card>

      {/* Síntomas Adicionales */}
      <Card>
        <CardHeader>
          <CardTitle>Síntomas Adicionales</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            {...register('additional_symptoms')}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            rows='4'
            placeholder='Describa cualquier otro síntoma o molestia que presente el paciente...'
          />
        </CardContent>
      </Card>
    </div>
  );
}
