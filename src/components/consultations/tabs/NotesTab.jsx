// src/components/consultations/tabs/NotesTab.jsx
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function NotesTab() {
  const { register } = useFormContext();

  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='additional_notes'>Notas Adicionales</Label>
          <Textarea
            id='additional_notes'
            {...register('additional_notes')}
            placeholder='Notas generales sobre la consulta...'
            rows={8}
          />
          <p className='text-xs text-gray-500'>
            Espacio para cualquier observación, comentario o detalle adicional sobre la consulta.
          </p>
        </div>
      </div>
    </div>
  );
}
