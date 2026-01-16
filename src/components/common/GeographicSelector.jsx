// src/components/common/GeographicSelector.jsx
/**
 * Componente reutilizable para capturar datos geográficos basados en SEPOMEX.
 * 
 * Soporta dos modos de entrada:
 * 1. Código Postal primero (autocompleta estado y municipio)
 * 2. Estado/Municipio primero (permite buscar colonia y luego CP)
 * 
 * Este componente se usa en:
 * - Register.jsx (registro de tenant - ubicación de sucursal)
 * - CustomerForm.jsx (registro de pacientes)
 * - Futuro: BranchForm.jsx (gestión de sucursales)
 * 
 * @example
 * // Con react-hook-form
 * <GeographicSelector
 *   register={register}
 *   errors={errors}
 *   watch={watch}
 *   setValue={setValue}
 *   fieldPrefix="branch_" // Opcional, para Register.jsx
 *   disabled={loading}
 * />
 * 
 * // Con estado controlado (useState)
 * <GeographicSelector
 *   values={formData}
 *   onChange={handleFieldChange}
 *   disabled={loading}
 * />
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
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
import { ChevronsUpDown, Check, Search, AlertCircle, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  getStates,
  getMunicipalitiesByState,
  lookupByPostalCode,
  getSettlementsByMunicipality,
} from '@/api/catalogs';

const GeographicSelector = ({
  // Props para react-hook-form
  register,
  errors,
  watch,
  setValue,
  // Props para estado controlado
  values,
  onChange,
  // Props comunes
  fieldPrefix = '',
  disabled = false,
  showStreetFields = true,
  required = false,
  className = '',
  title = 'Dirección',
  description = 'Ubicación basada en catálogo SEPOMEX',
  defaultMode = 'postal_code', // Modo por defecto: 'postal_code' o 'state_municipality'
}) => {
  // Determinar si estamos usando react-hook-form o estado controlado
  const isControlled = values !== undefined && onChange !== undefined;

  // Construir nombres de campos con prefijo
  const fieldNames = {
    postal_code: `${fieldPrefix}postal_code`,
    state_id: `${fieldPrefix}state_id`,
    municipality_id: `${fieldPrefix}municipality_id`,
    settlement_id: `${fieldPrefix}settlement_id`,
    settlement_custom: `${fieldPrefix}settlement_custom`,
    street: `${fieldPrefix}street`,
    exterior_number: `${fieldPrefix}exterior_number`,
    interior_number: `${fieldPrefix}interior_number`,
  };

  // Estado interno del componente
  const [locationMode, setLocationMode] = useState(defaultMode);
  const [states, setStates] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingMunicipalities, setLoadingMunicipalities] = useState(false);
  const [loadingSettlements, setLoadingSettlements] = useState(false);
  const [postalCodeError, setPostalCodeError] = useState('');
  const [customSettlement, setCustomSettlement] = useState(false);
  const [availablePostalCodes, setAvailablePostalCodes] = useState([]);

  // Nombres de estado y municipio para modo CP
  const [cpStateName, setCpStateName] = useState('');
  const [cpMunicipalityName, setCpMunicipalityName] = useState('');

  // Popover states
  const [stateOpen, setStateOpen] = useState(false);
  const [municipalityOpen, setMunicipalityOpen] = useState(false);
  const [settlementOpen, setSettlementOpen] = useState(false);

  // Search filters
  const [stateSearch, setStateSearch] = useState('');
  const [municipalitySearch, setMunicipalitySearch] = useState('');
  const [settlementSearch, setSettlementSearch] = useState('');

  // Helpers para obtener y establecer valores
  const getValue = useCallback((field) => {
    if (isControlled) {
      return values[fieldNames[field]];
    }
    return watch ? watch(fieldNames[field]) : undefined;
  }, [isControlled, values, watch, fieldNames]);

  const setFieldValue = useCallback((field, value) => {
    if (isControlled) {
      onChange(fieldNames[field], value);
    } else if (setValue) {
      setValue(fieldNames[field], value);
    }
  }, [isControlled, onChange, setValue, fieldNames]);

  // Valores actuales
  const currentStateId = getValue('state_id');
  const currentMunicipalityId = getValue('municipality_id');
  const currentPostalCode = getValue('postal_code');
  const currentSettlementId = getValue('settlement_id');

  // Cargar estados al montar
  useEffect(() => {
    const loadStatesData = async () => {
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
    loadStatesData();
  }, []);

  // Cargar municipios cuando cambia el estado (modo state_municipality)
  useEffect(() => {
    if (locationMode === 'state_municipality' && currentStateId) {
      const loadMunicipalitiesData = async () => {
        try {
          setLoadingMunicipalities(true);
          const data = await getMunicipalitiesByState(currentStateId);
          setMunicipalities(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error('Error al cargar municipios:', err);
        } finally {
          setLoadingMunicipalities(false);
        }
      };
      loadMunicipalitiesData();
    }
  }, [currentStateId, locationMode]);

  // Cargar asentamientos cuando cambia el municipio (modo state_municipality)
  useEffect(() => {
    if (locationMode === 'state_municipality' && currentMunicipalityId) {
      const loadSettlementsData = async () => {
        try {
          setLoadingSettlements(true);
          const data = await getSettlementsByMunicipality(currentMunicipalityId, settlementSearch);
          setSettlements(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error('Error al cargar asentamientos:', err);
        } finally {
          setLoadingSettlements(false);
        }
      };
      loadSettlementsData();
    }
  }, [currentMunicipalityId, settlementSearch, locationMode]);

  // Manejar cambio de modo de ubicación
  const handleLocationModeChange = (mode) => {
    setLocationMode(mode);
    // Limpiar campos geográficos
    setFieldValue('state_id', null);
    setFieldValue('municipality_id', null);
    setFieldValue('postal_code', '');
    setFieldValue('settlement_id', null);
    setFieldValue('settlement_custom', '');
    setMunicipalities([]);
    setSettlements([]);
    setAvailablePostalCodes([]);
    setPostalCodeError('');
    setCustomSettlement(false);
    setCpStateName('');
    setCpMunicipalityName('');
  };

  // Buscar por código postal
  const handlePostalCodeInput = async (value) => {
    const cleanValue = value.replace(/\D/g, '').slice(0, 5);
    setFieldValue('postal_code', cleanValue);
    setPostalCodeError('');

    if (cleanValue.length === 5) {
      setLoadingSettlements(true);
      try {
        const data = await lookupByPostalCode(cleanValue);
        if (data.state && data.municipality) {
          const settlementsData = data.settlements || [];
          
          // Autoseleccionar si solo hay una colonia
          const autoSelectedSettlement = settlementsData.length === 1 ? settlementsData[0].id : null;
          
          setFieldValue('state_id', data.state.id);
          setFieldValue('municipality_id', data.municipality.id);
          setFieldValue('settlement_id', autoSelectedSettlement);
          setFieldValue('settlement_custom', '');
          
          setSettlements(settlementsData);
          setCpStateName(data.state.name);
          setCpMunicipalityName(data.municipality.name);
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
      setFieldValue('state_id', null);
      setFieldValue('municipality_id', null);
      setFieldValue('settlement_id', null);
      setCpStateName('');
      setCpMunicipalityName('');
    }
  };

  // Manejar selección de estado
  const handleStateChange = (stateId) => {
    setFieldValue('state_id', stateId);
    setFieldValue('municipality_id', null);
    setFieldValue('settlement_id', null);
    setFieldValue('postal_code', '');
    setMunicipalities([]);
    setSettlements([]);
    setStateOpen(false);
    setStateSearch('');
  };

  // Manejar selección de municipio
  const handleMunicipalityChange = (municipalityId) => {
    setFieldValue('municipality_id', municipalityId);
    setFieldValue('settlement_id', null);
    setFieldValue('postal_code', '');
    setSettlements([]);
    setMunicipalityOpen(false);
    setMunicipalitySearch('');
  };

  // Manejar selección de colonia
  const handleSettlementChange = (settlementId) => {
    const settlement = settlements.find(s => s.id === settlementId);
    if (!settlement) return;

    setFieldValue('settlement_id', settlementId);
    setFieldValue('settlement_custom', '');
    setSettlementOpen(false);
    setSettlementSearch('');

    // Autocompletar código postal (modo state_municipality)
    if (locationMode === 'state_municipality') {
      const postalCodes = settlement.postal_codes || [];
      
      if (postalCodes.length === 1) {
        setFieldValue('postal_code', postalCodes[0]);
        setAvailablePostalCodes([]);
      } else if (postalCodes.length > 1) {
        setAvailablePostalCodes(postalCodes);
        setFieldValue('postal_code', postalCodes[0]);
      }
    }
  };

  // Filtrar listas según búsqueda
  const filteredStates = useMemo(() => 
    states.filter(s => s.name.toLowerCase().includes(stateSearch.toLowerCase())),
    [states, stateSearch]
  );

  const filteredMunicipalities = useMemo(() => 
    municipalities.filter(m => m.name.toLowerCase().includes(municipalitySearch.toLowerCase())),
    [municipalities, municipalitySearch]
  );

  const filteredSettlements = useMemo(() => 
    settlements.filter(s => s.name.toLowerCase().includes(settlementSearch.toLowerCase())),
    [settlements, settlementSearch]
  );

  // Obtener nombres para mostrar
  const selectedState = states.find(s => s.id === currentStateId);
  const selectedMunicipality = municipalities.find(m => m.id === currentMunicipalityId);
  const selectedSettlement = settlements.find(s => s.id === currentSettlementId);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Selector de modo de ubicación */}
      <div className='space-y-3'>
        <Label>¿Cómo prefieres ingresar la ubicación?</Label>
        <RadioGroup
          value={locationMode}
          onValueChange={handleLocationModeChange}
          className='flex flex-col sm:flex-row gap-4'
          disabled={disabled}
        >
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='postal_code' id={`${fieldPrefix}mode_cp`} />
            <Label htmlFor={`${fieldPrefix}mode_cp`} className='cursor-pointer font-normal'>
              Conozco el Código Postal
            </Label>
          </div>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='state_municipality' id={`${fieldPrefix}mode_state`} />
            <Label htmlFor={`${fieldPrefix}mode_state`} className='cursor-pointer font-normal'>
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
              <Label htmlFor={fieldNames.postal_code}>
                Código Postal {required && <span className='text-destructive'>*</span>}
              </Label>
              <Input
                id={fieldNames.postal_code}
                value={currentPostalCode || ''}
                onChange={(e) => handlePostalCodeInput(e.target.value)}
                placeholder='Ej: 06600'
                maxLength={5}
                disabled={disabled}
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
          {(cpStateName || cpMunicipalityName) && (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label>Estado</Label>
                <Input value={cpStateName} disabled className='bg-muted' />
              </div>
              <div className='space-y-2'>
                <Label>Municipio</Label>
                <Input value={cpMunicipalityName} disabled className='bg-muted' />
              </div>
            </div>
          )}

          {/* Selector de Colonia */}
          {settlements.length > 0 && (
            <div className='space-y-2'>
              <Label>
                Colonia {required && <span className='text-destructive'>*</span>}
              </Label>
              {!customSettlement ? (
                <>
                  <Popover open={settlementOpen} onOpenChange={setSettlementOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant='outline'
                        role='combobox'
                        className='w-full justify-between font-normal'
                        disabled={disabled || loadingSettlements}
                      >
                        {selectedSettlement?.name || 'Selecciona una colonia...'}
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
                            autoFocus
                            onKeyDown={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div className='max-h-60 overflow-y-auto mt-2'>
                          {filteredSettlements.map((settlement) => (
                            <div
                              key={settlement.id}
                              className={cn(
                                'flex items-center px-2 py-2 cursor-pointer rounded hover:bg-accent',
                                currentSettlementId === settlement.id && 'bg-accent'
                              )}
                              onClick={() => handleSettlementChange(settlement.id)}
                            >
                              <Check className={cn('mr-2 h-4 w-4', currentSettlementId === settlement.id ? 'opacity-100' : 'opacity-0')} />
                              {settlement.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <div className='flex items-center space-x-2 mt-2'>
                    <Checkbox
                      id={`${fieldPrefix}custom_settlement`}
                      checked={customSettlement}
                      onCheckedChange={(checked) => {
                        setCustomSettlement(checked);
                        if (checked) {
                          setFieldValue('settlement_id', null);
                        }
                      }}
                      disabled={disabled}
                    />
                    <Label htmlFor={`${fieldPrefix}custom_settlement`} className='text-sm font-normal cursor-pointer'>
                      Mi colonia no aparece en la lista
                    </Label>
                  </div>
                </>
              ) : (
                <>
                  <Input
                    value={getValue('settlement_custom') || ''}
                    onChange={(e) => setFieldValue('settlement_custom', e.target.value)}
                    placeholder='Nombre de la colonia'
                    disabled={disabled}
                  />
                  <Button
                    type='button'
                    variant='link'
                    className='p-0 h-auto text-sm'
                    onClick={() => {
                      setCustomSettlement(false);
                      setFieldValue('settlement_custom', '');
                    }}
                  >
                    ← Volver a seleccionar del catálogo
                  </Button>
                </>
              )}
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
              <Label>
                Estado {required && <span className='text-destructive'>*</span>}
              </Label>
              <Popover open={stateOpen} onOpenChange={setStateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    role='combobox'
                    className='w-full justify-between font-normal'
                    disabled={disabled || loadingStates}
                  >
                    {selectedState?.name || 'Selecciona un estado...'}
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
                        autoFocus
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className='max-h-60 overflow-y-auto mt-2'>
                      {filteredStates.map((state) => (
                        <div
                          key={state.id}
                          className={cn(
                            'flex items-center px-2 py-2 cursor-pointer rounded hover:bg-accent',
                            currentStateId === state.id && 'bg-accent'
                          )}
                          onClick={() => handleStateChange(state.id)}
                        >
                          <Check className={cn('mr-2 h-4 w-4', currentStateId === state.id ? 'opacity-100' : 'opacity-0')} />
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
              <Label>
                Municipio {required && <span className='text-destructive'>*</span>}
              </Label>
              <Popover open={municipalityOpen} onOpenChange={setMunicipalityOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    role='combobox'
                    className='w-full justify-between font-normal'
                    disabled={disabled || !currentStateId || loadingMunicipalities}
                  >
                    {selectedMunicipality?.name || 'Selecciona un municipio...'}
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
                        autoFocus
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className='max-h-60 overflow-y-auto mt-2'>
                      {filteredMunicipalities.map((muni) => (
                        <div
                          key={muni.id}
                          className={cn(
                            'flex items-center px-2 py-2 cursor-pointer rounded hover:bg-accent',
                            currentMunicipalityId === muni.id && 'bg-accent'
                          )}
                          onClick={() => handleMunicipalityChange(muni.id)}
                        >
                          <Check className={cn('mr-2 h-4 w-4', currentMunicipalityId === muni.id ? 'opacity-100' : 'opacity-0')} />
                          {muni.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Colonia (cuando hay municipio seleccionado) */}
          {currentMunicipalityId && (
            <div className='space-y-2'>
              <Label>
                Colonia {required && <span className='text-destructive'>*</span>}
              </Label>
              {!customSettlement ? (
                <>
                  <Popover open={settlementOpen} onOpenChange={setSettlementOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant='outline'
                        role='combobox'
                        className='w-full justify-between font-normal'
                        disabled={disabled || loadingSettlements}
                      >
                        {selectedSettlement?.name || 'Selecciona una colonia...'}
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
                            autoFocus
                            onKeyDown={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div className='max-h-60 overflow-y-auto mt-2'>
                          {filteredSettlements.map((settlement) => (
                            <div
                              key={settlement.id}
                              className={cn(
                                'flex items-center px-2 py-2 cursor-pointer rounded hover:bg-accent',
                                currentSettlementId === settlement.id && 'bg-accent'
                              )}
                              onClick={() => handleSettlementChange(settlement.id)}
                            >
                              <Check className={cn('mr-2 h-4 w-4', currentSettlementId === settlement.id ? 'opacity-100' : 'opacity-0')} />
                              {settlement.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <div className='flex items-center space-x-2 mt-2'>
                    <Checkbox
                      id={`${fieldPrefix}custom_settlement_sm`}
                      checked={customSettlement}
                      onCheckedChange={(checked) => {
                        setCustomSettlement(checked);
                        if (checked) {
                          setFieldValue('settlement_id', null);
                        }
                      }}
                      disabled={disabled}
                    />
                    <Label htmlFor={`${fieldPrefix}custom_settlement_sm`} className='text-sm font-normal cursor-pointer'>
                      Mi colonia no aparece en la lista
                    </Label>
                  </div>
                </>
              ) : (
                <>
                  <Input
                    value={getValue('settlement_custom') || ''}
                    onChange={(e) => setFieldValue('settlement_custom', e.target.value)}
                    placeholder='Nombre de la colonia'
                    disabled={disabled}
                  />
                  <Button
                    type='button'
                    variant='link'
                    className='p-0 h-auto text-sm'
                    onClick={() => {
                      setCustomSettlement(false);
                      setFieldValue('settlement_custom', '');
                    }}
                  >
                    ← Volver a seleccionar del catálogo
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Código Postal (autocompletado o selección múltiple) */}
          {currentSettlementId && (
            <div className='space-y-2'>
              <Label>
                Código Postal {required && <span className='text-destructive'>*</span>}
              </Label>
              {availablePostalCodes.length > 1 ? (
                <>
                  <Select
                    value={currentPostalCode}
                    onValueChange={(value) => setFieldValue('postal_code', value)}
                    disabled={disabled}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Selecciona tu código postal' />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePostalCodes.map((cp) => (
                        <SelectItem key={cp} value={cp}>
                          {cp}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className='text-xs text-muted-foreground'>
                    ⚠️ Esta colonia tiene {availablePostalCodes.length} códigos postales. Selecciona el tuyo.
                  </p>
                </>
              ) : currentPostalCode ? (
                <>
                  <Input
                    value={currentPostalCode}
                    disabled
                    className='bg-muted'
                  />
                  <p className='text-xs text-muted-foreground'>
                    Autocompletado según la colonia seleccionada
                  </p>
                </>
              ) : null}
            </div>
          )}
        </div>
      )}

      {/* Campos de calle y número */}
      {showStreetFields && (
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor={fieldNames.street}>
              Calle {required && <span className='text-destructive'>*</span>}
            </Label>
            {isControlled ? (
              <Input
                id={fieldNames.street}
                value={getValue('street') || ''}
                onChange={(e) => setFieldValue('street', e.target.value)}
                placeholder='Av. Insurgentes Sur'
                disabled={disabled}
              />
            ) : (
              <Input
                id={fieldNames.street}
                {...register(fieldNames.street, {
                  required: required ? 'La calle es obligatoria' : false,
                })}
                placeholder='Av. Insurgentes Sur'
                disabled={disabled}
              />
            )}
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor={fieldNames.exterior_number}>
                Número Ext. {required && <span className='text-destructive'>*</span>}
              </Label>
              {isControlled ? (
                <Input
                  id={fieldNames.exterior_number}
                  value={getValue('exterior_number') || ''}
                  onChange={(e) => setFieldValue('exterior_number', e.target.value)}
                  placeholder='1234'
                  disabled={disabled}
                />
              ) : (
                <Input
                  id={fieldNames.exterior_number}
                  {...register(fieldNames.exterior_number, {
                    required: required ? 'El número exterior es obligatorio' : false,
                  })}
                  placeholder='1234'
                  disabled={disabled}
                />
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor={fieldNames.interior_number}>Número Int.</Label>
              {isControlled ? (
                <Input
                  id={fieldNames.interior_number}
                  value={getValue('interior_number') || ''}
                  onChange={(e) => setFieldValue('interior_number', e.target.value)}
                  placeholder='Local 5'
                  disabled={disabled}
                />
              ) : (
                <Input
                  id={fieldNames.interior_number}
                  {...register(fieldNames.interior_number)}
                  placeholder='Local 5'
                  disabled={disabled}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeographicSelector;
