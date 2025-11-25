// src/components/consultations/tabs/ProductTab.jsx
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function ProductTab() {
  const { register } = useFormContext();

  return (
    <div className='space-y-8'>
      {/* Información del Armazón */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold border-b pb-2'>
          Información del Armazón
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='frame_brand'>Marca del Armazón</Label>
            <Input
              id='frame_brand'
              type='text'
              {...register('frame_brand')}
              placeholder='Ray-Ban'
              maxLength={100}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='frame_model'>Modelo del Armazón</Label>
            <Input
              id='frame_model'
              type='text'
              {...register('frame_model')}
              placeholder='Wayfarer'
              maxLength={100}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='frame_color'>Color del Armazón</Label>
            <Input
              id='frame_color'
              type='text'
              {...register('frame_color')}
              placeholder='Negro'
              maxLength={100}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='frame_size'>Tamaño del Armazón</Label>
            <Input
              id='frame_size'
              type='text'
              {...register('frame_size')}
              placeholder='52-18-145'
              maxLength={50}
            />
            <p className='text-xs text-gray-500'>
              Formato: ancho-puente-varilla (ej. 52-18-145)
            </p>
          </div>
        </div>
      </div>

      {/* Información de los Lentes */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold border-b pb-2'>
          Información de los Lentes
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='lens_type'>Tipo de Lente</Label>
            <Input
              id='lens_type'
              type='text'
              {...register('lens_type')}
              placeholder='Monofocal, Bifocal, Progresivo'
              maxLength={100}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='lens_material'>Material del Lente</Label>
            <Input
              id='lens_material'
              type='text'
              {...register('lens_material')}
              placeholder='CR-39, Policarbonato, Hi-Index'
              maxLength={100}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='lens_design'>Diseño del Lente</Label>
            <Input
              id='lens_design'
              type='text'
              {...register('lens_design')}
              placeholder='Asférico, Esférico'
              maxLength={100}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='re_lens_type'>Tipo de Lente - Ojo Derecho</Label>
            <Input
              id='re_lens_type'
              type='text'
              {...register('re_lens_type')}
              placeholder='Tipo específico para OD'
              maxLength={100}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='le_lens_type'>Tipo de Lente - Ojo Izquierdo</Label>
            <Input
              id='le_lens_type'
              type='text'
              {...register('le_lens_type')}
              placeholder='Tipo específico para OS'
              maxLength={100}
            />
          </div>
        </div>
      </div>

      {/* Información Comercial */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold border-b pb-2'>
          Información Comercial
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='total_price'>Precio Total</Label>
            <Input
              id='total_price'
              type='number'
              step='0.01'
              {...register('total_price', { valueAsNumber: true })}
              placeholder='1500.00'
              min='0'
            />
            <p className='text-xs text-gray-500'>
              Precio total del armazón y lentes
            </p>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='delivery_days'>Días de Entrega</Label>
            <Input
              id='delivery_days'
              type='number'
              {...register('delivery_days', { valueAsNumber: true })}
              placeholder='7'
              min='0'
              max='365'
            />
            <p className='text-xs text-gray-500'>
              Días estimados para la entrega del producto
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
