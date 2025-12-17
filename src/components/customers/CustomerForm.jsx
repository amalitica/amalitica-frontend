import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, ChevronsUpDown, Check, Search, AlertCircle, MapPin } from 'lucide-react';
import {
  createCustomer,
  updateCustomer,
  getCustomerById,
} from '@/api/customers';
import {
  getStates,
  getMunicipalitiesByState,
  lookupByPostalCode,
  getPostalCodesByMunicipality,
} from '@/api/catalogs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const CustomerForm = ({ mode = 'create' }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(mode === 'edit');
  const [error, setError] = useState(null);

  // Modo de entrada de ubicación: 'postal_code' o 'state_municipality'
  const [locationMode, setLocationMode] = useState('postal_code');

  // Estados para catálogos geográficos
  const [states, setStates] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [postalCodes, setPostalCodes] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingMunicipalities, setLoadingMunicipalities] = useState(false);
  const [loadingPostalCodes, setLoadingPostalCodes] = useState(false);
  const [loadingSettlements, setLoadingSettlements] = useState(false);
  const [postalCodeError, setPostalCodeError] = useState('');
  const [customSettlement, setCustomSettlement] = useState(false);

  // Popover states
  const [stateOpen, setStateOpen] = useState(false);
  const [municipalityOpen, setMunicipalityOpen] = useState(false);
  const [postalCodeOpen, setPostalCodeOpen] = useState(false);
  const [settlementOpen, setSettlementOpen] = useState(false);

  // Search filters para los popovers
  const [stateSearch, setStateSearch] = useState('');
  const [municipalitySearch, setMunicipalitySearch] = useState('');
  const [postalCodeSearch, setPostalCodeSearch] = useState('');
  const [settlementSearch, setSettlementSearch] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues,
  } = useForm({
    defaultValues: {
      name: '',
      paternal_surname: '',
      maternal_surname: '',
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
      // Otros
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

  const watchedStateId = watch('state_id');
  const watchedMunicipalityId = watch('municipality_id');
  const watchedPostalCode = watch('postal_code');
  const watchedSettlementId = watch('settlement_id');

  // Cargar estados al montar
  useEffect(() => {
    loadStates();
  }, []);

  // Cargar datos del cliente si estamos en modo edición
  useEffect(() => {
    if (mode === 'edit' && id) {
      loadCustomerData();
    }
  }, [mode, id]);

  // Cargar municipios cuando cambia el estado (modo state_municipality)
  useEffect(() => {
    if (locationMode === 'state_municipality' && watchedStateId) {
      loadMunicipalities(watchedStateId);
    }
  }, [watchedStateId, locationMode]);

  // Cargar códigos postales cuando cambia el municipio (modo state_municipality)
  useEffect(() => {
    if (locationMode === 'state_municipality' && watchedMunicipalityId) {
      loadPostalCodes(watchedMunicipalityId);
    }
  }, [watchedMunicipalityId, locationMode]);

  const loadStates = async () => {
    try {
      setLoadingStates(true);
      const data = await getStates();
      setStates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar estados:', err);
    } finally {
      setLoadingStates(false);
    }
  };

  const loadMunicipalities = async (stateId) => {
    try {
      setLoadingMunicipalities(true);
      const data = await getMunicipalitiesByState(stateId);
      setMunicipalities(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar municipios:', err);
    } finally {
      setLoadingMunicipalities(false);
    }
  };

  const loadPostalCodes = async (municipalityId) => {
    try {
      setLoadingPostalCodes(true);
      const data = await getPostalCodesByMunicipality(municipalityId);
      setPostalCodes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar códigos postales:', err);
    } finally {
      setLoadingPostalCodes(false);
    }
  };

  const loadSettlementsByPostalCode = async (postalCode) => {
    try {
      setLoadingSettlements(true);
      setPostalCodeError('');
      const data = await lookupByPostalCode(postalCode);
      
      if (data && data.settlements && data.settlements.length > 0) {
        setSettlements(data.settlements);
        // En modo postal_code, autocompletar estado y municipio
        if (locationMode === 'postal_code') {
          setValue('state_id', data.state?.id || null);
          setValue('municipality_id', data.municipality?.id || null);
        }
      } else {
        setPostalCodeError('Código postal no encontrado');
        setSettlements([]);
      }
    } catch (err) {
      console.error('Error al buscar código postal:', err);
      setPostalCodeError('Error al buscar código postal');
      setSettlements([]);
    } finally {
      setLoadingSettlements(false);
    }
  };

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

      // Si tiene datos geográficos, cargar los catálogos correspondientes
      if (customer.state_id) {
        await loadMunicipalities(customer.state_id);
      }
      if (customer.postal_code) {
        await loadSettlementsByPostalCode(customer.postal_code);
      }
    } catch (err) {
      console.error('Error al cargar cliente:', err);
      setError('Error al cargar los datos del cliente');
    } finally {
      setLoadingData(false);
    }
  };

  // Handler para cambio de código postal (modo postal_code)
  const handlePostalCodeChange = async (value) => {
    setValue('postal_code', value);
    if (value.length === 5) {
      await loadSettlementsByPostalCode(value);
    } else {
      setSettlements([]);
      setValue('state_id', null);
      setValue('municipality_id', null);
      setValue('settlement_id', null);
    }
  };

  // Handler para cambio de código postal en modo state_municipality
  const handlePostalCodeSelect = async (postalCode) => {
    setValue('postal_code', postalCode);
    setPostalCodeOpen(false);
    await loadSettlementsByPostalCode(postalCode);
  };

  // Handler para cambio de modo de ubicación
  const handleLocationModeChange = (newMode) => {
    setLocationMode(newMode);
    // Limpiar datos geográficos al cambiar de modo
    setValue('postal_code', '');
    setValue('state_id', null);
    setValue('municipality_id', null);
    setValue('settlement_id', null);
    setValue('settlement_custom', '');
    setSettlements([]);
    setMunicipalities([]);
    setPostalCodes([]);
    setPostalCodeError('');
    setCustomSettlement(false);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);

      // Preparar datos para enviar
      const submitData = { ...data };
      
      // Si usa colonia personalizada, enviar settlement_custom
      if (customSettlement && data.settlement_custom) {
        submitData.settlement_id = null;
      } else {
        delete submitData.settlement_custom;
      }

      // Limpiar campos vacíos opcionales
      const cleanedData = Object.fromEntries(
        Object.entries(submitData).filter(
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
      setError(
        err.response?.data?.detail ||
        `Error al ${mode === 'create' ? 'crear' : 'actualizar'} el cliente`
      );
    } finally {
      setLoading(false);
    }
  };

  // Filtrar opciones para los popovers
  const filteredStates = states.filter(state =>
    state.name.toLowerCase().includes(stateSearch.toLowerCase())
  );
  const filteredMunicipalities = municipalities.filter(muni =>
    muni.name.toLowerCase().includes(municipalitySearch.toLowerCase())
  );
  const filteredPostalCodes = postalCodes.filter(pc =>
    pc.postal_code.includes(postalCodeSearch)
  );
  const filteredSettlements = settlements.filter(s =>
    s.name.toLowerCase().includes(settlementSearch.toLowerCase())
  );

  // Obtener nombres para mostrar
  const selectedStateName = states.find(s => s.id === watchedStateId)?.name || '';
  const selectedMunicipalityName = municipalities.find(m => m.id === watchedMunicipalityId)?.name || '';
  const selectedSettlementName = settlements.find(s => s.id === watchedSettlementId)?.name || '';

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
                  <p className='text-sm text-destructive'>{errors.name.message}</p>
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
                  <p className='text-sm text-destructive'>{errors.paternal_surname.message}</p>
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
                  <p className='text-sm text-destructive'>{errors.maternal_surname.message}</p>
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
          <CardContent className='space-y-6'>
            {/* Selector de modo de ubicación */}
            <div className='space-y-3'>
              <Label>¿Cómo prefieres ingresar la ubicación?</Label>
              <RadioGroup
                value={locationMode}
                onValueChange={handleLocationModeChange}
                className='flex flex-col sm:flex-row gap-4'
              >
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='postal_code' id='mode_cp' />
                  <Label htmlFor='mode_cp' className='cursor-pointer font-normal'>
                    Conozco el Código Postal
                  </Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='state_municipality' id='mode_state' />
                  <Label htmlFor='mode_state' className='cursor-pointer font-normal'>
                    Seleccionar Estado y Municipio
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Modo: Código Postal primero */}
            {locationMode === 'postal_code' && (
              <div className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='postal_code'>Código Postal</Label>
                    <Input
                      id='postal_code'
                      value={watchedPostalCode || ''}
                      onChange={(e) => handlePostalCodeChange(e.target.value.replace(/\D/g, '').slice(0, 5))}
                      placeholder='Ej: 06600'
                      maxLength={5}
                    />
                    {postalCodeError && (
                      <p className='text-sm text-destructive flex items-center gap-1'>
                        <AlertCircle className='h-3 w-3' />
                        {postalCodeError}
                      </p>
                    )}
                    <p className='text-xs text-muted-foreground'>
                      El estado y municipio se completarán automáticamente
                    </p>
                  </div>
                </div>

                {/* Estado y Municipio (solo lectura) */}
                {watchedStateId && (
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label>Estado</Label>
                      <Input value={selectedStateName} disabled className='bg-muted' />
                    </div>
                    <div className='space-y-2'>
                      <Label>Municipio</Label>
                      <Input value={selectedMunicipalityName} disabled className='bg-muted' />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Modo: Estado/Municipio primero */}
            {locationMode === 'state_municipality' && (
              <div className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {/* Estado */}
                  <div className='space-y-2'>
                    <Label>Estado</Label>
                    <Popover open={stateOpen} onOpenChange={setStateOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant='outline'
                          role='combobox'
                          className='w-full justify-between font-normal'
                          disabled={loadingStates}
                        >
                          {watchedStateId ? selectedStateName : 'Selecciona un estado...'}
                          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className='w-full p-0' align='start'>
                        <div className='p-2'>
                          <div className='flex items-center border-b px-2 pb-2'>
                            <Search className='h-4 w-4 mr-2 opacity-50' />
                            <input
                              className='flex-1 bg-transparent outline-none text-sm'
                              placeholder='Buscar estado...'
                              value={stateSearch}
                              onChange={(e) => setStateSearch(e.target.value)}
                            />
                          </div>
                          <div className='max-h-60 overflow-y-auto mt-2'>
                            {filteredStates.map((state) => (
                              <div
                                key={state.id}
                                className={cn(
                                  'flex items-center px-2 py-2 cursor-pointer rounded hover:bg-accent',
                                  watchedStateId === state.id && 'bg-accent'
                                )}
                                onClick={() => {
                                  setValue('state_id', state.id);
                                  setValue('municipality_id', null);
                                  setValue('postal_code', '');
                                  setValue('settlement_id', null);
                                  setMunicipalities([]);
                                  setPostalCodes([]);
                                  setSettlements([]);
                                  setStateOpen(false);
                                }}
                              >
                                <Check className={cn('mr-2 h-4 w-4', watchedStateId === state.id ? 'opacity-100' : 'opacity-0')} />
                                {state.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Municipio */}
                  <div className='space-y-2'>
                    <Label>Municipio</Label>
                    <Popover open={municipalityOpen} onOpenChange={setMunicipalityOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant='outline'
                          role='combobox'
                          className='w-full justify-between font-normal'
                          disabled={!watchedStateId || loadingMunicipalities}
                        >
                          {watchedMunicipalityId ? selectedMunicipalityName : 'Selecciona un municipio...'}
                          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className='w-full p-0' align='start'>
                        <div className='p-2'>
                          <div className='flex items-center border-b px-2 pb-2'>
                            <Search className='h-4 w-4 mr-2 opacity-50' />
                            <input
                              className='flex-1 bg-transparent outline-none text-sm'
                              placeholder='Buscar municipio...'
                              value={municipalitySearch}
                              onChange={(e) => setMunicipalitySearch(e.target.value)}
                            />
                          </div>
                          <div className='max-h-60 overflow-y-auto mt-2'>
                            {filteredMunicipalities.map((muni) => (
                              <div
                                key={muni.id}
                                className={cn(
                                  'flex items-center px-2 py-2 cursor-pointer rounded hover:bg-accent',
                                  watchedMunicipalityId === muni.id && 'bg-accent'
                                )}
                                onClick={() => {
                                  setValue('municipality_id', muni.id);
                                  setValue('postal_code', '');
                                  setValue('settlement_id', null);
                                  setPostalCodes([]);
                                  setSettlements([]);
                                  setMunicipalityOpen(false);
                                }}
                              >
                                <Check className={cn('mr-2 h-4 w-4', watchedMunicipalityId === muni.id ? 'opacity-100' : 'opacity-0')} />
                                {muni.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Código Postal (desplegable) */}
                {watchedMunicipalityId && (
                  <div className='space-y-2'>
                    <Label>Código Postal</Label>
                    <Popover open={postalCodeOpen} onOpenChange={setPostalCodeOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant='outline'
                          role='combobox'
                          className='w-full justify-between font-normal'
                          disabled={loadingPostalCodes}
                        >
                          {watchedPostalCode || 'Selecciona un código postal...'}
                          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className='w-full p-0' align='start'>
                        <div className='p-2'>
                          <div className='flex items-center border-b px-2 pb-2'>
                            <Search className='h-4 w-4 mr-2 opacity-50' />
                            <input
                              className='flex-1 bg-transparent outline-none text-sm'
                              placeholder='Buscar CP...'
                              value={postalCodeSearch}
                              onChange={(e) => setPostalCodeSearch(e.target.value)}
                            />
                          </div>
                          <div className='max-h-60 overflow-y-auto mt-2'>
                            {filteredPostalCodes.map((pc) => (
                              <div
                                key={pc.postal_code}
                                className={cn(
                                  'flex items-center justify-between px-2 py-2 cursor-pointer rounded hover:bg-accent',
                                  watchedPostalCode === pc.postal_code && 'bg-accent'
                                )}
                                onClick={() => handlePostalCodeSelect(pc.postal_code)}
                              >
                                <div className='flex items-center'>
                                  <Check className={cn('mr-2 h-4 w-4', watchedPostalCode === pc.postal_code ? 'opacity-100' : 'opacity-0')} />
                                  {pc.postal_code}
                                </div>
                                <span className='text-xs text-muted-foreground'>
                                  {pc.settlement_count} colonias
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </div>
            )}

            {/* Colonia (común para ambos modos) */}
            {settlements.length > 0 && (
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <Label>Colonia</Label>
                  <Popover open={settlementOpen} onOpenChange={setSettlementOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant='outline'
                        role='combobox'
                        className='w-full justify-between font-normal'
                        disabled={customSettlement}
                      >
                        {watchedSettlementId ? selectedSettlementName : 'Selecciona una colonia...'}
                        <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-full p-0' align='start'>
                      <div className='p-2'>
                        <div className='flex items-center border-b px-2 pb-2'>
                          <Search className='h-4 w-4 mr-2 opacity-50' />
                          <input
                            className='flex-1 bg-transparent outline-none text-sm'
                            placeholder='Buscar colonia...'
                            value={settlementSearch}
                            onChange={(e) => setSettlementSearch(e.target.value)}
                          />
                        </div>
                        <div className='max-h-60 overflow-y-auto mt-2'>
                          {filteredSettlements.map((settlement) => (
                            <div
                              key={settlement.id}
                              className={cn(
                                'flex items-center px-2 py-2 cursor-pointer rounded hover:bg-accent',
                                watchedSettlementId === settlement.id && 'bg-accent'
                              )}
                              onClick={() => {
                                setValue('settlement_id', settlement.id);
                                setSettlementOpen(false);
                              }}
                            >
                              <Check className={cn('mr-2 h-4 w-4', watchedSettlementId === settlement.id ? 'opacity-100' : 'opacity-0')} />
                              <div>
                                <div>{settlement.name}</div>
                                {settlement.settlement_type && (
                                  <div className='text-xs text-muted-foreground'>{settlement.settlement_type}</div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Checkbox para colonia personalizada */}
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='custom_settlement'
                    checked={customSettlement}
                    onCheckedChange={(checked) => {
                      setCustomSettlement(checked);
                      if (checked) {
                        setValue('settlement_id', null);
                      } else {
                        setValue('settlement_custom', '');
                      }
                    }}
                  />
                  <Label htmlFor='custom_settlement' className='cursor-pointer font-normal text-sm'>
                    Mi colonia no aparece en la lista
                  </Label>
                </div>

                {customSettlement && (
                  <div className='space-y-2'>
                    <Label htmlFor='settlement_custom'>Nombre de tu colonia</Label>
                    <Input
                      id='settlement_custom'
                      {...register('settlement_custom', {
                        minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                        maxLength: { value: 200, message: 'Máximo 200 caracteres' },
                      })}
                      placeholder='Escribe el nombre de tu colonia'
                    />
                    {errors.settlement_custom && (
                      <p className='text-sm text-destructive'>{errors.settlement_custom.message}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Calle y Número */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='space-y-2 md:col-span-1'>
                <Label htmlFor='street'>Calle</Label>
                <Input
                  id='street'
                  {...register('street', {
                    maxLength: { value: 300, message: 'Máximo 300 caracteres' },
                  })}
                  placeholder='Av. Insurgentes Sur'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='exterior_number'>Número Ext.</Label>
                <Input
                  id='exterior_number'
                  {...register('exterior_number', {
                    maxLength: { value: 20, message: 'Máximo 20 caracteres' },
                  })}
                  placeholder='1234'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='interior_number'>Número Int.</Label>
                <Input
                  id='interior_number'
                  {...register('interior_number', {
                    maxLength: { value: 20, message: 'Máximo 20 caracteres' },
                  })}
                  placeholder='Local 5'
                />
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
                <Checkbox
                  id='diabetes'
                  {...register('diabetes')}
                  onCheckedChange={(checked) => setValue('diabetes', checked)}
                />
                <Label htmlFor='diabetes' className='cursor-pointer'>
                  Diabetes
                </Label>
              </div>

              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='hypertension'
                  {...register('hypertension')}
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
                    <SelectItem value='Recomendacion'>Recomendación</SelectItem>
                    <SelectItem value='RedesSociales'>Redes Sociales</SelectItem>
                    <SelectItem value='PublicidadExterior'>Publicidad Exterior</SelectItem>
                    <SelectItem value='BuscadorInternet'>Buscador de Internet</SelectItem>
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
