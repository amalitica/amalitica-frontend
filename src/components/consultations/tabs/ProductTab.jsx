// src/components/consultations/tabs/ProductTab.jsx
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProductTab() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className='space-y-6'>
      {/* Información del Armazón */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Armazón</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Marca del Armazón */}
            <div>
              <label className='block text-sm font-medium mb-2'>
                Marca del Armazón
              </label>
              <Input
                {...register('frame_brand')}
                placeholder='Ej: Ray-Ban, Oakley'
                maxLength='100'
              />
            </div>

            {/* Modelo del Armazón */}
            <div>
              <label className='block text-sm font-medium mb-2'>
                Modelo del Armazón
              </label>
              <Input
                {...register('frame_model')}
                placeholder='Ej: Aviator, Wayfarer'
                maxLength='100'
              />
            </div>

            {/* Color del Armazón */}
            <div>
              <label className='block text-sm font-medium mb-2'>
                Color del Armazón
              </label>
              <Input
                {...register('frame_color')}
                placeholder='Ej: Negro, Café'
                maxLength='50'
              />
            </div>

            {/* Precio del Armazón */}
            <div>
              <label className='block text-sm font-medium mb-2'>
                Precio del Armazón (MXN)
              </label>
              <Input
                type='number'
                step='0.01'
                min='0'
                {...register('frame_price', { valueAsNumber: true })}
                placeholder='0.00'
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información de los Lentes */}
      <Card>
        <CardHeader>
          <CardTitle>Información de los Lentes</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Tipo de Lente */}
            <div>
              <label className='block text-sm font-medium mb-2'>
                Tipo de Lente
              </label>
              <select
                {...register('lens_type')}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value=''>Seleccionar tipo</option>
                <option value='single_vision'>Visión Sencilla</option>
                <option value='bifocal'>Bifocal</option>
                <option value='progressive'>Progresivo</option>
                <option value='occupational'>Ocupacional</option>
              </select>
            </div>

            {/* Material del Lente */}
            <div>
              <label className='block text-sm font-medium mb-2'>
                Material del Lente
              </label>
              <Input
                {...register('lens_material')}
                placeholder='Ej: Policarbonato, CR-39'
                maxLength='100'
              />
            </div>

            {/* Tratamiento del Lente */}
            <div>
              <label className='block text-sm font-medium mb-2'>
                Tratamiento del Lente
              </label>
              <Input
                {...register('lens_treatment')}
                placeholder='Ej: Antireflejante, Fotocromático'
                maxLength='200'
              />
            </div>

            {/* Precio de los Lentes */}
            <div>
              <label className='block text-sm font-medium mb-2'>
                Precio de los Lentes (MXN)
              </label>
              <Input
                type='number'
                step='0.01'
                min='0'
                {...register('lens_price', { valueAsNumber: true })}
                placeholder='0.00'
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información Comercial */}
      <Card>
        <CardHeader>
          <CardTitle>Información Comercial</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Precio Total */}
            <div>
              <label className='block text-sm font-medium mb-2'>
                Precio Total (MXN)
              </label>
              <Input
                type='number'
                step='0.01'
                min='0'
                {...register('total_price', { valueAsNumber: true })}
                placeholder='0.00'
              />
            </div>

            {/* Descuento */}
            <div>
              <label className='block text-sm font-medium mb-2'>
                Descuento (MXN)
              </label>
              <Input
                type='number'
                step='0.01'
                min='0'
                {...register('discount', { valueAsNumber: true })}
                placeholder='0.00'
              />
            </div>

            {/* Anticipo */}
            <div>
              <label className='block text-sm font-medium mb-2'>
                Anticipo (MXN)
              </label>
              <Input
                type='number'
                step='0.01'
                min='0'
                {...register('advance_payment', { valueAsNumber: true })}
                placeholder='0.00'
              />
            </div>

            {/* Saldo Pendiente */}
            <div>
              <label className='block text-sm font-medium mb-2'>
                Saldo Pendiente (MXN)
              </label>
              <Input
                type='number'
                step='0.01'
                min='0'
                {...register('balance', { valueAsNumber: true })}
                placeholder='0.00'
              />
            </div>

            {/* Método de Pago */}
            <div>
              <label className='block text-sm font-medium mb-2'>
                Método de Pago
              </label>
              <select
                {...register('payment_method')}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value=''>Seleccionar método</option>
                <option value='cash'>Efectivo</option>
                <option value='card'>Tarjeta</option>
                <option value='transfer'>Transferencia</option>
                <option value='mixed'>Mixto</option>
              </select>
            </div>

            {/* Fecha de Entrega */}
            <div>
              <label className='block text-sm font-medium mb-2'>
                Fecha de Entrega Estimada
              </label>
              <Input type='date' {...register('delivery_date')} />
            </div>
          </div>

          {/* Notas de Venta */}
          <div className='mt-4'>
            <label className='block text-sm font-medium mb-2'>
              Notas de Venta
            </label>
            <textarea
              {...register('sales_notes')}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              rows='3'
              placeholder='Observaciones adicionales sobre la venta...'
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
