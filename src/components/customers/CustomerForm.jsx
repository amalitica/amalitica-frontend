import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import {
  createCustomer,
  updateCustomer,
  getCustomerById,
} from '@/api/customers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  } = useForm({
    defaultValues: {
      name: '',
      paternal_surname: '',
      maternal_surname: '',
      phone: '',
      email: '',
      birth_date: '',
      postal_code: '',
      colony: '',
      marital_status: '',
      occupation: '',
      marketing_source: '',
      diabetes: false,
      hypertension: false,
      hobbies: '',
      medical_conditions: '',
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
      const customer = response.data;

      // Llenar el formulario con los datos del cliente
      Object.keys(customer).forEach((key) => {
        if (key === 'birth_date' && customer[key]) {
          // Convertir fecha a formato YYYY-MM-DD para el input
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
    try {
      setLoading(true);
      setError(null);

      // Limpiar campos vacíos opcionales
      const cleanedData = Object.fromEntries(
        Object.entries(data).filter(
          ([_, value]) => value !== '' && value !== null
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
      setError(
        err.response?.data?.detail ||
        `Error al ${mode === 'create' ? 'crear' : 'actualizar'} el cliente`
      );
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
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>
                  Nombre(s) <span className='text-destructive'>*</span>
                </Label>
                <Input
                  id='name'
                  {...register('name', {
                    required: 'El nombre es obligatorio',
                    minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                    maxLength: { value: 200, message: 'Máximo 200 caracteres' },
                  })}
                  placeholder='Juan'
                />
                {errors.name && (
                  <p className='text-sm text-destructive'>
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='paternal_surname'>
                  Apellido Paterno <span className='text-destructive'>*</span>
                </Label>
                <Input
                  id='paternal_surname'
                  {...register('paternal_surname', {
                    required: 'El apellido paterno es obligatorio',
                    minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                    maxLength: { value: 200, message: 'Máximo 200 caracteres' },
                  })}
                  placeholder='Pérez'
                />
                {errors.paternal_surname && (
                  <p className='text-sm text-destructive'>
                    {errors.paternal_surname.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='maternal_surname'>Apellido Materno</Label>
                <Input
                  id='maternal_surname'
                  {...register('maternal_surname', {
                    minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                    maxLength: { value: 200, message: 'Máximo 200 caracteres' },
                  })}
                  placeholder='García'
                />
                {errors.maternal_surname && (
                  <p className='text-sm text-destructive'>
                    {errors.maternal_surname.message}
                  </p>
                )}
              </div>

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
                      return (
                        selectedDate <= today || 'La fecha no puede ser futura'
                      );
                    },
                  })}
                />
                {errors.birth_date && (
                  <p className='text-sm text-destructive'>
                    {errors.birth_date.message}
                  </p>
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
                  <p className='text-sm text-destructive'>
                    {errors.occupation.message}
                  </p>
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
            <CardDescription>
              Información para comunicarse con el cliente
            </CardDescription>
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
                      message: 'Solo dígitos, entre 10 y 15 caracteres',
                    },
                  })}
                  placeholder='5512345678'
                />
                {errors.phone && (
                  <p className='text-sm text-destructive'>
                    {errors.phone.message}
                  </p>
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
                  <p className='text-sm text-destructive'>
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='postal_code'>Código Postal</Label>
                <Input
                  id='postal_code'
                  {...register('postal_code', {
                    pattern: {
                      value: /^\d{5}$/,
                      message: 'Debe tener exactamente 5 dígitos',
                    },
                  })}
                  placeholder='01234'
                  maxLength={5}
                />
                {errors.postal_code && (
                  <p className='text-sm text-destructive'>
                    {errors.postal_code.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='colony'>Colonia</Label>
                <Input
                  id='colony'
                  {...register('colony', {
                    minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                    maxLength: { value: 100, message: 'Máximo 100 caracteres' },
                  })}
                  placeholder='Centro'
                />
                {errors.colony && (
                  <p className='text-sm text-destructive'>
                    {errors.colony.message}
                  </p>
                )}
              </div>
            </div>
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
                <input
                  type='checkbox'
                  id='diabetes'
                  {...register('diabetes')}
                  className='h-4 w-4 rounded border-gray-300'
                />
                <Label htmlFor='diabetes' className='cursor-pointer'>
                  Diabetes
                </Label>
              </div>

              <div className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  id='hypertension'
                  {...register('hypertension')}
                  className='h-4 w-4 rounded border-gray-300'
                />
                <Label htmlFor='hypertension' className='cursor-pointer'>
                  Hipertensión
                </Label>
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='medical_conditions'>
                Otras Condiciones Médicas
              </Label>
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
            <CardTitle>Marketing y Notas Adicionales</CardTitle>
            <CardDescription>
              Información complementaria del cliente
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
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
                  <SelectItem value='Referido'>Referido</SelectItem>
                  <SelectItem value='Facebook'>Facebook</SelectItem>
                  <SelectItem value='Instagram'>Instagram</SelectItem>
                  <SelectItem value='Google Maps'>Google Maps</SelectItem>
                  <SelectItem value='Otro'>Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='hobbies'>Pasatiempos e Intereses</Label>
              <textarea
                id='hobbies'
                {...register('hobbies')}
                className='w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                placeholder='Deportes, lectura, música...'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='additional_notes'>Notas Adicionales</Label>
              <textarea
                id='additional_notes'
                {...register('additional_notes')}
                className='w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                placeholder='Cualquier información adicional relevante...'
              />
            </div>
          </CardContent>
        </Card>

        {/* Botones de Acción */}
        <div className='flex flex-col sm:flex-row gap-4 justify-end'>
          <Button
            type='button'
            variant='outline'
            onClick={() => navigate('/customers')}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type='submit' disabled={loading}>
            <Save className='mr-2 h-4 w-4' />
            {loading
              ? 'Guardando...'
              : mode === 'create'
                ? 'Crear Cliente'
                : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;
