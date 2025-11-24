// src/components/consultations/tabs/NotesTab.jsx
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NotesTab() {
  const { register } = useFormContext();

  return (
    <div className='space-y-6'>
      {/* Diagnóstico */}
      <Card>
        <CardHeader>
          <CardTitle>Diagnóstico</CardTitle>
          <p className='text-sm text-gray-600'>
            Diagnóstico clínico del paciente
          </p>
        </CardHeader>
        <CardContent>
          <textarea
            {...register('diagnosis')}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            rows='5'
            placeholder='Escriba el diagnóstico clínico del paciente...'
          />
        </CardContent>
      </Card>

      {/* Observaciones Generales */}
      <Card>
        <CardHeader>
          <CardTitle>Observaciones Generales</CardTitle>
          <p className='text-sm text-gray-600'>
            Notas adicionales sobre la consulta
          </p>
        </CardHeader>
        <CardContent>
          <textarea
            {...register('notes')}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            rows='5'
            placeholder='Escriba cualquier observación adicional sobre la consulta...'
          />
        </CardContent>
      </Card>

      {/* Recomendaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Recomendaciones</CardTitle>
          <p className='text-sm text-gray-600'>
            Recomendaciones para el paciente
          </p>
        </CardHeader>
        <CardContent>
          <textarea
            {...register('recommendations')}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            rows='5'
            placeholder='Escriba las recomendaciones para el paciente...'
          />
        </CardContent>
      </Card>

      {/* Próxima Cita */}
      <Card>
        <CardHeader>
          <CardTitle>Seguimiento</CardTitle>
          <p className='text-sm text-gray-600'>
            Información sobre el seguimiento del paciente
          </p>
        </CardHeader>
        <CardContent>
          <textarea
            {...register('follow_up')}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            rows='4'
            placeholder='Indique cuándo debe regresar el paciente, qué revisar en la próxima cita, etc...'
          />
        </CardContent>
      </Card>
    </div>
  );
}
