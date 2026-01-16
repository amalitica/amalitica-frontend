// src/components/customers/CustomerForm.jsx
/**
 * Formulario de creación/edición de clientes (pacientes).
 *
 * Refactorizado para usar componentes reutilizables:
 * - PersonNameFields: Captura nombre, apellidos y género con inferencia automática
 * - GeographicSelector: Captura datos geográficos basados en SEPOMEX
 * - ConsentModal: Modal de consentimiento LFPDPPP (solo en modo creación)
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, MapPin } from 'lucide-react';
import {
  createCustomer,
  updateCustomer,
  getCustomerById,
  getCustomerEnums,
} from '@/api/customers';
import { createConsent } from '@/api/compliance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Combobox } from '@/components/ui/combobox';
import { MultiSelect } from '@/components/ui/multi-select';
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
import { ConsentModal } from '@/components/compliance';
import useAuth from '@/hooks/useAuth';

const CustomerForm = ({ mode = 'create' }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(mode === 'edit');
  const [error, setError] = useState(null);

  // Estados para el modal de consentimiento
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [pendingCustomerData, setPendingCustomerData] = useState(null);

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
      education_level: '',
      // Marketing
      marketing_source: '',
      hobbies: [],
      // Salud
      diabetes: null,
      hypertension: null,
      medical_conditions: '',
      // Notas
      additional_notes: '',
    },
  });

  // Estado para los enums
  const [enums, setEnums] = useState(null);

  // Obtener información del usuario autenticado
  const { user } = useAuth();

  // Cargar enums al montar el componente
  useEffect(() => {
    getCustomerEnums()
      .then((response) => setEnums(response.data))
      .catch((error) => console.error('Error al cargar enums:', error));
  }, []);

  // Pre-llenar campos geográficos con datos del branch del usuario (solo en modo creación)
  useEffect(() => {
    if (mode === 'create' && user?.branch) {
      // Pre-llenar estado y municipio con los datos de la sucursal del usuario
      setValue('state_id', user.branch.state_id);
      setValue('municipality_id', user.branch.municipality_id);
      setValue('postal_code', user.branch.postal_code);
      
      // Nota: settlement_id se llenará automáticamente cuando el usuario
      // seleccione el código postal en el GeographicSelector
    }
  }, [mode, user, setValue]);

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
        } else if (key === 'hobbies') {
          // Hobbies es un array
          setValue(key, customer[key] || []);
        } else if (key === 'diabetes' || key === 'hypertension') {
          // Campos booleanos nullable: mantener null si es null
          setValue(key, customer[key]);
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

  /**
   * Maneja el envío del formulario.
   * En modo creación, abre el modal de consentimiento.
   * En modo edición, actualiza directamente.
   */
  const onSubmit = async (data) => {
    // Limpiar datos antes de enviar
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) => value !== '' && value !== null && value !== undefined
      )
    );

    // Validar datos geográficos: si no hay settlement_id, eliminar todos los campos de ubicación
    // Esto evita enviar datos parciales o genéricos que ensuciarían la base de datos
    if (!cleanedData.settlement_id && !cleanedData.settlement_custom) {
      // Eliminar todos los campos geográficos si no se seleccionó una colonia
      delete cleanedData.state_id;
      delete cleanedData.municipality_id;
      delete cleanedData.settlement_id;
      delete cleanedData.settlement_custom;
      delete cleanedData.postal_code;
      delete cleanedData.street;
      delete cleanedData.exterior_number;
      delete cleanedData.interior_number;
    }

    if (mode === 'create') {
      // Guardar los datos y abrir el modal de consentimiento
      setPendingCustomerData(cleanedData);
      setShowConsentModal(true);
    } else {
      // Modo edición: actualizar directamente
      await updateCustomerData(cleanedData);
    }
  };

  /**
   * Actualiza los datos del cliente (modo edición).
   */
  const updateCustomerData = async (data) => {
    setLoading(true);
    setError(null);

    try {
      await updateCustomer(id, data);
      navigate('/customers');
    } catch (err) {
      console.error('Error al actualizar cliente:', err);
      handleApiError(err, 'actualizar');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja la aceptación del consentimiento.
   * Crea el cliente y luego registra el consentimiento.
   */
  const handleConsent = async (consentData) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Crear el cliente
      const customerResponse = await createCustomer(pendingCustomerData);
      const newCustomer = customerResponse.data || customerResponse;
      const customerId = newCustomer.id;

      // 2. Registrar el consentimiento
      const consentPayload = {
        primary_consent: consentData.primaryConsent,
        secondary_consent: consentData.secondaryConsent,
        consent_method: consentData.consentMethod,
        // El backend capturará automáticamente la IP y user_agent
      };

      await createConsent(customerId, consentPayload);

      // 3. Cerrar el modal y navegar a la lista de clientes
      setShowConsentModal(false);
      navigate('/customers');
    } catch (err) {
      console.error('Error al crear cliente o consentimiento:', err);
      handleApiError(err, 'crear');
      // Mantener el modal abierto para que el usuario pueda reintentar
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja errores de la API de forma consistente.
   */
  const handleApiError = (err, action) => {
    let errorMessage = `Error al ${action} el cliente`;

    if (err.response?.data?.detail) {
      const detail = err.response.data.detail;
      // Si detail es un array (errores de validación de Pydantic)
      if (Array.isArray(detail)) {
        errorMessage = detail
          .map((e) => e.msg || e.message || JSON.stringify(e))
          .join(', ');
      } else if (typeof detail === 'string') {
        errorMessage = detail;
      } else if (typeof detail === 'object') {
        errorMessage = detail.msg || detail.message || JSON.stringify(detail);
      }
    }

    setError(errorMessage);
  };

  /**
   * Maneja el cierre del modal de consentimiento.
   */
  const handleConsentModalClose = (open) => {
    setShowConsentModal(open);
    if (!open) {
      // Si se cierra el modal sin completar, limpiar los datos pendientes
      setPendingCustomerData(null);
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
    <div className='space-y-6 mx-auto pb-8'>
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
                <Combobox
                  options={
                    enums?.occupation?.map((occ) => ({
                      value: occ,
                      label: occ,
                    })) || []
                  }
                  value={watch('occupation')}
                  onValueChange={(value) => setValue('occupation', value)}
                  placeholder='Selecciona una ocupación...'
                  searchPlaceholder='Buscar ocupación...'
                  emptyText='No se encontró la ocupación.'
                  disabled={loading}
                />
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
                  <SelectContent position='popper'>
                    {enums?.marital_status?.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='education_level'>Nivel de Educación</Label>
                <Select
                  onValueChange={(value) => setValue('education_level', value)}
                  defaultValue={watch('education_level')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Selecciona...' />
                  </SelectTrigger>
                  <SelectContent position='popper'>
                    {enums?.education_level?.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
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
                      message: 'Debe ser un número de 10 a 15 dígitos',
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
                <Label htmlFor='email'>Correo Electrónico</Label>
                <Input
                  id='email'
                  type='email'
                  {...register('email', {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Correo electrónico inválido',
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
            </div>
          </CardContent>
        </Card>

        {/* Domicilio */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <MapPin className='h-5 w-5' />
              Domicilio
            </CardTitle>
            <CardDescription>
              Dirección del cliente basada en SEPOMEX
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GeographicSelector
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
              disabled={loading}
              defaultMode="state_municipality"
              requiredFields={{
                postal_code: false,
                state: false,
                municipality: false,
                settlement: false,
                street: false,
                exterior_number: false,
              }}
            />
          </CardContent>
        </Card>

        {/* Marketing */}
        <Card>
          <CardHeader>
            <CardTitle>Marketing</CardTitle>
            <CardDescription>
              Información sobre cómo llegó el cliente
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
                <SelectContent position='popper'>
                  {enums?.marketing_source?.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='hobbies'>Pasatiempos e Intereses</Label>
              <MultiSelect
                options={
                  enums?.hobbies?.map((hobby) => ({
                    value: hobby,
                    label: hobby,
                  })) || []
                }
                value={watch('hobbies') || []}
                onValueChange={(value) => setValue('hobbies', value)}
                placeholder='Selecciona pasatiempos...'
                searchPlaceholder='Buscar pasatiempo...'
                emptyText='No se encontró el pasatiempo.'
                disabled={loading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Salud */}
        <Card>
          <CardHeader>
            <CardTitle>Información de Salud</CardTitle>
            <CardDescription>Condiciones médicas relevantes</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-3'>
                <Label>¿Tiene Diabetes?</Label>
                <RadioGroup
                  value={
                    watch('diabetes') === true
                      ? 'true'
                      : watch('diabetes') === false
                      ? 'false'
                      : 'null'
                  }
                  onValueChange={(value) => {
                    if (value === 'true') setValue('diabetes', true);
                    else if (value === 'false') setValue('diabetes', false);
                    else setValue('diabetes', null);
                  }}
                >
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='true' id='diabetes-yes' />
                    <Label htmlFor='diabetes-yes' className='cursor-pointer font-normal'>
                      Sí
                    </Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='false' id='diabetes-no' />
                    <Label htmlFor='diabetes-no' className='cursor-pointer font-normal'>
                      No
                    </Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='null' id='diabetes-prefer-not' />
                    <Label htmlFor='diabetes-prefer-not' className='cursor-pointer font-normal'>
                      Prefiero no decir
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className='space-y-3'>
                <Label>¿Tiene Hipertensión?</Label>
                <RadioGroup
                  value={
                    watch('hypertension') === true
                      ? 'true'
                      : watch('hypertension') === false
                      ? 'false'
                      : 'null'
                  }
                  onValueChange={(value) => {
                    if (value === 'true') setValue('hypertension', true);
                    else if (value === 'false') setValue('hypertension', false);
                    else setValue('hypertension', null);
                  }}
                >
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='true' id='hypertension-yes' />
                    <Label htmlFor='hypertension-yes' className='cursor-pointer font-normal'>
                      Sí
                    </Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='false' id='hypertension-no' />
                    <Label htmlFor='hypertension-no' className='cursor-pointer font-normal'>
                      No
                    </Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='null' id='hypertension-prefer-not' />
                    <Label htmlFor='hypertension-prefer-not' className='cursor-pointer font-normal'>
                      Prefiero no decir
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='medical_conditions'>
                Otras Condiciones Médicas
              </Label>
              <Input
                id='medical_conditions'
                {...register('medical_conditions', {
                  maxLength: { value: 500, message: 'Máximo 500 caracteres' },
                })}
                placeholder='Alergias, medicamentos, cirugías previas...'
              />
              {errors.medical_conditions && (
                <p className='text-sm text-destructive'>
                  {errors.medical_conditions.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notas Adicionales */}
        <Card>
          <CardHeader>
            <CardTitle>Notas Adicionales</CardTitle>
            <CardDescription>Información adicional relevante</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <Label htmlFor='additional_notes'>Notas</Label>
              <Input
                id='additional_notes'
                {...register('additional_notes', {
                  maxLength: { value: 1000, message: 'Máximo 1000 caracteres' },
                })}
                placeholder='Información adicional sobre el cliente...'
              />
              {errors.additional_notes && (
                <p className='text-sm text-destructive'>
                  {errors.additional_notes.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className='flex justify-end gap-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => navigate('/customers')}
            disabled={loading}
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
                {mode === 'create' ? 'Continuar' : 'Guardar Cambios'}
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Modal de Consentimiento (solo en modo creación) */}
      {mode === 'create' && (
        <ConsentModal
          open={showConsentModal}
          onOpenChange={handleConsentModalClose}
          onConsent={handleConsent}
          customerName={
            pendingCustomerData
              ? `${pendingCustomerData.name || ''} ${pendingCustomerData.paternal_surname || ''}`.trim()
              : ''
          }
          isLoading={loading}
        />
      )}
    </div>
  );
};

export default CustomerForm;
