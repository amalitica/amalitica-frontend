// src/components/consultations/tabs/SymptomsTab.jsx
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

export default function SymptomsTab() {
  const { register, watch, setValue } = useFormContext();

  return (
    <div className='space-y-8'>
      {/* Síntomas Visuales */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold border-b pb-2'>
          Síntomas Visuales
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='symptoms.vision.blurry_distance'
              checked={watch('symptoms.vision.blurry_distance')}
              onCheckedChange={(checked) =>
                setValue('symptoms.vision.blurry_distance', checked)
              }
            />
            <Label htmlFor='symptoms.vision.blurry_distance' className='cursor-pointer'>
              ¿Lejos borroso?
            </Label>
          </div>

          <div className='flex items-center space-x-2'>
            <Checkbox
              id='symptoms.vision.blurry_near'
              checked={watch('symptoms.vision.blurry_near')}
              onCheckedChange={(checked) =>
                setValue('symptoms.vision.blurry_near', checked)
              }
            />
            <Label htmlFor='symptoms.vision.blurry_near' className='cursor-pointer'>
              ¿Cerca borroso?
            </Label>
          </div>

          <div className='flex items-center space-x-2'>
            <Checkbox
              id='symptoms.vision.blurry_letters'
              checked={watch('symptoms.vision.blurry_letters')}
              onCheckedChange={(checked) =>
                setValue('symptoms.vision.blurry_letters', checked)
              }
            />
            <Label htmlFor='symptoms.vision.blurry_letters' className='cursor-pointer'>
              ¿Mueven letras/renglones?
            </Label>
          </div>

          <div className='flex items-center space-x-2'>
            <Checkbox
              id='symptoms.vision.sun_sensitive'
              checked={watch('symptoms.vision.sun_sensitive')}
              onCheckedChange={(checked) =>
                setValue('symptoms.vision.sun_sensitive', checked)
              }
            />
            <Label htmlFor='symptoms.vision.sun_sensitive' className='cursor-pointer'>
              ¿Sensible al sol?
            </Label>
          </div>

          <div className='flex items-center space-x-2'>
            <Checkbox
              id='symptoms.vision.artificial_light_sensitive'
              checked={watch('symptoms.vision.artificial_light_sensitive')}
              onCheckedChange={(checked) =>
                setValue('symptoms.vision.artificial_light_sensitive', checked)
              }
            />
            <Label htmlFor='symptoms.vision.artificial_light_sensitive' className='cursor-pointer'>
              ¿Sensible a luz artificial?
            </Label>
          </div>
        </div>
      </div>

      {/* Síntomas de Cefalea */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold border-b pb-2'>
          Síntomas de Cefalea (Dolor de Cabeza)
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='symptoms.headache.frontal'
              checked={watch('symptoms.headache.frontal')}
              onCheckedChange={(checked) =>
                setValue('symptoms.headache.frontal', checked)
              }
            />
            <Label htmlFor='symptoms.headache.frontal' className='cursor-pointer'>
              Cefalea frontal
            </Label>
          </div>

          <div className='flex items-center space-x-2'>
            <Checkbox
              id='symptoms.headache.occipital'
              checked={watch('symptoms.headache.occipital')}
              onCheckedChange={(checked) =>
                setValue('symptoms.headache.occipital', checked)
              }
            />
            <Label htmlFor='symptoms.headache.occipital' className='cursor-pointer'>
              Cefalea occipital
            </Label>
          </div>

          <div className='flex items-center space-x-2'>
            <Checkbox
              id='symptoms.headache.temporal'
              checked={watch('symptoms.headache.temporal')}
              onCheckedChange={(checked) =>
                setValue('symptoms.headache.temporal', checked)
              }
            />
            <Label htmlFor='symptoms.headache.temporal' className='cursor-pointer'>
              Cefalea temporal
            </Label>
          </div>
        </div>
      </div>

      {/* Molestias Oculares */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold border-b pb-2'>
          Molestias Oculares
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='symptoms.eye_discomfort.eye_pain'
              checked={watch('symptoms.eye_discomfort.eye_pain')}
              onCheckedChange={(checked) =>
                setValue('symptoms.eye_discomfort.eye_pain', checked)
              }
            />
            <Label htmlFor='symptoms.eye_discomfort.eye_pain' className='cursor-pointer'>
              ¿Dolor ocular?
            </Label>
          </div>

          <div className='flex items-center space-x-2'>
            <Checkbox
              id='symptoms.eye_discomfort.itching'
              checked={watch('symptoms.eye_discomfort.itching')}
              onCheckedChange={(checked) =>
                setValue('symptoms.eye_discomfort.itching', checked)
              }
            />
            <Label htmlFor='symptoms.eye_discomfort.itching' className='cursor-pointer'>
              ¿Comezón?
            </Label>
          </div>

          <div className='flex items-center space-x-2'>
            <Checkbox
              id='symptoms.eye_discomfort.burning'
              checked={watch('symptoms.eye_discomfort.burning')}
              onCheckedChange={(checked) =>
                setValue('symptoms.eye_discomfort.burning', checked)
              }
            />
            <Label htmlFor='symptoms.eye_discomfort.burning' className='cursor-pointer'>
              ¿Ardor?
            </Label>
          </div>

          <div className='flex items-center space-x-2'>
            <Checkbox
              id='symptoms.eye_discomfort.tearing'
              checked={watch('symptoms.eye_discomfort.tearing')}
              onCheckedChange={(checked) =>
                setValue('symptoms.eye_discomfort.tearing', checked)
              }
            />
            <Label htmlFor='symptoms.eye_discomfort.tearing' className='cursor-pointer'>
              ¿Lagaña?
            </Label>
          </div>

          <div className='flex items-center space-x-2'>
            <Checkbox
              id='symptoms.eye_discomfort.watery_eyes'
              checked={watch('symptoms.eye_discomfort.watery_eyes')}
              onCheckedChange={(checked) =>
                setValue('symptoms.eye_discomfort.watery_eyes', checked)
              }
            />
            <Label htmlFor='symptoms.eye_discomfort.watery_eyes' className='cursor-pointer'>
              ¿Lagrimeo?
            </Label>
          </div>

          <div className='flex items-center space-x-2'>
            <Checkbox
              id='symptoms.eye_discomfort.irritation'
              checked={watch('symptoms.eye_discomfort.irritation')}
              onCheckedChange={(checked) =>
                setValue('symptoms.eye_discomfort.irritation', checked)
              }
            />
            <Label htmlFor='symptoms.eye_discomfort.irritation' className='cursor-pointer'>
              ¿Irritación?
            </Label>
          </div>

          <div className='flex items-center space-x-2'>
            <Checkbox
              id='symptoms.eye_discomfort.dry_eye'
              checked={watch('symptoms.eye_discomfort.dry_eye')}
              onCheckedChange={(checked) =>
                setValue('symptoms.eye_discomfort.dry_eye', checked)
              }
            />
            <Label htmlFor='symptoms.eye_discomfort.dry_eye' className='cursor-pointer'>
              ¿Ojo seco?
            </Label>
          </div>

          <div className='flex items-center space-x-2'>
            <Checkbox
              id='symptoms.eye_discomfort.fatigue'
              checked={watch('symptoms.eye_discomfort.fatigue')}
              onCheckedChange={(checked) =>
                setValue('symptoms.eye_discomfort.fatigue', checked)
              }
            />
            <Label htmlFor='symptoms.eye_discomfort.fatigue' className='cursor-pointer'>
              ¿Cansancio?
            </Label>
          </div>
        </div>
      </div>

      {/* Condiciones de Salud */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold border-b pb-2'>
          Condiciones de Salud
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='symptoms.health_conditions.hypertension'
              checked={watch('symptoms.health_conditions.hypertension')}
              onCheckedChange={(checked) =>
                setValue('symptoms.health_conditions.hypertension', checked)
              }
            />
            <Label htmlFor='symptoms.health_conditions.hypertension' className='cursor-pointer'>
              ¿Hipertensión?
            </Label>
          </div>

          <div className='flex items-center space-x-2'>
            <Checkbox
              id='symptoms.health_conditions.diabetes'
              checked={watch('symptoms.health_conditions.diabetes')}
              onCheckedChange={(checked) =>
                setValue('symptoms.health_conditions.diabetes', checked)
              }
            />
            <Label htmlFor='symptoms.health_conditions.diabetes' className='cursor-pointer'>
              ¿Diabético?
            </Label>
          </div>

          <div className='flex items-center space-x-2'>
            <Checkbox
              id='symptoms.health_conditions.tired'
              checked={watch('symptoms.health_conditions.tired')}
              onCheckedChange={(checked) =>
                setValue('symptoms.health_conditions.tired', checked)
              }
            />
            <Label htmlFor='symptoms.health_conditions.tired' className='cursor-pointer'>
              ¿Cansado?
            </Label>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='symptoms.health_conditions.screen_hours'>
              ¿Horas en dispositivos?
            </Label>
            <Input
              id='symptoms.health_conditions.screen_hours'
              type='number'
              {...register('symptoms.health_conditions.screen_hours', {
                valueAsNumber: true,
              })}
              placeholder='8'
              min='0'
              max='24'
            />
          </div>
        </div>
      </div>

      {/* Campos de Texto Adicionales */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold border-b pb-2'>
          Información Adicional
        </h3>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='symptoms.disease'>¿Alguna enfermedad?</Label>
            <Input
              id='symptoms.disease'
              type='text'
              {...register('symptoms.disease')}
              placeholder='Especifique enfermedades...'
              maxLength={500}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='symptoms.takes_medication'>¿Toma medicamento?</Label>
            <Input
              id='symptoms.takes_medication'
              type='text'
              {...register('symptoms.takes_medication')}
              placeholder='Especifique medicamentos...'
              maxLength={500}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='symptoms.observations'>Observaciones adicionales</Label>
            <Textarea
              id='symptoms.observations'
              {...register('symptoms.observations')}
              placeholder='Observaciones adicionales sobre los síntomas...'
              rows={4}
              maxLength={1000}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
