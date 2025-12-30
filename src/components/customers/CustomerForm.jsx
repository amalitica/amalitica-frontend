// src/components/customers/CustomerForm.jsx
/**
 * Formulario de creación/edición de clientes (pacientes).
 * 
 * Refactorizado para usar componentes reutilizables:
 * - PersonNameFields: Captura nombre, apellidos y género con inferencia automática
 * - GeographicSelector: Captura datos geográficos basados en SEPOMEX
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, MapPin } from 'lucide-react';
import {
  createCustomer,
  updateCustomer,
  getCustomerById,
} from '@/api/customers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PersonNameFields from '@/components/common/PersonNameFields';
import GeographicSelector from '@/components/common/GeographicSelector';

const CustomerForm = ({ mode = 'create' }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(mode === 'edit');
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues,
  } = useForm({
    defaultValues: {
      // Datos personales
      name: '',
      paternal_surname: '',
      maternal_surname: '',
      gender: null,
      gender_inferred: false,
      gender_confidence: null,
      gender_inference_method: null,
      phone: '',
      email: '',
      birth_date: '',
      // Datos geográficos
      postal_code: '',
      state_id: null,
      municipality_id: null,
      settlement_id: null,
      settlement_custom: '',
      street: '',
      exterior_number: '',
      interior_number: '',
      // Otros datos personales
      marital_status: '',
      occupation: '',
      // Marketing
      marketing_source: '',
      hobbies: '',
      // Salud
      diabetes: false,
      hypertension: false,
      medical_conditions: '',
      // Notas
      additional_notes: '',
    },
  });

  // Cargar datos del cliente si estamos en modo edición
  useEffect(() => {
    if (mode === 'edit' && id) {
      loadCustomerData();
    }
  }, [mode, id]);

  const loadCustomerData = async () => {
    try {
      setLoadingData(true);
      const response = await getCustomerById(id);
      const customer = response.data || response;

      // Llenar el formulario con los datos del cliente
      Object.keys(customer).forEach((key) => {
        if (key === 'birth_date' && customer[key]) {
          setValue(key, customer[key].split('T')[0]);
        } else {
          setValue(key, customer[key] || '');
        }
      });
    } catch (err) {
      console.error('Error al cargar cliente:', err);
      setError('Error al cargar los datos del cliente');
    } finally {
      setLoadingData(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      // Limpiar datos antes de enviar
      const cleanedData = Object.fromEntries(
        Object.entries(data).filter(
          ([_, value]) => value !== '' && value !== null && value !== undefined
        )
      );

      if (mode === 'create') {
        await createCustomer(cleanedData);
      } else {
        await updateCustomer(id, cleanedData);
      }

      navigate('/customers');
    } catch (err) {
      console.error('Error al guardar cliente:', err);
      // Manejar diferentes formatos de error del backend
      let errorMessage = `Error al ${mode === 'create' ? 'crear' : 'actualizar'} el cliente`;
      
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        // Si detail es un array (errores de validación de Pydantic)
        if (Array.isArray(detail)) {
          errorMessage = detail.map(e => e.msg || e.message || JSON.stringify(e)).join(', ');
        } else if (typeof detail === 'string') {
          errorMessage = detail;
        } else if (typeof detail === 'object') {
          errorMessage = detail.msg || detail.message || JSON.stringify(detail);
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <p className='text-muted-foreground'>Cargando datos del cliente...</p>
      </div>
    );
  }

  return (
    <div className='space-y-6 max-w-4xl mx-auto'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => navigate('/customers')}
        >
          <ArrowLeft className='h-4 w-4' />
        </Button>
        <div>
          <h1 className='text-2xl sm:text-3xl font-bold'>
            {mode === 'create' ? 'Nuevo Cliente' : 'Editar Cliente'}
          </h1>
          <p className='text-sm text-muted-foreground mt-1'>
            {mode === 'create'
              ? 'Completa la información del nuevo cliente'
              : 'Actualiza la información del cliente'}
          </p>
        </div>
      </div>

      {error && (
        <Card className='border-destructive'>
          <CardContent className='pt-6'>
            <p className='text-destructive text-sm'>{error}</p>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {/* Datos Personales */}
        <Card>
          <CardHeader>
            <CardTitle>Datos Personales</CardTitle>
            <CardDescription>Información básica del cliente</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* Campos de nombre con inferencia de género */}
            <PersonNameFields
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
              disabled={loading}
              showGender={true}
              showMaternalSurname={true}
              requiredFields={{
                name: true,
                paternal_surname: true,
                maternal_surname: false,
                gender: false,
              }}
              labels={{
                name: 'Nombre(s)',
                paternal_surname: 'Apellido Paterno',
                maternal_surname: 'Apellido Materno',
                gender: 'Género',
              }}
              placeholders={{
                name: 'Juan',
                paternal_surname: 'Pérez',
                maternal_surname: 'García',
              }}
            />

            {/* Otros datos personales */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='birth_date'>Fecha de Nacimiento</Label>
                <Input
                  id='birth_date'
                  type='date'
                  {...register('birth_date', {
                    validate: (value) => {
                      if (!value) return true;
                      const selectedDate = new Date(value);
                      const today = new Date();
                      return selectedDate <= today || 'La fecha no puede ser futura';
                    },
                  })}
                />
                {errors.birth_date && (
                  <p className='text-sm text-destructive'>{errors.birth_date.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='occupation'>Ocupación</Label>
                <Input
                  id='occupation'
                  {...register('occupation', {
                    minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                    maxLength: { value: 100, message: 'Máximo 100 caracteres' },
                  })}
                  placeholder='Ingeniero'
                />
                {errors.occupation && (
                  <p className='text-sm text-destructive'>{errors.occupation.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='marital_status'>Estado Civil</Label>
                <Select
                  onValueChange={(value) => setValue('marital_status', value)}
                  defaultValue={watch('marital_status')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Selecciona...' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Soltero'>Soltero</SelectItem>
                    <SelectItem value='Casado'>Casado</SelectItem>
                    <SelectItem value='Divorciado'>Divorciado</SelectItem>
                    <SelectItem value='Viudo'>Viudo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Datos de Contacto */}
        <Card>
          <CardHeader>
            <CardTitle>Datos de Contacto</CardTitle>
            <CardDescription>Información para comunicarse con el cliente</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='phone'>
                  Teléfono <span className='text-destructive'>*</span>
                </Label>
                <Input
                  id='phone'
                  {...register('phone', {
                    required: 'El teléfono es obligatorio',
                    pattern: {
                      value: /^\d{10,15}$/,
                      message: 'Debe tener entre 10 y 15 dígitos',
                    },
                  })}
                  placeholder='5512345678'
                />
                {errors.phone && (
                  <p className='text-sm text-destructive'>{errors.phone.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  {...register('email', {
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Email inválido',
                    },
                  })}
                  placeholder='cliente@ejemplo.com'
                />
                {errors.email && (
                  <p className='text-sm text-destructive'>{errors.email.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dirección */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <MapPin className='h-5 w-5' />
              Dirección
            </CardTitle>
            <CardDescription>Ubicación del cliente (opcional pero recomendado para análisis)</CardDescription>
          </CardHeader>
          <CardContent>
            <GeographicSelector
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
              disabled={loading}
              showStreetFields={true}
              required={false}
            />
          </CardContent>
        </Card>

        {/* Datos de Salud */}
        <Card>
          <CardHeader>
            <CardTitle>Información de Salud</CardTitle>
            <CardDescription>Condiciones médicas relevantes</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex flex-col sm:flex-row gap-4'>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='diabetes'
                  checked={watch('diabetes')}
                  onCheckedChange={(checked) => setValue('diabetes', checked)}
                />
                <Label htmlFor='diabetes' className='cursor-pointer'>
                  Diabetes
                </Label>
              </div>

              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='hypertension'
                  checked={watch('hypertension')}
                  onCheckedChange={(checked) => setValue('hypertension', checked)}
                />
                <Label htmlFor='hypertension' className='cursor-pointer'>
                  Hipertensión
                </Label>
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='medical_conditions'>Otras Condiciones Médicas</Label>
              <textarea
                id='medical_conditions'
                {...register('medical_conditions')}
                className='w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                placeholder='Describe otras condiciones médicas relevantes...'
              />
            </div>
          </CardContent>
        </Card>

        {/* Marketing y Notas */}
        <Card>
          <CardHeader>
            <CardTitle>Información Adicional</CardTitle>
            <CardDescription>Marketing y notas del cliente</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='marketing_source'>¿Cómo nos conoció?</Label>
                <Select
                  onValueChange={(value) => setValue('marketing_source', value)}
                  defaultValue={watch('marketing_source')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Selecciona...' />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Boca a boca */}
                    <SelectItem value='Referido'>Referido (amigo/familiar)</SelectItem>
                    <SelectItem value='Recomendación Médica'>Recomendación Médica</SelectItem>
                    {/* Digital */}
                    <SelectItem value='Facebook'>Facebook</SelectItem>
                    <SelectItem value='Instagram'>Instagram</SelectItem>
                    <SelectItem value='Google'>Google (búsqueda/anuncios)</SelectItem>
                    <SelectItem value='Google Maps'>Google Maps</SelectItem>
                    <SelectItem value='TikTok'>TikTok</SelectItem>
                    {/* Tradicional */}
                    <SelectItem value='Publicidad Exterior'>Publicidad Exterior</SelectItem>
                    <SelectItem value='Ubicación'>Pasó por la zona</SelectItem>
                    {/* Otro */}
                    <SelectItem value='Otro'>Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='hobbies'>Pasatiempos</Label>
                <Input
                  id='hobbies'
                  {...register('hobbies')}
                  placeholder='Lectura, deportes, etc.'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='additional_notes'>Notas Adicionales</Label>
              <textarea
                id='additional_notes'
                {...register('additional_notes')}
                className='w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                placeholder='Notas adicionales sobre el cliente...'
              />
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className='flex justify-end gap-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => navigate('/customers')}
          >
            Cancelar
          </Button>
          <Button type='submit' disabled={loading}>
            {loading ? (
              <>
                <span className='animate-spin mr-2'>⏳</span>
                Guardando...
              </>
            ) : (
              <>
                <Save className='h-4 w-4 mr-2' />
                {mode === 'create' ? 'Crear Cliente' : 'Guardar Cambios'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;
