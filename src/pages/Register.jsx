import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  Building2,
  User,
  MapPin,
  ChevronsUpDown,
  Check,
  AlertCircle,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import logoAmalitica from '@/assets/images/amalitica_logo.png';
import { registerTenant } from '@/api/tenants';
import apiClient from '@/api/axios';
import {
  getStates,
  getMunicipalitiesByState,
  lookupByPostalCode,
  getPostalCodesByMunicipality,
  getSettlementsByMunicipality,
  getPostalCodeBySettlement,
} from '@/api/catalogs';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

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

  // Estado del formulario
  const [formData, setFormData] = useState({
    // Datos del negocio
    business_name: '',
    // Datos de la sucursal (geográficos)
    branch_name: 'Matriz',
    branch_postal_code: '',
    branch_state_id: null,
    branch_municipality_id: null,
    branch_settlement_id: null,
    branch_settlement_custom: '',
    branch_street: '',
    branch_exterior_number: '',
    branch_interior_number: '',
    // Datos del administrador
    admin_name: '',
    admin_email: '',
    admin_phone: '',
    admin_password: '',
    admin_password_confirmation: '',
  });

  // Cargar estados al montar el componente
  useEffect(() => {
    const loadStates = async () => {
      try {
        const data = await getStates();
        setStates(data);
      } catch (err) {
        console.error('Error cargando estados:', err);
      } finally {
        setLoadingStates(false);
      }
    };
    loadStates();
  }, []);

  // Cargar municipios cuando cambia el estado (solo en modo state_municipality)
  useEffect(() => {
    if (locationMode === 'state_municipality' && formData.branch_state_id) {
      setLoadingMunicipalities(true);
      getMunicipalitiesByState(formData.branch_state_id)
        .then((data) => {
          setMunicipalities(data);
        })
        .catch((err) => {
          console.error('Error cargando municipios:', err);
        })
        .finally(() => {
          setLoadingMunicipalities(false);
        });
    }
  }, [formData.branch_state_id, locationMode]);

  // Cargar asentamientos cuando cambia el municipio o el término de búsqueda (solo en modo state_municipality)
  useEffect(() => {
    if (locationMode === 'state_municipality' && formData.branch_municipality_id) {
      setLoadingSettlements(true);
      getSettlementsByMunicipality(formData.branch_municipality_id, settlementSearch)
        .then((data) => {
          setSettlements(data);
        })
        .catch((err) => {
          console.error('Error cargando asentamientos:', err);
        })
        .finally(() => {
          setLoadingSettlements(false);
        });
    }
  }, [formData.branch_municipality_id, settlementSearch, locationMode]);

  // Manejar cambio de modo de ubicación
  const handleLocationModeChange = (mode) => {
    setLocationMode(mode);
    // Limpiar datos geográficos al cambiar de modo
    setFormData((prev) => ({
      ...prev,
      branch_postal_code: '',
      branch_state_id: null,
      branch_municipality_id: null,
      branch_settlement_id: null,
      branch_settlement_custom: '',
    }));
    setMunicipalities([]);
    setPostalCodes([]);
    setSettlements([]);
    setPostalCodeError('');
    setCustomSettlement(false);
  };

  // Buscar por código postal (modo postal_code)
  const handlePostalCodeInput = async (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
    setFormData((prev) => ({ ...prev, branch_postal_code: value }));
    setPostalCodeError('');

    if (value.length === 5) {
      setLoadingSettlements(true);
      try {
        const data = await lookupByPostalCode(value);
        if (data.state && data.municipality) {
          const settlements = data.settlements || [];
          
          // Si solo hay una colonia, autoseleccionarla
          const autoSelectedSettlement = settlements.length === 1 ? settlements[0].id : null;
          
          setFormData((prev) => ({
            ...prev,
            branch_state_id: data.state.id,
            branch_municipality_id: data.municipality.id,
            branch_settlement_id: autoSelectedSettlement,
            branch_settlement_custom: '',
          }));
          setSettlements(settlements);
          setCustomSettlement(false);
        } else {
          setPostalCodeError('Código postal no encontrado. Verifica que sea correcto.');
          setSettlements([]);
        }
      } catch (err) {
        console.error('Error buscando CP:', err);
        setPostalCodeError('Error al buscar el código postal.');
      } finally {
        setLoadingSettlements(false);
      }
    } else {
      setSettlements([]);
      setFormData((prev) => ({
        ...prev,
        branch_state_id: null,
        branch_municipality_id: null,
        branch_settlement_id: null,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleStateChange = (stateId) => {
    setFormData((prev) => ({
      ...prev,
      branch_state_id: stateId,
      branch_municipality_id: null,
      branch_postal_code: '',
      branch_settlement_id: null,
    }));
    setMunicipalities([]);
    setPostalCodes([]);
    setSettlements([]);
    setStateOpen(false);
    setStateSearch('');
  };

  const handleMunicipalityChange = (municipalityId) => {
    setFormData((prev) => ({
      ...prev,
      branch_municipality_id: municipalityId,
      branch_settlement_id: null,
      branch_postal_code: '',
    }));
    setSettlements([]);
    setMunicipalityOpen(false);
    setMunicipalitySearch('');
  };

  const handlePostalCodeSelect = (postalCode) => {
    setFormData((prev) => ({
      ...prev,
      branch_postal_code: postalCode,
      branch_settlement_id: null,
    }));
    setPostalCodeOpen(false);
    setPostalCodeSearch('');
  };

  const handleSettlementChange = async (settlementId) => {
    setFormData((prev) => ({
      ...prev,
      branch_settlement_id: settlementId,
      branch_settlement_custom: '',
    }));
    setSettlementOpen(false);
    setSettlementSearch('');
    
    // Autocompletar código postal basado en la colonia seleccionada
    try {
      const postalCode = await getPostalCodeBySettlement(settlementId);
      setFormData((prev) => ({
        ...prev,
        branch_postal_code: postalCode,
      }));
    } catch (err) {
      console.error('Error obteniendo código postal:', err);
    }
  };

  const handleCustomSettlementToggle = (checked) => {
    setCustomSettlement(checked);
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        branch_settlement_id: null,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        branch_settlement_custom: '',
      }));
    }
  };

  const validateStep1 = () => {
    if (!formData.business_name.trim()) {
      setError('El nombre del negocio es requerido');
      return false;
    }
    if (formData.business_name.trim().length < 2) {
      setError('El nombre del negocio debe tener al menos 2 caracteres');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.branch_postal_code || formData.branch_postal_code.length !== 5) {
      setError('El código postal debe tener 5 dígitos');
      return false;
    }
    if (!formData.branch_state_id) {
      setError('Selecciona un estado');
      return false;
    }
    if (!formData.branch_municipality_id) {
      setError('Selecciona un municipio');
      return false;
    }
    if (!customSettlement && !formData.branch_settlement_id) {
      setError('Selecciona una colonia o marca "Mi colonia no aparece"');
      return false;
    }
    if (customSettlement && !formData.branch_settlement_custom.trim()) {
      setError('Escribe el nombre de tu colonia');
      return false;
    }
    if (!formData.branch_street.trim()) {
      setError('La calle es requerida');
      return false;
    }
    if (!formData.branch_exterior_number.trim()) {
      setError('El número exterior es requerido');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.admin_name.trim()) {
      setError('Tu nombre es requerido');
      return false;
    }
    if (formData.admin_name.trim().length < 2) {
      setError('Tu nombre debe tener al menos 2 caracteres');
      return false;
    }
    if (!formData.admin_email.trim()) {
      setError('Tu correo electrónico es requerido');
      return false;
    }
    if (!formData.admin_phone.trim()) {
      setError('Tu teléfono es requerido');
      return false;
    }
    if (!/^\d+$/.test(formData.admin_phone)) {
      setError('El teléfono solo debe contener dígitos');
      return false;
    }
    if (formData.admin_phone.length < 10) {
      setError('El teléfono debe tener al menos 10 dígitos');
      return false;
    }
    if (!formData.admin_password) {
      setError('La contraseña es requerida');
      return false;
    }
    if (formData.admin_password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return false;
    }
    if (!/[A-Z]/.test(formData.admin_password)) {
      setError('La contraseña debe contener al menos una mayúscula');
      return false;
    }
    if (!/[a-z]/.test(formData.admin_password)) {
      setError('La contraseña debe contener al menos una minúscula');
      return false;
    }
    if (!/[0-9]/.test(formData.admin_password)) {
      setError('La contraseña debe contener al menos un número');
      return false;
    }
    if (/\s/.test(formData.admin_password)) {
      setError('La contraseña no debe contener espacios');
      return false;
    }
    if (formData.admin_password !== formData.admin_password_confirmation) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setLoading(true);
    setError('');

    try {
      const payload = {
        business_name: formData.business_name.trim(),
        branch_name: formData.branch_name.trim() || 'Matriz',
        branch_postal_code: formData.branch_postal_code,
        branch_state_id: formData.branch_state_id,
        branch_municipality_id: formData.branch_municipality_id,
        branch_settlement_id: formData.branch_settlement_id,
        branch_settlement_custom: customSettlement
          ? formData.branch_settlement_custom.trim()
          : null,
        branch_street: formData.branch_street.trim(),
        branch_exterior_number: formData.branch_exterior_number.trim(),
        branch_interior_number: formData.branch_interior_number.trim() || null,
        admin_name: formData.admin_name.trim(),
        admin_email: formData.admin_email.trim(),
        admin_phone: formData.admin_phone.trim(),
        admin_password: formData.admin_password,
        admin_password_confirmation: formData.admin_password_confirmation,
      };

      const response = await registerTenant(payload);

      // Limpiar localStorage completamente antes de guardar nuevos tokens
      localStorage.clear();
      
      // Guardar nuevos tokens en localStorage
      localStorage.setItem('accessToken', response.access_token);
      localStorage.setItem('refreshToken', response.refresh_token);
      
      // Actualizar el header de Authorization en apiClient inmediatamente
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.access_token}`;
      
      // Obtener información del usuario autenticado
      const userResponse = await apiClient.get('/users/me');
      localStorage.setItem('user', JSON.stringify(userResponse.data));

      setSuccess(true);

      // Redirigir al dashboard después de 2 segundos
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Error de registro:', err);
      const errorData = err.response?.data;
      let errorMessage = 'Error al registrar. Por favor, intenta de nuevo.';

      if (errorData?.detail) {
        if (typeof errorData.detail === 'string') {
          errorMessage = errorData.detail;
        } else if (Array.isArray(errorData.detail)) {
          errorMessage = errorData.detail.map((e) => e.msg).join('. ');
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Negocio', icon: Building2 },
    { number: 2, title: 'Ubicación', icon: MapPin },
    { number: 3, title: 'Cuenta', icon: User },
  ];

  // Obtener nombres para mostrar
  const selectedState = states.find((s) => s.id === formData.branch_state_id);
  const selectedMunicipality = municipalities.find(
    (m) => m.id === formData.branch_municipality_id
  );
  const selectedSettlement = settlements.find(
    (s) => s.id === formData.branch_settlement_id
  );

  // Filtrar listas según búsqueda
  const filteredStates = states.filter((s) =>
    s.name.toLowerCase().includes(stateSearch.toLowerCase())
  );
  const filteredMunicipalities = municipalities.filter((m) =>
    m.name.toLowerCase().includes(municipalitySearch.toLowerCase())
  );
  const filteredPostalCodes = postalCodes.filter((pc) =>
    pc.postal_code.includes(postalCodeSearch)
  );
  // Para settlements en modo state_municipality, el filtrado se hace en el backend
  // En modo postal_code, usamos filtrado local ya que la lista es pequeña
  const filteredSettlements = locationMode === 'postal_code'
    ? settlements.filter((s) => s.name.toLowerCase().includes(settlementSearch.toLowerCase()))
    : settlements;

  // Componente reutilizable para Popover con búsqueda
  const SearchablePopover = ({
    open,
    onOpenChange,
    triggerText,
    placeholder,
    searchValue,
    onSearchChange,
    items,
    renderItem,
    disabled,
    isLoading,
    emptyText,
  }) => (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full justify-between font-normal'
          disabled={disabled || isLoading}
        >
          {isLoading ? (
            <Loader2 className='w-4 h-4 animate-spin' />
          ) : (
            <span className='truncate'>{triggerText}</span>
          )}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className='w-[--radix-popover-trigger-width] p-0' 
        align='start'
        onInteractOutside={(e) => {
          // Evitar que se cierre al hacer clic en el input de búsqueda
          const target = e.target;
          if (target.closest('[role="combobox"]')) {
            e.preventDefault();
          }
        }}
      >
        <div className='flex flex-col'>
          {/* Input de búsqueda */}
          <div className='flex items-center border-b px-3 py-2'>
            <Search className='mr-2 h-4 w-4 shrink-0 opacity-50' />
            <Input
              placeholder={placeholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              autoFocus
              className='border-0 p-0 h-8 focus-visible:ring-0 focus-visible:ring-offset-0'
            />
          </div>

          {/* Lista de resultados */}
          <div className='max-h-[300px] overflow-y-auto overflow-x-hidden'>
            {items.length === 0 ? (
              <div className='py-6 text-center text-sm text-gray-500'>
                {emptyText || 'No se encontraron resultados'}
              </div>
            ) : (
              <div className='p-1'>{items.map(renderItem)}</div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );

  if (success) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-100 p-4'>
        <Card className='w-full max-w-md text-center'>
          <CardContent className='pt-6'>
            <CheckCircle2 className='w-16 h-16 text-green-500 mx-auto mb-4' />
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>
              ¡Registro Exitoso!
            </h2>
            <p className='text-muted-foreground mb-4'>
              Tu cuenta ha sido creada. Serás redirigido al panel de control en unos
              segundos...
            </p>
            <Loader2 className='w-6 h-6 animate-spin mx-auto text-primary' />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 p-4'>
      <div className='w-full max-w-lg'>
        {/* Header */}
        <div className='text-center mb-6'>
          <img
            src={logoAmalitica}
            alt='Logo de Amalitica'
            className='w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2'
          />
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>Amalitica</h1>
          <p className='text-sm text-muted-foreground'>
            Plataforma de Gestión para Ópticas
          </p>
        </div>

        {/* Progress Steps */}
        <div className='flex justify-center mb-6'>
          {steps.map((step, index) => (
            <div key={step.number} className='flex items-center'>
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  currentStep >= step.number
                    ? 'bg-primary border-primary text-white'
                    : 'border-gray-300 text-gray-400'
                }`}
              >
                <step.icon className='w-5 h-5' />
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 sm:w-16 h-1 mx-1 transition-colors ${
                    currentStep > step.number ? 'bg-primary' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <Card className='sm:border sm:shadow-sm border-none shadow-none'>
          <CardHeader className='px-4 sm:px-6'>
            <CardTitle className='text-xl sm:text-2xl'>
              {currentStep === 1 && 'Datos del Negocio'}
              {currentStep === 2 && 'Ubicación de tu Óptica'}
              {currentStep === 3 && 'Tu Cuenta'}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && 'Ingresa el nombre de tu óptica.'}
              {currentStep === 2 && 'Ingresa la dirección de tu sucursal principal.'}
              {currentStep === 3 &&
                'Crea tu cuenta de administrador para acceder al sistema.'}
            </CardDescription>
          </CardHeader>

          <CardContent className='px-4 sm:px-6'>
            <form onSubmit={handleSubmit} className='space-y-4'>
              {error && (
                <div className='bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive'>
                  <AlertCircle className='w-4 h-4 flex-shrink-0' />
                  <p>{error}</p>
                </div>
              )}

              {/* Step 1: Datos del Negocio */}
              {currentStep === 1 && (
                <>
                  <div className='space-y-2'>
                    <Label htmlFor='business_name'>
                      Nombre de tu Óptica <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='business_name'
                      name='business_name'
                      value={formData.business_name}
                      onChange={handleChange}
                      placeholder='Óptica Visión Clara'
                      required
                      disabled={loading}
                      autoFocus
                    />
                    <p className='text-xs text-muted-foreground'>
                      Este será el nombre que verán tus clientes
                    </p>
                  </div>
                </>
              )}

              {/* Step 2: Datos Geográficos */}
              {currentStep === 2 && (
                <>
                  {/* Selector de modo de ubicación */}
                  <div className='space-y-3'>
                    <Label>¿Cómo prefieres ingresar tu ubicación?</Label>
                    <RadioGroup
                      value={locationMode}
                      onValueChange={handleLocationModeChange}
                      className='flex flex-col space-y-2'
                    >
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='postal_code' id='mode_cp' />
                        <Label htmlFor='mode_cp' className='font-normal cursor-pointer'>
                          Conozco mi Código Postal
                        </Label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='state_municipality' id='mode_state' />
                        <Label
                          htmlFor='mode_state'
                          className='font-normal cursor-pointer'
                        >
                          Prefiero seleccionar Estado y Municipio
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <hr className='my-4' />

                  {/* Modo: Código Postal primero */}
                  {locationMode === 'postal_code' && (
                    <>
                      {/* Código Postal (input) */}
                      <div className='space-y-2'>
                        <Label htmlFor='branch_postal_code'>
                          Código Postal <span className='text-red-500'>*</span>
                        </Label>
                        <div className='relative'>
                          <Input
                            id='branch_postal_code'
                            name='branch_postal_code'
                            value={formData.branch_postal_code}
                            onChange={handlePostalCodeInput}
                            placeholder='06600'
                            maxLength={5}
                            disabled={loading}
                            className={postalCodeError ? 'border-red-500' : ''}
                          />
                          {loadingSettlements && (
                            <Loader2 className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground' />
                          )}
                        </div>
                        {postalCodeError && (
                          <p className='text-xs text-red-500'>{postalCodeError}</p>
                        )}
                        <p className='text-xs text-muted-foreground'>
                          El estado y municipio se completarán automáticamente
                        </p>
                      </div>

                      {/* Estado y Municipio (solo lectura) */}
                      {formData.branch_state_id && (
                        <div className='grid grid-cols-2 gap-4'>
                          <div className='space-y-2'>
                            <Label>Estado</Label>
                            <Input
                              value={selectedState?.name || ''}
                              disabled
                              className='bg-gray-50'
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label>Municipio</Label>
                            <Input
                              value={
                                municipalities.find(
                                  (m) => m.id === formData.branch_municipality_id
                                )?.name ||
                                settlements[0]?.municipality_name ||
                                ''
                              }
                              disabled
                              className='bg-gray-50'
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Modo: Estado/Municipio primero */}
                  {locationMode === 'state_municipality' && (
                    <>
                      {/* Estado */}
                      <div className='space-y-2'>
                        <Label>
                          Estado <span className='text-red-500'>*</span>
                        </Label>
                        <SearchablePopover
                          open={stateOpen}
                          onOpenChange={(open) => {
                            setStateOpen(open);
                            if (!open) setStateSearch('');
                          }}
                          triggerText={selectedState?.name || 'Seleccionar estado...'}
                          placeholder='Buscar estado...'
                          searchValue={stateSearch}
                          onSearchChange={setStateSearch}
                          items={filteredStates}
                          disabled={loading}
                          isLoading={loadingStates}
                          emptyText='No se encontró el estado'
                          renderItem={(state) => (
                            <div
                              key={state.id}
                              onClick={() => handleStateChange(state.id)}
                              className='relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground transition-colors'
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4 flex-shrink-0',
                                  formData.branch_state_id === state.id
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              {state.name}
                            </div>
                          )}
                        />
                      </div>

                      {/* Municipio */}
                      <div className='space-y-2'>
                        <Label>
                          Municipio <span className='text-red-500'>*</span>
                        </Label>
                        <SearchablePopover
                          open={municipalityOpen}
                          onOpenChange={(open) => {
                            setMunicipalityOpen(open);
                            if (!open) setMunicipalitySearch('');
                          }}
                          triggerText={
                            selectedMunicipality?.name || 'Seleccionar municipio...'
                          }
                          placeholder='Buscar municipio...'
                          searchValue={municipalitySearch}
                          onSearchChange={setMunicipalitySearch}
                          items={filteredMunicipalities}
                          disabled={loading || !formData.branch_state_id}
                          isLoading={loadingMunicipalities}
                          emptyText={
                            !formData.branch_state_id
                              ? 'Selecciona un estado primero'
                              : 'No se encontró el municipio'
                          }
                          renderItem={(muni) => (
                            <div
                              key={muni.id}
                              onClick={() => handleMunicipalityChange(muni.id)}
                              className='relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground transition-colors'
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4 flex-shrink-0',
                                  formData.branch_municipality_id === muni.id
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              {muni.name}
                            </div>
                          )}
                        />
                      </div>

                    </>
                  )}

                  {/* Colonia (común para ambos modos) */}
                  {settlements.length > 0 && (
                    <div className='space-y-2'>
                      <Label>
                        Colonia <span className='text-red-500'>*</span>
                      </Label>
                      {!customSettlement ? (
                        <SearchablePopover
                          open={settlementOpen}
                          onOpenChange={(open) => {
                            setSettlementOpen(open);
                            if (!open) setSettlementSearch('');
                          }}
                          triggerText={
                            selectedSettlement?.name || 'Seleccionar colonia...'
                          }
                          placeholder='Buscar colonia...'
                          searchValue={settlementSearch}
                          onSearchChange={setSettlementSearch}
                          items={filteredSettlements}
                          disabled={loading}
                          isLoading={loadingSettlements}
                          emptyText='No se encontró la colonia'
                          renderItem={(settlement) => (
                            <div
                              key={settlement.id}
                              onClick={() => handleSettlementChange(settlement.id)}
                              className='relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground transition-colors'
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4 flex-shrink-0',
                                  formData.branch_settlement_id === settlement.id
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              <div className='flex flex-col'>
                                <span>{settlement.name}</span>
                                {settlement.settlement_type && (
                                  <span className='text-xs text-muted-foreground'>
                                    {settlement.settlement_type}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        />
                      ) : (
                        <Input
                          name='branch_settlement_custom'
                          value={formData.branch_settlement_custom}
                          onChange={handleChange}
                          placeholder='Nombre de tu colonia'
                          disabled={loading}
                        />
                      )}
                      <div className='flex items-center space-x-2'>
                        <Checkbox
                          id='customSettlement'
                          checked={customSettlement}
                          onCheckedChange={handleCustomSettlementToggle}
                          disabled={loading}
                        />
                        <label
                          htmlFor='customSettlement'
                          className='text-sm text-muted-foreground cursor-pointer'
                        >
                          Mi colonia no aparece en la lista
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Código Postal (solo lectura en modo state_municipality) */}
                  {locationMode === 'state_municipality' && formData.branch_postal_code && (
                    <div className='space-y-2'>
                      <Label>Código Postal</Label>
                      <Input
                        value={formData.branch_postal_code}
                        disabled
                        className='bg-gray-50'
                      />
                      <p className='text-xs text-muted-foreground'>
                        Autocompletado según la colonia seleccionada
                      </p>
                    </div>
                  )}

                  {/* Calle y Número */}
                  <div className='space-y-2'>
                    <Label htmlFor='branch_street'>
                      Calle <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='branch_street'
                      name='branch_street'
                      value={formData.branch_street}
                      onChange={handleChange}
                      placeholder='Av. Insurgentes Sur'
                      disabled={loading}
                    />
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='branch_exterior_number'>
                        Número Ext. <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        id='branch_exterior_number'
                        name='branch_exterior_number'
                        value={formData.branch_exterior_number}
                        onChange={handleChange}
                        placeholder='1234'
                        disabled={loading}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='branch_interior_number'>Número Int.</Label>
                      <Input
                        id='branch_interior_number'
                        name='branch_interior_number'
                        value={formData.branch_interior_number}
                        onChange={handleChange}
                        placeholder='Local 5'
                        disabled={loading}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Step 3: Datos del Administrador */}
              {currentStep === 3 && (
                <>
                  <div className='space-y-2'>
                    <Label htmlFor='admin_name'>
                      Tu Nombre Completo <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='admin_name'
                      name='admin_name'
                      value={formData.admin_name}
                      onChange={handleChange}
                      placeholder='Juan Pérez García'
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='admin_email'>
                      Tu Correo Electrónico <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='admin_email'
                      name='admin_email'
                      type='email'
                      value={formData.admin_email}
                      onChange={handleChange}
                      placeholder='tu@email.com'
                      required
                      disabled={loading}
                    />
                    <p className='text-xs text-muted-foreground'>
                      Este será tu usuario para iniciar sesión
                    </p>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='admin_phone'>
                      Tu Teléfono <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='admin_phone'
                      name='admin_phone'
                      type='tel'
                      value={formData.admin_phone}
                      onChange={handleChange}
                      placeholder='5512345678'
                      required
                      disabled={loading}
                    />
                    <p className='text-xs text-muted-foreground'>
                      Solo dígitos, mínimo 10
                    </p>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='admin_password'>
                      Contraseña <span className='text-red-500'>*</span>
                    </Label>
                    <div className='relative'>
                      <Input
                        id='admin_password'
                        name='admin_password'
                        type={showPassword ? 'text' : 'password'}
                        value={formData.admin_password}
                        onChange={handleChange}
                        placeholder='••••••••'
                        required
                        disabled={loading}
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                      >
                        {showPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </Button>
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      Mínimo 8 caracteres, una mayúscula, una minúscula y un número
                    </p>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='admin_password_confirmation'>
                      Confirmar Contraseña <span className='text-red-500'>*</span>
                    </Label>
                    <div className='relative'>
                      <Input
                        id='admin_password_confirmation'
                        name='admin_password_confirmation'
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.admin_password_confirmation}
                        onChange={handleChange}
                        placeholder='••••••••'
                        required
                        disabled={loading}
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={loading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div className='flex gap-3 pt-2'>
                {currentStep > 1 && (
                  <Button
                    type='button'
                    variant='outline'
                    onClick={prevStep}
                    disabled={loading}
                    className='flex-1'
                  >
                    Anterior
                  </Button>
                )}
                {currentStep < 3 ? (
                  <Button
                    type='button'
                    onClick={nextStep}
                    disabled={loading}
                    className='flex-1'
                  >
                    Siguiente
                  </Button>
                ) : (
                  <Button type='submit' disabled={loading} className='flex-1'>
                    {loading ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Registrando...
                      </>
                    ) : (
                      'Crear Cuenta'
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className='text-center text-sm text-muted-foreground mt-4'>
          ¿Ya tienes una cuenta?{' '}
          <Link to='/login' className='text-primary hover:underline font-medium'>
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
