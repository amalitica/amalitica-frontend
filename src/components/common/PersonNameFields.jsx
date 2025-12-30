// src/components/common/PersonNameFields.jsx
/**
 * Componente reutilizable para capturar datos de nombre de persona.
 * 
 * Incluye:
 * - Nombre(s)
 * - Apellido paterno
 * - Apellido materno (opcional)
 * - Selector de género con inferencia automática
 * 
 * Este componente se usa en:
 * - Register.jsx (registro de tenant/admin)
 * - CustomerForm.jsx (registro de pacientes)
 * - Futuro: UserForm.jsx (gestión de empleados)
 * 
 * @example
 * // Con react-hook-form
 * <PersonNameFields
 *   register={register}
 *   errors={errors}
 *   watch={watch}
 *   setValue={setValue}
 *   namePrefix="admin_" // Opcional, para Register.jsx
 *   disabled={loading}
 * />
 * 
 * // Con estado controlado (useState)
 * <PersonNameFields
 *   values={formData}
 *   onChange={handleFieldChange}
 *   disabled={loading}
 * />
 */

import { useEffect, useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import GenderSelector from './GenderSelector';

const PersonNameFields = ({
  // Props para react-hook-form
  register,
  errors,
  watch,
  setValue,
  // Props para estado controlado
  values,
  onChange,
  // Props comunes
  namePrefix = '',
  disabled = false,
  showGender = true,
  showMaternalSurname = true,
  requiredFields = {
    name: true,
    paternal_surname: true,
    maternal_surname: false,
    gender: false,
  },
  labels = {
    name: 'Nombre(s)',
    paternal_surname: 'Apellido Paterno',
    maternal_surname: 'Apellido Materno',
    gender: 'Género',
  },
  placeholders = {
    name: 'Juan',
    paternal_surname: 'Pérez',
    maternal_surname: 'García',
  },
  className = '',
}) => {
  // Determinar si estamos usando react-hook-form o estado controlado
  const isControlled = values !== undefined && onChange !== undefined;

  // Construir nombres de campos con prefijo
  const fieldNames = {
    name: `${namePrefix}name`,
    paternal_surname: `${namePrefix}paternal_surname`,
    maternal_surname: `${namePrefix}maternal_surname`,
    gender: `${namePrefix}gender`,
    gender_inferred: `${namePrefix}gender_inferred`,
    gender_confidence: `${namePrefix}gender_confidence`,
    gender_inference_method: `${namePrefix}gender_inference_method`,
  };

  // Obtener valores actuales
  const getCurrentValue = (field) => {
    if (isControlled) {
      return values[fieldNames[field]] || '';
    }
    return watch ? watch(fieldNames[field]) || '' : '';
  };

  // Manejar cambios
  const handleChange = (field, value) => {
    if (isControlled) {
      onChange(fieldNames[field], value);
    } else if (setValue) {
      setValue(fieldNames[field], value);
    }
  };

  // Manejar cambio de género desde GenderSelector
  const handleGenderChange = useCallback((gender, inferred, confidence, method) => {
    handleChange('gender', gender);
    handleChange('gender_inferred', inferred);
    handleChange('gender_confidence', confidence);
    handleChange('gender_inference_method', method);
  }, [isControlled, onChange, setValue, fieldNames]);

  // Obtener el nombre actual para la inferencia de género
  const currentName = getCurrentValue('name');

  // Renderizar campo de input
  const renderInput = (field, type = 'text') => {
    const isRequired = requiredFields[field];
    const label = labels[field];
    const placeholder = placeholders[field];
    const fieldName = fieldNames[field];
    const error = errors?.[fieldName];

    if (isControlled) {
      return (
        <div className='space-y-2'>
          <Label htmlFor={fieldName}>
            {label} {isRequired && <span className='text-destructive'>*</span>}
          </Label>
          <Input
            id={fieldName}
            name={fieldName}
            type={type}
            value={values[fieldName] || ''}
            onChange={(e) => onChange(fieldName, e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            required={isRequired}
          />
        </div>
      );
    }

    // Modo react-hook-form
    return (
      <div className='space-y-2'>
        <Label htmlFor={fieldName}>
          {label} {isRequired && <span className='text-destructive'>*</span>}
        </Label>
        <Input
          id={fieldName}
          {...register(fieldName, {
            required: isRequired ? `${label} es obligatorio` : false,
            minLength: { value: 2, message: 'Mínimo 2 caracteres' },
            maxLength: { value: 100, message: 'Máximo 100 caracteres' },
          })}
          placeholder={placeholder}
          disabled={disabled}
        />
        {error && (
          <p className='text-sm text-destructive'>{error.message}</p>
        )}
      </div>
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Grid de campos de nombre */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {/* Nombre(s) */}
        {renderInput('name')}

        {/* Apellido Paterno */}
        {renderInput('paternal_surname')}

        {/* Apellido Materno */}
        {showMaternalSurname && renderInput('maternal_surname')}
      </div>

      {/* Selector de Género */}
      {showGender && (
        <div className='space-y-2'>
          <Label>
            {labels.gender} {requiredFields.gender && <span className='text-destructive'>*</span>}
          </Label>
          <GenderSelector
            name={currentName}
            value={getCurrentValue('gender')}
            onChange={handleGenderChange}
            disabled={disabled}
            showOtherOption={true}
          />
        </div>
      )}
    </div>
  );
};

export default PersonNameFields;
